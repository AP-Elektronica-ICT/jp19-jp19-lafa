# Analyse

## Probleemstelling

Momenteel neemt traditionele manier van landbouwen te veel middelen in beslag. Er is een te grote oppervlakte vereist. De gewassen gebruiken te veel water en er zijn gevoeliger voor ziektes en bacterien hierdoor gebruiken wij pesticiden die niet altijd goed zijn voor de gezondheid van de mens en het milieu. Ook het huidige klimaat is onvoorspelbaar en kan voor een slecht oogst zorgen. Het duurt daarnaast ook lang om traditionele gewassen te kweken. Het is ook arbeidsintensief.
Bij het wateren van planten, kan men de planten makkelijk teveel water geven. Hierdoor zal de grond wateroverlast ondervinden, en worden de wortels beroofd van de zuurstof. Als de plant te weinig water krijgt, kan deze krimpen en hydrofoob worden, waardoor ze moeilijk terug water kunnen opnemen.

## Mindmap

![Mindmap](https://raw.githubusercontent.com/AP-Elektronica-ICT/jp19-lafa/analysis/doc/img/analysis/mindmap.png)

## Beschrijving

FarmLab is een project waar we met een team van 5 aan werken en waar elk teamlid zijn eigen functie heeft binnnen dit project.

We hebben voor de opbouw van de constructie een Technical Lead Mechanical deze zorgt voor het ontwerpen van de verschillende onderdelen en de volledige constructie van de farm.

De Technical Lead Sensor zorgt voor het uitkiezen van de te gaan gebruikte sensoren en hoe deze sensoren gaan werken binnen de geautomatiseerde farm.

Als er sensoren aanwezig zijn gaan deze ook iets gaan aansturen als er iets gebeurd. Hiervoor hebben we de Technical Lead Actuators deze zorgt voor al de aan te sturen onderdelen zoals de pompen, lichten, ...

Omdat dit een geatomatiseerd project moet zijn gaan we dat verzamelen die we dan ergens willen zien. Dit gaan we doen via een Webplatform waar onze Technical Lead Webplatform een portaal/ dashboard maakt waar we de waardes van de sensoren, de staat van de actuatoren zien en de camera.

Omdat we met verschillende onderdelen werken moet dit natuurlijk nog allemaal samen werken zodat we 1 geheel bekomen dit is de taak van de Technical Lead Integration.

Om dit alles tot een goed einde te brengen heeft elk team ook een Team Leader. Bij dit project gebruiken we Scrum als techniek voor het verloop van de ontwikkeling tot het eindresultaat.
De Team Leader zorgt hierbij dat heel het team altijd op de hoogte is van de staat van elk onderdeel van het project. Dat er vergaderingen worden vastgelegt zodat we een bespreking kunnen doen waar we ergens zitten met de user stories in elke sprint. En voor de aanmoedeging van het team.

**Hydroponics**

Ons doel is het volledig automatiseren van het telen van planten volgens de techniek Hydroponics.

Hydrophonics is het telen van planten zonder ze in grond te zetten. Hierbij zetten we de planten in water met bijgevoegde voeding.

Als je planten geeft wat ze nodig hebben, wanneer ze dit nodig hebben en in de juiste hoeveelheid dan krijg je een perfect gezonde plant. Doordat we het voedsel aan de plant overbrengen door water heeft de plant niet veel moeite nodig om aan zijn voeding te geraken en kan hij deze gewoon opnemen via de wortels. Ten opzichte van het telen in grond moet de plant zijn voedsel onderdelen nog gaan halen uit de grond wat veel moeite kost voor de plant en het nodige voedsel is misschien niet altijd aanwezig.

Bij het gebruik van Hydroponics krijg je meer opbrengsten van gezonden planten op het einde doordat door deze techniek te hanteren de planten sneller en beter groeien.

Bij Hydroponics is het zeer belangrijk dat je de pH-graad (zuurtegraad) van het medium , bij ons water regelt. Als de pH-graad niet constant is gaat de plant zijn voedingsstoffen niet meer kunnnen opnemen.  Het testen en regelen van de pH-graad is moeilijk en tijd rovend.

**Improvements**

Bij het begin van ons project hebben we eerst de rollen van het team verdeeld zodat iedereen een taak had waar die zich al kon op focussen en informatie over kon verzamelen. Daarna zijn we begonnen met het opstellen van een analyse over het project. Eerst hebben we wat meer informatie opgezocht ver Hydroponics waar ons project om draait. Verder hebben we wat gebrainstormt zodat we iedeën kregen over hoe we het hele project gaan aanpakken. Voor een overzicht te hebben van de onderdelen en functies hebben we een mindmap gemaakt met wat er allemaal kanen moet gebeuren in het project.

bij het analiseren op vlak van software en hardware hebben we schema’s gemaakt waar we verschillende onderdelen duidelijk maken.
Een hardware blockdiagram zodat we weten hoe we al de onderdelen met elkaar gaan connecteren en via welk protocol.
Voor de verschillende connecties tussen de onderdelen van de FarmLab hebben we een Node connection diagram opgesteld.
Een schema dat de architectuur weergeeft hoe het webplatform zal werken met welke voorzieningen.

**Our vision**

FarmLab is een manier van telen van planten volgens Hydoponics. Het is een volledig geautomatiseerd systeem zodat je eigenlijk kan genieten dat je deze planten hebt en de voordelen hier uit kan halen zonder dat je hier bijna iets aan moet doen tijdens de groei fase.

Je kan verschillende planten telen op de FarmLab doordat we per kast 2 verschillende soorten planten kunnen laten groeien elks op de manier dat de plant nodig heeft. Als men dan meer planten zou willen telen kan je een kast bijplaatsen die dan direct met je bestaande systeem wordt geconnecteerd doordat je farm op een eigen netwerk zit.
Je kan al de kasten besturen via 1 maincontroller. Op deze controller kan je de de waarden zien van elke sensor en de staat van elke actuator. Het bedienen van de actuatoren gaat ook via deze controller of het webplatform als je niet op de plaats van de farm bent.


### Relevant information

**Scrum**

Scrum is een basis (framework) om op een efficïente manier een product te ontwikkelen.
Een scrumteam bestaat uit een:
- Scrum master
- Product owner
- Stackeholders
- Developers team

Bij scrum maken we user stories zodat we ons in de plaats van de gebruiker van het product plaatsen. Met die user stories gaan we naar onze klant die deze stories aanvuld met functies dat hij graag in het afgewerkte product zou willen zien.

De verschillende user stories geven we elks een estimated time, een berekende gok hoeveel tijd we nodig gaan hebben om die user storie te gaan implementern in het product. Als al de stories een estimate hebben kunnen we gaan beslisen tegen welke snelheid we het product af willen hebben. Als we alle estimates van de stories optellen en dit getal delen door de gewenste vooruitgang van het project weten we hoeveel stories we kunnen plaatsen per sprint.

Een sprint bestaat iuit verschillende user stories. Elke sprint heeft ongeveer evenveel etsimate points en duurt 2 - 4 weken. Na eke sprint gaat men terug naar de klant en bespreekt men de vooruitgang en eventuele veranderingen. Hierna gaat men verder naar de volgende sprint.

**Raspberry Pi**

Een low cost computer waarbij de hardware ontworpen is als een  single-board computer en/ of een embedded platform. Het embedded deel van de Raspberry Pi zijn de GPIO-pinnen die aanwezig zijn. Door deze pinnen krijgt de Raspi interface mogelijkheden.

De Raspberry Pi heeft communicatie mogelijkheden zoals I²c en SPI. Het is niet al te groot met toch veel rekenkracht. De opslag gebeurd via een SD-kaart op de Raspi. Verder zijn er grafische mogelijkheden maar toch beperkter dan een pc en het heeft een Operating system OS.


## Hardware Analyse
### Hardware Blockdiagram
![Hardware Blockdiagram](https://raw.githubusercontent.com/AP-Elektronica-ICT/jp19-lafa/analysis/doc/img/analysis/hardware_blockdiagram.png)

### Node Connection Diagram

#### Scalable Network topology
![Scalable network topology](https://raw.githubusercontent.com/AP-Elektronica-ICT/jp19-lafa/analysis/doc/img/analysis/ScalableNodeTopology.png)

#### Unreliable Network topology
![Unreliable network topology](https://raw.githubusercontent.com/AP-Elektronica-ICT/jp19-lafa/analysis/doc/img/analysis/UnreliableNodeTopology.png)

#### Scalable node block Diagram
![Scalable node block diagram](https://raw.githubusercontent.com/AP-Elektronica-ICT/jp19-lafa/analysis/doc/img/analysis/Node_Scalable.png)

#### Unreliable node block Diagram
![Unreliable node block diagram](https://raw.githubusercontent.com/AP-Elektronica-ICT/jp19-lafa/analysis/doc/img/analysis/Node_Unreliable.png)

#### Controllers
[Go to Controllers Analysis](../analysis/hardware/Controllers.md)
#### Sensors
[Go to Sensor Analysis](../analysis/hardware/Sensors.md)
#### Actuators
[Go to Actuator Analysis](../analysis/hardware/Actuators.md)
#### Communication
[Go to Communication Analysis](../analysis/hardware/Communication.md)
#### Structure
[Go to Structure Analysis](../analysis/hardware/Structure.md)

## Software Analyse
### Web Platform Architectuur
![Hardware Blockdiagram](https://raw.githubusercontent.com/AP-Elektronica-ICT/jp19-lafa/analysis/doc/img/analysis/webplatform_blockdiagram.png)
#### Data & Data Storage
[Go to Data Analysis](../analysis/software/Data.md)
#### Web Platform
[Go to Platform Analysis](../analysis/software/Platform.md)
#### Computer Vision
[Go to Computer Vision Analysis](../analysis/software/Vision.md)
### State diagram
![Mindmap](https://raw.githubusercontent.com/AP-Elektronica-ICT/jp19-lafa/analysis/doc/img/analysis/state_diagram.png)


## User stories en Engineering Tasks

User Stories op Jira: [Jira](https://jira.ap.be/projects/JP19LAFA/summary)
