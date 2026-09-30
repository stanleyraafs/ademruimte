// Genereert de rustige bladtextuur (naadloze achtergrond) en het favicon.
// Draai opnieuw met: npm run art
import { writeFileSync, mkdirSync } from "node:fs";

const OUT = "src/assets/img";
mkdirSync(OUT, { recursive: true });

// ---------- helpers ----------
const r1 = (n) => Math.round(n * 10) / 10;

// Cubic bezier segmenten -> path string
function pathFrom(start, segs) {
  return `M${start.join(",")} ` + segs.map((s) => "C" + s.map((p) => p.join(",")).join(" ")).join(" ") + " Z";
}
const mirror = (p) => [1600 - p[0], p[1]];

// ---------- de long ----------
// Linker kwab (links in beeld). Rechter kwab is gespiegeld.
const lobeStart = [715, 212];
const lobeSegs = [
  [[690, 212], [668, 248], [650, 298]],
  [[620, 380], [575, 500], [565, 610]],
  [[560, 672], [576, 708], [612, 708]],
  [[662, 704], [722, 668], [772, 690]],
  [[790, 698], [790, 670], [785, 640]],
  [[779, 600], [783, 560], [781, 500]],
  [[779, 420], [771, 330], [756, 270]],
  [[746, 232], [732, 212], [715, 212]],
];
const leftD = pathFrom(lobeStart, lobeSegs);
const rightD = pathFrom(mirror(lobeStart), lobeSegs.map((s) => s.map(mirror)));
// Rivier (luchtpijp) en bronchiën
const riverD = "M812,-30 C790,40 816,120 806,180 C800,215 800,235 800,250";
const bronchusL = "M800,250 C790,272 778,290 758,322";
const bronchusR = "M800,250 C810,272 822,290 842,322";
// ---------- blad-vormen ----------
function leafPath(L, w) {
  return `M0,0 C${w},${r1(L * 0.22)} ${r1(w * 0.95)},${r1(L * 0.7)} 0,${L} C${-r1(w * 0.95)},${r1(L * 0.7)} ${-w},${r1(L * 0.22)} 0,0 Z`;
}
function leafWithVeins(L, w) {
  const veins = [];
  for (let t = 0.18; t < 0.9; t += 0.12) {
    const y = L * t, ww = w * Math.sin(Math.PI * t) * 0.8;
    veins.push(`M0,${r1(y)} Q${r1(ww * 0.5)},${r1(y + L * 0.03)} ${r1(ww)},${r1(y + L * 0.08)}`);
    veins.push(`M0,${r1(y)} Q${r1(-ww * 0.5)},${r1(y + L * 0.03)} ${r1(-ww)},${r1(y + L * 0.08)}`);
  }
  return `<path d="${leafPath(L, w)}"/><path d="M0,0 L0,${L}"/><path d="${veins.join(" ")}"/>`;
}
function frondPaths(L, maxLeaf, bendAmt) {
  // varenblad: stengel + blaadjes aan beide kanten
  const out = [];
  const stem = (t) => [t * L, Math.sin(t * Math.PI * 0.9) * bendAmt * t];
  const [ex, ey] = stem(1);
  out.push(`<path d="M0,0 Q${r1(L * 0.5)},${r1(bendAmt * 0.9)} ${r1(ex)},${r1(ey)}" fill="none" stroke-width="${r1(L / 90)}" class="stem"/>`);
  for (let t = 0.06; t < 0.98; t += 0.045) {
    const [x, y] = stem(t);
    const [x2, y2] = stem(t + 0.01);
    const ang = (Math.atan2(y2 - y, x2 - x) * 180) / Math.PI;
    const len = maxLeaf * Math.pow(Math.sin(Math.PI * Math.min(1, t * 1.05)), 0.7) + 6;
    for (const side of [-1, 1]) {
      out.push(
        `<path transform="translate(${r1(x)} ${r1(y)}) rotate(${r1(ang + side * 58)})" d="M0,0 C${r1(len * 0.3)},${r1(-len * 0.09)} ${r1(len * 0.75)},${r1(-len * 0.08)} ${r1(len)},0 C${r1(len * 0.75)},${r1(len * 0.08)} ${r1(len * 0.3)},${r1(len * 0.09)} 0,0 Z"/>`
      );
    }
  }
  return out.join("");
}
function monstera(size) {
  // hartvormig blad met insnijdingen en gaatjes (via masker)
  const s = size / 100;
  const leaf = `M0,-2 C-30,-12 -62,4 -70,34 C-78,66 -60,96 -30,108 C-14,114 -4,112 0,106 C4,112 14,114 30,108 C60,96 78,66 70,34 C62,4 30,-12 0,-2 Z`;
  const cuts = [];
  for (const side of [-1, 1]) {
    for (let k = 0; k < 5; k++) {
      const a = (-60 + k * 30) * (Math.PI / 180);
      const x1 = side * Math.cos(a) * 26, y1 = 52 + Math.sin(a) * 26;
      const x2 = side * Math.cos(a) * 90, y2 = 52 + Math.sin(a) * 90;
      cuts.push(`<path d="M${r1(x1)},${r1(y1)} L${r1(x2)},${r1(y2)}" stroke="#000" stroke-width="5" stroke-linecap="round"/>`);
      if (k % 2 === 0) cuts.push(`<ellipse cx="${r1(side * Math.cos(a) * 18)}" cy="${r1(52 + Math.sin(a) * 18)}" rx="3.5" ry="6" transform="rotate(${r1((a * 180) / Math.PI + 90)} ${r1(side * Math.cos(a) * 18)} ${r1(52 + Math.sin(a) * 18)})" fill="#000"/>`);
    }
  }
  return { leaf, cuts: cuts.join(""), s };
}

