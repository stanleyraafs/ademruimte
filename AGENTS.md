# AGENTS.md: overdracht voor AI-agents

Dit is de website van **Ademwerk Stanley Raafs**, resetcoach en begeleider van somatisch (verbonden) ademwerk in Beesel (Limburg). De site is een statische [Eleventy 3](https://www.11ty.dev/)-site. De eigenaar beheert de inhoud zelf via [Decap CMS](https://decapcms.org/) op `/admin/`. De site is volledig in het Nederlands.

**Status:** alle pagina's zijn af en lokaal getest. De code staat in de **publieke** repo [`stanleyraafs/ademwerk`](https://github.com/stanleyraafs/ademwerk) (branch `main`). De site is nog **niet online**: Netlify en het CMS-inloggen moeten nog worden ingericht. Deploy of koppel diensten niet zonder expliciete opdracht van de eigenaar. Omdat de repo publiek is, commit je nooit persoonlijke notities, transcripten, sleutels of tokens. Wat nog openstaat, staat in [`docs/status.md`](docs/status.md).

**Werkwijze:** commit nooit rechtstreeks op `main` en zet nooit iets live zonder akkoord van de eigenaar. Werk op een aparte branch en open een pull request. De eigenaar bekijkt de wijzigingen (en de Netlify-preview) en geeft akkoord voordat er gemerged wordt.

## Lees dit eerst

| Document | Inhoud |
|---|---|
| [`docs/briefing.md`](docs/briefing.md) | Wat de klant wil: de oorspronkelijke vraag, de referentiesites, de antwoorden op de 10 intakevragen en de feedbackrondes |
| [`docs/ontwerp.md`](docs/ontwerp.md) | Designsysteem: kleuren, fonts, componenten, paginaopbouw en de hero-animatie |
| [`docs/techniek.md`](docs/techniek.md) | Architectuur: datamodel, templates, beeldpipeline, CMS, SEO, hero-WebGL en hosting |
| [`docs/beelden.md`](docs/beelden.md) | Hoe de AI-foto's zijn gemaakt (met de exacte prompts) en hoe je ze vervangt |
| [`docs/status.md`](docs/status.md) | Wat af is, welke aannames nog geverifieerd moeten worden en wat de volgende stappen zijn |
| [`README.md`](README.md) | Voor mensen: lokaal draaien, beheren en online zetten |

## Snel starten

```bash
npm install
npm run dev              # dev-server op http://localhost:8080 (bouwt en herlaadt automatisch)
npm run build            # productiebuild naar _site/
npm run check:links      # na een build: controleert interne links, afbeeldingen en srcsets
```

Draai `npm run build` **niet** terwijl `npm run dev` loopt. Twee processen die tegelijk dezelfde AVIF-bestanden wegschrijven, laten de dev-server vastlopen (`heif: Cannot write output data`). In dat geval: stop de server, verwijder `_site/` en start opnieuw.

## Afspraken met de klant (niet van afwijken zonder overleg)

- **Taal en toon:** Nederlands, de **jij-vorm**, warm, persoonlijk en nuchter. Geen zweverige taal.
- **Positionering:** *resetcoach*. De site richt zich op mensen die vastlopen, overspannen zijn, in of tegen een burn-out zitten, en op traumaverwerking. Ademwerk is "voor iedereen", maar de focus ligt hierop.
- **Tarief:** €150 per uur, inclusief btw.
- **Alleen contant betalen.** Dit moet **expliciet** op de site staan. De tekst komt uit `site.betalen`.
- **Boeken gaat via bellen, appen of mailen.** Dus **geen** WhatsApp-knop, **geen** contactformulier en **geen** Calendly of ander boekingssysteem. De klant heeft dit expliciet afgewezen.
- **Hoofd-CTA:** *gratis kennismakingsgesprek*.
- **Beeld:** **realistische foto's**. Een getekende of SVG-jungle is afgewezen ("lijkt op Minecraft"). De hero is een fotorealistische luchtopname van een jungle met een meer in de vorm van een long, met subtiele animatie eroverheen.
- **Kleuren:** diep junglegroen gecombineerd met fris lichtgroen, met zand, goud en bruin als accent. Bladeren alleen als *rustige* textuur.
- **Zelf beheerbaar:** alles wat de klant zou willen aanpassen (teksten, prijzen, aanbod, foto's, contactgegevens) moet via het CMS kunnen. Voeg je nieuwe inhoud of instellingen toe? Zet ze dan in `src/_data/*.json` of in markdown, en voeg het veld toe aan `src/admin/config.yml`. Hardcode geen klantinhoud in templates.
- **Niets verzinnen:** geen reviews, geen biografie, geen opleidingen of certificaten, geen medische claims ("geneest"). Ademwerk wordt steeds gepresenteerd als aanvulling op, en nooit als vervanging van, medische of psychologische zorg. De contra-indicaties staan op `/ademwerk/#veiligheid`.
- **SEO:** er zijn aparte pagina's per onderwerp en per dienst, met lokale zoekwoorden (Beesel, Reuver, Venlo, Roermond).

## Conventies

- Commentaar in code is **Nederlands** en spaarzaam. Het legt het *waarom* uit.
- CSS staat in één bestand (`src/assets/css/style.css`) met design tokens in `:root` en BEM-achtige klassen (`.hero__media`, `.card__body`). Secties zijn gemarkeerd met `/* ---------- naam ---------- */`.
- Afbeeldingen zet je als gewone `<img src="/assets/..." alt="" sizes="..." eleventy:widths="480,800">` in templates. De image-transform-plugin zet ze bij het bouwen om naar `<picture>` met AVIF/WebP/JPEG.
- De hero-foto gebruikt de shortcode `{% heroPicture %}` (art direction: liggend of staand). De `<img>` daarin heeft `eleventy:ignore`, zodat de transform-plugin hem overslaat.
- Er zijn bewust **geen async shortcodes** meer in lussen of includes (zie de valkuilen).
- Nieuwe JS gaat in `src/assets/js/`. `main.js` laadt op alle pagina's, `hero.js` alleen op de homepage.

## Valkuilen die al een keer mis zijn gegaan

1. **Async shortcodes in Nunjucks-lussen en includes** leveren door elkaar gegooide of verkeerde output op, bijvoorbeeld kaarten op de verkeerde plek of een dubbele titel. Daarom loopt alles via de image-transform-plugin (synchrone templates). Gebruik geen `{% picture %}`-achtige async shortcodes in `for`-lussen of in `card.njk`.
2. **`backdrop-filter` op de header** maakt de header het containing block voor het `position: fixed`-mobiele menu. Het menu zat dan na scrollen opgesloten in de headerbalk. De oplossing is `.nav-open .site-header { backdrop-filter: none }`.
3. **`<picture>` in fotokaders** moet expliciet `width/height: 100%` krijgen, anders vult de foto het kader maar half. Dat staat al in de CSS voor `.media-frame`, `.card__media`, `.section__bg`, `.page-hero__bg` en `.aside-card__media`.
4. **Gelijktijdige builds:** zie hierboven.
5. **Decap CMS:** `decap-cms.js` moet in de `<body>` geladen worden, niet in de `<head>`. Een directe deeplink naar een bestand in een *files*-collectie toont soms lege velden; open eerst de collectie.
6. **Git Bash op Windows** zet een argument `"/"` om naar een Windows-pad. Gebruik `MSYS_NO_PATHCONV=1` bij `npm run shot -- / naam`.
7. **Paginatitel dubbel ge-escaped:** `eleventyComputed` in een `.njk`-bestand escapet al. Gebruik daar `| safe` (zie `src/index.njk`).

## Verifiëren

Werk visueel na elke wijziging. De scripts gebruiken Google Chrome via `puppeteer-core`; stel het pad in met `CHROME_PATH` als het afwijkt. Screenshots komen in `_notes/shots/` (die map wordt door git genegeerd).

```bash
npm run shot -- /aanbod/ aanbod 1440 900 --full   # screenshot (volledige pagina)
npm run check:hero -- 1440 900 desktop            # WebGL-hero: 3 frames, fps, fouten
npm run check:ui                                  # mobiel menu (bovenaan en na scrollen)
npm run check:ui -- --cms                         # plus CMS-schermen (eerst: npx decap-server)
npm run record:hero                               # geanimeerde WebP van de hero
```

Controleer altijd ook op mobiel (390×844) en op tablet (820×1180). Headless Chrome rendert WebGL in software, dus een lage fps daar is normaal.

## Mappen

```
src/
  _data/site.json        contactgegevens, tarief, betaaltekst, fotopaden (CMS: Instellingen)
  _data/home.json        alle teksten van de homepage (CMS: Homepage)
  _data/nav.json         hoofdmenu
  _includes/             base.njk (layout, SEO, header/footer), page.njk, aanbod.njk, card.njk, cta.njk, icons.njk
  aanbod/*.md            één bestand per dienst (CMS: Aanbod); aanbod.json zet layout en permalink
  index.njk              homepage
  ademwerk.md, over-stanley.md, aanbod-overzicht.njk, kennismaken.njk, 404.njk, sitemap.njk, robots.njk
  admin/                 Decap CMS (index.html + config.yml)
  assets/css|js|fonts|img|uploads
scripts/generate-art.mjs bladtextuur-SVG's en favicon (npm run art)
scripts/dev/             controle-scripts (screenshots, hero, menu/CMS, links)
docs/                    projectdocumentatie
_notes/                  lokaal kladwerk, NIET in git: transcript van de intake, screenshots, AI-originelen (PNG)
```
