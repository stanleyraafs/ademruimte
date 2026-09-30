// Genereert de deelafbeelding voor social media (1200×630) en het app-icoon (180×180).
// Teksten komen uit src/_data/site.json. Draai opnieuw met: npm run social
// Vereist Google Chrome (pad aanpassen via CHROME_PATH).
import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import puppeteer from "puppeteer-core";

const site = JSON.parse(readFileSync("src/_data/site.json", "utf8"));
const file = (p) => pathToFileURL(resolve(p)).href;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
const tmp = mkdtempSync(join(tmpdir(), "ademwerk-"));

const fonts = `
  @font-face { font-family: Fraunces; src: url("${file("src/assets/fonts/fraunces-latin-full-normal.woff2")}"); font-weight: 100 900; }
  @font-face { font-family: Fraunces; src: url("${file("src/assets/fonts/fraunces-latin-full-italic.woff2")}"); font-weight: 100 900; font-style: italic; }
  @font-face { font-family: "DM Sans"; src: url("${file("src/assets/fonts/dm-sans-latin-wght-normal.woff2")}"); font-weight: 100 1000; }
  * { margin: 0; box-sizing: border-box; }
`;

// Het long-icoon uit het favicon, zonder afgeronde hoeken (iOS rondt zelf af)
const lung = readFileSync("src/favicon.svg", "utf8").replace(/ rx="\d+"/, "");

const og = `<!doctype html><meta charset="utf-8"><style>${fonts}
  body { width: 1200px; height: 630px; overflow: hidden; background: #0a2718; font-family: "DM Sans", sans-serif; color: #fff; }
  /* Foto alleen rechts, zodat de hele long naast de tekst in beeld is */
  .foto { position: absolute; top: 0; bottom: 0; right: 0; left: 400px; background: url("${file(site.heroFoto.replace(/^\//, "src/"))}") 50% 45% / cover; }
  .schaduw { position: absolute; inset: 0; background: linear-gradient(90deg, #0a2718 0%, #0a2718 33%, rgba(10,39,24,.55) 52%, rgba(10,39,24,0) 70%); }
  .tekst { position: absolute; left: 80px; top: 0; bottom: 0; width: 640px; display: flex; flex-direction: column; justify-content: center; }
  .merk { display: flex; align-items: center; gap: 18px; margin-bottom: 44px; }
  .merk svg { width: 64px; height: 70px; }
  .merk span { font-size: 22px; letter-spacing: .32em; text-transform: uppercase; color: #e0bb62; font-weight: 600; }
  h1 { font-family: Fraunces, serif; font-weight: 500; font-size: 84px; line-height: 1.02; font-variation-settings: "SOFT" 100, "WONK" 0; }
  h1 em { display: block; color: #86d99a; font-weight: 400; font-variation-settings: "SOFT" 100, "WONK" 1; }
  p { margin-top: 30px; font-size: 27px; line-height: 1.4; color: rgba(255,255,255,.86); }
  .knop { margin-top: 36px; align-self: flex-start; padding: 16px 30px; border-radius: 999px; background: linear-gradient(135deg, #e0bb62, #c99a3b); color: #10231a; font-size: 24px; font-weight: 600; }
</style>
<div class="foto"></div><div class="schaduw"></div>
<div class="tekst">
  <div class="merk">${lung}<span>Ademwerk</span></div>
  <h1>Even op reset.<em>Terug naar je adem.</em></h1>
  <p>${esc(site.coach)} · ${esc(site.rol)} in ${esc(site.plaats)}</p>
  <div class="knop">Gratis kennismaking</div>
</div>`;

const icon = `<!doctype html><meta charset="utf-8"><style>
  * { margin: 0; } body { width: 180px; height: 180px; background: #0b3320; display: grid; place-items: center; }
  svg { width: 124px; height: 134px; }
</style>${lung}`;

const DEFAULT_CHROME = {
  win32: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  darwin: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  linux: "/usr/bin/google-chrome",
};
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || DEFAULT_CHROME[process.platform],
  headless: "new",
  args: ["--allow-file-access-from-files"],
});

async function render(html, name, width, height, type, out) {
  const path = join(tmp, name);
  writeFileSync(path, html);
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(path).href, { waitUntil: "networkidle0" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: out, type, ...(type === "jpeg" ? { quality: 88 } : {}) });
  await page.close();
  console.log("geschreven:", out);
}

await render(og, "og.html", 1200, 630, "jpeg", "src/assets/img/deelafbeelding.jpg");
await render(icon, "icon.html", 180, 180, "png", "src/apple-touch-icon.png");
await browser.close();
