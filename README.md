# Website Ademwerk Stanley Raas

Website voor resetcoach en ademcoach Stanley Raas in Beesel. De site wordt gebouwd met [Eleventy](https://www.11ty.dev/). Beheer gaat via [Decap CMS](https://decapcms.org/) op `/admin/`.

> **Werk je als AI-agent (of ontwikkelaar) aan dit project?** Begin bij [`AGENTS.md`](AGENTS.md). Daar staan de afspraken met de klant, de valkuilen en de werkwijze. De achtergrond staat in [`docs/`](docs/).

## Lokaal draaien

```bash
npm install
npm run dev        # http://localhost:8080
npm run build      # bouwt de site naar _site/
```

Lokaal teksten bewerken zonder inloggen: start naast `npm run dev` ook `npx decap-server` en open http://localhost:8080/admin/.

## Waar staat wat?

| Wat | Bestand | In het CMS |
|---|---|---|
| Contactgegevens, adres, betaaltekst, foto's | `src/_data/site.json` | Instellingen & homepage → Contactgegevens & algemeen |
| Teksten homepage, FAQ | `src/_data/home.json` | Instellingen & homepage → Homepage |
| Aanbod (per dienst een pagina) | `src/aanbod/*.md` | Aanbod |
| Wat is ademwerk / Over Stanley | `src/ademwerk.md`, `src/over-stanley.md` | Pagina's |
| Foto's (geüpload via CMS) | `src/assets/uploads/` | Media |

Alle foto's worden bij het bouwen automatisch omgezet naar AVIF/WebP/JPEG in meerdere formaten.

## Online zetten (gratis hosting op Netlify)

1. De code staat in de GitHub-repository [`stanleyraafs/ademwerk`](https://github.com/stanleyraafs/ademwerk).
2. Maak op [netlify.com](https://www.netlify.com/) een site aan vanuit die repository. De build-instellingen staan al in `netlify.toml`.
3. Koppel het eigen domein in Netlify onder *Domain management*.
4. Stel het inloggen voor het CMS in:
   - Maak op GitHub een OAuth-app aan (*Settings → Developer settings → OAuth Apps*) met als callback-URL `https://api.netlify.com/auth/done`.
   - Ga in Netlify naar *Site configuration → Access & security → OAuth*, kies *Install provider → GitHub* en vul de Client ID en het Secret in.
5. `src/admin/config.yml` wijst al naar `stanleyraafs/ademwerk`. Pas dit alleen aan als de repo verhuist.
6. Pas in het CMS (of in `site.json`) het websiteadres aan als het domein anders is.

Daarna logt Stanley in op `https://<domein>/admin/` met een GitHub-account dat schrijfrechten heeft op de repo. Elke wijziging staat binnen ±1 minuut automatisch live.

## Controles

```bash
npm run check:links                              # na een build: kapotte links en afbeeldingen
npm run shot -- /aanbod/ aanbod 1440 900 --full  # screenshot naar _notes/shots/
npm run check:hero                               # de geanimeerde hero (WebGL)
npm run check:ui                                 # het mobiele menu
```

Deze scripts gebruiken een lokaal geïnstalleerde Google Chrome. Stel het pad in met `CHROME_PATH` als het afwijkt. Meer uitleg staat in [`docs/techniek.md`](docs/techniek.md#scripts).

## Documentatie

- [`docs/briefing.md`](docs/briefing.md): wat de klant wil
- [`docs/ontwerp.md`](docs/ontwerp.md): kleuren, fonts, componenten, de hero
- [`docs/techniek.md`](docs/techniek.md): architectuur, CMS, SEO, beeld, hosting
- [`docs/beelden.md`](docs/beelden.md): de AI-foto's en hun prompts
- [`docs/status.md`](docs/status.md): wat af is, wat nog openstaat, de volgende stappen
