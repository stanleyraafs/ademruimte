# Beelden

Alle foto's op de site zijn **met AI gegenereerd**. Er zijn nog geen echte foto's van Stanley of de praktijk.

## Hoe ze gemaakt zijn

- Gemaakt met de **Codex CLI** (v0.145) en de ingebouwde functie `image_generation`, met het model `gpt-5.5`. Het standaardmodel van die CLI-versie (`gpt-6-astra`) gaf de fout "requires a newer version of Codex".
- Het commando had deze vorm: `codex exec --skip-git-repo-check -m gpt-5.5 -c model_reasoning_effort=medium --sandbox workspace-write -C <project> "<opdracht + prompt>"`.
- **Nabewerking:** de PNG's (±2,5–3,5 MB) zijn met sharp omgezet naar JPG (kwaliteit 90, mozjpeg) en staan in `src/assets/img/`. De originele PNG's staan lokaal in `_notes/originelen/` en gaan niet in git.
- **Let op:** de Codex-sandbox liet lege mappen `.git/` en `.agents/` achter in de projectmap. Die zijn verwijderd. Controleer dat na een nieuwe Codex-run, zeker zodra er een echte git-repo is.

## Overzicht

| Bestand | Formaat | Gebruik |
|---|---|---|
| `img/hero/hero-long-meer.jpg` | 1536×1024 | hero op desktop, og:image, JSON-LD |
| `img/hero/hero-long-meer-staand.jpg` | 1024×1536 | hero op staande schermen |
| `img/sfeer/bladeren-donker.jpg` | 1536×1024 | `site.bladerFoto`: donkere secties, CTA-band, standaard pagina-hero, 404, tijdelijke foto bij "Over mij" |
| `img/sfeer/losse-sessie.jpg` | 1024×1024 | dienst *Losse ademsessie*, het blok "Waarom een resetcoach" |
| `img/sfeer/groepssessie.jpg` | 1024×1024 | dienst *Groepssessie*, hero van het aanbod-overzicht |
| `img/sfeer/maatwerk.jpg` | 1024×1024 | dienst *Traject op maat*, hero van de contactpagina |

## Prompts (letterlijk)

**Hero liggend** (1536×1024)
> Ultra-realistic aerial drone photograph, dreamy and cinematic, looking straight down at a lush tropical rainforest. In the exact center of the frame lies a calm, crystal-clear turquoise-to-emerald lake whose shoreline clearly forms the shape of a pair of human lungs: two lobes side by side, slightly narrower at the top and wider at the bottom, separated by a thin strip of jungle in the middle. A small winding river enters from the top center like a trachea and splits into two short branches that flow into each lobe. The lungs shape must be instantly recognizable but look completely natural, like a real place photographed by a drone. Narrow golden-sand shores and shallow light-green water along the edges, subtle underwater sandbanks branching inside the lobes like bronchi. Dense, varied jungle canopy all around: deep emerald, jungle green and fresh bright lime-green treetops, a few flowering trees with golden-ochre crowns. Soft morning mist drifting over parts of the canopy, warm golden sunlight from the top left, gentle light rays, peaceful and breathing atmosphere. The lake occupies roughly the central third of the image width and sits slightly above the vertical center, leaving calm darker canopy at the bottom of the frame. Vivid, lively greens, high detail, natural colors, shot on a professional drone camera, no text, no people, no buildings, no watermark.

**Hero staand** (1024×1536, met de liggende versie als referentie)
> Ultra-realistic aerial drone photograph looking straight down at a lush tropical rainforest, same style as the reference: in the upper-middle of the frame a calm crystal-clear turquoise lake whose shoreline forms the shape of a pair of human lungs (two lobes side by side, narrower at the top, wider at the bottom, a thin strip of jungle between them), a small winding river entering from the top center like a trachea and splitting into two branches into the lobes, faint underwater sandbanks branching like bronchi. The lungs lake fills about 70% of the image width and sits in the upper half, the lower 40% of the frame is calm dense darker jungle canopy. Narrow golden sand shores, deep emerald and fresh lime-green treetops, a few golden-ochre flowering crowns, soft morning mist patches, warm golden sunlight from the top left. No text, no people, no buildings.

**Bladeren donker** (1536×1024)
> Photorealistic close-up of lush tropical jungle foliage: overlapping monstera, fern and banana leaves in deep emerald and jungle green, soft dappled light, a few fresh lime-green highlights, moody and calm, low contrast, lots of dark green shadow areas so text can be placed on top. Shallow depth of field. No flowers, no text.

**Losse sessie** (1024×1024)
> Photorealistic macro photo of a single fresh bright-green monstera leaf with tiny dew drops, lit by warm soft golden morning light, blurred deep-green jungle background. Calm, intimate, peaceful. No text.

**Groepssessie** (1024×1024)
> Photorealistic aerial photo looking straight down at a perfect circle of tall tropical trees around a small round clearing with soft grass, morning mist, golden light, deep emerald and lime-green canopy. Evokes a circle of people breathing together, but no people visible. No text.

**Maatwerk** (1024×1024)
> Photorealistic macro photo of a young fern frond slowly unfurling (a koru spiral), fresh lime green against a soft blurred deep-emerald background, warm golden rim light, calm and hopeful. No text.

## Vervangen

- **Via het CMS:** upload een nieuwe foto bij het betreffende veld (hero, bladerfoto, dienstfoto of "Foto van Stanley"). De pipeline maakt automatisch alle formaten.
- **Hero-foto:** houd het meer in de long **turquoise**, want de water-effecten herkennen het water aan die kleur. Houd de long in het midden of iets erboven, en zorg voor rustiger bladerdak onderin voor de tekst. De staande versie moet de long in de bovenste helft hebben.
- **"Over mij":** zodra er een portret van Stanley is, zet je het in het veld `home.over.foto`. De bladerfoto is daar nu alleen een tijdelijke invulling.
