// Screenshot van een pagina van de draaiende dev-server.
//   node scripts/dev/screenshot.mjs <pad> <naam> [breedte] [hoogte] [--full]
//   node scripts/dev/screenshot.mjs /aanbod/ aanbod 1440 900 --full
// Git Bash zet "/" om naar een Windows-pad: gebruik daar MSYS_NO_PATHCONV=1.
import { launch, collectErrors, wait, BASE_URL, OUT_DIR } from "./browser.mjs";

const args = process.argv.slice(2);
const full = args.includes("--full");
const [path = "/", name = "shot", w = "1440", h = "900"] = args.filter((a) => a !== "--full");

const browser = await launch();
const page = await browser.newPage();
const errors = collectErrors(page);
await page.setViewport({ width: +w, height: +h });
await page.goto(BASE_URL + path, { waitUntil: "networkidle0" });

if (full) {
  // Alles een keer in beeld scrollen zodat reveal-animaties en lazy images afgaan
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
    document.querySelectorAll("img").forEach((i) => (i.loading = "eager"));
    await Promise.all([...document.images].map((i) => (i.complete ? 1 : new Promise((r) => (i.onload = i.onerror = r)))));
    window.scrollTo(0, 0);
  });
  await wait(1200);
} else {
  await wait(2500);
}

const file = `${OUT_DIR}/${name}.png`;
await page.screenshot({ path: file, fullPage: full });
await browser.close();
console.log(file, errors.length ? { errors } : "geen fouten");
