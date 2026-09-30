(() => {
  const doc = document.documentElement;
  doc.classList.remove("no-js");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Header wordt massief zodra je voorbij de hero scrolt
  const header = document.querySelector(".site-header");
  if (header && !header.classList.contains("site-header--solid")) {
    const onScroll = () => header.classList.toggle("is-solid", window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // Mobiel menu
  const toggle = document.querySelector(".nav-toggle");
  if (toggle) {
    // Achter het open menu mag je niet met Tab of een schermlezer in de pagina belanden
    const behind = document.querySelectorAll("main, .site-footer");
    const setOpen = (open) => {
      document.body.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      behind.forEach((el) => (el.inert = open));
    };
    toggle.addEventListener("click", () => {
      const open = !document.body.classList.contains("nav-open");
      setOpen(open);
      if (open) document.querySelector(".nav a")?.focus();
    });
    document.querySelectorAll(".nav a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape" || !document.body.classList.contains("nav-open")) return;
      setOpen(false);
      toggle.focus();
    });
    // Groter scherm (bijv. telefoon gedraaid): menu dicht, pagina weer bereikbaar
    window.matchMedia("(min-width: 961px)").addEventListener("change", (e) => e.matches && setOpen(false));
  }

  // Zwevende lichtdeeltjes in de hero
  const spores = document.querySelector(".hero__spores");
  if (spores && !reduceMotion) {
    const count = window.innerWidth < 700 ? 10 : 18;
    for (let i = 0; i < count; i++) {
      const s = document.createElement("span");
      s.className = "spore";
      s.style.left = `${Math.random() * 100}%`;
      s.style.setProperty("--s", `${2 + Math.random() * 5}px`);
      s.style.setProperty("--d", `${14 + Math.random() * 16}s`);
      s.style.setProperty("--delay", `${-Math.random() * 30}s`);
      s.style.setProperty("--x", `${(Math.random() - 0.5) * 160}px`);
      spores.appendChild(s);
    }
  }

  // Elementen rustig laten verschijnen
  const items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add("is-visible"));
  }
})();
