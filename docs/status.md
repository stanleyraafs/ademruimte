# Status

*Bijgewerkt: 30 september 2026*

## Af

- De site telt 9 pagina's:
  - home
  - Wat is ademwerk
  - het aanbod-overzicht
  - 3 dienstpagina's
  - Over Stanley
  - Contact
  - 404
  
  Daarnaast worden `sitemap.xml` en `robots.txt` gegenereerd.
- **De hero** is een fotorealistische AI-luchtopname met een meer in de vorm van een long, in een liggende en een staande versie. De animaties:
  - de foto ademt (4 s in, 6 s uit)
  - WebGL-mist in twee lagen met lichtval
  - rimpelend en glinsterend water
  - muisparallax
  - lichtstralen en zwevende deeltjes
  - de tekst komt gestaffeld binnen
- De dienstpagina's volgen de opbouw van julipohan, met een sticky prijskaart en de melding over contant betalen.
- Alles is beheerbaar via Decap CMS: aanbod, pagina's, homepageteksten, contactgegevens en foto's. Lokaal getest met `decap-server`.
- **SEO:**
  - aparte pagina's met lokale zoekwoorden
  - JSON-LD: bedrijf, FAQ, diensten, breadcrumbs
  - canonical en Open Graph
- De beeldpipeline levert AVIF/WebP/JPEG in meerdere formaten.
- De site is responsive. Gecontroleerd op 1440×900, 1280×800, 820×1180 en 390×844, met het mobiele menu zowel bovenaan als na scrollen.
- De controle-scripts staan in `scripts/dev/` (zie `techniek.md`).
- De linkcontrole na de build geeft 0 ontbrekende links.

## Te verifiëren bij de klant (aannames)

Bevestigd door de eigenaar: achternaam **Raafs** en e-mailadres **Stanley.raafs@gmail.com** (beide in `site.json`).

| Wat | Nu op de site | Toelichting |
|---|---|---|
| Straatnaam | Bussereindseweg 9 | Uit de spraakopname ("Busser Eindseweg"). **Spelling controleren.** |
| Plaats | Beesel | De opname zei "Bezel". |
| Postcode | *(leeg)* | Niet genoemd. |
| Domein | `https://www.ademwerkstanleyraafs.nl` | Een voorbeeld. Aanpassen in `site.url` en in `src/admin/config.yml` (`site_url` / `display_url`). |
| Duur van een losse sessie | "meestal 1,5 à 2 uur, inclusief intake en nagesprek" | Een aanname, gebaseerd op wat in het vak gebruikelijk is. |
| Groepssessie | prijs "Op aanvraag", duur "2 à 2,5 uur" | Een aanname. De klant noemde alleen €150 per uur. |
| Details van de sessies | thee, matje, oefening voor thuis, tussentijds contact | Door de maker geschreven voorbeeldteksten. |
| "Over mij" | algemene tekst over zijn aanpak | Bewust **geen** verzonnen biografie. Het persoonlijke verhaal moet van Stanley komen. |

## Nog aan te leveren door de klant

- **Logo en huisstijl.** Ze bestaan al. Upload het logo via het CMS in het veld `site.logo`, en stem de kleurtokens eventueel af op de huisstijl.
- **Portretfoto** voor "Over mij" (`home.over.foto`), eventueel ook foto's van de praktijkruimte.
- **Persoonlijk verhaal** voor de pagina Over Stanley.
- **Reviews** zodra die er zijn. Er is nog geen sectie voor; die moet dan gebouwd worden, als CMS-lijst in `home.json` en eventueel per dienst.
- Het **KvK-nummer**. Een Nederlandse onderneming moet dat op de website vermelden. Voeg dan een veld `kvk` toe aan `site.json`, `config.yml` en de footer.
- Links naar social media, als die er zijn. De velden staan al klaar.

## Online zetten

De code staat in de **publieke** repo [`stanleyraafs/ademwerk`](https://github.com/stanleyraafs/ademwerk). `.gitignore` sluit `_notes/` uit (daar staan het intake-transcript en de AI-originelen), net als `node_modules/` en `_site/`. `src/admin/config.yml` wijst al naar deze repo.

Nog te doen, alleen op aanwijzing van de eigenaar:

1. Een site aanmaken op Netlify vanuit de repo (de instellingen staan in `netlify.toml`) en het domein koppelen.
2. Een GitHub OAuth-app aanmaken met callback `https://api.netlify.com/auth/done` en die in Netlify installeren als OAuth-provider. Het GitHub-account van Stanley (`stanleyraafs`) is de eigenaar van de repo en kan dus inloggen in het CMS.
3. Na livegang de sitemap aanmelden bij Google Search Console en een Google Bedrijfsprofiel aanmaken (lokale SEO).

## Mogelijke volgende stappen

- De hero-WebGL testen op echte telefoons (iOS Safari en Android Chrome), zowel de framerate als de batterij. Headless testen gebeurt alleen met software-rendering.
- Een `apple-touch-icon` en een PNG-favicon toevoegen. Nu is er alleen `favicon.svg`.
- Een eigen og:image van 1200×630 maken, met logo en tekst.
- Een sectie met reviews en eventueel een pagina met een agenda voor de groepssessies.
- Een eenvoudige privacyverklaring. Er zijn geen formulieren of cookies, maar het staat professioneel.
- Na het lezen van de huisstijl: fonts en kleuren eventueel aanpassen.
