import markdownIt from "markdown-it";
import Image, { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

const md = markdownIt({ html: true, breaks: false, linkify: true, typographer: true });

const IMG_OPTS = {
  formats: ["avif", "webp", "jpeg"],
  outputDir: "_site/img/",
  urlPath: "/img/",
  sharpJpegOptions: { quality: 78, progressive: true },
  sharpWebpOptions: { quality: 76 },
  sharpAvifOptions: { quality: 55 },
};

// Paden uit het CMS beginnen met "/assets/..."; op schijf staan ze onder src/
const toSrcPath = (p) => (p.startsWith("/") ? "src" + p : p);

// Hero: liggende foto op desktop, staande foto op mobiel (art direction)
async function heroPicture(landscape, portrait, alt = "") {
  const widths = [800, 1200, 1600, 2000];
  const land = await Image(toSrcPath(landscape), { ...IMG_OPTS, widths });
  const port = portrait ? await Image(toSrcPath(portrait), { ...IMG_OPTS, widths: [480, 768, 1024] }) : null;
  const srcset = (meta, fmt) => meta[fmt].map((i) => i.srcset).join(", ");
  const sources = [];
  for (const fmt of ["avif", "webp", "jpeg"]) {
    const type = fmt === "jpeg" ? "image/jpeg" : `image/${fmt}`;
    if (port) sources.push(`<source media="(max-aspect-ratio: 4/5)" type="${type}" srcset="${srcset(port, fmt)}" sizes="100vw">`);
    sources.push(`<source type="${type}" srcset="${srcset(land, fmt)}" sizes="100vw">`);
  }
  const fallback = land.jpeg[land.jpeg.length - 1];
  return `<picture class="hero__picture">${sources.join("")}<img src="${fallback.url}" width="${fallback.width}" height="${fallback.height}" alt="${alt}" fetchpriority="high" decoding="async" eleventy:ignore></picture>`;
}

// Eén URL van een geoptimaliseerde variant, voor og:image en structured data
async function imageUrl(src, width = 1600, format = "webp") {
  if (!src) return "";
  const meta = await Image(toSrcPath(src), { ...IMG_OPTS, widths: [width], formats: [format] });
  return meta[format][0].url;
}

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets/fonts");
  eleventyConfig.addPassthroughCopy("src/assets/css");
  eleventyConfig.addPassthroughCopy("src/assets/js");
  eleventyConfig.addPassthroughCopy("src/assets/img/*.svg");
  eleventyConfig.addPassthroughCopy("src/assets/uploads");
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/favicon.svg");
  eleventyConfig.addPassthroughCopy("src/apple-touch-icon.png");
  eleventyConfig.addPassthroughCopy("src/favicon-48.png");
  eleventyConfig.addPassthroughCopy("src/icon-512.png");
  eleventyConfig.addPassthroughCopy("src/assets/img/logo");

  // Zet elke <img> (ook foto's uit het CMS) om naar een geoptimaliseerde <picture>
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    formats: IMG_OPTS.formats,
    widths: [480, 800, 1200, 1600],
    urlPath: "/img/",
    outputDir: "_site/img/",
    sharpJpegOptions: IMG_OPTS.sharpJpegOptions,
    sharpWebpOptions: IMG_OPTS.sharpWebpOptions,
    sharpAvifOptions: IMG_OPTS.sharpAvifOptions,
    svgShortCircuit: true,
    htmlOptions: { imgAttributes: { loading: "lazy", decoding: "async" } },
  });
  eleventyConfig.addAsyncShortcode("heroPicture", heroPicture);
  eleventyConfig.addAsyncShortcode("imageUrl", imageUrl);

  eleventyConfig.addCollection("aanbod", (api) =>
    api.getFilteredByGlob("src/aanbod/*.md").sort((a, b) => (a.data.volgorde || 99) - (b.data.volgorde || 99))
  );

  // "06 22 37 97 22" -> "+31622379722"
  eleventyConfig.addFilter("telLink", (nr = "") => {
    const digits = String(nr).replace(/[^\d+]/g, "");
    return digits.startsWith("0") ? "+31" + digits.slice(1) : digits;
  });
  eleventyConfig.addFilter("absoluteUrl", (path, base) => new URL(path, base).href);
  eleventyConfig.addFilter("year", () => new Date().getFullYear());
  eleventyConfig.addFilter("isoDate", (d) => new Date(d).toISOString().slice(0, 10));
  eleventyConfig.addFilter("striptags", (s = "") => String(s).replace(/<[^>]+>/g, ""));
  eleventyConfig.setLibrary("md", md);
  eleventyConfig.addFilter("md", (str = "") => md.render(String(str)));
  eleventyConfig.addFilter("mdInline", (str = "") => md.renderInline(String(str)));

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