const m = monstera(100);

// ---------- rustige bladtextuur (naadloos) ----------
function pattern(name, stroke, strokeOpacity) {
  const T = 520;
  const items = [], defs = [];
  const place = (x, y, content) => {
    const id = `p${defs.length}`;
    defs.push(`<g id="${id}">${content}</g>`);
    for (const dx of [-T, 0, T]) for (const dy of [-T, 0, T]) items.push(`<use href="#${id}" x="${r1(x + dx)}" y="${r1(y + dy)}"/>`);
  };
  const specs = [
    [60, 70, "leaf", 150, 44, 30],
    [300, 40, "frond", 0, 0, 110],
    [420, 250, "leaf", 120, 36, -40],
    [140, 300, "monstera", 0, 0, 20],
    [360, 420, "leaf", 90, 28, 150],
    [30, 460, "frond", 0, 0, -20],
    [250, 220, "leaf", 70, 22, 80],
  ];
  for (const [x, y, type, L, w, rot] of specs) {
    let c;
    if (type === "leaf") c = `<g transform="rotate(${rot})">${leafWithVeins(L, w)}</g>`;
    else if (type === "frond") c = `<g transform="rotate(${rot}) scale(.32)">${frondPaths(420, 70, 50).replace(/<path /g, '<path fill="none" ')}</g>`;
    else c = `<g transform="rotate(${rot}) scale(.95)"><path d="${m.leaf}"/><path d="M0,0 L0,106"/>${[...Array(4)].map((_, k) => { const a = (-45 + k * 30) * Math.PI / 180; return `<path d="M0,${r1(52 + Math.sin(a) * 4)} Q${r1(Math.cos(a) * 40)},${r1(52 + Math.sin(a) * 42)} ${r1(Math.cos(a) * 64)},${r1(52 + Math.sin(a) * 64)}"/><path d="M0,${r1(52 + Math.sin(a) * 4)} Q${r1(-Math.cos(a) * 40)},${r1(52 + Math.sin(a) * 42)} ${r1(-Math.cos(a) * 64)},${r1(52 + Math.sin(a) * 64)}"/>`; }).join("")}</g>`;
    place(x, y, c);
  }
  writeFileSync(
    `${OUT}/${name}.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" width="${T}" height="${T}" viewBox="0 0 ${T} ${T}"><defs>${defs.join("")}</defs><g fill="none" stroke="${stroke}" stroke-opacity="${strokeOpacity}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${items.join("")}</g></svg>`
  );
}
pattern("leaves-on-dark", "#bfeecb", 0.14);
pattern("leaves-on-light", "#146b3a", 0.1);

// Favicon: kleine long
writeFileSync(
  "src/favicon.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="560 200 480 520"><rect x="560" y="200" width="480" height="520" rx="110" fill="#0b3320"/><g fill="none" stroke="#e3cf9f" stroke-width="22" stroke-linecap="round"><path d="M800,200 L800,250"/><path d="${bronchusL}"/><path d="${bronchusR}"/></g><path d="${leftD}" fill="#6ed08a"/><path d="${rightD}" fill="#6ed08a"/></svg>`
);

console.log("bladtextuur en favicon gegenereerd");
