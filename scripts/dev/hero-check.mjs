// Controleert de levende hero (WebGL-mist en water): maakt 3 frames met 3 s ertussen
// en meldt of WebGL actief is, de canvasgrootte en de framerate.
//   node scripts/dev/hero-check.mjs [breedte] [hoogte] [label]
// Let op: headless Chrome rendert WebGL in software, dus de fps ligt veel lager dan op echte hardware.
import { launch, collectErrors, wait, BASE_URL, OUT_DIR } from "./browser.mjs";

const [w = "1440", h = "900", label = "desktop"] = process.argv.slice(2);
const browser = await launch();
const page = await browser.newPage();
const errors = collectErrors(page);
await page.setViewport({ width: +w, height: +h });
await page.goto(BASE_URL + "/", { waitUntil: "networkidle0" });
await wait(2500);

const info = await page.evaluate(() => {
  const c = document.querySelector(".hero__canvas");
  return { webgl: document.querySelector(".hero").classList.contains("has-gl"), canvas: c ? [c.width, c.height] : null };
});
for (let i = 0; i < 3; i++) {
  await page.screenshot({ path: `${OUT_DIR}/hero-${label}-${i}.png` });
  await wait(3000);
}
const fps = await page.evaluate(
  () =>
    new Promise((res) => {
      let n = 0;
      const t0 = performance.now();
      const f = () => (performance.now() - t0 < 2000 ? (n++, requestAnimationFrame(f)) : res(n / 2));
      requestAnimationFrame(f);
    })
);
await browser.close();
console.log(JSON.stringify({ ...info, fps, errors }, null, 2));
