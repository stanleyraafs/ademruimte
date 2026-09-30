// Adem mee: het logo in de hero ademt in boxbreathing (4 tellen in, 4 vast, 4 uit, 4 vast).
// De tekst loopt synchroon met de CSS-animatie van de ring. Tikken start een begeleide oefening.
(() => {
  const knop = document.querySelector(".adem");
  if (!knop) return;
  const hero = knop.closest(".hero");
  const ring = knop.querySelector(".adem__ring");
  const faseEl = knop.querySelector(".adem__fase");
  const telEl = knop.querySelector(".adem__tel");
  const labelEl = knop.querySelector(".adem__label");
  const hintEl = knop.querySelector(".adem__hint");
  const label = labelEl.textContent;
  const fases = (knop.dataset.fases || "Adem in|Houd vast|Adem uit|Houd vast").split("|");
  const rondes = parseInt(knop.dataset.rondes, 10) || 4;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const CYCLUS = 16000;
  const FASE = CYCLUS / 4;
  const nu = () => (document.timeline && document.timeline.currentTime != null ? document.timeline.currentTime : performance.now());

  // Het begin van de ademcyclus, gelijk aan de CSS-animatie; hero.js leest dit voor de WebGL-mist
  const ringAnimatie = () => (ring && ring.getAnimations ? ring.getAnimations().find((a) => a.animationName === "adem-ring") : null);
  const a = ringAnimatie();
  window.ademStart = a && a.currentTime != null ? nu() - a.currentTime : nu();

  let oefenen = false;
  let oefeningStart = 0;
  let klaarTot = 0;
  let laatste = "";

  function naarBegin() {
    // Ring, foto en mist samen terug naar "Adem in", zodat de oefening bij het begin start
    document.getAnimations().forEach((anim) => {
      if (anim.animationName === "adem-ring" || anim.animationName === "hero-breathe") anim.currentTime = 0;
    });
    window.ademStart = nu();
  }

  function start() {
    oefenen = true;
    klaarTot = 0;
    naarBegin();
    oefeningStart = window.ademStart;
    hero.classList.add("is-oefenen");
    knop.setAttribute("aria-pressed", "true");
    faseEl.setAttribute("aria-live", "polite");
    hintEl.textContent = knop.dataset.stop;
  }

  function stop(klaar) {
    oefenen = false;
    hero.classList.remove("is-oefenen");
    knop.setAttribute("aria-pressed", "false");
    faseEl.setAttribute("aria-live", klaar ? "polite" : "off");
    hintEl.textContent = knop.dataset.start;
    labelEl.textContent = label;
    if (klaar) klaarTot = nu() + 5000;
  }

  knop.addEventListener("click", () => (oefenen ? stop(false) : start()));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && oefenen) stop(false);
  });
  faseEl.setAttribute("aria-live", "off");

  function toon(fase, tel) {
    const sleutel = fase + "|" + tel;
    if (sleutel === laatste) return;
    laatste = sleutel;
    faseEl.textContent = fase;
    telEl.textContent = tel;
  }

  function frame() {
    const t = nu();
    if (klaarTot > t) {
      toon(knop.dataset.klaar, "");
    } else if (reduce && !oefenen) {
      toon("", "");
    } else {
      const inCyclus = (((t - window.ademStart) % CYCLUS) + CYCLUS) % CYCLUS;
      const fase = Math.floor(inCyclus / FASE);
      const tel = String(4 - Math.floor((inCyclus % FASE) / 1000));
      if (oefenen) {
        const ronde = Math.floor((t - oefeningStart) / CYCLUS) + 1;
        if (ronde > rondes) {
          stop(true);
        } else {
          labelEl.textContent = `Ronde ${ronde} van ${rondes}`;
          toon(fases[fase] + "…", tel);
        }
      } else {
        toon(fases[fase] + "…", tel);
      }
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
