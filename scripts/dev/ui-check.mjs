// Controleert het mobiele menu (ook na scrollen) en het CMS via de lokale backend.
//   node scripts/dev/ui-check.mjs            -> alleen mobiel menu
//   node scripts/dev/ui-check.mjs --cms      -> ook het CMS (vereist `npx decap-server` op poort 8081)
// Het CMS-deel opent alleen schermen; het slaat niets op.
import { launch, collectErrors, wait, BASE_URL, OUT_DIR } from "./browser.mjs";

const browser = await launch();
const page = await browser.newPage();
const errors = collectErrors(page);

// Mobiel menu, bovenaan en na scrollen (backdrop-filter mag het menu niet opsluiten)
await page.setViewport({ width: 390, height: 844 });
await page.goto(BASE_URL + "/", { waitUntil: "networkidle0" });
await page.click(".nav-toggle");
await wait(700);
await page.screenshot({ path: `${OUT_DIR}/menu-top.png` });
await page.keyboard.press("Escape");
await page.evaluate(() => window.scrollTo(0, 1400));
await wait(800);
await page.click(".nav-toggle");
await wait(700);
await page.screenshot({ path: `${OUT_DIR}/menu-gescrold.png` });

if (process.argv.includes("--cms")) {
  await page.setViewport({ width: 1400, height: 900 });
  await page.goto(BASE_URL + "/admin/", { waitUntil: "networkidle0" });
  await wait(1500);
  const login = await page.$("button");
  if (login) {
    await login.click();
    await wait(2500);
  }
  await page.goto(BASE_URL + "/admin/#/collections/aanbod/entries/losse-sessie", { waitUntil: "networkidle0" });
  await wait(3000);
  await page.screenshot({ path: `${OUT_DIR}/cms-aanbod.png` });
  // Eerst de collectie openen: een directe deeplink laadt soms nog lege velden
  await page.goto(BASE_URL + "/admin/#/collections/instellingen", { waitUntil: "networkidle0" });
  await wait(2500);
  await page.goto(BASE_URL + "/admin/#/collections/instellingen/entries/home", { waitUntil: "networkidle0" });
  await wait(6000);
  await page.screenshot({ path: `${OUT_DIR}/cms-home.png` });
}

await browser.close();
console.log(`screenshots in ${OUT_DIR}`, errors.length ? { errors } : "geen fouten");
