// Vercel serverless function: receives contact-form submissions and emails
// them to the firm via Resend. No email addresses are exposed to the client.
//
// Required env var (set in Vercel project settings):
//   RESEND_API_KEY  - your Resend API key
// Optional env vars:
//   CONTACT_FROM     - verified sender, default "Solicitor Digital <form@solicitordigital.ie>"
//   CONTACT_TO       - comma-separated recipients, default the two inboxes below

const DEFAULT_TO = "casey@solicitordigital.ie,caseymeraz@gmail.com";
// Bridge sender: meraz.co is already verified in Resend, so the form delivers
// today. Once solicitordigital.ie verifies (DNS), switch this to
// "Solicitor Digital <form@solicitordigital.ie>" (or set the CONTACT_FROM env).
const DEFAULT_FROM = "Solicitor Digital <form@meraz.co>";

function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not configured");
    return res.status(500).json({ error: "Email service is not configured." });
  }

  // Vercel parses JSON bodies automatically; fall back to manual parse otherwise.
  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }
  body = body || {};

  // Honeypot: real users leave this empty. Bots fill everything in.
  if (body.company_website) {
    return res.status(200).json({ ok: true });
  }

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required." });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Please provide a valid email address." });
  }

  const fields = [
    ["Name", name],
    ["Firm", body.firm],
    ["Email", email],
    ["Phone", body.phone],
    ["Practice area", body["practice-area"]],
    ["Location", body.location],
    ["Budget / case value", body.budget],
    ["Budget type", body["budget-type"]],
    ["Message", body.message],
  ].filter(([, v]) => v != null && String(v).trim() !== "");

  const textBody = fields.map(([label, v]) => `${label}: ${v}`).join("\n");
  const htmlBody = `
    <h2>New audit enquiry from solicitordigital.ie</h2>
    <table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;">
      ${fields
        .map(
          ([label, v]) =>
            `<tr><td style="padding:6px 12px;font-weight:bold;vertical-align:top;">${escapeHtml(
              label
            )}</td><td style="padding:6px 12px;white-space:pre-wrap;">${escapeHtml(v)}</td></tr>`
        )
        .join("")}
    </table>`;

  const to = (process.env.CONTACT_TO || DEFAULT_TO)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  try {
    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM || DEFAULT_FROM,
        to,
        reply_to: email,
        subject: `New growth-plan enquiry${body.firm ? ` — ${body.firm}` : ""} (${name})`,
        text: textBody,
        html: htmlBody,
      }),
    });

    if (!resp.ok) {
      const detail = await resp.text();
      console.error("Resend error", resp.status, detail);
      return res.status(502).json({ error: "Could not send your enquiry. Please try again." });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Contact handler failed", err);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};
