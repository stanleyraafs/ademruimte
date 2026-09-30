# Techniek

## Stack

- **[Eleventy 3](https://www.11ty.dev/)** (Nunjucks + Markdown) bouwt de statische HTML in `_site/`. De config staat in `eleventy.config.mjs`.
- **[@11ty/eleventy-img](https://www.11ty.dev/docs/plugins/image/)** zet afbeeldingen om naar AVIF/WebP/JPEG in meerdere breedtes. Het resultaat komt in `_site/img/`.
- **[Decap CMS](https://decapcms.org/)** (v3, geladen via unpkg) draait op `/admin/` voor beheer door de klant.
- **Vanilla CSS en JS**, zonder framework of bundler. De enige runtime-JS is `main.js` en, op de homepage, `hero.js`.
- **Hosting:** Netlify (gratis). De config staat in `netlify.toml`.
- Node ≥ 20 (Netlify gebruikt 22).

## Datamodel

### `src/_data/site.json`
Beschikbaar als `site.*` in alle templates. In het CMS staat het onder *Instellingen & homepage → Contactgegevens & algemeen*.

| Veld | Gebruik |
|---|---|
| `naam`, `coach`, `rol` | bedrijfsnaam, naam van de coach en functie (logo, footer, JSON-LD) |
| `url` | absolute basis-URL, **zonder** slash aan het eind (canonical, og, sitemap, JSON-LD) |
| `omschrijving` | standaard meta-description |
| `telefoon` | getoond zoals ingevoerd; de filter `telLink` maakt er `+316…` van |
| `email` | **nog leeg**. Blokken met e-mail verschijnen pas als dit gevuld is (`{% if site.email %}`) |
| `adres`, `postcode`, `plaats`, `regio` | adres (de postcode is nog leeg), werkgebied |
| `tarief`, `btw` | tariefteksten |
| `betalen` | de tekst over alleen contant betalen; die staat overal waar het over betalen gaat |
| `logo` | leeg betekent een tekstlogo met long-icoon; gevuld wordt het een `<img>` in de header |
| `heroFoto`, `heroFotoMobiel` | liggende en staande hero-foto |
| `bladerFoto` | de achtergrond van de donkere secties en de standaard pagina-hero |
| `ogAfbeelding` | optionele deelafbeelding; anders wordt de afbeelding van de pagina of de hero-foto gebruikt |
| `instagram`, `facebook`, `linkedin` | verschijnen in de footer zodra ze gevuld zijn |

### `src/_data/home.json`
Alle teksten van de homepage staan hier:
- `seoTitel`
- `hero{boventitel, titel, tekst, knop}`. Een `\n` in `titel` maakt de tweede regel de groene accentregel.
- `herkenning{titel, punten[], slot}`
- `reset{titel, tekst (markdown), pijlers[{titel, tekst}]}`
- `feit{getal, titel, tekst}`
- `stappen{titel, items[{titel, tekst}]}`
- `over{titel, tekst, knop, foto?}`
- `praktisch{titel}`
- `faq[{vraag, antwoord}]`. HTML mag in een antwoord; voor de JSON-LD wordt het gestript.
- `cta{titel, tekst}`

### `src/aanbod/*.md` (collectie `aanbod`)
Front matter:
- `title`, `volgorde` (sortering), `kort` (tekst op de kaart)
- `prijs`, `prijsNotitie`. Op de kaart wordt het deel "· contant te voldoen…" weggelaten.
- `duur`, `waar`
- `afbeelding`
- `herken[]`, `voorWie`, `verloop[{titel, tekst}]`, `watKrijgJe[]`
- `seoTitel`, `description`

De body bevat de welkomsttekst. `aanbod.json` zet `layout: aanbod.njk` en de permalink `/aanbod/<bestandsnaam>/`. Een nieuw bestand, bijvoorbeeld via het CMS, verschijnt vanzelf op de home, het overzicht, de footer en onder "Ander aanbod".

### Pagina's (`src/ademwerk.md`, `src/over-stanley.md`)
Front matter voor `page.njk`:
- `layout`, `permalink`
- `title`, `kop?`, `kruimel?`, `boventitel?`, `intro`
- `heroAfbeelding?`, `seoTitel?`, `description?`

## Templates

| Bestand | Rol |
|---|---|
| `_includes/base.njk` | de HTML-basis: `<head>` met SEO en og, JSON-LD van het bedrijf, header met menu, footer, `main.js` |
| `_includes/page.njk` | de generieke contentpagina: pagina-hero, `.prose`, CTA |
| `_includes/aanbod.njk` | de dienstpagina, inclusief de JSON-LD `Service` en `BreadcrumbList` |
| `_includes/card.njk` | de aanbod-kaart. Verwacht de variabele `item` (een collectie-item) en `loop` |
| `_includes/cta.njk` | de afsluitende CTA-band op de bladerfoto |
| `_includes/icons.njk` | de macro `icon(naam)`: `lung`, `phone`, `chat`, `mail`, `pin`, `cash`, `arrow`, `calendar` |

**Filters** (in `eleventy.config.mjs`):
- `telLink`
- `absoluteUrl(base)`
- `year`
- `isoDate`
- `striptags`
- `md` / `mdInline` (via markdown-it; HTML is toegestaan)

**Shortcodes:**
- `{% heroPicture liggend, staand, alt %}`: een `<picture>` met `media="(max-aspect-ratio: 4/5)"` voor de staande foto
- `{% imageUrl src, breedte, formaat %}`: één URL, voor og:image en JSON-LD

## Beeldpipeline

- In templates: `<img src="/assets/…" alt="…" sizes="…" eleventy:widths="480,800">`. De **image-transform-plugin** maakt er bij het bouwen `<picture>` van, standaard met `loading="lazy"` en `decoding="async"`. Boven de vouw gebruik je `loading="eager" fetchpriority="high"`.
- Paden die met `/` beginnen, worden opgezocht vanuit `src/`. Dat geldt ook voor CMS-uploads in `src/assets/uploads/`.
- SVG's blijven SVG (`svgShortCircuit`).
- `<img eleventy:ignore>` wordt overgeslagen. De hero doet dat, omdat die zijn eigen `<picture>` maakt.
- Bronfoto's zijn JPG's van kwaliteit 90 (±0,2–0,6 MB). De originele PNG's staan lokaal in `_notes/originelen/`, buiten git.

## CMS (Decap)

- De configuratie staat in `src/admin/config.yml`. Er zijn drie collecties:
  - **Aanbod**: een map; nieuwe diensten aanmaken mag
  - **Pagina's**: Wat is ademwerk en Over Stanley. De `layout` en `permalink` staan als verborgen velden
  - **Instellingen & homepage**: `site.json` en `home.json`
- Media gaan naar `src/assets/uploads/` en worden gepubliceerd als `/assets/uploads/`.
- **Backend:** `github`, met `repo: stanleyraafs/ademruimte` en branch `main`. Voor het inloggen is een GitHub OAuth-provider nodig; op Netlify is dat *Access & security → OAuth → Install provider → GitHub*. Wie via het CMS bewerkt, heeft schrijfrechten op de repo nodig.
- **Lokaal:** met `local_backend: true` start je `npx decap-server` (poort 8081) naast `npm run dev` en open je `/admin/`. Wijzigingen worden dan direct naar de bestanden geschreven.
- **Nieuw veld nodig?** Voeg het toe aan het databestand **én** aan `config.yml`. Een veld dat niet in de config staat, is niet bewerkbaar voor de klant.
- Bekende eigenaardigheid: een directe deeplink naar een bestand in *Instellingen* laadt soms lege velden. Open eerst de collectie en pas dan het bestand. Sla in dat geval niets op.

## SEO

- Elke pagina heeft een eigen `seoTitel` en `description`, plus canonical, Open Graph en Twitter-card.
- **JSON-LD:**
  - `HealthAndBeautyBusiness` op alle pagina's: adres, telefoon, `paymentAccepted: Cash`, werkgebied en de oprichter
  - `FAQPage` op de home
  - `Service` en `BreadcrumbList` op de dienstpagina's
- `sitemap.xml` en `robots.txt` worden gegenereerd. `/admin/` staat op disallow en heeft een noindex-meta-tag.
- Lokale zoekwoorden staan in de titels en teksten: Beesel, Reuver, Venlo, Roermond en Limburg.
- Er zijn geen trackers, cookies of externe fonts. Alleen `/admin/` laadt Decap vanaf unpkg.

## Hero-WebGL (`src/assets/js/hero.js`)

**Hoe het werkt:** één fragment-shader tekent de hero-foto zelf, als `object-fit: cover` met dezelfde `object-position` als de `<img>`, en voegt daar de effecten aan toe.

- **Water:** het script herkent water **aan de kleur**, turquoise pixels met veel blauw ten opzichte van rood en blauw ongeveer gelijk aan groen. Daarop komen UV-rimpelingen, fijne glinsteringen en trage caustics. Een andere foto werkt dus alleen als die ook turquoise water bevat; op andere pixels gebeurt niets.
- **Mist:** twee lagen fbm-ruis (value noise, 5 octaven) met domain warping, in schermruimte:
  - de achterste laag drijft langzaam
  - de voorste laag drijft sneller en heeft lichtval vanaf de zonkant linksboven
  - de mist is dunner boven de long (`uFocus`) en dikker aan de randen
  - de dichtheid volgt het ademritme (`uBreath`, synchroon met de CSS van 10 s)
  - de lagen verschuiven licht mee met de muis (`uMouse`)

**Prestaties:**
- De resolutie is begrensd op ±2,4 MP op desktop en ±1,1 MP op touch-apparaten.
- Houdt een apparaat het niet bij (de helft van 90 frames duurt langer dan 40 ms), dan zakt de resolutie naar 60 %, met een ondergrens van 0,5×.
- Het script pauzeert buiten beeld (IntersectionObserver) en in een verborgen tab (rAF).

**Terugvaloptie:** zonder WebGL, als het compileren faalt of met *prefers-reduced-motion* komt er geen canvas. De foto en de CSS-mist blijven dan staan.

**Instelknoppen** (allemaal in de shader-string):

| Wat | Waar | Nu |
|---|---|---|
| Windsnelheid van de mist | `vec2 wind = vec2(t * 0.05, t * 0.012)` | hoger is sneller |
| Grootte van de mistbanken | `fp = uv * … * 1.35` | lager geeft grotere banken |
| Hoeveelheid mist | de drempels van `smoothstep(0.42, 0.8, back)` / `smoothstep(0.5, 0.8, front)` | een lagere eerste waarde geeft meer mist |
| Dekking van de mist | `* 0.55` (achter) / `* 0.72` (voor) | |
| Vrije ruimte boven de long | `mix(0.3, 1.0, edge)` en `uFocus` (0.5, 0.4; staand 0.3) | |
| Mee-ademen | `(0.75 + 0.4 * uBreath)` | |
| Rimpelsterkte | `disp * 0.0035` | |
| Glinsteringen | `smoothstep(0.6, 0.88, sp)` en de intensiteit | |

## Hosting en deploy

- **Netlify:** build `npm run build`, publish `_site`, Node 22. Cache-headers voor `/img/*` en de fonts staan in `netlify.toml`. De 404 komt uit `_site/404.html`.
- Het stappenplan voor het online zetten staat in `README.md`: repo → Netlify → domein → OAuth → `config.yml`.
- Een CMS-wijziging wordt een commit op GitHub, en Netlify bouwt dan automatisch opnieuw (±1 minuut).

## Scripts

| Script | Doel |
|---|---|
| `npm run dev` / `build` | ontwikkelen en bouwen |
| `npm run art` | bladtextuur-SVG's en favicon opnieuw genereren (`scripts/generate-art.mjs`) |
| `npm run check:links` | interne links, afbeeldingen en srcsets in `_site` controleren (exitcode 1 bij fouten) |
| `npm run shot -- <pad> <naam> [b] [h] [--full]` | screenshot naar `_notes/shots/` |
| `npm run check:hero -- [b] [h] [label]` | WebGL-status, frames en fps van de hero |
| `npm run check:ui [-- --cms]` | mobiel menu (bovenaan en na scrollen), optioneel de CMS-schermen |
| `npm run record:hero` | geanimeerde WebP van de hero |

De browser-scripts gebruiken `puppeteer-core` met een lokale Chrome. Stel het pad in met `CHROME_PATH` en de server met `BASE_URL` (standaard `http://localhost:8080`).
