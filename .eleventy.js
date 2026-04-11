module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/sitemap.xml": "sitemap.xml" });

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
