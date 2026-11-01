// Service worker: laat de site ook zonder internet werken.
// Gewone bezoekers merken er niets van: alleen wat ze bekijken wordt bewaard.
// In de geïnstalleerde app (beginscherm) vraagt main.js om alles op te halen: alle pagina's en foto's uit /offline.json.
const CACHE = "ademruimte";

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

const eigen = (url) => url.origin === self.location.origin && !url.pathname.startsWith("/admin");
// Foto's in /img/ hebben een vingerafdruk in de naam: eenmaal binnen, nooit meer veranderd
const vast = (pad) => pad.startsWith("/img/") || pad.startsWith("/assets/fonts/");

async function bewaar(req, res) {
  if (res && res.ok && res.type === "basic") {
    const cache = await caches.open(CACHE);
    await cache.put(req, res.clone());
  }
  return res;
}

// Een pagina: eerst het internet (dan zie je altijd de nieuwste versie), anders de bewaarde versie
async function pagina(req) {
  try {
    return await bewaar(req, await fetch(req));
  } catch (err) {
    const url = new URL(req.url);
    const cache = await caches.open(CACHE);
    const pad = url.pathname.endsWith("/") || url.pathname.includes(".") ? url.pathname : url.pathname + "/";
    return (await cache.match(pad)) || (await cache.match("/404.html")) || (await cache.match("/")) || Response.error();
  }
}

// Een foto in een ander formaat of een andere breedte, als precies deze niet bewaard is
async function andereVariant(pad) {
  const m = pad.match(/^\/img\/(.+)-(\d+)\.(avif|webp|jpe?g|png)$/);
  if (!m) return null;
  const [, naam, breedte] = m;
  const cache = await caches.open(CACHE);
  const kandidaten = [];
  for (const req of await cache.keys()) {
    const k = new URL(req.url).pathname.match(/^\/img\/(.+)-(\d+)\.(avif|webp|jpe?g|png)$/);
    if (k && k[1] === naam) kandidaten.push({ req, verschil: Math.abs(k[2] - breedte), jpeg: /jpe?g/.test(k[3]) });
  }
  // Liefst dezelfde breedte; JPEG kan elke browser tonen
  kandidaten.sort((a, b) => a.verschil - b.verschil || b.jpeg - a.jpeg);
  return kandidaten.length ? cache.match(kandidaten[0].req) : null;
}

// Overige bestanden: CSS en JS eerst van internet (kleine bestanden, die kunnen veranderen); foto's en fonts uit het geheugen
async function bestand(req) {
  const pad = new URL(req.url).pathname;
  const cache = await caches.open(CACHE);
  if (vast(pad)) {
    const bewaard = await cache.match(req);
    if (bewaard) return bewaard;
  }
  try {
    return await bewaar(req, await fetch(req));
  } catch (err) {
    return (await cache.match(req)) || (await andereVariant(pad)) || Response.error();
  }
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (!eigen(url) || url.pathname === "/offline.json") return;
  e.respondWith(req.mode === "navigate" ? pagina(req) : bestand(req));
});

// Alles ophalen voor gebruik zonder internet (gevraagd door de geïnstalleerde app)
async function alles(client) {
  const lijst = await (await fetch("/offline.json", { cache: "no-store" })).json();
  const cache = await caches.open(CACHE);
  const wachtrij = [...lijst.bestanden];
  let mislukt = 0;
  async function werker() {
    while (wachtrij.length) {
      const pad = wachtrij.shift();
      if (vast(pad) && (await cache.match(pad))) continue;
      try {
        const res = await fetch(pad, { cache: "no-cache" });
        // Een doorgestuurd antwoord mag een browser niet als pagina tonen; bewaar daarom een schone kopie
        if (res.ok) await cache.put(pad, res.redirected ? new Response(await res.blob(), { headers: res.headers }) : res);
        else mislukt++;
      } catch (err) {
        mislukt++;
      }
    }
  }
  await Promise.all(Array.from({ length: 6 }, werker));
  // Opruimen wat niet meer op de site staat (oude foto's, oude pagina's)
  if (!mislukt) {
    const gewenst = new Set(lijst.bestanden);
    for (const req of await cache.keys()) {
      if (!gewenst.has(new URL(req.url).pathname)) await cache.delete(req);
    }
  }
  if (client) client.postMessage({ type: "offline-klaar", compleet: !mislukt });
}

self.addEventListener("message", (e) => {
  if (e.data && e.data.type === "alles-ophalen") e.waitUntil(alles(e.source).catch(() => {}));
});
