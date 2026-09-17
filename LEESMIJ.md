# PALME - Train. Connect. Relax.

## Begin hier

Pak het volledige ZIP-bestand uit en open **START-HIER.html** of **index.html** in je browser.
Er is geen installatie, abonnement of buildstap nodig om dit ontwerp te bekijken.
De losse PALME-website-preview.html buiten het ZIP-bestand is een zelfstandige kijkversie.

**Internet is nodig voor de extra sfeerfoto's.** De fotografie wordt vanaf Unsplash en Pexels geladen, niet met het pakket meegeleverd. De aangeleverde PALME-merkbeelden zijn gebruikt voor het logo en de kleuren. Bij een onbereikbare foto verschijnt een rustige achtergrond in de huisstijl in plaats van een kapotte afbeelding. Voor de definitieve website zijn eigen foto's van de club de beste vervanging.

Dit is een werkende front-end en een configureerbare koppeling, nog geen gepubliceerde website of aangesloten ledenadministratie. Er zijn geen echte inschrijvingen, boekingen, betalingen of persoonsgegevens verwerkt.

## In het pakket

- `index.html`: de complete Nederlandstalige website.
- `styles.css`: responsive vormgeving voor mobiel, tablet en desktop.
- `app.js`: navigatie, dialoogvensters, filterbaar voorbeeldrooster en Virtuagym-aansluitpunten.
- `config.js`: openbare clubinstellingen, foto-URL's en contactgegevens.
- `instellingen.html` en `instellingen.js`: lokaal hulpmiddel om config.js te maken.
- `assets/`: het bewerkte, aangeleverde logo en favicon. Geen lettertypebestanden.
- `BRONNEN.md`: broninformatie over de inspiratie, fotografie en Virtuagym.
- `START-HIER.html`: korte startpagina met uitleg.

Er zijn geen externe JavaScriptbibliotheken, trackingpixels, analytics of Google Fonts toegevoegd. De site gebruikt systeemlettertypen. Foto's maken wel verbinding met de externe beeldleveranciers. Iframes worden pas geladen nadat de bezoeker daarvoor op een knop klikt.

## Virtuagym aansluiten

### Zonder in de code te werken

1. Open `instellingen.html` vanuit de uitgepakte map.
2. Vul de echte, openbare PALME-clublinks en eventuele iframe-codes in.
3. Klik op **Download config.js**.
4. Vervang `config.js` in de website-map door het nieuwe bestand. Verwijder een eventueel automatisch toegevoegd volgnummer in de bestandsnaam.
5. Heropen `index.html` of vernieuw de pagina volledig.
6. Test alle functies met de eigen clubomgeving.

Dit hulpmiddel past de bestanden niet automatisch aan en schrijft niets naar een server. De losse kijkversie bevat ingebouwde instellingen; wijzigingen aan een los config.js wijzigen die kijkversie niet. Gebruik het uitgepakte pakket om verder te werken.

### Benodigde openbare gegevens

**Ledenlogin**: de openbare URL van de eigen Virtuagym-ledenomgeving.

**Lid worden / webshop**: kopieer de Shop main link uit Systeeminstellingen > Webshopinstellingen. De inschrijfknoppen openen die URL. Is daarnaast een iframe-URL ingevuld, dan opent de webshop in een venster binnen de website, met een link naar een los tabblad als alternatief.

**Lesrooster**: ga naar Systeeminstellingen > Roosterinstellingen > selecteer het gewenste rooster > Geavanceerd. Kopieer de embed-code of gebruik een openbare roosterlink. Zodra een rooster-URL is ingesteld, verdwijnt het voorbeeldrooster. Het actuele rooster wordt via Virtuagym weergegeven, niet nagemaakt of uitgelezen. Reserveren vereist een geschikte clubconfiguratie en kan een ledenlogin vereisen; laat direct boeken via een embedded rooster zo nodig door Virtuagym Support inschakelen.

**Kennismaken**: gebruik een bestaande openbare boekingslink of de iframe-URL van de officiele afspraakwidget. De beschikbaarheid van een proefleswidget hangt af van de geactiveerde modules en de inrichting van activiteiten, medewerkers en beschikbaarheid. De betreffende Virtuagym-documentatie noemt het afspraakrooster en leadmanagement als vereisten. Er is niet aangenomen dat PALME deze modules al heeft.

De instellingenpagina verwerkt alleen een volledige HTTPS-URL of een iframe-code met precies een iframe en een HTTPS-src. Code met scripts wordt bewust niet uitgevoerd. Als de officiele widget JavaScript gebruikt, moet een ontwikkelaar die exacte widget apart implementeren volgens de documentatie van Virtuagym. Verzin geen embed- of API-adressen op basis van een clubnaam.

### Wat deze koppeling wel en niet doet

De website kan de echte ledenlogin openen, naar de echte webshop doorsturen en een officieel rooster- of inschrijf-iframe tonen. De daadwerkelijke account-, boekings-, contract- en betaalhandelingen vinden plaats in Virtuagym.

