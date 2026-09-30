# Ontwerp

## Sfeer

De sfeer is weelderig, levend en rustig: een "dreamshot" boven de jungle, met veel groen, warm ochtendlicht en mist. Commercieel moet het helder zijn: op elke pagina staan een duidelijke CTA (*gratis kennismaking*), de prijs en het telefoonnummer. Het ritme van de adem (4 tellen in, 6 tellen uit) is het terugkerende bewegingsmotief.

## Kleuren (`:root` in `src/assets/css/style.css`)

| Token | Hex | Gebruik |
|---|---|---|
| `--jungle-950` | `#05170d` | footer, donkerste tekst op goud |
| `--jungle-900` | `#0a2718` | donkere secties, header na scrollen, knoppen |
| `--jungle-800` | `#0f3a24` | reserve |
| `--emerald-700` | `#135a38` | koppen van accenten en iconen |
| `--emerald-600` | `#1a7a4a` | links, eyebrows |
| `--leaf-500` | `#2f9e5c` | opsommingstekens |
| `--fresh-400` | `#86d99a` | fris lichtgroen: accent op donker, tweede regel van de hero-kop |
| `--fresh-200` | `#d3f1d8` | achtergrond van iconen |
| `--mist` / `--mist-2` | `#f4f7ef` / `#e9f0e3` | lichte secties |
| `--sand-100` / `--sand-300` | `#f7f0e1` / `#e8d5a9` | zandsecties, kleine labels op donker |
| `--gold-400` / `--gold-500` | `#e0bb62` / `#c99a3b` | primaire knop (goudverloop), highlights |
| `--bark-600` | `#7a5530` | bruin accent (reserve) |
| `--ink` / `--muted` | `#10231a` / `#4b6155` | tekst |

## Typografie

- **Koppen:** *Fraunces* (variabel, `SOFT 100`). Italic met `WONK 1` voor accentwoorden (`.accent`).
- **Tekst:** *DM Sans* (variabel).
- Beide fonts worden zelf gehost vanuit `src/assets/fonts/`, dus zonder Google Fonts (privacy/AVG). Ze komen uit `@fontsource-variable`.

## Componenten

- **Knoppen:**
  - `.btn--gold`: de primaire actie
  - `.btn--ghost`: op donker of op een foto
  - `.btn--line`: op licht
- **Tekststijlen:** `.eyebrow` is een klein label in hoofdletters met een streepje ervoor. `.lead` is een grote intro-alinea.
- **Lijsten:** `.checklist` heeft een blaadje als icoon. `.checklist--dark` is de variant voor donkere secties.
- **Kaarten:** `.card` is een aanbod-kaart met een foto, een korte tekst, de prijs en een pijl. De hele kaart is klikbaar via de `::after` van de link.
- **Kaders en blokken:**
  - `.media-frame`: een foto met een boogvormige bovenkant en een glazen badge
  - `.info` / `.info--highlight`: praktische tegels, waarbij "Alleen contant" altijd de donkere highlight-tegel is
  - `.aside-card`: de sticky prijskaart op dienstpagina's, met een `.cash-note`
- **Stappen:** `.steps` bevat genummerde stappen met een stippellijn ertussen. `.timeline` is de verticale variant.
- **Veelgestelde vragen:** `.faq` gebruikt `<details>`/`<summary>`.
- **Animatie bij scrollen:** `.reveal` laat elementen rustig verschijnen. De vertraging stel je in met `style="--delay: .1s"`.

## Achtergronden en textuur

- **Donkere secties** (`.section--jungle`, `cta.njk`): de *bladerfoto* (`site.bladerFoto`) met een donkergroene overlay.
- **Lichte secties** (`.section--mist`, `.section--sand`): een naadloze, heel lichte lijntextuur van bladeren (`leaves-on-light.svg`), die naar boven en onder uitfadet.
- **Footer:** `leaves-on-dark.svg`.
- De SVG-texturen en het favicon maak je met `npm run art` (`scripts/generate-art.mjs`).

## Paginaopbouw

**Home** (`src/index.njk`):
1. hero
2. *Herken je dit?*
3. *Waarom een resetcoach?*, met drie pijlers
4. het feit "± 20.000 keer per dag adem je" op de bladerfoto
5. het aanbod: 3 kaarten, plus de melding "uitsluitend contant"
6. *Zo werkt het*: 3 stappen
7. *Over mij*
8. *Goed om te weten*: boeken, alleen contant, locatie
9. veelgestelde vragen
10. de CTA-band

**Dienstpagina** (`src/_includes/aanbod.njk`), met de opbouw van julipohan:
- een pagina-hero met de dienstfoto
- de welkomsttekst
- *Herken je dit?*
- *Voor wie*
- *Wat kun je verwachten?* als tijdlijn
- *Dit krijg je*
- een sticky prijskaart met de duur, de locatie, hoe je boekt, de knoppen en de melding over contant betalen
- *Ander aanbod*
- de CTA-band

**Overige pagina's** gebruiken `page.njk`: een pagina-hero, markdown-inhoud (`.prose`) en de CTA-band. Uitzonderingen:
- **Contact** (`kennismaken.njk`) heeft eigen blokken voor bellen, appen, mailen en het adres, plus "zo gaat het verder".
- **Het aanbod-overzicht** (`aanbod-overzicht.njk`) gebruikt kaarten en infotegels.

## Hero

De hero heeft deze lagen, van onder naar boven:

| Laag | Wat | Waar |
|---|---|---|
| `.hero__media` | De foto (`<picture>`: liggend op desktop, staand bij `max-aspect-ratio: 4/5`). Het hele blok **ademt**: een schaal van 1 naar 1,045, met 4 s in en 6 s uit (`--breath: 10s`). | CSS `hero-breathe` |
| `.hero__canvas` (binnen de media-laag) | WebGL: de foto plus **rimpelend water**, **glinsteringen**, trage caustics en **twee lagen rollende mist** met lichtval vanaf de zonkant. De mist wordt dikker en dunner met het ademritme, en de lagen bewegen licht mee met de muis. Het canvas fadet in zodra het klaar is. | `src/assets/js/hero.js` |
| `.hero__rays` | Warme lichtstralen linksboven, die langzaam pulseren | CSS |
| `.hero__mist` | CSS-mist als terugvaloptie. Die wordt verborgen zodra WebGL actief is (`.has-gl`). | CSS |
| `.hero__shade` | Verlopen voor de leesbaarheid (boven voor de header, onder voor de tekst) | CSS |
| `.hero__spores` | Zwevende lichtdeeltjes, gegenereerd in `main.js` | CSS + JS |
| `.hero__content` | De ademindicator ("Adem in… / Adem uit…", synchroon met `--breath`), de eyebrow, de H1 (de 2e regel groen en cursief), de tekst en twee knoppen. Alles komt bij het laden gestaffeld binnen. | `index.njk` |

- **Desktop:** de tekst staat in twee kolommen onderin, onder de long.
- **Staande schermen** (`max-width: 860px` en `max-aspect-ratio: 4/5`): de hele staande foto staat bovenaan (150vw hoog), met de long vrij in beeld. Daaronder fadet de foto naar donkergroen, en daar staat de tekst.
- **"Minder beweging":** alle animaties staan uit en de WebGL-laag start niet.

## Motion-principes

- Alles volgt het ademritme van 10 s: 40 % inademen en 60 % uitademen. Dat geldt voor de hero-zoom, de ademindicator, de mistdichtheid en het grote getal in de feit-sectie.
- Beweging is langzaam en rustig. Er zijn geen harde overgangen.
- `prefers-reduced-motion` wordt overal gerespecteerd.
