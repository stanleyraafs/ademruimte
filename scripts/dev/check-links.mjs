// Controleert na `npm run build` of alle interne links, afbeeldingen en srcsets in _site bestaan.
//   node scripts/dev/check-links.mjs
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const pages = [];
(function walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith(".html")) pages.push(p);
  }
})("_site");

let missing = 0;
const exists = (url) => {
  let f = join("_site", decodeURI(url));
  if (url.endsWith("/")) f = join(f, "index.html");
  return existsSync(f);
};
for (const p of pages) {
  const html = readFileSync(p, "utf8");
  for (const [, url] of html.matchAll(/(?:href|src)="(\/[^"#?]*)"/g)) {
    if (!exists(url)) (missing++, console.log("ONTBREEKT", p, "->", url));
  }
  for (const [, set] of html.matchAll(/srcset="([^"]+)"/g)) {
    for (const part of set.split(",")) {
      const url = part.trim().split(" ")[0];
      if (url.startsWith("/") && !exists(url)) (missing++, console.log("ONTBREEKT (srcset)", p, "->", url));
    }
  }
}
console.log(`${pages.length} pagina's gecontroleerd, ${missing} ontbrekend`);
process.exitCode = missing ? 1 : 0;
