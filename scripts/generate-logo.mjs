// Zet het logo (zwarte inkt op papier) om naar transparante beeldmerken.
// De inkt wordt het alfakanaal, zodat de kleur met CSS (mask-image) te kiezen is.
// Uitvoer: enso.png (compleet), enso-ring.png en enso-tekens.png (los, voor de hero-animatie),
// plus favicon en app-iconen (src/favicon-48.png, src/apple-touch-icon.png, src/icon-512.png).
import sharp from "sharp";

const SRC = process.argv[2] || "_notes/logo/logo-origineel.jpg";
const OUT = "src/assets/img/logo";
const SIZE = 480;

const { data, info } = await sharp(SRC).greyscale().raw().toBuffer({ resolveWithObject: true });
const { width: w, height: h } = info;

// inkt -> alfa: papier (~235) transparant, inkt (<60) dekkend
const alpha = new Uint8Array(w * h);
for (let i = 0; i < w * h; i++) {
  const t = (215 - data[i]) / (215 - 60);
  alpha[i] = Math.round(Math.max(0, Math.min(1, t)) * 255);
}

// Samenhangende inktvlekken labelen, om de cirkel van de tekens te scheiden
const label = new Int32Array(w * h).fill(-1);
const comps = [];
const stack = [];
for (let i = 0; i < w * h; i++) {
  if (alpha[i] < 90 || label[i] !== -1) continue;
  const id = comps.length;
  const c = { n: 0, sx: 0, sy: 0, x0: w, y0: h, x1: 0, y1: 0 };
  label[i] = id;
  stack.push(i);
  while (stack.length) {
    const p = stack.pop();
    const x = p % w, y = (p / w) | 0;
    c.n++; c.sx += x; c.sy += y;
    if (x < c.x0) c.x0 = x; if (x > c.x1) c.x1 = x;
    if (y < c.y0) c.y0 = y; if (y > c.y1) c.y1 = y;
    for (const q of [p - 1, p + 1, p - w, p + w]) {
      if (q < 0 || q >= w * h || label[q] !== -1 || alpha[q] < 90) continue;
      if (Math.abs((q % w) - x) > 1) continue;
      label[q] = id;
      stack.push(q);
    }
  }
  comps.push(c);
}

// De grootste vlek is de cirkel; het middelpunt en de straal volgen uit zijn kader
const ring = comps.reduce((a, b) => (b.n > a.n ? b : a));
const cx = (ring.x0 + ring.x1) / 2, cy = (ring.y0 + ring.y1) / 2;
const r = Math.max(ring.x1 - ring.x0, ring.y1 - ring.y0) / 2;

// Tekens: vlekken in de smalle middenkolom (de cirkel zelf en de losse penseelhaal rechts vallen erbuiten)
const inKolom = (x, y) => Math.abs(x - cx) < r * 0.25 && Math.abs(y - cy) < r * 0.7;
const isTeken = comps.map((c) => c !== ring && inKolom(c.sx / c.n, c.sy / c.n));

// Randpixels (onder de drempel) toewijzen aan de dichtstbijzijnde gelabelde buur
function laag(filter) {
  const rgba = Buffer.alloc(w * h * 4, 255);
  for (let i = 0; i < w * h; i++) {
    let id = label[i];
    if (id === -1 && alpha[i] > 0) {
      for (let d = 1; d <= 3 && id === -1; d++) {
        for (const q of [i - d, i + d, i - d * w, i + d * w]) {
          if (q >= 0 && q < w * h && label[q] !== -1) { id = label[q]; break; }
        }
      }
    }
    const hoort = id === -1 ? filter(null, i) : filter(id, i);
    rgba[i * 4 + 3] = hoort ? alpha[i] : 0;
  }
  return rgba;
}

const pad = Math.round(r * 0.03);
const side = Math.round(r * 2 + pad * 2);
const left = Math.max(0, Math.round(cx - side / 2));
const top = Math.max(0, Math.round(cy - side / 2));
const crop = { left, top, width: Math.min(side, w - left), height: Math.min(side, h - top) };

async function schrijf(buf, naam, size = SIZE) {
  await sharp(buf, { raw: { width: w, height: h, channels: 4 } })
    .extract(crop)
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toFile(`${OUT}/${naam}`);
}

const binnen = (i) => inKolom(i % w, (i / w) | 0);
await schrijf(laag(() => true), "enso.png");
await schrijf(laag((id, i) => (id === null ? !binnen(i) : !isTeken[id])), "enso-ring.png");
await schrijf(laag((id, i) => (id === null ? binnen(i) : isTeken[id])), "enso-tekens.png");

// App-icoon: zandkleurige inkt op junglegroen
async function icoon(size, naam) {
  const mark = await sharp(laag(() => true), { raw: { width: w, height: h, channels: 4 } })
    .extract(crop).resize(Math.round(size * 0.8)).png().toBuffer();
  const kleur = await sharp({ create: { width: Math.round(size * 0.8), height: Math.round(size * 0.8), channels: 4, background: "#e8d5a9" } })
    .composite([{ input: mark, blend: "dest-in" }]).png().toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: "#0a2718" } })
    .composite([{ input: kleur, gravity: "center" }])
    .png({ compressionLevel: 9 })
    .toFile(naam);
}
await icoon(180, "src/apple-touch-icon.png");
await icoon(512, "src/icon-512.png");
await icoon(48, "src/favicon-48.png");

console.log(`logo: ${comps.length} vlekken, ${isTeken.filter(Boolean).length} tekens, straal ${Math.round(r)}px`);
