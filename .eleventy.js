module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "robots.txt" });

  // YYYY-MM-DD for sitemap <lastmod>.
  eleventyConfig.addFilter("isoDate", function (d) {
    try {
      return new Date(d).toISOString().slice(0, 10);
    } catch (e) {
      return "";
    }
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "../_data",
      output: "_site",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    templateFormats: ["html", "njk", "md"],
  };
};
