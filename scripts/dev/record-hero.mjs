// Neemt de hero op als geanimeerde WebP (handig om beweging te laten zien).
//   node scripts/dev/record-hero.mjs [breedte] [hoogte] [frames] [ms-tussen-frames]
// Headless rendert traag, dus de opname speelt versneld af.
import sharp from "sharp";
import { launch, wait, BASE_URL, OUT_DIR } from "./browser.mjs";

const [w = "1280", h = "800", n = "40", step = "200"] = process.argv.slice(2);
const browser = await launch();
const page = await browser.newPage();
await page.setViewport({ width: +w, height: +h });
await page.goto(BASE_URL + "/", { waitUntil: "networkidle0" });
await wait(2500);

const frames = [];
for (let i = 0; i < +n; i++) {
  frames.push(await page.screenshot({ type: "png" }));
  await wait(+step);
}
await browser.close();

const small = await Promise.all(frames.map((f) => sharp(f).resize(Math.round(+w * 0.6)).png().toBuffer()));
const file = `${OUT_DIR}/hero-animatie.webp`;
await sharp(small, { join: { animated: true } })
  .webp({ quality: 70, loop: 0, delay: small.map(() => 120) })
  .toFile(file);
console.log(file);