Er is geen zelfgebouwd registratieformulier, betaalformulier, backend, OAuth-client, SSO of Club Member / Lead API-integratie in dit pakket. Voor een formulier dat gegevens vanaf de eigen server naar Virtuagym stuurt, zijn geautoriseerde documentatie, credentials en een afzonderlijke serverimplementatie nodig. Virtuagym beschrijft daarvoor de Club Member API V1 en de Lead API V3.

**Zet nooit API keys, club keys, client secrets, wachtwoorden of ledengegevens in config.js of andere browserbestanden.** Voor de hier gebruikte openbare koppelingen zijn die niet nodig.

### Embed-beperkingen

De container van een iframe is responsive; de inhoud en boekingslogica blijven van Virtuagym. Browserinstellingen voor cookies, het framebeleid van de aanbieder, betaalredirects en de accountconfiguratie kunnen invloed hebben op de werking. Daarom staat bij ieder iframe ook een link om de omgeving apart te openen. Een iframe-loadmelding bewijst niet dat een boeking of betaling is geslaagd; deze website doet zulke aannames niet.

## Inhoud en foto's aanpassen

Teksten staan in `index.html`. Kleuren staan bovenaan `styles.css` onder `:root`. Fotoadressen staan in `config.js` onder `images`.

Voor eigen fotografie: plaats bijvoorbeeld `fitness.webp` in de map `assets` en wijzig de corresponderende instelling naar `assets/fitness.webp`. Voor de andere vier beelden werkt dit hetzelfde. Gebruik geoptimaliseerde WebP/JPEG-bestanden; houd de hero bij voorkeur onder circa 500 kB zonder zichtbare kwaliteitsproblemen. Controleer mobiele uitsneden apart.

De huidige voorbeeldlessen staan apart in `app.js`. Ze zijn expliciet als demonstratie gemarkeerd. Er worden geen fictieve beschikbaarheid, recensies, prijzen, openingstijden of namen van trainers getoond. De zichtbare faciliteiten en marketingteksten zijn een ontwerpuitwerking van de aangeleverde screenshots en moeten voor publicatie inhoudelijk worden bevestigd.

## Voor publicatie

Bevestig teksten, faciliteiten, definitieve foto's en gebruiksrechten, contactgegevens, lidmaatschappen en voorwaarden. Voeg een goedgekeurde privacyverklaring toe. De privacyuitleg in de preview is alleen een uitleg van het websiteconcept, niet de definitieve juridische verklaring van de club.

Controleer in ieder geval: ledenlogin, inschrijven, betaling en contract waar van toepassing, lesreservering, annulering, kennismakingsafspraak, bevestigingen en mobiel gebruik. Doe dit met de echte Virtuagym-testmogelijkheden en pas daarna met een productieaccount.

Zet `preview` op `false` in config.js wanneer het conceptlabel mag verdwijnen. Zonder echte rooster-URL wordt dan geen demonstratierooster meer getoond. Verwijder de `noindex, nofollow`-meta in index.html pas wanneer de website daadwerkelijk door zoekmachines gevonden mag worden. Stel het definitieve domein, eventuele metadata voor delen en de hosting in.

Upload voor de openbare website alleen `index.html`, `styles.css`, `app.js`, `config.js` en `assets/`. Zet de instellingenpagina, startpagina en documentatie niet publiek online. HTTPS-hosting wordt verwacht voor productie. Er is nog niets naar een publieke server geupload.

## Controle van deze oplevering

De eigen websitecode is gecontroleerd met Node syntaxchecks en met een Chromium-browser op 320, 390, 600, 768, 1024 en 1440 pixels breed. De controles omvatten horizontale overflow, de ruimte in de hero, dag- en lesfilters, de lege filterstatus, mobiel menu, Escape en focusherstel, de voorbeeldvensters, het genereren van config.js en het afwijzen van scriptwidgets.

De geconfigureerde iframe-route is getest met een nagebootste externe pagina: het voorbeeldrooster verdwijnt, de iframe wordt pas na een klik aangemaakt en een inschrijf-iframe wordt na sluiten verwijderd. Dit is geen end-to-endtest met een echte Virtuagym-club.

De afgeschermde testbrowser kon de externe foto's en echte Virtuagym-omgeving niet laden. De fotopagina's en integratiemogelijkheden zijn via publieke bronnen bekeken; de exacte werking van de extra foto-URL's in de definitieve gebruikersbrowser en van jullie eigen Virtuagym-account moet nog live worden gecontroleerd. De website is getest via de zelfstandige HTML-weergave; Safari en Firefox zijn niet afzonderlijk getest.

## Contentupdate september 2026
De teksten in deze versie zijn bijgewerkt op basis van `Palmé Club - Website.docx` (Website — Sitemap & Content Briefing, versie 0.1). De bestaande grafische opzet, kleuren, fotografie-indeling en interacties zijn zoveel mogelijk behouden. Prijzen zijn bewust niet hardcoded; hiervoor blijft de Virtuagym-koppeling het uitgangspunt.
