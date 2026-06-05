/* Floating WhatsApp / Call widget — sitewide.
   Single source of truth: edit this file to change the number, copy, or styling.
   Number: 0873535028 (IE)  ->  +353 87 353 5028  ->  wa.me/353873535028 */
(function () {
  "use strict";

  var WHATSAPP = "353873535028";              // wa.me format (no +, no leading 0)
  var TEL = "+353873535028";                  // E.164 for tel: links
  var DISPLAY = "+353 87 353 5028";           // human-readable
  var PREFILL = "Hi Solicitor Digital, I'd like to ask about your services.";

  if (document.getElementById("sd-contact-widget")) return;

  var css = ''
    + '#sd-contact-widget{position:fixed;right:20px;bottom:20px;z-index:2147483000;'
    + 'font-family:inherit;display:flex;flex-direction:column;align-items:flex-end;gap:12px}'
    + '#sd-cw-actions{display:flex;flex-direction:column;align-items:flex-end;gap:10px;'
    + 'opacity:0;transform:translateY(10px) scale(.96);pointer-events:none;'
    + 'transition:opacity .18s ease,transform .18s ease}'
    + '#sd-contact-widget.open #sd-cw-actions{opacity:1;transform:none;pointer-events:auto}'
    + '.sd-cw-link{display:inline-flex;align-items:center;gap:10px;text-decoration:none;'
    + 'background:#fff;color:#0f2a3f;font-weight:600;font-size:15px;line-height:1;'
    + 'padding:12px 16px;border-radius:999px;box-shadow:0 6px 20px rgba(0,0,0,.18);'
    + 'white-space:nowrap;transition:transform .12s ease}'
    + '.sd-cw-link:hover{transform:translateY(-1px)}'
    + '.sd-cw-link svg{width:20px;height:20px;flex:0 0 20px}'
    + '.sd-cw-ico{display:inline-flex;align-items:center;justify-content:center;'
    + 'width:30px;height:30px;border-radius:50%}'
    + '.sd-cw-wa .sd-cw-ico{background:#25D366;color:#fff}'
    + '.sd-cw-call .sd-cw-ico{background:#0f2a3f;color:#fff}'
    + '#sd-cw-toggle{width:60px;height:60px;border:0;border-radius:50%;cursor:pointer;'
    + 'background:#25D366;color:#fff;box-shadow:0 6px 20px rgba(0,0,0,.25);'
    + 'display:flex;align-items:center;justify-content:center;'
    + 'transition:transform .15s ease,background .15s ease}'
    + '#sd-cw-toggle:hover{transform:scale(1.05)}'
    + '#sd-cw-toggle svg{width:34px;height:34px}'
    + '#sd-contact-widget.open #sd-cw-toggle{background:#0f2a3f}'
    + '#sd-cw-toggle .sd-cw-close{display:none}'
    + '#sd-contact-widget.open #sd-cw-toggle .sd-cw-open{display:none}'
    + '#sd-contact-widget.open #sd-cw-toggle .sd-cw-close{display:block}'
    + '@media (max-width:480px){#sd-contact-widget{right:14px;bottom:14px}}'
    + '@media (prefers-reduced-motion:reduce){#sd-contact-widget *{transition:none!important}}';

  var waIcon = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.207zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>';
  var phoneIcon = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.62 10.79a15.53 15.53 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.36 11.36 0 003.56.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.56 1 1 0 01-.24 1.01l-2.21 2.22z"/></svg>';
  var closeIcon = '<svg class="sd-cw-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';

  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  var wrap = document.createElement("div");
  wrap.id = "sd-contact-widget";
  wrap.innerHTML = ''
    + '<div id="sd-cw-actions">'
    +   '<a class="sd-cw-link sd-cw-wa" href="https://wa.me/' + WHATSAPP
    +     '?text=' + encodeURIComponent(PREFILL) + '" target="_blank" rel="noopener"'
    +     ' aria-label="Message us on WhatsApp">'
    +     '<span class="sd-cw-ico">' + waIcon + '</span><span>Chat on WhatsApp</span></a>'
    +   '<a class="sd-cw-link sd-cw-call" href="tel:' + TEL + '"'
    +     ' aria-label="Call us on ' + DISPLAY + '">'
    +     '<span class="sd-cw-ico">' + phoneIcon + '</span><span>Call ' + DISPLAY + '</span></a>'
    + '</div>'
    + '<button id="sd-cw-toggle" type="button" aria-expanded="false"'
    +   ' aria-label="Contact us by WhatsApp or phone">'
    +   '<span class="sd-cw-open">' + waIcon + '</span>' + closeIcon
    + '</button>';
  document.body.appendChild(wrap);

  var toggle = wrap.querySelector("#sd-cw-toggle");
  function setOpen(open) {
    wrap.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  }
  toggle.addEventListener("click", function (e) {
    e.stopPropagation();
    setOpen(!wrap.classList.contains("open"));
  });
  document.addEventListener("click", function (e) {
    if (!wrap.contains(e.target)) setOpen(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setOpen(false);
  });
})();
