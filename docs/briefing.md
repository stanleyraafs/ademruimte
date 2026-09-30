# Briefing

## Oorspronkelijke vraag

> Maak een website voor een ademcoach, met als inspiratie https://verbondenvrij.nl/.
> Levendig groen, een dreamshot met een stukje jungle, en in het midden een meer dat de vorm heeft van een long.
> Neem ook de bladerachtergrond van https://www.julipohan.com/ als voorbeeld. De site van Verbonden Vrij vind ik commercieel sterker, maar de omschrijvingen van de producten vind ik sterker bij Juli Pohan.

## Referentiesites: wat we overnemen

### verbondenvrij.nl (commerciële kracht)
- Prijzen staan transparant in een indeling met drie niveaus: een losse sessie, een traject en maatwerk ("prijs in overleg").
- Het persoonlijke verhaal van de oprichter.
- Veel aandacht voor veiligheid, en de contra-indicaties worden genoemd.
- Een sterke haak rond "je adem is er altijd". Wij gebruiken een eigen variant: "± 20.000 keer per dag adem je".
- **Zwaktes die we bewust vermijden:**
  - geen CTA in de hero
  - prijzen die per pagina verschillen
  - weinig reviews
  - geen manier om bezoekers vast te houden
  - mixed CTA's (de ene knop gaat naar contact, de andere naar boeken)

### julipohan.com (sterke productomschrijvingen)
Elk aanbod volgt dezelfde vaste opbouw:
1. een warm welkom
2. "herken je dit?" in vraagvorm
3. voor wie het is
4. hoe het verloopt, met de duur
5. een lijstje "wat krijg je"
6. de prijs inclusief btw, en wanneer je betaalt

De site gebruikt een foto van bladeren terugkerend als achtergrond en als beeld op de kaarten. De toon is persoonlijk, in de ik-vorm, en warm.

Op deze site is die opbouw overgenomen in `src/_includes/aanbod.njk`, met de velden `herken`, `voorWie`, `verloop` en `watKrijgJe`. Het bladerbeeld komt terug als achtergrondfoto (`bladerFoto`) en als rustige lijntextuur.

## Intake: 10 vragen en de antwoorden

De klant beantwoordde de vragen in een gesproken opname. Het ruwe transcript staat lokaal in `_notes/transcript.txt` en hoort **niet** in de publieke repo. Hieronder staat de samenvatting.

| # | Vraag | Antwoord |
|---|---|---|
| 1 | Wie is de coach? | **Stanley Raafs.** De bedrijfsnaam is *Ademwerk Stanley Raafs*. Locatie: **Beesel** (in de opname klonk dat als "Bezel"). Adres: **Bussereindseweg 9** (in de opname klonk dat als "Busser Eindseweg nummer 9"; nog te verifiëren). Telefoon: **06 22 37 97 22**. Er zijn al een logo en een huisstijl, maar die waren nog niet beschikbaar. |
| 2 | Wat is het aanbod? | Een **losse sessie**, een **groepssessie** en een **persoonlijk traject op maat**. De prijs is **€150 per uur, inclusief btw**. |
| 3 | Welke vorm van ademwerk, en voor wie? | **Somatisch, verbonden ademwerk.** Het is voor iedereen, maar hij positioneert zich als **resetcoach**: voor mensen die tegen zichzelf aanlopen, die overspannen zijn, in een burn-out zitten of niet meer weten waar ze het moeten zoeken. En uiteraard voor **traumaverwerking**. |
| 4 | Hoe maken we de hero-afbeelding? | **Optie C:** een AI-foto met daaroverheen een subtiele animatie. |
| 5 | Welke stijl? | **Junglegroen en fris lichtgroen**, gecombineerd, met **zand, goud of een bruine tint** als accent. De bladeren als **rustige textuur**. Waar die komen, mag de maker zelf bepalen. |
| 6 | Hoe boeken en betalen klanten? | **Alleen contant.** De klant wil contant geld in stand houden, dus dit moet **expliciet** op de site staan. Boeken gaat via **bellen, appen of mailen**. **Geen** Calendly, **geen** WhatsApp-knop en **geen** contactformulier. |
| 7 | Welke reviews en welk materiaal zijn er? | Nog niets. Dit punt staat open. |
| 8 | Hoe houden we bezoekers vast? | Met een **gratis kennismakingsgesprek**. |
| 9 | Welke pagina's? | "Doe wat het beste is voor SEO." Het is dus een site met meerdere pagina's geworden. |
| 10 | Techniek, teksten en taal | **Goedkoop hosten**, maar hij moet **zelf alles kunnen aanpassen en beheren**, ook foto's, het aanbod en teksten. De maker schrijft voorlopig de teksten. Aanspreekvorm: **jij** ("absoluut persoonlijk"). Voorlopig alleen **Nederlands**. |

## Feedbackrondes

1. **De eerste versie van de hero was een getekende SVG-jungle.** Die is afgewezen: "super slecht, niet realistisch, lijkt meer op een Minecraft-afbeelding. Moet meer lijken op een realistische foto zoals het voorbeeld van Verbonden Vrij." Daarna zijn er fotorealistische AI-foto's gemaakt (zie [`beelden.md`](beelden.md)). **Les:** geen illustraties als hoofdbeeld; alleen fotografisch beeld.
2. **"Ik wil de hero meer geanimeerd hebben, waarbij de mist ook beweegt."** Daarop is een WebGL-laag gebouwd met rollende mist in twee lagen, rimpelend en glinsterend water en muisparallax. De mist ademt mee met de ademindicator (zie [`ontwerp.md`](ontwerp.md#hero)).
3. **Documentatie vastleggen, zodat een andere agent verder kan.** Daarna, op aanwijzing van de eigenaar, in de **publieke** repo [`stanleyraafs/ademwerk`](https://github.com/stanleyraafs/ademwerk) gezet.
