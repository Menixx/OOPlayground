// Texte der Erklärungsseite (Deutsch) – übernommen aus dem TZ „OOPlayground_Docs_TZ.md“, Abschnitt 10.
// Auszeichnung in md-Feldern (wird in src/docs/render.js umgewandelt):
//   `code` · [[UI-Chip]] · {{tag}} (auch {{Stack}} {{Heap}} {{Metaspace}}) · **fett** · *kursiv* · [Text](#id) · Listen · Tabellen
//   ```console … ``` = Ausgabe (Zeile mit "!! " = Fehler) · ```java = Codebeispiel (nur Java) · ```text = Schema
// Blocktypen (k): md | zones | short | life | inApp | memory (Im Speicher) | remember | code | goal | before | steps | output | watch
export default {
  groups: [
    { id: 'teil-oberflaeche', key: 'oberflaeche', nav: 'Teil 1: Die Oberfläche' },
    { id: 'teil-begriffe', key: 'begriffe', nav: 'Teil 2: Die Begriffe' },
    { id: 'teil-vorfuehren', key: 'vorfuehren', nav: 'Teil 3: Ausprobieren' }
  ],
  sections: [
    {
      id: 'start', group: 'start', num: null, nav: 'Willkommen', type: 'intro',
      title: 'Willkommen im OOPlayground!',
      cards: [
        { id: 'teil-oberflaeche', title: 'Die Oberfläche', text: 'Was ist was?' },
        { id: 'teil-begriffe', title: 'Die Begriffe', text: 'Was bedeutet das?' },
        { id: 'teil-vorfuehren', title: 'Ausprobieren', text: 'Wie probiere ich es aus?' }
      ],
      blocks: [
        { k: 'md', md: `Hier lernst du, wie man Programme aus **Objekten** baut. Das nennt man **objektorientierte Programmierung**, kurz **OOP**.

Stell dir vor, ein Programm ist eine kleine Welt. In dieser Welt gibt es Dinge: Katzen, Autos, Sterne. Jedes Ding weiß etwas über sich selbst und kann etwas tun. Genau so denkt OOP.

Wichtig: Alles, was du im OOPlayground anklickst, passiert **wirklich**. Hinter jedem Knopf steckt echter JavaScript-Code. Nichts ist nur ein Bild.

Diese Seite hat drei Teile:

1. **Die Oberfläche** – Was siehst du im OOPlayground, und wofür ist es da?
2. **Die Begriffe** – Die wichtigsten Wörter der OOP, ganz einfach erklärt.
3. **Ausprobieren** – Schritt-für-Schritt-Anleitungen: So erlebst du jeden Begriff selbst im OOPlayground.

**Tipp:** Öffne den OOPlayground in einem zweiten Fenster und mach alles direkt mit. Bei jedem Begriff findest du den Knopf **▶ Selbst ausprobieren**. Er bringt dich zur passenden Anleitung.` }
      ]
    },
    {
      id: 'ui-ueberblick', group: 'oberflaeche', num: 'O1', nav: 'Überblick', type: 'ui',
      title: 'Der OOPlayground auf einen Blick',
      blocks: [
        { k: 'md', md: `Der OOPlayground hat vier Bereiche. Von oben nach unten:

1. **Kopfzeile** – der Name, die Sprache und der Knopf zu dieser Erklärung.
2. **Abstrakte Klassen** – drei Baupläne: Tier, Transport und Figur.
3. **Erstellte Objekte** – alle Dinge, die du aus den Bauplänen gebaut hast.
4. **Ausgabe** – das Tagebuch des Programms. Hier steht, was passiert ist.` },
        { k: 'zones' },
        { k: 'md', md: `So spielst du: Du schaust dir einen Bauplan an, baust daraus Objekte, gibst den Objekten Befehle – und liest in der Ausgabe, was sie antworten.

Und wenn du wissen willst, was dabei im Inneren passiert: Unten links öffnet ein kleiner Knopf den [Speicher](#ui-speicher). Unten rechts schaltet ein runder Knopf mit Lautsprecher den **Ton** ein und aus (mehr dazu bei [Erstellte Objekte](#ui-objekte)).` }
      ],
      related: [{ id: 'begriff-klasse', label: 'Klasse' }, { id: 'begriff-objekt', label: 'Objekt' }]
    },
    {
      id: 'ui-kopfzeile', group: 'oberflaeche', num: 'O2', nav: 'Kopfzeile', type: 'ui',
      title: 'Die Kopfzeile',
      blocks: [
        { k: 'md', md: `Ganz oben steht der Name **OOPlayground**. Rechts findest du:

- **Den Knopf \`[[? Erklärung]]\`** – er öffnet diese Seite in einem neuen Tab.
- **Den runden Knopf für das Farbschema** – ein Klick wechselt der Reihe nach: ☀ hell, ☾ dunkel und 🖥 wie im System (dann folgt die Seite der Einstellung deines Computers).
- **Den Sprachschalter \`[[EN | DE]]\`** – er wechselt alle Texte zwischen Englisch und Deutsch. Die Namen der Klassen und Objekte (zum Beispiel \`Katze\` oder \`auto1\`) bleiben immer deutsch. Sie sind nämlich Namen im Programmcode – und Code übersetzt man nicht.

Die Sprache merkt sich der OOPlayground. Wechselst du sie hier, wechselt sie auch auf dieser Erklärungsseite.

**Auf dem Handy** sind diese Knöpfe hinter dem Menüknopf (drei Punkte) versteckt. Dort steht ganz unten rechts auch der **Ton-Knopf**, der auf größeren Bildschirmen unten rechts im Fenster liegt.` }
      ]
    },
    {
      id: 'ui-klassen', group: 'oberflaeche', num: 'O3', nav: 'Abstrakte Klassen', type: 'ui',
      title: 'Der Bereich „Abstrakte Klassen"',
      blocks: [
        { k: 'md', md: `Hier siehst du drei Symbole: **Tier**, **Transport** und **Figur**. Jedes Symbol ist eine **abstrakte Klasse** – ein Bauplan, der absichtlich noch nicht fertig ist.

- **Tier** beschreibt alles, was Tiere gemeinsam haben. Seine Kinder: Katze, Krokodil, Mensch, Eule.
- **Transport** beschreibt alles, was Fahrzeuge gemeinsam haben. Seine Kinder: Auto, Flugzeug, Zug.
- **Figur** beschreibt alles, was geometrische Figuren gemeinsam haben. Ihre Kinder: Dreieck, Kreis, Stern.

Fahr mit der Maus über ein Symbol. Dann öffnet sich die **Klassenkarte** mit allen Einzelheiten.` }
      ],
      related: [{ id: 'begriff-klasse', label: 'Klasse' }, { id: 'begriff-abstrakte-klasse', label: 'Abstrakte Klasse' }, { id: 'begriff-abstraktion', label: 'Abstraktion' }]
    },
    {
      id: 'ui-klassenkarte', group: 'oberflaeche', num: 'O4', nav: 'Klassenkarte', type: 'ui',
      title: 'Die Klassenkarte',
      blocks: [
        { k: 'md', md: `Die Klassenkarte zeigt dir den Bauplan. Oben steht zum Beispiel \`abstract class Tier\`. Darunter gibt es vier Teile:

**1. Felder** – Was jedes Tier hat. Zum Beispiel \`name\`, \`anzahlBeine\` (Anzahl der Beine) oder \`kannFliegen\`. Nur \`name\` hat schon einen Wert: den Platzhalter \`"Unbenannt"\`. Die anderen Felder sind leer. Der Bauplan sagt nur: „Das gibt es." Wie viele Beine genau – das weiß erst das fertige Tier.

**2. Methoden** – Was jedes Tier kann. Jede Methode hat ein Abzeichen:
- {{abstract}} – Diese Fähigkeit gibt es, aber **wie** sie funktioniert, steht hier noch nicht. Das muss jedes Kind selbst festlegen. Beispiel: \`essen()\`.
- {{implemented}} – Diese Fähigkeit ist schon fertig und funktioniert für alle Kinder gleich. Beispiel: \`halten()\` bei Tier oder \`drehen90()\` bei Figur.

In den Klammern stehen die **Parameter** – was man der Methode beim Aufruf mitgeben kann:
- \`essen(T dauer)\` und \`bewegen(T dauer)\` – wie lange, in Sekunden (zum Beispiel \`5\`) oder \`"ewig"\`. \`T\` ist ein **generischer Typ**: Er steht hier für eine Zahl **oder** einen Text. Darum steht vor der Methode \`<T>\`.
- \`lautGeben(int anzahl)\` – wie oft das Tier einen Laut von sich gibt.
- \`motorStarten()\`, \`halten()\` und \`drehen90()\` haben keine Parameter.

**3. Erben** – Die Kinder dieser Klasse, als Knöpfe: zum Beispiel \`[[Katze]]\`, \`[[Krokodil]]\`, \`[[Mensch]]\`. Wenn du darüberfährst, steht da **Instanziieren**. Ein Klick baut ein neues Objekt. Es erscheint unter **Erstellte Objekte**.

**4. Der Knopf \`[[new Tier()]]\`** – Er versucht, direkt aus der abstrakten Klasse ein Objekt zu bauen. Darüber steht: **Direkt instanziieren (verboten)**. Und tatsächlich: Es klappt nicht, in der Ausgabe erscheint ein Fehler. Das ist Absicht!

**So liest du die Karte:** Alles steht so da, wie es in der Programmiersprache Java aussehen würde. Zuerst kommt der **Typ**, dann der **Name**:
- \`String\` = Text, \`int\` = ganze Zahl, \`boolean\` = ja (\`true\`) oder nein (\`false\`).
- \`public\` heißt: Jeder darf diese Methode benutzen. \`void\` heißt: Die Methode gibt keinen Wert zurück, sie tut einfach etwas.` }
      ],
      related: [{ id: 'begriff-abstrakte-klasse', label: 'Abstrakte Klasse' }, { id: 'begriff-feld', label: 'Feld & Zustand' }, { id: 'begriff-methode', label: 'Methode' }, { id: 'begriff-instanziierung', label: 'Instanziierung' }, { id: 'begriff-vererbung', label: 'Vererbung' }]
    },
    {
      id: 'ui-objekte', group: 'oberflaeche', num: 'O5', nav: 'Erstellte Objekte', type: 'ui',
      title: 'Der Bereich „Erstellte Objekte"',
      blocks: [
        { k: 'md', md: `Hier wohnen alle Objekte, die du gebaut hast. Jedes Kästchen ist **ein Objekt**: Es hat ein Bild und einen Namen, zum Beispiel \`katze1\`.

**Die Namen zählen mit:** Baust du drei Katzen, heißen sie \`katze1\`, \`katze2\` und \`katze3\`. So kann man sie gut auseinanderhalten.

**Bewegung:** Wenn du einem Tier oder Fahrzeug einen Befehl gibst, bewegt sich sein Bild – die Katze frisst, das Auto fährt los. Figuren drehen sich, wenn du \`drehen90()\` ausführst. Wie lange das Bild sich bewegt, hängt vom Aufruf ab: \`essen(5)\` dauert fünf Sekunden, \`essen("ewig")\` so lange, bis du \`halten()\` aufrufst. \`motorStarten()\` spielt seine Animation genau einmal.

**Ton:** Bei \`lautGeben()\` ist das Tier auch zu hören – die Katze miaut, das Krokodil knurrt, die Eule ruft. Der **Mensch** spricht jedes Mal in einer **zufälligen Sprache**, und in der Ausgabe steht, welche es war, zum Beispiel \`Der Mensch spricht Ukrainisch.\` Mit \`lautGeben(3)\` hörst du den Laut dreimal.

Am Anfang ist der Ton **aus**: Der runde Knopf unten rechts zeigt einen durchgestrichenen Lautsprecher. Ein Klick schaltet den Ton ein, noch ein Klick wieder aus. Ist der Ton aus, bewegt sich das Bild trotzdem und die Ausgabe schreibt mit – nur zu hören ist nichts. Jede Tondatei wird erst geladen, wenn sie zum ersten Mal gebraucht wird.

Oben im Bereich gibt es zwei Knöpfe:
- **\`[[Alle bewegen]]\`** – sagt allen Tieren und Fahrzeugen gleichzeitig: „Beweg dich!" Jedes bewegt sich auf seine eigene Art. Der Knopf ist erst aktiv, wenn es mindestens ein Tier oder Fahrzeug gibt. Figuren machen nicht mit – sie haben keine Methode \`bewegen()\`.
- **\`[[Alle löschen]]\`** – entfernt alle Objekte auf einmal.

Ist der Bereich leer, steht dort ein kleiner Hinweis, wie du dein erstes Objekt baust.` }
      ],
      related: [{ id: 'begriff-objekt', label: 'Objekt' }, { id: 'begriff-instanziierung', label: 'Instanziierung' }, { id: 'begriff-polymorphie', label: 'Polymorphie' }, { id: 'begriff-null', label: 'Referenz & null' }]
    },
    {
      id: 'ui-objektkarte', group: 'oberflaeche', num: 'O6', nav: 'Objektkarte', type: 'ui',
      title: 'Die Objektkarte',
      blocks: [
        { k: 'md', md: `Fahr mit der Maus über ein Objekt, zum Beispiel \`katze1\`. Dann öffnet sich seine Karte. Oben steht \`class Katze katze1\`. Das heißt: „Ich bin das Objekt \`katze1\`, gebaut nach dem Bauplan \`Katze\`."

**Felder** – Jetzt haben alle Felder einen Wert, zum Beispiel \`int anzahlBeine = 4;\`. Jedes Feld hat ein Abzeichen:
- {{geerbt}} – Dieses Feld kommt von der Elternklasse (hier: Tier).
- {{eigen}} – Dieses Feld hat nur diese Klasse. Bei der Katze ist das \`schnurrt\`.

**Methoden** – Auch hier gibt es Abzeichen:
- {{überschrieben}} – Die Klasse hat eine eigene Version dieser Methode geschrieben. Beispiel: \`essen()\` – die Katze frisst auf ihre Art.
- {{geerbt}} – Die Methode kommt unverändert von den Eltern. Beispiel: \`halten()\`.

Neben jeder Methode gibt es den Knopf **\`[[Ausführen]]\`**. Ein Klick ruft die Methode wirklich auf. Die Antwort erscheint in der **Ausgabe**.

**Argumente eintragen:** Hat eine Methode einen Parameter, steht in ihrer Zeile ein kleines Eingabefeld – direkt in den Klammern, zum Beispiel \`essen(T dauer = "ewig")\` oder \`lautGeben(int anzahl = 1)\`. Darin steht schon ein **Standardwert**. Du kannst ihn ändern, zum Beispiel in \`5\`, und dann auf **Ausführen** klicken oder Enter drücken. Bei \`dauer\` geht eine Zahl (Sekunden) oder \`"ewig"\`, bei \`anzahl\` eine ganze Zahl ab 1. Ein falscher Wert führt zu einem Fehler in der Ausgabe – so wie in Java eine \`IllegalArgumentException\`.

**Der Knopf \`[[katze1 = null]]\`** ganz unten löscht dieses eine Objekt.

**Besonderheit bei Fahrzeugen:** Beim Feld \`motor\` steht kein Text, sondern ein Name wie \`Benzinmotor\`. Fahr darüber – dann öffnet sich eine zweite Karte, die **Motorkarte**. Der Motor ist nämlich ein eigenes Objekt.

**Gut zu wissen:** Nach einem Klick auf **Ausführen** wird die Karte neu gezeichnet. Eine offene Motorkarte schließt sich dabei. Fahr einfach noch einmal über den Motornamen.` }
      ],
      related: [{ id: 'begriff-feld', label: 'Feld & Zustand' }, { id: 'begriff-methode', label: 'Methode' }, { id: 'begriff-vererbung', label: 'Vererbung' }, { id: 'begriff-ueberschreiben', label: 'Überschreiben' }, { id: 'begriff-komposition', label: 'Komposition' }]
    },
    {
      id: 'ui-motorkarte', group: 'oberflaeche', num: 'O7', nav: 'Motorkarte', type: 'ui',
      title: 'Die Motorkarte',
      blocks: [
        { k: 'md', md: `Jedes Fahrzeug hat einen eigenen Motor:

| Fahrzeug | Motor | Leistung |
|---|---|---|
| Auto | Benzinmotor | 150 PS |
| Flugzeug | Turbofan | 120 kN |
| Zug | Elektromotor | 5600 kW |

Oben auf der Karte steht zum Beispiel \`class Benzinmotor extends Motor\`. Das heißt: Der Benzinmotor ist eine Art Motor.

**Felder:** \`typ\` (welche Art von Motor), \`leistung\` (wie stark) und \`laeuft\` (läuft er gerade? \`true\` = ja, \`false\` = nein).

**Methoden:**
- \`public void starten()\` – der **öffentliche** Knopf des Motors. Den darf jeder drücken.
- Drei \`private\`-Methoden in grau, zum Beispiel \`kraftstoffEinspritzen()\`. Das sind die **geheimen Schritte** im Inneren des Motors. Daneben steht der Knopf **\`[[testen]]\`** (Tooltip: „Zugriff von außen versuchen"). Er versucht, den geheimen Schritt von außen aufzurufen – und das scheitert immer: In der Ausgabe steht „Zugriff verweigert".

**Hinweis auf der Karte:** „Aufgerufen wird nur motorStarten() am Transportobjekt." Das heißt: Du startest den Motor nicht selbst. Du sagst es dem Auto – und das Auto sagt es seinem Motor.

**Der Knopf \`[[Implementierung anzeigen]]\`** klappt eine Liste auf. Sie zeigt, welche geheimen Schritte der Motor beim Starten macht und in welcher Reihenfolge. Das ist nur zum **Anschauen** – drücken kannst du die Schritte nicht. Mit **Implementierung ausblenden** klappst du die Liste wieder zu.` }
      ],
      related: [{ id: 'begriff-kapselung', label: 'Kapselung' }, { id: 'begriff-komposition', label: 'Komposition & Delegation' }, { id: 'begriff-nachrichten', label: 'Message Passing' }]
    },
    {
      id: 'ui-ausgabe', group: 'oberflaeche', num: 'O8', nav: 'Ausgabe', type: 'ui',
      title: 'Die Ausgabe',
      blocks: [
        { k: 'md', md: `Die Ausgabe ist das **Tagebuch des Programms**. Hier steht alles, was passiert. Es gibt drei Arten von Zeilen:

- **Zeilen mit \`>\` am Anfang** – Was gemacht wurde. Zum Beispiel ein Befehl wie \`> katze1.essen("ewig")\` oder eine Meldung wie \`> Objekt katze1 wurde erstellt.\` Ein Befehl zeigt auch seine Argumente. Läuft eine Methode eine Zeit lang, meldet sie sich am Ende noch einmal: \`> katze1.essen(5) ist fertig.\`
- **Eingerückte Zeilen** – Die Antwort des Objekts. Zum Beispiel \`Die Katze frisst Fisch.\`
- **Rote Zeilen** – Ein Fehler. Etwas war nicht erlaubt, zum Beispiel ein Objekt aus einer abstrakten Klasse zu bauen.

So sieht das aus:

\`\`\`console
> Objekt katze1 wurde erstellt.
> katze1.essen("ewig")
  Die Katze frisst Fisch.
> new Tier()
!! Abstrakte Klassen können nicht instanziiert werden.
\`\`\`

Mit dem Knopf **\`[[Leeren]]\`** machst du die Ausgabe wieder leer. Die Objekte bleiben dabei erhalten.` }
      ],
      related: [{ id: 'begriff-methode', label: 'Methode' }, { id: 'begriff-nachrichten', label: 'Message Passing' }]
    },
    {
      id: 'ui-speicher', group: 'oberflaeche', num: 'O9', nav: 'Speicher', type: 'ui',
      title: 'Der Speicher – ein Blick in die JVM',
      blocks: [
        { k: 'md', md: `Unten links in der Ecke gibt es einen kleinen Knopf mit einem **Speicher-Symbol**. Fährst du darüber, steht da: **Einen Blick in den Speicher werfen**. Ein Klick öffnet das Fenster **Speicher der JVM**.

Der OOPlayground läuft in JavaScript. Das Fenster zeigt, wie dasselbe Programm in **Java** im Speicher liegen würde. Es hat drei farbige Spalten:

| Spalte | Was steht darin? |
|---|---|
| {{Stack}} | Der Frame \`main(String[] args)\` mit einer Variable für jedes Objekt, zum Beispiel \`Katze katze1 = @1159cc2d\`. Klickst du auf **Ausführen**, liegt der Frame dieser Methode obendrauf, zum Beispiel \`Katze.essen(T dauer)\` mit \`this\` und \`dauer\`. Er bleibt, solange die Methode läuft – bei \`"ewig"\` so lange, bis du \`halten()\` aufrufst oder das Objekt löschst. |
| {{Heap}} | Jedes Objekt als Kasten: Klasse, Adresse, Name und alle Felder mit ihren Werten. Ein Motor ist ein eigener Kasten, zum Beispiel \`auto1.motor\`. |
| {{Metaspace}} | Alle Klassen mit \`extends\`, ihren eigenen Feldern und Methoden. Sie sind schon da, bevor du das erste Objekt baust, und ändern sich nie. |

**Hervorheben:** Fahr mit der Maus über ein Objekt oder eine Adresse. Dann leuchtet alles auf, was dazugehört: die Variable im Stack, das Objekt im Heap und seine Klasse im Metaspace. Ist die Klasse gerade nicht zu sehen, rollt der Metaspace von selbst dorthin.

**Live dabei:** Das Fenster ändert sich mit. Neue Objekte leuchten kurz auf, geänderte Werte (zum Beispiel \`laeuft = true\`) stehen sofort da, gelöschte Objekte verschwinden.

**Adressen:** Zahlen wie \`@1159cc2d\` sind ausgedacht. So ähnlich sieht es aus, wenn Java ein Objekt ausgibt – echte Speicheradressen zeigt Java nie.

Schließen kannst du das Fenster mit **×**, mit der Taste **Esc** oder mit einem Klick daneben. Den Knopf gibt es nur auf größeren Bildschirmen, nicht auf dem Handy.` }
      ],
      related: [{ id: 'begriff-speicher', label: 'Speicher (JVM)' }, { id: 'begriff-objekt', label: 'Objekt' }, { id: 'begriff-polymorphie', label: 'Polymorphie' }, { id: 'begriff-null', label: 'Referenz & null' }]
    },
    {
      id: 'ui-legende', group: 'oberflaeche', num: 'O10', nav: 'Farben & Abzeichen', type: 'ui',
      title: 'Farben und Abzeichen',
      blocks: [
        { k: 'md', md: `Im OOPlayground hat jede Farbe eine Bedeutung. Hier ist die Übersicht:

**Farben in den Karten**

| So sieht es aus | Bedeutung |
|---|---|
| Blauer Name, z. B. \`anzahlBeine\` | ein **Feld** (etwas, das das Objekt weiß) |
| Grüner Name, z. B. \`essen()\` | eine **Methode** (etwas, das das Objekt kann) |
| Lila Name | eine **abstrakte** Methode (noch ohne Inhalt) |
| Grauer Name | eine **private** Methode (geheim, nur für den Motor selbst) |
| Oranges Wort vor dem Namen, z. B. \`int\` | der **Typ** (was für ein Wert hineinpasst) |
| Rosa Wörter \`public\`, \`private\`, \`abstract\` | wer die Methode benutzen darf, oder ob sie abstrakt ist |
| Graue Kommentare, z. B. \`// km/h\` | die **Einheit** eines Werts |

**Abzeichen**

| Abzeichen | Bedeutung |
|---|---|
| {{abstract}} | Die Methode hat noch keinen Inhalt. Jedes Kind muss sie selbst schreiben. |
| {{implemented}} | Die Methode ist fertig und funktioniert schon. |
| {{geerbt}} | Kommt unverändert von der Elternklasse. |
| {{eigen}} | Gibt es nur in dieser Klasse. |
| {{überschrieben}} | Die Klasse hat ihre eigene Version der Methode geschrieben. |

**Farben im Speicher**

| Bereich | Was liegt dort? |
|---|---|
| {{Stack}} | Frames der laufenden Methoden mit ihren Variablen und Referenzen |
| {{Heap}} | die Objekte mit ihren Feldern; Adressen wie \`@1159cc2d\` sind auch orange |
| {{Metaspace}} | die Klassen (Baupläne) |` }
      ],
      related: [{ id: 'begriff-feld', label: 'Feld & Zustand' }, { id: 'begriff-methode', label: 'Methode' }, { id: 'begriff-vererbung', label: 'Vererbung' }, { id: 'begriff-kapselung', label: 'Kapselung' }]
    },
    {
      id: 'begriffe-ueberblick', group: 'begriffe', num: 'B0', nav: 'Die vier Säulen', type: 'intro',
      title: 'Die vier Säulen der OOP',
      blocks: [
        { k: 'md', md: `Ein Haus steht auf Säulen. Die OOP auch – auf vier Stück. Wer diese vier versteht, versteht die Idee der OOP:

| Säule | In einem Satz |
|---|---|
| [Abstraktion](#begriff-abstraktion) | Nur das Wichtige zeigen, den Rest weglassen. |
| [Vererbung](#begriff-vererbung) | Kinder bekommen alles von den Eltern – und haben Eigenes dazu. |
| [Polymorphie](#begriff-polymorphie) | Ein Befehl, und jeder macht es auf seine Art. |
| [Kapselung](#begriff-kapselung) | Das Innere ist geheim, man benutzt nur die erlaubten Knöpfe. |

Damit du die Säulen verstehst, brauchst du ein paar Grundwörter. Fang am besten mit **Objekt** und **Klasse** an und lies dann der Reihe nach.

**Neu: Im Speicher.** Bei jedem Begriff gibt es einen Block **Im Speicher**. Er erklärt, was dabei im Speicher der JVM passiert – im {{Stack}}, im {{Heap}} und im {{Metaspace}}. Was diese drei Bereiche sind, steht bei [Der Speicher](#begriff-speicher).` }
      ]
    },
    {
      id: 'begriff-objekt', group: 'begriffe', num: 'B1', nav: 'Objekt', type: 'concept', demo: 'demo-instanziieren',
      title: 'Was ist ein Objekt?',
      blocks: [
        { k: 'short', md: `Ein Objekt ist ein Ding im Programm, das etwas **weiß** und etwas **kann**.` },
        { k: 'life', md: `🐈 Denk an eine echte Katze. Sie weiß etwas über sich: Sie hat vier Beine und einen Schwanz. Und sie kann etwas: fressen und laufen. Im Programm ist das genauso – nur dass die Katze aus Code besteht.` },
        { k: 'inApp', md: `Jedes Kästchen unter **Erstellte Objekte** ist ein Objekt, zum Beispiel \`katze1\` oder \`auto1\`. Fahr mit der Maus darüber. Unter **Felder** siehst du, was es weiß. Unter **Methoden** siehst du, was es kann.` },
        { k: 'memory', md: `Ein Objekt **wohnt im {{Heap}}**. Dort hat es einen eigenen Platz mit einer **Adresse**, zum Beispiel \`@1159cc2d\`, und dort liegen alle seine Felder.

Der Name \`katze1\` ist **nicht** das Objekt selbst. Er ist eine kleine Variable im {{Stack}}, in der nur die Adresse steht – wie ein Zettel mit einer Hausnummer.

Jedes Objekt weiß außerdem, nach welchem Bauplan es gebaut wurde: Es zeigt auf seine Klasse im {{Metaspace}}. Im Fenster **Speicher** steht das bei jedem Objekt als \`→ Katze.class\`. Was Stack, Heap und Metaspace genau sind, erklärt [Der Speicher](#begriff-speicher).` },
        { k: 'remember', md: `Objekt = Wissen + Können.` }
      ]
    },
    {
      id: 'begriff-klasse', group: 'begriffe', num: 'B2', nav: 'Klasse', type: 'concept', demo: 'demo-instanziieren',
      title: 'Was ist eine Klasse?',
      blocks: [
        { k: 'short', md: `Eine Klasse ist ein **Bauplan** für Objekte.` },
        { k: 'life', md: `🍪 Denk an eine Ausstechform für Plätzchen. Die Form selbst kann man nicht essen. Aber mit ihr kannst du ganz viele Plätzchen machen. Alle haben dieselbe Form – und trotzdem ist jedes ein eigenes Plätzchen. Die Form ist die Klasse. Die Plätzchen sind die Objekte.` },
        { k: 'inApp', md: `\`Katze\` ist eine Klasse. \`katze1\` und \`katze2\` sind Objekte, gebaut nach dem Bauplan \`Katze\`. Die Klasse sagt: „Jede Katze hat Beine und kann fressen." Das Objekt sagt: „Ich bin **diese eine** Katze hier."` },
        { k: 'memory', md: `Eine Klasse liegt im {{Metaspace}} – und zwar nur **ein einziges Mal**, egal wie viele Objekte du baust. \`katze1\` und \`katze2\` liegen beide im {{Heap}} und zeigen auf **dieselbe** Klasse \`Katze\`.

In Java lädt die JVM eine Klasse, wenn sie zum ersten Mal gebraucht wird. Danach bleibt sie da und ändert sich nicht mehr. Im OOPlayground stehen alle Klassen schon von Anfang an im Metaspace.` },
        { k: 'remember', md: `Klasse = Bauplan. Objekt = das gebaute Ding.` },
        { k: 'code', md: `\`\`\`java
class Katze extends Tier {          // der Bauplan
    public void essen() {
        System.out.println("Die Katze frisst Fisch.");
    }
}

Katze katze1 = new Katze();         // ein Ding nach dem Bauplan
\`\`\`` }
      ]
    },
    {
      id: 'begriff-speicher', group: 'begriffe', num: 'B3', nav: 'Speicher (JVM)', type: 'concept', demo: 'demo-speicher',
      title: 'Der Speicher: Stack, Heap und Metaspace',
      blocks: [
        { k: 'short', md: `Wenn ein Java-Programm läuft, legt die **Java Virtual Machine** (JVM) alles in ihren **Speicher**. Drei Bereiche sind für uns wichtig: {{Stack}}, {{Heap}} und {{Metaspace}}.` },
        { k: 'life', md: `🏭 Stell dir eine Werkstatt vor. An der Wand hängt ein Regal mit **Bauplänen** – das ist der Metaspace. In der großen Halle stehen die **gebauten Dinge** – das ist der Heap. Und auf dem Schreibtisch liegt ein **Stapel Notizzettel**: Oben liegt immer der Zettel für die Arbeit, die du gerade machst. Darauf steht zum Beispiel: „katze1 steht in der Halle auf Platz 7." Das ist der Stack.` },
        { k: 'inApp', md: `Unten links im OOPlayground gibt es einen kleinen Knopf mit einem Speicher-Symbol. Ein Klick öffnet das Fenster **Speicher der JVM** mit drei farbigen Spalten:

- {{Stack}} – pro Methodenaufruf ein **Frame** mit lokalen Variablen, Parametern und Referenzen. Ganz unten liegt der Frame von \`main(String[] args)\`.
- {{Heap}} – alle **Objekte** mit ihren Feldern. Jedes Objekt hat eine **Adresse**, zum Beispiel \`@1159cc2d\`.
- {{Metaspace}} – die **Beschreibung der Klassen**: Felder, Methoden und von wem sie erben.

Fahr mit der Maus über ein Objekt oder eine Adresse. Dann leuchtet alles auf, was dazugehört: die Variable im Stack, das Objekt im Heap und seine Klasse im Metaspace.

Bei jedem Begriff auf dieser Seite gibt es einen Block **Im Speicher**. Dort steht, was bei diesem Begriff im Speicher passiert.` },
        { k: 'remember', md: `Metaspace = Baupläne. Heap = Objekte. Stack = was gerade läuft.` },
        { k: 'code', md: `\`\`\`java
public static void main(String[] args) {   // Frame von main() im Stack
    Katze katze1 = new Katze();
    // katze1      → Variable im Stack, enthält nur die Adresse
    // new Katze() → das Objekt im Heap
    // Katze       → der Bauplan im Metaspace
}
\`\`\`` }
      ]
    },
    {
      id: 'begriff-feld', group: 'begriffe', num: 'B4', nav: 'Feld & Zustand', type: 'concept', demo: 'demo-zustand',
      title: 'Was sind Felder und was ist der Zustand?',
      blocks: [
        { k: 'short', md: `Ein **Feld** ist eine Eigenschaft eines Objekts – ein kleines Fach mit einem Namen und einem Wert. Alle Werte zusammen nennt man den **Zustand** des Objekts.` },
        { k: 'life', md: `📋 Denk an einen Steckbrief: „Name: Katze. Beine: 4. Kann fliegen: nein." Jede Zeile ist ein Feld. Und der Zustand kann sich ändern: Eine Lampe ist mal an, mal aus. Ein Motor läuft mal, mal nicht.` },
        { k: 'inApp', md: `Felder stehen in jeder Karte unter **Felder**, ihr Name ist blau. Beispiel: \`int anzahlBeine = 4;\`. Vor dem Namen steht der **Typ** – er sagt, was in das Fach hineinpasst:
- \`String\` – ein Text, z. B. \`"Katze"\`
- \`int\` – eine ganze Zahl, z. B. \`4\`
- \`boolean\` – ja oder nein: \`true\` oder \`false\`

Der Zustand ändert sich zum Beispiel beim Motor: Vor dem Starten steht dort \`laeuft = false\`, danach \`laeuft = true\`. Und jedes Objekt hat seinen **eigenen** Zustand: Startest du den Motor von \`auto1\`, läuft der Motor von \`auto2\` trotzdem nicht.` },
        { k: 'memory', md: `Die Werte der Felder stehen **im Objekt** im {{Heap}}. Jedes Objekt hat seine **eigenen** Fächer – deshalb ändert sich bei \`auto2\` nichts, wenn der Motor von \`auto1\` startet. Im {{Metaspace}} steht nur, **welche** Felder es gibt und welchen Typ sie haben – aber keine Werte.

Kleine Werte wie \`4\` oder \`true\` stehen direkt im Fach. Ist der Wert ein Objekt – zum Beispiel beim Feld \`motor\` –, steht im Fach nur eine **Adresse**. Sie zeigt auf ein anderes Objekt im Heap.

Felder mit \`static\` (im OOPlayground gibt es keine) gehören nicht zu einem Objekt, sondern zur Klasse. Von ihnen gibt es nur **einen** Wert für alle Objekte.` },
        { k: 'remember', md: `Felder = was ein Objekt weiß. Zustand = die Werte genau jetzt.` }
      ]
    },
    {
      id: 'begriff-methode', group: 'begriffe', num: 'B5', nav: 'Methode', type: 'concept', demo: 'demo-methode',
      title: 'Was ist eine Methode?',
      blocks: [
        { k: 'short', md: `Eine Methode ist etwas, das ein Objekt **tun** kann – ein Befehl, den es versteht.` },
        { k: 'life', md: `🐕 Ein Hund versteht „Sitz!". Wenn du es sagst, setzt er sich hin. „Sitz" ist wie eine Methode: ein Befehl, den der Hund kennt und ausführen kann.` },
        { k: 'inApp', md: `Methoden stehen in jeder Karte unter **Methoden**. Ihr Name ist grün und hat Klammern am Ende: \`essen()\`, \`bewegen()\`, \`motorStarten()\`. Mit dem Knopf **Ausführen** rufst du eine Methode auf. Das Objekt tut dann etwas und antwortet in der **Ausgabe**. Manche Methoden ändern dabei den Zustand – zum Beispiel startet \`motorStarten()\` den Motor.` },
        { k: 'memory', md: `Der Code einer Methode liegt **einmal** im {{Metaspace}}, bei ihrer Klasse – nicht in jedem Objekt. Hundert Katzen teilen sich also ein einziges \`essen()\`.

Rufst du eine Methode auf, legt die JVM einen neuen **Frame** oben auf den {{Stack}}. Darin stehen \`this\` (die Adresse des Objekts, das gerade arbeitet), die Parameter und die lokalen Variablen. Ist die Methode fertig, wird der Frame wieder weggenommen. Im Fenster **Speicher** siehst du nach **Ausführen** kurz den Frame \`Katze.essen()\` über dem Frame von \`main()\`.

Woher weiß die JVM, **welches** \`essen()\` sie nehmen soll? Sie schaut beim Objekt im {{Heap}} nach, von welcher Klasse es ist, und sucht dort die passende Version. Das nennt man **dynamische Bindung** (englisch *dynamic dispatch*) – mehr dazu bei [Polymorphie](#begriff-polymorphie).` },
        { k: 'remember', md: `Methode = was ein Objekt kann. Aufrufen = „Mach das jetzt!"` },
        { k: 'code', md: `\`\`\`java
katze1.essen();   // Methode aufrufen
// Ausgabe: Die Katze frisst Fisch.
\`\`\`` }
      ]
    },
    {
      id: 'begriff-instanziierung', group: 'begriffe', num: 'B6', nav: 'Instanziierung & Konstruktor', type: 'concept', demo: 'demo-instanziieren',
      title: 'Was heißt Instanziierung?',
      blocks: [
        { k: 'short', md: `**Instanziieren** heißt: aus einer Klasse ein echtes Objekt bauen. Das fertige Objekt nennt man **Instanz**.` },
        { k: 'life', md: `🍪 Du drückst die Ausstechform in den Teig – und schon liegt ein neues Plätzchen da. Jedes Mal, wenn du drückst, entsteht ein **neues** Plätzchen.` },
        { k: 'inApp', md: `Öffne die Klassenkarte von **Tier** und klick unter **Erben** auf **Katze**. Im Programm passiert dann \`new Katze()\`. Ein neues Objekt erscheint: \`katze1\`. Klickst du noch einmal, kommt \`katze2\`. Beide sind Katzen – aber zwei verschiedene Objekte.

**Der Konstruktor:** Beim Bauen läuft automatisch eine besondere Methode: der **Konstruktor**. Er füllt die Felder mit Startwerten, zum Beispiel \`name = "Katze"\` und \`anzahlBeine = 4\`. Deshalb sind die Felder in der Objektkarte schon ausgefüllt – in der Klassenkarte von Tier aber noch leer.` },
        { k: 'memory', md: `\`Katze katze1 = new Katze();\` passiert in vier Schritten:

1. \`new\` holt den Bauplan \`Katze\` aus dem {{Metaspace}}.
2. Im {{Heap}} wird Platz für **alle** Felder reserviert – die geerbten von Tier und die eigenen der Katze. Zuerst stehen dort Standardwerte: \`0\`, \`false\` oder \`null\`.
3. Der Konstruktor läuft – mit einem eigenen Frame im {{Stack}} – und füllt die Felder mit Startwerten.
4. Die Adresse des neuen Objekts kommt in die Variable \`katze1\` im {{Stack}}.

Im Fenster **Speicher** leuchten nach dem Klick die neue Variable und das neue Objekt kurz auf.` },
        { k: 'remember', md: `\`new\` + Klasse = neues Objekt.` },
        { k: 'code', md: `\`\`\`java
Katze katze1 = new Katze();  // Instanz Nr. 1
Katze katze2 = new Katze();  // Instanz Nr. 2 – ein anderes Objekt

class Katze extends Tier {
    boolean schnurrt;

    Katze() {                // der Konstruktor
        super();             // erst den Teil von Tier bauen
        this.name = "Katze";
        this.anzahlBeine = 4;
        this.schnurrt = true;
    }
}
\`\`\`` }
      ]
    },
    {
      id: 'begriff-abstrakte-klasse', group: 'begriffe', num: 'B7', nav: 'Abstrakte Klasse', type: 'concept', demo: 'demo-abstrakt',
      title: 'Was ist eine abstrakte Klasse?',
      blocks: [
        { k: 'short', md: `Eine abstrakte Klasse ist ein Bauplan, der **absichtlich nicht fertig** ist. Aus ihr kann man kein Objekt bauen – nur aus ihren Kindern.` },
        { k: 'life', md: `🦁 Wenn jemand sagt: „Bring mir ein Tier!", fragst du sofort: „Welches denn?" Ein „Tier an sich" gibt es nicht. Es gibt nur Katzen, Krokodile, Menschen … „Tier" ist eine **Idee**. Sie beschreibt, was alle Tiere gemeinsam haben.` },
        { k: 'inApp', md: `\`Tier\`, \`Transport\` und \`Figur\` sind abstrakt. Darum steht auf ihrer Karte \`abstract class\`. Der Knopf \`new Tier()\` versucht trotzdem, ein Tier direkt zu bauen – und die Ausgabe meldet einen Fehler: „Abstrakte Klassen können nicht instanziiert werden."

**Abstrakte Methoden:** Eine Methode mit dem lila Abzeichen {{abstract}} hat nur einen Namen, aber noch keinen Inhalt. Die Klasse sagt damit: „Jedes Tier **muss** fressen können – aber **wie**, das entscheidet jedes Kind selbst." Die Katze frisst Fisch, das Krokodil frisst Fleisch, der Mensch isst Pizza.` },
        { k: 'memory', md: `Auch \`Tier\` hat seinen Platz im {{Metaspace}}: Die Kinder brauchen ja seine Felder und seine fertigen Methoden wie \`halten()\`. Aber im {{Heap}} findest du **nie** ein Objekt der Klasse \`Tier\` – nur Katzen, Krokodile, Menschen und Eulen.

Bei einer abstrakten Methode wie \`essen()\` steht im Metaspace nur der Name, aber kein Code. Den Code liefern erst die Kinder.` },
        { k: 'remember', md: `Abstrakt = nur eine Idee, noch nicht fertig. Erst die Kinder machen sie fertig.` },
        { k: 'code', md: `\`\`\`java
abstract class Tier {                // "abstract" = absichtlich nicht fertig
    String name = "Unbenannt";
    int anzahlBeine;

    public abstract void essen();    // nur der Name, noch kein Inhalt

    public void halten() {           // schon fertig – für alle Kinder gleich
        System.out.println(name + " bleibt stehen.");
    }
}

Tier tier = new Tier();   // ✗ Fehler: Tier ist abstrakt und kann nicht instanziiert werden
\`\`\`` }
      ]
    },
    {
      id: 'begriff-abstraktion', group: 'begriffe', num: 'B8', nav: 'Abstraktion', type: 'concept', pillar: 1, demo: 'demo-abstraktion',
      title: 'Abstraktion',
      overline: 'Säule 1 von 4',
      blocks: [
        { k: 'short', md: `Abstraktion heißt: Nur das **Wichtige** zeigen und unwichtige Einzelheiten weglassen.` },
        { k: 'life', md: `🗺️ Auf einer Landkarte sind Straßen nur Linien. Bäume, Autos und Häuser fehlen. Trotzdem findest du den Weg – sogar leichter! Die Karte zeigt nur, was du zum Finden brauchst.` },
        { k: 'inApp', md: `Die Klasse \`Transport\` sagt nur das Wichtigste über **alle** Fahrzeuge: Sie haben eine Höchstgeschwindigkeit, Räder und einen Motor. Sie können den Motor starten und sich bewegen. Ob es ein Auto, ein Flugzeug oder ein Zug ist – das ist hier egal. Wer mit einem Fahrzeug arbeitet, muss nur das wissen.

Eine abstrakte Klasse ist also ein Werkzeug für Abstraktion: Sie sammelt, was alle gemeinsam haben, und lässt die Einzelheiten für später.` },
        { k: 'memory', md: `Eine Variable im {{Stack}} darf einen allgemeinen Typ haben: \`Transport t = new Auto();\`. Im {{Heap}} liegt trotzdem ein ganz normales Auto mit allen seinen Feldern.

Der Typ der Variable ist wie eine **Brille**: Durch die Brille „Transport" siehst du nur, was alle Fahrzeuge gemeinsam haben. Das Objekt selbst wird dadurch nicht kleiner. (Im OOPlayground haben die Variablen immer den genauen Typ, zum Beispiel \`Auto auto1\`.)` },
        { k: 'remember', md: `Abstraktion = Was haben alle gemeinsam? Der Rest kommt später.` }
      ]
    },
    {
      id: 'begriff-vererbung', group: 'begriffe', num: 'B9', nav: 'Vererbung', type: 'concept', pillar: 2, demo: 'demo-vererbung',
      title: 'Vererbung',
      overline: 'Säule 2 von 4',
      blocks: [
        { k: 'short', md: `Vererbung heißt: Eine Klasse bekommt automatisch alles von ihrer **Elternklasse** – und kann noch Eigenes dazu haben.` },
        { k: 'life', md: `👨‍👧 Vielleicht hast du die Augenfarbe von deiner Mama geerbt. Du musst sie nicht selbst „machen" – du hast sie einfach. Aber du hast auch ganz eigene Sachen, zum Beispiel dein Lieblingshobby.` },
        { k: 'inApp', md: `\`Katze\` erbt von \`Tier\`. Im Code schreibt man das so: \`class Katze extends Tier\`. In der Objektkarte von \`katze1\` siehst du das an den Abzeichen:
- Felder wie \`anzahlBeine\` oder \`hatSchwanz\` haben {{geerbt}} – sie kommen von Tier.
- Das Feld \`schnurrt\` hat {{eigen}} – das hat nur die Katze.

Die Eltern nennt man **Oberklasse**, die Kinder **Unterklassen**. In der Klassenkarte stehen die Kinder unter **Erben**.` },
        { k: 'memory', md: `Im {{Heap}} steckt **kein** extra Tier-Objekt in der Katze. \`katze1\` ist **ein einziges** Objekt, und darin stehen alle Felder zusammen: die fünf geerbten von Tier und das eigene \`schnurrt\`. Im Fenster **Speicher** siehst du das: \`katze1\` ist ein Kasten mit sechs Feldern.

Im {{Metaspace}} ist es anders: Dort steht jede Klasse für sich. Bei \`Katze\` steht nur \`schnurrt\` und dazu \`extends Tier\` – die übrigen Felder stehen bei \`Tier\`. Die Klasse Katze zeigt also auf ihre Elternklasse, und beim Bauen sammelt die JVM die Felder von beiden ein.` },
        { k: 'remember', md: `Kind = alles von den Eltern + etwas Eigenes.` },
        { k: 'code', md: `\`\`\`java
class Katze extends Tier {   // "extends" = erbt von
    boolean schnurrt;

    Katze() {
        super();               // den geerbten Teil von Tier bauen
        this.schnurrt = true;  // etwas Eigenes dazu
    }
}
\`\`\`` }
      ]
    },
    {
      id: 'begriff-ueberschreiben', group: 'begriffe', num: 'B10', nav: 'Überschreiben', type: 'concept', demo: 'demo-ueberschreiben',
      title: 'Überschreiben',
      blocks: [
        { k: 'short', md: `Überschreiben heißt: Die Kindklasse schreibt eine geerbte Methode **neu**, auf ihre eigene Art. Der Name bleibt gleich.` },
        { k: 'life', md: `🥞 Deine Oma hat ein Rezept für Pfannkuchen. Du hast es geerbt – aber du machst sie mit Schokolade. Das Rezept heißt immer noch „Pfannkuchen". Nur deine Version ist anders.` },
        { k: 'inApp', md: `In der Objektkarte von \`katze1\` hat \`essen()\` das gelbe Abzeichen {{überschrieben}}: Die Katze hat ihre eigene Version geschrieben – sie frisst Fisch. Die Methode \`halten()\` hat dagegen {{geerbt}}: Die Katze benutzt einfach die Version von Tier, ohne etwas zu ändern.` },
        { k: 'memory', md: `Im {{Metaspace}} hat die Klasse \`Krokodil\` ihren **eigenen** Code für \`essen()\`. Für \`halten()\` hat sie keinen – den gibt es nur einmal, bei \`Tier\`.

Jede Klasse hat eine Art Inhaltsverzeichnis ihrer Methoden, die **Methodentabelle**. Beim Krokodil steht darin: \`essen()\` → Code von Krokodil, \`halten()\` → Code von Tier. Überschreiben heißt also: Im Inhaltsverzeichnis des Kindes wird ein Eintrag der Eltern durch einen eigenen ersetzt.

Im Fenster **Speicher** siehst du das an den Klassen: Bei \`Katze\` stehen \`essen()\`, \`bewegen()\` und \`lautGeben()\`, aber kein \`halten()\`.` },
        { k: 'remember', md: `Überschreiben = gleicher Name, eigene Art.` },
        { k: 'code', md: `\`\`\`java
class Krokodil extends Tier {
    @Override                  // eigene Version von essen()
    public void essen() {
        System.out.println("Das Krokodil frisst Fleisch.");
    }
    // halten() wird nicht neu geschrieben → die Version von Tier gilt
}
\`\`\`` }
      ]
    },
    {
      id: 'begriff-polymorphie', group: 'begriffe', num: 'B11', nav: 'Polymorphie', type: 'concept', pillar: 3, demo: 'demo-polymorphie',
      title: 'Polymorphie',
      overline: 'Säule 3 von 4',
      blocks: [
        { k: 'short', md: `Polymorphie bedeutet „Vielgestaltigkeit": Du gibst vielen verschiedenen Objekten **denselben Befehl** – und jedes führt ihn auf **seine eigene Weise** aus.` },
        { k: 'life', md: `🏫 Die Lehrerin sagt zur ganzen Klasse: „Kommt bitte nach vorne!" Ein Kind läuft, eins hüpft, eins fährt mit dem Rollstuhl. Die Lehrerin muss nicht jedem einzeln erklären, **wie** es nach vorne kommt. Jeder weiß das selbst.` },
        { k: 'inApp', md: `Der Knopf **Alle bewegen** sagt allen Tieren und Fahrzeugen: \`bewegen()\`. Die Katze läuft auf vier Pfoten, das Krokodil kriecht, das Flugzeug fliegt durch die Luft. Das Programm fragt dabei nie: „Bist du eine Katze? Bist du ein Auto?" Es ruft einfach bei allen dieselbe Methode auf. Jedes Objekt weiß selbst, was es tun muss – weil jedes Kind \`bewegen()\` überschrieben hat.` },
        { k: 'memory', md: `Hier passiert die **dynamische Bindung** (englisch *dynamic dispatch*). In der Schleife steht in der Variable \`tier\` im {{Stack}} nacheinander die Adresse von drei verschiedenen Objekten. Bei \`tier.bewegen()\` fragt die JVM jedes Mal **erst in diesem Moment**:

1. Welches Objekt liegt an dieser Adresse im {{Heap}}?
2. Von welcher Klasse ist es?
3. Welche Version von \`bewegen()\` steht bei dieser Klasse im {{Metaspace}}?

Der Typ der Variable (\`Tier\`) entscheidet also nicht, **welcher** Code läuft – das entscheidet das Objekt selbst. Probier es im Fenster **Speicher**: Fahr über ein Objekt, und seine Klasse im Metaspace leuchtet auf. Genau dort sucht die JVM die Methode.` },
        { k: 'remember', md: `Polymorphie = ein Befehl, viele verschiedene Antworten.` },
        { k: 'code', md: `\`\`\`java
Tier[] tiere = { new Katze(), new Krokodil(), new Mensch() };

for (Tier tier : tiere) {
    tier.bewegen();            // derselbe Befehl für alle
}
// Läuft auf vier Pfoten.
// Kriecht.
// Geht auf zwei Beinen.
\`\`\`` }
      ]
    },
    {
      id: 'begriff-kapselung', group: 'begriffe', num: 'B12', nav: 'Kapselung', type: 'concept', pillar: 4, demo: 'demo-kapselung',
      title: 'Kapselung',
      overline: 'Säule 4 von 4',
      blocks: [
        { k: 'short', md: `Kapselung heißt: Ein Objekt **versteckt sein Inneres**. Von außen darf man nur die erlaubten Knöpfe drücken.` },
        { k: 'life', md: `📺 Bei einer Fernbedienung drückst du nur auf die Knöpfe. Die Kabel und Chips darin siehst du nicht und darfst du nicht anfassen – sonst geht vielleicht etwas kaputt. Du musst sie auch gar nicht kennen, um fernzusehen.` },
        { k: 'inApp', md: `Der Motor hat einen öffentlichen Knopf: \`public starten()\`. Dazu hat er drei geheime Schritte mit \`private\`, zum Beispiel \`kraftstoffEinspritzen()\`. Klickst du bei einem geheimen Schritt auf **testen**, kommt: „Zugriff verweigert". Die geheimen Schritte laufen nur, wenn der Motor sie **selbst** aufruft – beim Starten.

Auch die Figuren haben ein Geheimnis: ihren Drehwinkel. Er steht nicht in der Karte, und ändern kann ihn nur die Methode \`drehen90()\`.

**Schnittstelle:** Alle öffentlichen Methoden eines Objekts zusammen nennt man seine **Schnittstelle**. Das sind seine „Knöpfe" nach außen.` },
        { k: 'memory', md: `Im {{Heap}} liegen private Felder genauso im Objekt wie alle anderen. Im Fenster **Speicher** siehst du bei den Figuren zum Beispiel \`private #winkel = 90\` – obwohl der Winkel in der Objektkarte fehlt. Auch die privaten Methoden des Motors stehen ganz normal im {{Metaspace}}, bei ihrer Klasse.

Kapselung ist also kein Tresor im Speicher, sondern eine **Regel der Sprache**: Der Compiler und die JVM lassen Code von außen einfach nicht heran.` },
        { k: 'remember', md: `\`public\` = für alle. \`private\` = nur für mich selbst.` },
        { k: 'code', md: `\`\`\`java
class Benzinmotor extends Motor {
    private void zuenden() { /* geheim */ }   // private = nur von innen
    public void starten() {                   // öffentlich
        this.zuenden();                       // drinnen erlaubt
        this.laeuft = true;
    }
}

motor.starten();   // ✓ klappt
motor.zuenden();   // ✗ verboten – von außen nicht erreichbar
\`\`\`` }
      ]
    },
    {
      id: 'begriff-nachrichten', group: 'begriffe', num: 'B13', nav: 'Message Passing', type: 'concept', demo: 'demo-nachrichten',
      title: 'Message Passing – Objekte schicken sich Nachrichten',
      blocks: [
        { k: 'short', md: `Objekte arbeiten zusammen, indem sie sich **Nachrichten** schicken. Eine Nachricht schicken heißt: eine Methode eines anderen Objekts aufrufen. Die Antwort ist das, was die Methode zurückgibt.` },
        { k: 'life', md: `✉️ Du schreibst deiner Freundin: „Kannst du mir das Buch mitbringen?" Du sagst ihr nicht, **wie** sie das machen soll. Sie bekommt die Nachricht, erledigt es auf ihre Art und antwortet: „Klar, erledigt!"` },
        { k: 'inApp', md: `Klickst du bei \`auto1\` neben \`motorStarten()\` auf **Ausführen**, schickst du dem Auto die Nachricht: „Starte deinen Motor!" Das Auto startet den Motor aber nicht selbst. Es schickt seinem Motor eine neue Nachricht: \`starten()\`. Der Motor erledigt seine geheimen Schritte und antwortet: „Motor gestartet!" Dann antwortet das Auto dir: „Motor erfolgreich gestartet." Deshalb siehst du in der Ausgabe **zwei** Antworten.

Auch **Alle bewegen** ist Message Passing: Eine Nachricht – \`bewegen()\` – geht an viele Objekte gleichzeitig.` },
        { k: 'memory', md: `Jede Nachricht ist ein Methodenaufruf – und jeder Aufruf legt einen Frame auf den {{Stack}}. Bei \`auto1.motorStarten()\` wächst der Stapel so:

\`\`\`text
│ Benzinmotor.zuenden()    │  ← ganz oben: was gerade passiert
│ Benzinmotor.starten()    │
│ Auto.motorStarten()      │
│ main()                   │
└──────────────────────────┘
\`\`\`

Ist eine Methode fertig, wird ihr Frame weggenommen, und ihre Antwort geht an den Frame darunter. Darum kommt in der Ausgabe erst die Antwort des Motors und dann die des Autos. Im Fenster **Speicher** zeigt der OOPlayground nur den Frame der Nachricht, die **du** schickst.` },
        { k: 'remember', md: `Methode aufrufen = Nachricht schicken. Rückgabewert = Antwort.` },
        { k: 'code', md: `\`\`\`text
Du ──motorStarten()──▶ auto1 ──starten()──▶ Benzinmotor
                                               └─ geheime Schritte
Du ◀─"Motor erfolgreich gestartet."─ auto1 ◀─"Motor gestartet!"─ Benzinmotor
\`\`\`` }
      ]
    },
    {
      id: 'begriff-komposition', group: 'begriffe', num: 'B14', nav: 'Komposition & Delegation', type: 'concept', demo: 'demo-komposition',
      title: 'Komposition und Delegation',
      blocks: [
        { k: 'short', md: `**Komposition** heißt: Ein Objekt **besteht aus** anderen Objekten. **Delegation** heißt: Es gibt eine Aufgabe an eines dieser Teile weiter.` },
        { k: 'life', md: `🚲 Ein Fahrrad hat Räder, Bremsen und eine Klingel. Wenn du klingeln willst, klingelt nicht das ganze Fahrrad – das macht die Klingel. Das Fahrrad „delegiert" das Klingeln an die Klingel.` },
        { k: 'inApp', md: `Das Feld \`motor\` von \`auto1\` enthält keinen Text, sondern ein ganzes eigenes Objekt: einen \`Benzinmotor\`. Darum kannst du darüberfahren und eine eigene Karte öffnen. Wenn du \`motorStarten()\` aufrufst, gibt das Auto die Arbeit an seinen Motor weiter – das ist Delegation.

**Vererbung oder Komposition?**
- „**ist ein**" → Vererbung: Eine Katze **ist ein** Tier.
- „**hat ein**" → Komposition: Ein Auto **hat einen** Motor. (Ein Auto ist ja kein Motor!)` },
        { k: 'memory', md: `Bei Komposition liegen **zwei** Objekte im {{Heap}}: das Auto und sein Motor. Im Feld \`motor\` von \`auto1\` steht nur die **Adresse** des Motors. Im Fenster **Speicher** steht der Motor als eigener Kasten direkt unter dem Auto (\`auto1.motor\`). Fahr über die Adresse beim Feld \`motor\` – dann leuchten der Motor und seine Klasse \`Benzinmotor\` auf.

Vergleiche mit Vererbung: Eine Katze ist **ein** Objekt, mit den Feldern von Tier darin. Ein Auto mit Motor sind **zwei** Objekte, die über eine Adresse verbunden sind.` },
        { k: 'remember', md: `ist ein → Vererbung. hat ein → Komposition.` },
        { k: 'code', md: `\`\`\`java
class Auto extends Transport {           // Auto IST EIN Transport
    Motor motor;

    Auto() {
        super();
        this.motor = new Benzinmotor();      // Auto HAT EINEN Motor
    }

    public void motorStarten() {
        this.motor.starten();                // Arbeit an den Motor weitergeben
    }
}
\`\`\`` }
      ]
    },
    {
      id: 'begriff-wiederverwendung', group: 'begriffe', num: 'B15', nav: 'Wiederverwendung', type: 'concept', demo: 'demo-wiederverwendung',
      title: 'Wiederverwendung',
      blocks: [
        { k: 'short', md: `Wiederverwendung heißt: Code **einmal** schreiben und an **vielen** Stellen benutzen.` },
        { k: 'life', md: `📖 Du schreibst ein Rezept einmal auf. Dann kannst du daraus so oft kochen, wie du willst – und deine Freunde können es auch benutzen. Niemand muss das Rezept jedes Mal neu erfinden.` },
        { k: 'inApp', md: `Die Methode \`drehen90()\` steht nur **ein einziges Mal** im Code – in der Klasse \`Figur\`. Dreieck, Kreis und Stern erben sie und können sich alle drehen. Niemand musste die Methode dreimal schreiben. In der Klassenkarte von Figur hat \`drehen90()\` deshalb das Abzeichen {{implemented}}, und in den Objektkarten {{geerbt}}.

Wiederverwendung ist einer der größten Vorteile der Vererbung: weniger Code, weniger Fehler. Und wenn man die Methode einmal verbessert, sind sofort alle Figuren besser.` },
        { k: 'memory', md: `\`drehen90()\` steht im {{Metaspace}} nur **einmal**, bei \`Figur\`. Dreieck, Kreis und Stern haben keine eigene Kopie – ihre Methodentabellen zeigen alle auf denselben Code.

Die Daten sind dagegen getrennt: Jede Figur hat im {{Heap}} ihren eigenen \`#winkel\`. Code wird geteilt, Zustand nicht.` },
        { k: 'remember', md: `Einmal schreiben, oft benutzen.` }
      ]
    },
    {
      id: 'begriff-null', group: 'begriffe', num: 'B16', nav: 'Referenz & null', type: 'concept', demo: 'demo-null',
      title: 'Referenz und null',
      blocks: [
        { k: 'short', md: `Ein Name wie \`katze1\` ist wie ein Zeiger auf ein Objekt. Man nennt ihn **Referenz**. \`null\` heißt: „Dieser Name zeigt auf nichts mehr."` },
        { k: 'life', md: `🎈 Stell dir einen Luftballon an einer Schnur vor. Die Schnur ist der Name, der Ballon ist das Objekt. Lässt du die Schnur los (\`= null\`), fliegt der Ballon weg. Hält ihn niemand mehr fest, räumt JavaScript ihn irgendwann von selbst auf. Das nennt man **Garbage Collection** – die „Müllabfuhr" des Programms.` },
        { k: 'inApp', md: `In jeder Objektkarte gibt es ganz unten den Knopf \`katze1 = null\`. Ein Klick – und das Objekt ist weg. **Alle löschen** macht das mit allen Objekten auf einmal.

Und die Nummern? Solange es noch eine Katze gibt, werden Nummern nicht doppelt vergeben. Erst wenn **keine** Katze mehr da ist, fängt die Zählung wieder bei \`katze1\` an.` },
        { k: 'memory', md: `Die Variable \`katze1\` im {{Stack}} enthält nur eine Adresse. \`katze1 = null\` löscht diese Adresse – das Objekt im {{Heap}} bleibt zuerst einfach liegen. Zeigt keine Variable und kein Feld mehr darauf, ist es **unerreichbar**. Dann räumt der **Garbage Collector** der JVM es irgendwann weg und gibt den Platz frei. Die Klasse \`Katze\` im {{Metaspace}} bleibt – sie wird ja weiter gebraucht.

Im OOPlayground geht es schneller: Nach \`katze1 = null\` verschwinden die Variable im Stack und das Objekt im Heap sofort.` },
        { k: 'remember', md: `Referenz = Schnur zum Objekt. \`null\` = keine Schnur mehr.` }
      ]
    },
    {
      id: 'demo-vorbereitung', group: 'vorfuehren', num: 'D0', nav: 'Vorbereitung', type: 'demo',
      title: 'Vorbereitung',
      blocks: [
        { k: 'goal', md: `Einen sauberen Start haben, damit alles genau so aussieht wie in den Anleitungen.` },
        { k: 'steps', md: `1. Öffne den OOPlayground mit dem Knopf **Zum Playground** oben auf dieser Seite. Am besten legst du beide Fenster nebeneinander: links der OOPlayground, rechts diese Anleitung.
2. Wähle oben rechts die Sprache: **EN** oder **DE**.
3. Sind schon Objekte da? Dann klick auf **\`[[Alle löschen]]\`**.
4. Klick in der Ausgabe auf **\`[[Leeren]]\`**.` },
        { k: 'watch', md: `- Vor jeder neuen Anleitung lohnt sich Schritt 3 und 4. Dann stimmen die Namen (\`katze1\`, \`auto1\` …) und die Ausgabe genau mit den Beispielen überein.
- Ist eine Karte plötzlich zu? Fahr einfach noch einmal mit der Maus über das Symbol.` }
      ]
    },
    {
      id: 'demo-abstraktion', group: 'vorfuehren', num: 'D1', nav: 'Abstraktion entdecken', type: 'demo',
      title: 'Abstraktion entdecken',
      blocks: [
        { k: 'goal', md: `Du entdeckst, dass eine Klasse nur das **Gemeinsame** beschreibt – das „Was", nicht das „Wie".` },
        { k: 'steps', md: `1. Fahre mit der Maus über **Transport**. Die Karte \`abstract class Transport\` öffnet sich.
2. Lies die **Felder**: \`name\`, \`kannFliegen\`, \`hoechstgeschwindigkeit\`, \`anzahlRaeder\`, \`motor\`. Das hat **jedes** Fahrzeug – egal welches.
3. Achte darauf: Fast alle Felder haben noch **keinen Wert**. Nur \`name\` hat den Platzhalter \`"Unbenannt"\`.
4. Schau dir die **Methoden** an: \`motorStarten()\` und \`bewegen()\` haben das Abzeichen {{abstract}}. Das heißt: Jedes Fahrzeug kann das – aber **wie**, steht hier noch nicht.
5. Mach dasselbe kurz mit **Tier** und mit **Figur**.` },
        { k: 'output', md: `Noch nichts – du schaust dir nur die Baupläne an.` },
        { k: 'watch', md: `- Die Klasse sagt **was** es gibt, nicht **wie** es genau ist.
- Ob Auto, Flugzeug oder Zug: Wer nur „Transport" kennt, weiß schon genug, um damit zu arbeiten.` }
      ],
      related: [{ id: 'begriff-abstraktion', label: 'Abstraktion' }, { id: 'begriff-abstrakte-klasse', label: 'Abstrakte Klasse' }]
    },
    {
      id: 'demo-abstrakt', group: 'vorfuehren', num: 'D2', nav: 'Abstrakte Klasse ausprobieren', type: 'demo',
      title: 'Abstrakte Klasse ausprobieren',
      blocks: [
        { k: 'goal', md: `Du probierst, aus einer abstrakten Klasse ein Objekt zu bauen – und merkst, dass es **nicht** geht.` },
        { k: 'steps', md: `1. Fahre über **Tier**.
2. Lies den Titel: \`abstract class Tier\`.
3. Schau dir die Abzeichen an: {{abstract}} bei \`essen()\`, \`bewegen()\` und \`lautGeben()\`, {{implemented}} bei \`halten()\`.
4. Klick ganz unten in der Karte auf **\`[[new Tier()]]\`**. (Wenn du darüberfährst, steht da: „Direkt instanziieren (verboten)".)
5. Schau in die **Ausgabe**.
6. Wenn du magst: Probier dasselbe mit \`new Transport()\` und \`new Figur()\`.` },
        { k: 'output', md: `\`\`\`console
> new Tier()
!! Abstrakte Klassen können nicht instanziiert werden.
\`\`\`` },
        { k: 'watch', md: `- Unter **Erstellte Objekte** ist **nichts** Neues erschienen.
- Der Fehler ist echt, nicht ausgedacht: Der Konstruktor von Tier prüft, ob jemand direkt \`new Tier()\` sagt – und verbietet es.
- Lila {{abstract}} = „Das müssen die Kinder fertig machen." Grün {{implemented}} = „Das ist schon fertig."` }
      ],
      related: [{ id: 'begriff-abstrakte-klasse', label: 'Abstrakte Klasse' }, { id: 'begriff-instanziierung', label: 'Instanziierung' }]
    },
    {
      id: 'demo-instanziieren', group: 'vorfuehren', num: 'D3', nav: 'Objekte erstellen', type: 'demo',
      title: 'Objekte erstellen (Klasse → Objekt)',
      blocks: [
        { k: 'goal', md: `Du siehst, wie aus **einer** Klasse **viele** Objekte entstehen.` },
        { k: 'steps', md: `1. Fahre über **Tier**.
2. Fahre unter **Erben** über den Knopf **\`[[Katze]]\`**. Da steht: „Instanziieren".
3. Klick auf **\`[[Katze]]\`**. Unter **Erstellte Objekte** erscheint \`katze1\`.
4. Klick noch zweimal auf **\`[[Katze]]\`**. Jetzt gibt es auch \`katze2\` und \`katze3\`.
5. Fahre über \`katze1\`. Oben auf der Karte steht \`class Katze katze1\`.
6. Fahre über \`katze2\`. Oben steht \`class Katze katze2\`.
7. Vergleiche mit der Karte von **Tier**: Dort waren die Felder leer. Bei \`katze1\` sind sie ausgefüllt.` },
        { k: 'output', md: `\`\`\`console
> Objekt katze1 wurde erstellt.
> Objekt katze2 wurde erstellt.
> Objekt katze3 wurde erstellt.
\`\`\`` },
        { k: 'watch', md: `- **Eine** Klasse (\`Katze\`) – **drei** Objekte. Jedes hat seinen eigenen Namen.
- Der Klick auf **Katze** „initialisiert" nicht die Klasse – er baut ein **neues Objekt**: \`new Katze()\`.
- Die Felder sind sofort ausgefüllt. Das hat der **Konstruktor** beim Bauen gemacht.
- Öffne unten links den **Speicher**: Im Stack stehen drei Variablen, im Heap drei Objekte – aber die Klasse \`Katze\` gibt es im Metaspace nur **einmal**.` }
      ],
      related: [{ id: 'begriff-objekt', label: 'Objekt' }, { id: 'begriff-klasse', label: 'Klasse' }, { id: 'begriff-instanziierung', label: 'Instanziierung' }]
    },
    {
      id: 'demo-zustand', group: 'vorfuehren', num: 'D4', nav: 'Zustand beobachten', type: 'demo',
      title: 'Zustand beobachten',
      blocks: [
        { k: 'goal', md: `Du beobachtest, dass jedes Objekt seinen **eigenen Zustand** hat und dass Methoden ihn ändern können.` },
        { k: 'steps', md: `1. Fahre über **Transport** und klick zweimal auf **\`[[Auto]]\`**. Jetzt gibt es \`auto1\` und \`auto2\`.
2. Fahre über \`auto1\`. Fahre in der Karte über \`Benzinmotor\` (beim Feld \`motor\`). Die Motorkarte öffnet sich. Dort steht: \`laeuft = false\`.
3. Klick in der Karte von \`auto1\` neben \`motorStarten()\` auf **\`[[Ausführen]]\`**. Das Auto im Bild startet.
4. Fahre wieder über \`Benzinmotor\` von \`auto1\`. Jetzt steht da: \`laeuft = true\`.
5. Fahre über \`auto2\` und dann über seinen \`Benzinmotor\`. Dort steht immer noch: \`laeuft = false\`.
6. Klick bei \`auto1\` noch einmal auf **Ausführen** neben \`motorStarten()\`.` },
        { k: 'output', md: `\`\`\`console
> Objekt auto1 wurde erstellt.
> Objekt auto2 wurde erstellt.
> auto1.motorStarten()
  Motor gestartet!
  Motor erfolgreich gestartet.
> auto1.motorStarten()
  Der Motor läuft bereits.
\`\`\`` },
        { k: 'watch', md: `- Gleiche Klasse, **verschiedener** Zustand: Bei \`auto1\` läuft der Motor, bei \`auto2\` nicht.
- Die Methode \`motorStarten()\` hat den Zustand **geändert** (\`false\` → \`true\`).
- Beim zweiten Mal antwortet das Auto anders – es **erinnert sich** an seinen Zustand.
- Nach **Ausführen** wird die Karte neu gezeichnet und die Motorkarte schließt sich. Das ist normal – einfach neu öffnen.
- Im **Speicher** steht \`laeuft\` im Heap beim Motor von \`auto1\`. Der Motor von \`auto2\` ist ein anderer Kasten mit seinem eigenen Wert.` }
      ],
      related: [{ id: 'begriff-feld', label: 'Feld & Zustand' }, { id: 'begriff-objekt', label: 'Objekt' }]
    },
    {
      id: 'demo-methode', group: 'vorfuehren', num: 'D5', nav: 'Methode aufrufen', type: 'demo',
      title: 'Methode aufrufen',
      blocks: [
        { k: 'goal', md: `Du gibst einem Objekt einen Befehl und liest, was es antwortet.` },
        { k: 'steps', md: `1. Erstelle eine Katze: **Tier** → **\`[[Katze]]\`**. Es erscheint \`katze1\`.
2. Fahre über \`katze1\`. Unter **Methoden** stehen: \`essen()\`, \`bewegen()\`, \`lautGeben()\`, \`halten()\`.
3. Klick neben \`essen()\` auf **\`[[Ausführen]]\`**. Die Katze im Bild frisst.
4. Klick neben \`bewegen()\` auf **\`[[Ausführen]]\`**. Die Katze läuft.
5. Klick neben \`halten()\` auf **\`[[Ausführen]]\`**. Die Katze bleibt stehen.` },
        { k: 'output', md: `\`\`\`console
> Objekt katze1 wurde erstellt.
> katze1.essen("ewig")
  Die Katze frisst Fisch.
> katze1.bewegen("ewig")
  Läuft auf vier Pfoten
> katze1.halten()
  Katze bleibt stehen.
\`\`\`` },
        { k: 'watch', md: `- Die Zeile mit \`>\` ist der **Befehl**, den du geschickt hast: \`katze1.essen()\`. So sieht ein Methodenaufruf im Code aus.
- Die eingerückte Zeile ist die **Antwort** des Objekts.
- Hinter **Ausführen** steckt ein echter Aufruf der JavaScript-Methode – nichts ist vorgespielt.` }
      ],
      related: [{ id: 'begriff-methode', label: 'Methode' }, { id: 'begriff-nachrichten', label: 'Message Passing' }]
    },
    {
      id: 'demo-vererbung', group: 'vorfuehren', num: 'D6', nav: 'Vererbung entdecken', type: 'demo',
      title: 'Vererbung entdecken',
      blocks: [
        { k: 'goal', md: `Du entdeckst, dass Kinder alles von den Eltern bekommen – und Eigenes dazu haben.` },
        { k: 'steps', md: `1. Fahre über **Tier** und lies die Felder: \`name\`, \`kannFliegen\`, \`anzahlBeine\`, \`hatSchwanz\`, \`kannGestreicheltWerden\`.
2. Klick unter **Erben** nacheinander auf **\`[[Katze]]\`**, **\`[[Krokodil]]\`** und **\`[[Mensch]]\`**.
3. Fahre über \`katze1\`. Du siehst: Die fünf Felder von Tier sind da und haben {{geerbt}}. Ganz unten steht \`schnurrt = true\` mit {{eigen}}.
4. Fahre über \`krokodil1\`. Sein eigenes Feld: \`anzahlZaehne = 66\`.
5. Fahre über \`mensch1\`. Sein eigenes Feld: \`beruf = "Student"\`.
6. Fahre noch einmal über **Tier**: Diese eigenen Felder gibt es dort **nicht**.` },
        { k: 'output', md: `\`\`\`console
> Objekt katze1 wurde erstellt.
> Objekt krokodil1 wurde erstellt.
> Objekt mensch1 wurde erstellt.
\`\`\`` },
        { k: 'watch', md: `- Die Kinder mussten die Felder von Tier **nicht neu erfinden** – sie haben sie geerbt.
- Jedes Kind hat trotzdem **etwas Eigenes**.
- Die geerbten Felder haben bei jedem Kind andere **Werte**: Die Katze hat 4 Beine, der Mensch 2.
- Im **Speicher** ist \`katze1\` **ein** Kasten mit allen sechs Feldern. Im Metaspace steht bei \`Katze\` dagegen nur \`schnurrt\` – der Rest steht bei \`Tier\`.` }
      ],
      related: [{ id: 'begriff-vererbung', label: 'Vererbung' }]
    },
    {
      id: 'demo-ueberschreiben', group: 'vorfuehren', num: 'D7', nav: 'Überschreiben ausprobieren', type: 'demo',
      title: 'Überschreiben ausprobieren',
      blocks: [
        { k: 'goal', md: `Du probierst aus, dass Kinder eine geerbte Methode auf ihre eigene Art neu schreiben können – oder sie einfach so übernehmen.` },
        { k: 'before', md: `**Vorher:** \`katze1\`, \`krokodil1\` und \`mensch1\` sollten da sein (siehe [Vererbung entdecken](#demo-vererbung)).` },
        { k: 'steps', md: `1. Fahre über **Tier**. Du siehst: \`essen()\` ist {{abstract}}, \`halten()\` ist {{implemented}}.
2. Fahre über \`katze1\`. Du siehst: \`essen()\`, \`bewegen()\` und \`lautGeben()\` haben {{überschrieben}}, \`halten()\` hat {{geerbt}}.
3. Klick neben \`essen()\` auf **\`[[Ausführen]]\`** – zuerst bei \`katze1\`, dann bei \`krokodil1\`, dann bei \`mensch1\`.
4. Klick neben \`halten()\` auf **\`[[Ausführen]]\`** – bei \`katze1\` und bei \`krokodil1\`.` },
        { k: 'output', md: `\`\`\`console
> katze1.essen("ewig")
  Die Katze frisst Fisch.
> krokodil1.essen("ewig")
  Das Krokodil frisst Fleisch.
> mensch1.essen("ewig")
  Der Mensch isst eine Pizza.
> katze1.halten()
  Katze bleibt stehen.
> krokodil1.halten()
  Krokodil bleibt stehen.
\`\`\`` },
        { k: 'watch', md: `- \`essen()\` ist {{überschrieben}}: drei Tiere, drei **verschiedene** Antworten.
- \`halten()\` ist {{geerbt}}: Alle benutzen **dieselbe** Methode von Tier. Nur der Name im Satz ist anders – weil die Methode den Namen aus dem Feld \`name\` liest.` }
      ],
      related: [{ id: 'begriff-ueberschreiben', label: 'Überschreiben' }, { id: 'begriff-vererbung', label: 'Vererbung' }]
    },
    {
      id: 'demo-polymorphie', group: 'vorfuehren', num: 'D8', nav: 'Polymorphie erleben', type: 'demo',
      title: 'Polymorphie erleben',
      blocks: [
        { k: 'goal', md: `Du erlebst, dass **ein** Befehl bei verschiedenen Objekten **verschiedene** Dinge bewirkt.` },
        { k: 'steps', md: `1. Klick auf **\`[[Alle löschen]]\`** und in der Ausgabe auf **\`[[Leeren]]\`**.
2. Erstelle eine Figur: **Figur** → **\`[[Dreieck]]\`**. Achte darauf: **Alle bewegen** ist noch grau – Figuren können sich nicht bewegen.
3. Erstelle drei Tiere: **Tier** → **\`[[Katze]]\`**, **\`[[Krokodil]]\`**, **\`[[Mensch]]\`**. Jetzt ist **Alle bewegen** aktiv.
4. Erstelle drei Fahrzeuge: **Transport** → **\`[[Auto]]\`**, **\`[[Flugzeug]]\`**, **\`[[Zug]]\`**.
5. Klick auf **\`[[Alle bewegen]]\`**. Alle Tiere und Fahrzeuge bewegen sich gleichzeitig – jedes anders.` },
        { k: 'output', note: '(nach Schritt 5)', md: `\`\`\`console
> Alle bewegen
  katze1: Läuft auf vier Pfoten.
  krokodil1: Kriecht.
  mensch1: Geht auf zwei Beinen.
  auto1: Fährt auf der Straße.
  flugzeug1: Fliegt durch die Luft.
  zug1: Fährt auf Schienen.
\`\`\`` },
        { k: 'watch', md: `- **Ein** Befehl – **sechs** verschiedene Antworten.
- Das Programm fragt nie „Bist du eine Katze?". Es ruft bei allen einfach \`bewegen()\` auf. Jedes Objekt weiß selbst, wie es sich bewegt.
- \`dreieck1\` fehlt in der Liste: Figuren haben keine Methode \`bewegen()\`, darum werden sie gar nicht gefragt.
- Polymorphie funktioniert, weil jedes Kind \`bewegen()\` **überschrieben** hat.
- Im **Speicher** siehst du, wie das klappt: Fahr über ein Objekt – seine Klasse im Metaspace leuchtet auf. Dort sucht die JVM bei jedem Aufruf das passende \`bewegen()\` (dynamische Bindung).` }
      ],
      related: [{ id: 'begriff-polymorphie', label: 'Polymorphie' }, { id: 'begriff-ueberschreiben', label: 'Überschreiben' }]
    },
    {
      id: 'demo-kapselung', group: 'vorfuehren', num: 'D9', nav: 'Kapselung testen', type: 'demo',
      title: 'Kapselung testen',
      blocks: [
        { k: 'goal', md: `Du testest, ob man an das Innere des Motors herankommt – und merkst: Es ist geheim, starten kannst du ihn nur auf dem erlaubten Weg.` },
        { k: 'steps', md: `1. Erstelle ein Auto: **Transport** → **\`[[Auto]]\`**. Es erscheint \`auto1\`.
2. Fahre über \`auto1\` und dann über \`Benzinmotor\`. Die Motorkarte \`class Benzinmotor extends Motor\` öffnet sich.
3. Schau dir die Methoden an: oben \`public void starten()\`, darunter drei graue \`private\`-Methoden: \`kraftstoffEinspritzen()\`, \`zuenden()\`, \`kolbenBewegen()\`.
4. Klick neben \`kraftstoffEinspritzen()\` auf **\`[[testen]]\`**. In der Ausgabe erscheint ein roter Fehler.
5. Lies den Hinweis auf der Karte: „Aufgerufen wird nur motorStarten() am Transportobjekt."
6. Klick auf **\`[[Implementierung anzeigen]]\`**. Eine Liste klappt auf:
   1. \`kraftstoffEinspritzen()  →  Kraftstoff wird eingespritzt\`
   2. \`zuenden()  →  Zündfunke zündet das Gemisch\`
   3. \`kolbenBewegen()  →  Kolben beginnen sich zu bewegen\`
7. Jetzt der richtige Weg: Klick in der Karte von \`auto1\` neben \`motorStarten()\` auf **\`[[Ausführen]]\`**.` },
        { k: 'output', md: `\`\`\`console
> Objekt auto1 wurde erstellt.
> motor['#kraftstoffEinspritzen']()
!! Zugriff verweigert – #kraftstoffEinspritzen ist privat. (TypeError)
> auto1.motorStarten()
  Motor gestartet!
  Motor erfolgreich gestartet.
\`\`\`` },
        { k: 'watch', md: `- Der verbotene Weg (**testen**) klappt **nie**. Der richtige Weg (**motorStarten()**) klappt immer.
- Das Verbot ist echt: In JavaScript sind Methoden mit \`#\` vor dem Namen privat. Von außen kommt man nicht heran.
- **Implementierung anzeigen** ist nur zum **Anschauen**. Die Schritte kann man nicht drücken – genau das ist Kapselung.
- Wer das Auto fährt, muss nicht wissen, wie Kraftstoff eingespritzt wird. Ein Knopf reicht.` }
      ],
      related: [{ id: 'begriff-kapselung', label: 'Kapselung' }]
    },
    {
      id: 'demo-nachrichten', group: 'vorfuehren', num: 'D10', nav: 'Message Passing verfolgen', type: 'demo',
      title: 'Message Passing verfolgen',
      blocks: [
        { k: 'goal', md: `Du verfolgst, wie Objekte sich gegenseitig Nachrichten schicken, um eine Aufgabe zu erledigen.` },
        { k: 'steps', md: `1. Erstelle einen Zug: **Transport** → **\`[[Zug]]\`**. Es erscheint \`zug1\`.
2. Fahre über \`zug1\` und klick neben \`motorStarten()\` auf **\`[[Ausführen]]\`**.
3. Lies die Ausgabe Zeile für Zeile:
   - \`> zug1.motorStarten()\` – **deine** Nachricht an den Zug.
   - \`Motor gestartet!\` – die Antwort des **Motors** an den Zug.
   - \`Motor erfolgreich gestartet.\` – die Antwort des **Zugs** an dich.
4. Optional: Öffne die Motorkarte \`Elektromotor\` und klick auf **\`[[Implementierung anzeigen]]\`**. So siehst du, was der Motor nach der Nachricht getan hat.
5. Klick neben \`halten()\` auf **\`[[Ausführen]]\`**. Der Zug hält und schickt seinem Motor die Nachricht \`stoppen()\`.` },
        { k: 'output', md: `\`\`\`console
> Objekt zug1 wurde erstellt.
> zug1.motorStarten()
  Motor gestartet!
  Motor erfolgreich gestartet.
> zug1.halten()
  Zug hält an.
  Motor gestoppt.
\`\`\`

So läuft die Nachricht:
\`\`\`text
Du ──motorStarten()──▶ zug1 ──starten()──▶ Elektromotor
                                              └─ batterieAktivieren()
                                              └─ spannungAnlegen()
                                              └─ rotorDrehen()
\`\`\`` },
        { k: 'watch', md: `- Du schickst nur **eine** Nachricht. Den Rest regeln die Objekte unter sich.
- Jedes Objekt antwortet – darum gibt es zwei Antwortzeilen.
- Auch **Alle bewegen** ist Message Passing: eine Nachricht, viele Empfänger.` }
      ],
      related: [{ id: 'begriff-nachrichten', label: 'Message Passing' }, { id: 'begriff-methode', label: 'Methode' }, { id: 'begriff-komposition', label: 'Komposition & Delegation' }]
    },
    {
      id: 'demo-komposition', group: 'vorfuehren', num: 'D11', nav: 'Komposition entdecken', type: 'demo',
      title: 'Komposition entdecken',
      blocks: [
        { k: 'goal', md: `Du entdeckst, dass ein Fahrzeug einen Motor **hat** – als eigenes Objekt.` },
        { k: 'steps', md: `1. Fahre über **Transport**. Schau dir das Feld \`Motor motor;\` an – sein Typ ist keine Zahl und kein Text, sondern eine **Klasse**: \`Motor\`.
2. Erstelle **\`[[Auto]]\`**, **\`[[Flugzeug]]\`** und **\`[[Zug]]\`**.
3. Fahre über \`auto1\` und dann über sein Feld \`motor\` → Motorkarte **Benzinmotor**: \`typ = "Benzin"\`, \`leistung = 150\` (PS).
4. Fahre über \`flugzeug1\` → **Turbofan**: \`leistung = 120\` (kN).
5. Fahre über \`zug1\` → **Elektromotor**: \`leistung = 5600\` (kW).` },
        { k: 'output', md: `\`\`\`console
> Objekt auto1 wurde erstellt.
> Objekt flugzeug1 wurde erstellt.
> Objekt zug1 wurde erstellt.
\`\`\`` },
        { k: 'watch', md: `- Jedes Fahrzeug **hat einen** Motor. Aber kein Fahrzeug **ist ein** Motor – darum ist das keine Vererbung, sondern **Komposition**.
- Der Motor ist ein **eigenes Objekt** mit eigener Karte, eigenen Feldern und eigenen Methoden.
- Alle drei Fahrzeuge starten ihren Motor mit derselben Methode \`motorStarten()\`. Jedes **delegiert** die Arbeit an seinen eigenen Motor – und jeder Motor macht es anders (siehe **Implementierung anzeigen**).
- Im **Speicher** liegen für jedes Fahrzeug **zwei** Objekte im Heap: das Fahrzeug und sein Motor. Im Feld \`motor\` steht nur die Adresse des Motors.` }
      ],
      related: [{ id: 'begriff-komposition', label: 'Komposition & Delegation' }, { id: 'begriff-nachrichten', label: 'Message Passing' }]
    },
    {
      id: 'demo-wiederverwendung', group: 'vorfuehren', num: 'D12', nav: 'Wiederverwendung ausprobieren', type: 'demo',
      title: 'Wiederverwendung ausprobieren',
      blocks: [
        { k: 'goal', md: `Du probierst aus, dass eine Methode, die nur einmal geschrieben wurde, von allen Kindern benutzt wird.` },
        { k: 'steps', md: `1. Fahre über **Figur**. Achte darauf: \`drehen90()\` hat {{implemented}} – sie ist schon fertig, nicht abstrakt!
2. Erstelle **\`[[Dreieck]]\`**, **\`[[Kreis]]\`** und **\`[[Stern]]\`**.
3. Fahre über \`dreieck1\`. Hier hat \`drehen90()\` das Abzeichen {{geerbt}}.
4. Klick neben \`drehen90()\` auf **\`[[Ausführen]]\`** – bei \`dreieck1\`, \`kreis1\` und \`stern1\`. Die Figuren drehen sich.
5. Klick bei \`dreieck1\` noch dreimal auf **Ausführen**. Das Dreieck dreht sich einmal ganz herum.` },
        { k: 'output', md: `\`\`\`console
> Objekt dreieck1 wurde erstellt.
> Objekt kreis1 wurde erstellt.
> Objekt stern1 wurde erstellt.
> dreieck1.drehen90()
  Dreieck wurde um 90° gedreht (jetzt 90°).
> kreis1.drehen90()
  Kreis wurde um 90° gedreht (jetzt 90°).
> stern1.drehen90()
  Stern wurde um 90° gedreht (jetzt 90°).
> dreieck1.drehen90()
  Dreieck wurde um 90° gedreht (jetzt 180°).
> dreieck1.drehen90()
  Dreieck wurde um 90° gedreht (jetzt 270°).
> dreieck1.drehen90()
  Dreieck wurde um 90° gedreht (jetzt 0°).
\`\`\`` },
        { k: 'watch', md: `- \`drehen90()\` steht nur **einmal** im Code (in \`Figur\`) – und alle drei Figuren können es.
- Beim Kreis siehst du die Drehung vielleicht kaum – er ist ja rund! Aber die Ausgabe zeigt: Die Methode lief trotzdem.
- Jede Figur merkt sich ihren **eigenen** Winkel: \`dreieck1\` ist bei 0°, \`kreis1\` noch bei 90°. Der Winkel ist privat – nur \`drehen90()\` darf ihn ändern (das ist wieder Kapselung).` }
      ],
      related: [{ id: 'begriff-wiederverwendung', label: 'Wiederverwendung' }, { id: 'begriff-vererbung', label: 'Vererbung' }]
    },
    {
      id: 'demo-null', group: 'vorfuehren', num: 'D13', nav: 'Objekte löschen (null)', type: 'demo',
      title: 'Objekte löschen mit null',
      blocks: [
        { k: 'goal', md: `Du siehst, was passiert, wenn ein Name auf kein Objekt mehr zeigt.` },
        { k: 'steps', md: `1. Klick auf **\`[[Alle löschen]]\`** und **\`[[Leeren]]\`**.
2. Erstelle zwei Katzen: **Tier** → zweimal **\`[[Katze]]\`**. Es gibt \`katze1\` und \`katze2\`.
3. Fahre über \`katze1\` und klick ganz unten auf **\`[[katze1 = null]]\`**. \`katze1\` verschwindet, \`katze2\` bleibt.
4. Klick noch einmal auf **\`[[Katze]]\`**. Die neue Katze heißt \`katze3\` – nicht \`katze1\`!
5. Klick auf **\`[[Alle löschen]]\`**. Alle Objekte sind weg.
6. Klick noch einmal auf **\`[[Katze]]\`**. Jetzt heißt sie wieder \`katze1\`.` },
        { k: 'output', md: `\`\`\`console
> Objekt katze1 wurde erstellt.
> Objekt katze2 wurde erstellt.
> katze1 = null
  Objekt katze1 wurde gelöscht.
> Objekt katze3 wurde erstellt.
> Alle löschen
  2 Objekt(e) wurden gelöscht.
> Objekt katze1 wurde erstellt.
\`\`\`` },
        { k: 'watch', md: `- \`katze1 = null\` heißt: „Der Name \`katze1\` zeigt auf nichts mehr." Das Objekt ist danach nicht mehr erreichbar.
- Das Löschen von \`katze1\` betrifft \`katze2\` **nicht** – jedes Objekt ist unabhängig.
- Solange noch eine Katze lebt, wird kein Name doppelt vergeben. Erst wenn keine mehr da ist, beginnt die Zählung neu.
- Im **Speicher** sind nach \`katze1 = null\` die Variable im Stack und das Objekt im Heap weg. Die Klasse \`Katze\` bleibt im Metaspace.` }
      ],
      related: [{ id: 'begriff-null', label: 'Referenz & null' }]
    },
    {
      id: 'demo-speicher', group: 'vorfuehren', num: 'D14', nav: 'In den Speicher schauen', type: 'demo',
      title: 'In den Speicher schauen',
      blocks: [
        { k: 'goal', md: `Du schaust nach, wo Variablen, Objekte und Klassen im Speicher der JVM liegen.` },
        { k: 'steps', md: `1. Klick auf **\`[[Alle löschen]]\`** und in der Ausgabe auf **\`[[Leeren]]\`**.
2. Klick unten links auf den Knopf mit dem Speicher-Symbol. (Wenn du darüberfährst, steht da: „Einen Blick in den Speicher werfen".) Du siehst: Stack und Heap sind leer – aber im Metaspace stehen schon alle Klassen.
3. Schließ das Fenster mit **×** und erstelle **Tier** → **\`[[Katze]]\`** und **Transport** → **\`[[Auto]]\`**.
4. Öffne den Speicher wieder. Du siehst: Im Stack stehen \`Katze katze1\` und \`Auto auto1\`. Im Heap stehen **drei** Kästen: \`katze1\`, \`auto1\` und sein \`Benzinmotor\`.
5. Fahr im Stack über die Adresse von \`katze1\`. Die Variable, das Objekt und die Klasse \`Katze\` leuchten auf.
6. Fahr im Heap über die Adresse beim Feld \`motor\` von \`auto1\`. Jetzt leuchten der Benzinmotor und seine Klasse auf.
7. Schließ das Fenster und klick bei \`auto1\` neben \`motorStarten()\` auf **\`[[Ausführen]]\`**. Öffne gleich danach den Speicher: Oben im Stack liegt kurz der Frame \`Auto.motorStarten()\`, und beim Motor steht jetzt \`laeuft = true\`.
8. Schließ das Fenster, klick bei \`katze1\` auf **\`[[katze1 = null]]\`** und öffne den Speicher noch einmal.` },
        { k: 'output', md: `\`\`\`console
> Objekt katze1 wurde erstellt.
> Objekt auto1 wurde erstellt.
> auto1.motorStarten()
  Motor gestartet!
  Motor erfolgreich gestartet.
> katze1 = null
  Objekt katze1 wurde gelöscht.
\`\`\`` },
        { k: 'watch', md: `- Der Metaspace ändert sich nie: Die Klassen sind da, bevor das erste Objekt gebaut wird, und bleiben, wenn alle Objekte weg sind.
- Ein Auto mit Motor sind **zwei** Objekte im Heap, aber nur **eine** Variable im Stack. An den Motor kommt man nur über das Auto.
- Der Frame von \`motorStarten()\` bleibt nur, solange die Startanimation einmal abläuft (etwa zwei Sekunden). Verpasst? Kein Problem – das Feld \`laeuft\` zeigt trotzdem, dass die Methode gelaufen ist.
- Nach \`katze1 = null\` sind Variable und Objekt weg. Die Klasse \`Katze\` bleibt im Metaspace.` }
      ],
      related: [{ id: 'begriff-speicher', label: 'Speicher (JVM)' }, { id: 'begriff-objekt', label: 'Objekt' }, { id: 'begriff-null', label: 'Referenz & null' }]
    }
  ]
};
