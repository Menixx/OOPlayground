// Texts of the guide page (English) – taken from the spec "OOPlayground_Docs_TZ.md", section 10.
// Auszeichnung in md-Feldern (wird in src/docs/render.js umgewandelt):
//   `code` · [[UI-Chip]] · {{tag}} · **fett** · *kursiv* · [Text](#id) · Listen · Tabellen
//   ```console … ``` = Ausgabe (Zeile mit "!! " = Fehler) · ```java = Codebeispiel (nur Java) · ```text = Schema
// Blocktypen (k): md | zones | short | life | inApp | remember | code | goal | before | steps | output | watch
export default {
  groups: [
    { id: 'teil-oberflaeche', key: 'oberflaeche', nav: 'Part 1: The interface' },
    { id: 'teil-begriffe', key: 'begriffe', nav: 'Part 2: The concepts' },
    { id: 'teil-vorfuehren', key: 'vorfuehren', nav: 'Part 3: Try it yourself' }
  ],
  sections: [
    {
      id: 'start', group: 'start', num: null, nav: 'Welcome', type: 'intro',
      title: 'Welcome to OOPlayground!',
      cards: [
        { id: 'teil-oberflaeche', title: 'The interface', text: 'What is what?' },
        { id: 'teil-begriffe', title: 'The concepts', text: 'What does it mean?' },
        { id: 'teil-vorfuehren', title: 'Try it yourself', text: 'How do I try it?' }
      ],
      blocks: [
        { k: 'md', md: `Here you'll learn how programs are built from **objects**. This is called **object-oriented programming**, or **OOP** for short.

Imagine a program is a little world. In this world there are things: cats, cars, stars. Each thing knows something about itself and can do something. That's exactly how OOP thinks.

Important: everything you click in OOPlayground **really happens**. Behind every button there is real JavaScript code. Nothing is just a picture.

This page has three parts:

1. **The interface** – What do you see in OOPlayground, and what is it for?
2. **The concepts** – The most important OOP words, explained very simply.
3. **Try it yourself** – Step-by-step instructions: experience each concept yourself in OOPlayground.

**Tip:** Open OOPlayground in a second window and try everything as you read. Each concept has a **▶ Try it yourself** button. It takes you to the matching instructions.

Note: the class names in the app (\`Tier\`, \`Katze\`, \`Auto\` …) are always German, because they are names in the program code. On this page we translate them in brackets the first time they appear.` }
      ]
    },
    {
      id: 'ui-ueberblick', group: 'oberflaeche', num: 'O1', nav: 'Overview', type: 'ui',
      title: 'OOPlayground at a glance',
      blocks: [
        { k: 'md', md: `OOPlayground has four areas. From top to bottom:

1. **Header** – the name, the language and the button to this guide.
2. **Abstract classes** – three blueprints: Tier (animal), Transport and Figur (shape).
3. **Created objects** – all the things you have built from the blueprints.
4. **Output** – the program's diary. It shows what has happened.` },
        { k: 'zones' },
        { k: 'md', md: `How to play: look at a blueprint, build objects from it, give the objects commands – and read their answers in the output.

And if you want to know what happens inside: a small button at the bottom left opens [memory](#ui-speicher).` }
      ],
      related: [{ id: 'begriff-klasse', label: 'Class' }, { id: 'begriff-objekt', label: 'Object' }]
    },
    {
      id: 'ui-kopfzeile', group: 'oberflaeche', num: 'O2', nav: 'Header', type: 'ui',
      title: 'The header',
      blocks: [
        { k: 'md', md: `At the very top you see the name **OOPlayground**. On the right you'll find:

- **The \`[[? Guide]]\` button** – it opens this page in a new tab.
- **The round color-scheme button** – each click switches in turn: ☀ light, ☾ dark and 🖥 like the system (the page then follows your computer’s setting).
- **The language switch \`[[EN | DE]]\`** – it switches all texts between English and German. The names of classes and objects (for example \`Katze\` or \`auto1\`) always stay German. That's because they are names in the program code – and code doesn't get translated.

OOPlayground remembers your language. If you switch it there, it also switches on this guide page.` }
      ]
    },
    {
      id: 'ui-klassen', group: 'oberflaeche', num: 'O3', nav: 'Abstract classes', type: 'ui',
      title: 'The "Abstract classes" area',
      blocks: [
        { k: 'md', md: `Here you see three symbols: **Tier** (animal), **Transport** and **Figur** (shape). Each symbol is an **abstract class** – a blueprint that is unfinished on purpose.

- **Tier** describes everything animals have in common. Its children: Katze (cat), Krokodil (crocodile), Mensch (human), Eule (owl).
- **Transport** describes everything vehicles have in common. Its children: Auto (car), Flugzeug (plane), Zug (train).
- **Figur** describes everything geometric shapes have in common. Its children: Dreieck (triangle), Kreis (circle), Stern (star).

Move your mouse over a symbol. The **class card** opens with all the details.` }
      ],
      related: [{ id: 'begriff-klasse', label: 'Class' }, { id: 'begriff-abstrakte-klasse', label: 'Abstract class' }, { id: 'begriff-abstraktion', label: 'Abstraction' }]
    },
    {
      id: 'ui-klassenkarte', group: 'oberflaeche', num: 'O4', nav: 'Class card', type: 'ui',
      title: 'The class card',
      blocks: [
        { k: 'md', md: `The class card shows you the blueprint. At the top it says, for example, \`abstract class Tier\`. Below that there are four parts:

**1. Fields** – What every animal has. For example \`name\`, \`anzahlBeine\` (number of legs) or \`kannFliegen\` (can fly). Only \`name\` already has a value: the placeholder \`"Unbenannt"\` (unnamed). The other fields are empty. The blueprint only says: "This exists." Exactly how many legs – only the finished animal knows that.

**2. Methods** – What every animal can do. Each method has a badge:
- {{abstract}} – This ability exists, but **how** it works isn't written here yet. Each child has to decide that itself. Example: \`essen()\` (eat).
- {{implemented}} – This ability is already finished and works the same for all children. Example: \`halten()\` (stop) in Tier, or \`drehen90()\` (rotate by 90°) in Figur.

**3. Subclasses** – The children of this class, as buttons: for example \`[[Katze]]\`, \`[[Krokodil]]\`, \`[[Mensch]]\`. When you hover over one, it says **Instantiate**. One click builds a new object. It appears under **Created objects**.

**4. The \`[[new Tier()]]\` button** – It tries to build an object directly from the abstract class. Its tooltip says: **Instantiate directly (forbidden)**. And indeed: it doesn't work, an error appears in the output. That's on purpose!

**How to read the card:** everything is written the way it would look in the Java programming language. First comes the **type**, then the **name**:
- \`String\` = text, \`int\` = whole number, \`boolean\` = yes (\`true\`) or no (\`false\`).
- \`public\` means: anyone may use this method. \`void\` means: the method doesn't give back a value, it just does something.` }
      ],
      related: [{ id: 'begriff-abstrakte-klasse', label: 'Abstract class' }, { id: 'begriff-feld', label: 'Field & state' }, { id: 'begriff-methode', label: 'Method' }, { id: 'begriff-instanziierung', label: 'Instantiation' }, { id: 'begriff-vererbung', label: 'Inheritance' }]
    },
    {
      id: 'ui-objekte', group: 'oberflaeche', num: 'O5', nav: 'Created objects', type: 'ui',
      title: 'The "Created objects" area',
      blocks: [
        { k: 'md', md: `All the objects you have built live here. Each little box is **one object**: it has a picture and a name, for example \`katze1\`.

**The names count up:** if you build three cats, they're called \`katze1\`, \`katze2\` and \`katze3\`. That way you can easily tell them apart.

**Movement:** when you give an animal or a vehicle a command, its picture moves – the cat eats, the car drives off. Shapes rotate when you run \`drehen90()\`.

At the top of the area there are two buttons:
- **\`[[Move all]]\`** – tells all animals and vehicles at the same time: "Move!" Each one moves in its own way. The button only becomes active when there is at least one animal or vehicle. Shapes don't join in – they have no \`bewegen()\` (move) method.
- **\`[[Delete all]]\`** – removes all objects at once.

When the area is empty, a small hint tells you how to build your first object.` }
      ],
      related: [{ id: 'begriff-objekt', label: 'Object' }, { id: 'begriff-instanziierung', label: 'Instantiation' }, { id: 'begriff-polymorphie', label: 'Polymorphism' }, { id: 'begriff-null', label: 'Reference & null' }]
    },
    {
      id: 'ui-objektkarte', group: 'oberflaeche', num: 'O6', nav: 'Object card', type: 'ui',
      title: 'The object card',
      blocks: [
        { k: 'md', md: `Move your mouse over an object, for example \`katze1\`. Its card opens. At the top it says \`class Katze katze1\`. That means: "I am the object \`katze1\`, built from the blueprint \`Katze\`."

**Fields** – Now all fields have a value, for example \`int anzahlBeine = 4;\`. Each field has a badge:
- {{inherited}} – This field comes from the parent class (here: Tier).
- {{own}} – Only this class has this field. For the cat it's \`schnurrt\` (purrs).

**Methods** – There are badges here too:
- {{overridden}} – The class has written its own version of this method. Example: \`essen()\` – the cat eats in its own way.
- {{inherited}} – The method comes unchanged from the parents. Example: \`halten()\`.

Next to every method there is a **\`[[Run]]\`** button. One click really calls the method. The answer appears in the **Output**.

**The \`[[katze1 = null]]\` button** at the very bottom deletes this one object.

**Special for vehicles:** the \`motor\` field doesn't show text but a name like \`Benzinmotor\` (petrol engine). Hover over it – a second card opens, the **engine card**. That's because the engine is an object of its own.

**Good to know:** after clicking **Run**, the card is redrawn. An open engine card closes when that happens. Just hover over the engine name again.` }
      ],
      related: [{ id: 'begriff-feld', label: 'Field & state' }, { id: 'begriff-methode', label: 'Method' }, { id: 'begriff-vererbung', label: 'Inheritance' }, { id: 'begriff-ueberschreiben', label: 'Overriding' }, { id: 'begriff-komposition', label: 'Composition' }]
    },
    {
      id: 'ui-motorkarte', group: 'oberflaeche', num: 'O7', nav: 'Engine card', type: 'ui',
      title: 'The engine card',
      blocks: [
        { k: 'md', md: `Each vehicle has its own engine:

| Vehicle | Engine | Power |
|---|---|---|
| Auto (car) | Benzinmotor (petrol engine) | 150 PS (hp) |
| Flugzeug (plane) | Turbofan | 120 kN |
| Zug (train) | Elektromotor (electric motor) | 5600 kW |

At the top of the card it says, for example, \`class Benzinmotor extends Motor\`. That means: the petrol engine is a kind of engine.

**Fields:** \`typ\` (what kind of engine), \`leistung\` (how powerful) and \`laeuft\` (is it running right now? \`true\` = yes, \`false\` = no).

**Methods:**
- \`public void starten()\` (start) – the engine's **public** button. Anyone may press it.
- Three \`private\` methods in grey, for example \`kraftstoffEinspritzen()\` (inject fuel). These are the **secret steps** inside the engine. Next to each one there is a **\`[[test]]\`** button (tooltip: "Try to access from outside"). It tries to call the secret step from outside – and that always fails: the output says "Access denied".

**Hint on the card:** "Only motorStarten() is called on the transport object." That means: you don't start the engine yourself. You tell the car – and the car tells its engine.

**The \`[[Show implementation]]\` button** opens a list. It shows which secret steps the engine performs when starting, and in which order. This is only for **looking** – you can't press the steps. **Hide implementation** closes the list again.` }
      ],
      related: [{ id: 'begriff-kapselung', label: 'Encapsulation' }, { id: 'begriff-komposition', label: 'Composition & delegation' }, { id: 'begriff-nachrichten', label: 'Message passing' }]
    },
    {
      id: 'ui-ausgabe', group: 'oberflaeche', num: 'O8', nav: 'Output', type: 'ui',
      title: 'The output',
      blocks: [
        { k: 'md', md: `The output is the **program's diary**. Everything that happens is written here. There are three kinds of lines:

- **Lines starting with \`>\`** – What was done. For example a command like \`> katze1.essen()\` or a message like \`> Object katze1 was created.\`
- **Indented lines** – The object's answer. For example \`The cat eats fish.\`
- **Red lines** – An error. Something wasn't allowed, for example building an object from an abstract class.

This is what it looks like:

\`\`\`console
> Object katze1 was created.
> katze1.essen()
  The cat eats fish.
> new Tier()
!! Abstract classes cannot be instantiated.
\`\`\`

The **\`[[Clear]]\`** button empties the output. Your objects stay where they are.` }
      ],
      related: [{ id: 'begriff-methode', label: 'Method' }, { id: 'begriff-nachrichten', label: 'Message passing' }]
    },
    {
      id: 'ui-speicher', group: 'oberflaeche', num: 'O9', nav: 'Memory', type: 'ui',
      title: 'Memory – a look inside the JVM',
      blocks: [
        { k: 'md', md: `In the bottom left corner there's a small button with a **memory icon**. When you hover over it, it says: **Take a look into memory**. A click opens the **JVM memory** window.

OOPlayground runs in JavaScript. The window shows how the same program would sit in memory in **Java**. It has three coloured columns:

| Column | What's in it? |
|---|---|
| {{Stack}} | The frame \`main(String[] args)\` with one variable for each object, for example \`Katze katze1 = @1159cc2d\`. When you click **Run**, that method's frame sits on top, for example \`Katze.essen(T dauer)\` with \`this\` and \`dauer\`. It stays as long as the method runs – with \`"ewig"\` (forever) until you call \`halten()\` or delete the object. |
| {{Heap}} | Every object as a box: class, address, name and all fields with their values. An engine is a box of its own, for example \`auto1.motor\`. |
| {{Metaspace}} | All classes with \`extends\`, their own fields and methods. They are there before you build the first object, and they never change. |

**Highlighting:** hover over an object or an address. Then everything that belongs to it lights up: the variable on the stack, the object in the heap and its class in the metaspace. If the class is out of sight, the metaspace scrolls there by itself.

**Live:** the window changes along with the program. New objects light up briefly, changed values (for example \`laeuft = true\`) appear straight away, deleted objects disappear.

**Addresses:** numbers like \`@1159cc2d\` are made up. It looks a bit like this when Java prints an object – Java never shows real memory addresses.

You can close the window with **×**, with the **Esc** key or by clicking next to it. The button only appears on larger screens, not on phones.` }
      ],
      related: [{ id: 'begriff-speicher', label: 'Memory (JVM)' }, { id: 'begriff-objekt', label: 'Object' }, { id: 'begriff-polymorphie', label: 'Polymorphism' }, { id: 'begriff-null', label: 'Reference & null' }]
    },
    {
      id: 'ui-legende', group: 'oberflaeche', num: 'O10', nav: 'Colours & badges', type: 'ui',
      title: 'Colours and badges',
      blocks: [
        { k: 'md', md: `In OOPlayground every colour means something. Here's the overview:

**Colours in the cards**

| What it looks like | Meaning |
|---|---|
| Blue name, e.g. \`anzahlBeine\` | a **field** (something the object knows) |
| Green name, e.g. \`essen()\` | a **method** (something the object can do) |
| Purple name | an **abstract** method (no content yet) |
| Grey name | a **private** method (secret, only for the engine itself) |
| Orange word before the name, e.g. \`int\` | the **type** (what kind of value fits in) |
| Pink words \`public\`, \`private\`, \`abstract\` | who may use the method, or whether it is abstract |
| Grey comments, e.g. \`// km/h\` | the **unit** of a value |

**Badges**

| Badge | Meaning |
|---|---|
| {{abstract}} | The method has no content yet. Each child must write it itself. |
| {{implemented}} | The method is finished and already works. |
| {{inherited}} | Comes unchanged from the parent class. |
| {{own}} | Exists only in this class. |
| {{overridden}} | The class has written its own version of the method. |

**Colours in memory**

| Area | What's stored there? |
|---|---|
| {{Stack}} | frames of the running methods with their variables and references |
| {{Heap}} | the objects with their fields; addresses like \`@1159cc2d\` are orange too |
| {{Metaspace}} | the classes (blueprints) |` }
      ],
      related: [{ id: 'begriff-feld', label: 'Field & state' }, { id: 'begriff-methode', label: 'Method' }, { id: 'begriff-vererbung', label: 'Inheritance' }, { id: 'begriff-kapselung', label: 'Encapsulation' }]
    },
    {
      id: 'begriffe-ueberblick', group: 'begriffe', num: 'B0', nav: 'The four pillars', type: 'intro',
      title: 'The four pillars of OOP',
      blocks: [
        { k: 'md', md: `A house stands on pillars. So does OOP – on four of them. If you understand these four, you understand the idea of OOP:

| Pillar | In one sentence |
|---|---|
| [Abstraction](#begriff-abstraktion) | Show only what matters, leave out the rest. |
| [Inheritance](#begriff-vererbung) | Children get everything from their parents – plus something of their own. |
| [Polymorphism](#begriff-polymorphie) | One command, and everyone does it their own way. |
| [Encapsulation](#begriff-kapselung) | The inside is secret; you only use the buttons you're allowed to. |

To understand the pillars you need a few basic words. It's best to start with **Object** and **Class** and then read in order.

**New: In memory.** Every concept has an **In memory** block. It explains what happens in the JVM's memory – on the {{Stack}}, in the {{Heap}} and in the {{Metaspace}}. What these three areas are is explained in [Memory](#begriff-speicher).` }
      ]
    },
    {
      id: 'begriff-objekt', group: 'begriffe', num: 'B1', nav: 'Object', type: 'concept', demo: 'demo-instanziieren',
      title: 'What is an object?',
      blocks: [
        { k: 'short', md: `An object is a thing in a program that **knows** something and **can do** something.` },
        { k: 'life', md: `🐈 Think of a real cat. It knows things about itself: it has four legs and a tail. And it can do things: eat and walk. In a program it's exactly the same – except the cat is made of code.` },
        { k: 'inApp', md: `Each little box under **Created objects** is an object, for example \`katze1\` or \`auto1\`. Hover over it. Under **Fields** you see what it knows. Under **Methods** you see what it can do.` },
        { k: 'memory', md: `An object **lives in the {{Heap}}**. There it has its own place with an **address**, for example \`@1159cc2d\`, and that's where all its fields are.

The name \`katze1\` is **not** the object itself. It's a small variable on the {{Stack}} that only holds the address – like a note with a house number on it.

Every object also knows which blueprint it was built from: it points to its class in the {{Metaspace}}. In the **memory** window this is shown on every object as \`→ Katze.class\`. What stack, heap and metaspace are exactly is explained in [Memory](#begriff-speicher).` },
        { k: 'remember', md: `Object = knowing + doing.` }
      ]
    },
    {
      id: 'begriff-klasse', group: 'begriffe', num: 'B2', nav: 'Class', type: 'concept', demo: 'demo-instanziieren',
      title: 'What is a class?',
      blocks: [
        { k: 'short', md: `A class is a **blueprint** for objects.` },
        { k: 'life', md: `🍪 Think of a cookie cutter. You can't eat the cutter itself. But with it you can make lots and lots of cookies. They all have the same shape – and yet each one is its own cookie. The cutter is the class. The cookies are the objects.` },
        { k: 'inApp', md: `\`Katze\` (cat) is a class. \`katze1\` and \`katze2\` are objects built from the \`Katze\` blueprint. The class says: "Every cat has legs and can eat." The object says: "I am **this particular** cat right here."` },
        { k: 'memory', md: `A class lives in the {{Metaspace}} – and only **once**, no matter how many objects you build. \`katze1\` and \`katze2\` are both in the {{Heap}} and point to the **same** class \`Katze\`.

In Java the JVM loads a class the first time it's needed. After that it stays and doesn't change any more. In OOPlayground all classes are in the metaspace right from the start.` },
        { k: 'remember', md: `Class = blueprint. Object = the thing that was built.` },
        { k: 'code', md: `\`\`\`java
class Katze extends Tier {          // the blueprint
    public void essen() {
        System.out.println("The cat eats fish.");
    }
}

Katze katze1 = new Katze();         // one thing built from the blueprint
\`\`\`` }
      ]
    },
    {
      id: 'begriff-speicher', group: 'begriffe', num: 'B3', nav: 'Memory (JVM)', type: 'concept', demo: 'demo-speicher',
      title: 'Memory: stack, heap and metaspace',
      blocks: [
        { k: 'short', md: `When a Java program runs, the **Java Virtual Machine** (JVM) puts everything into its **memory**. Three areas matter to us: the {{Stack}}, the {{Heap}} and the {{Metaspace}}.` },
        { k: 'life', md: `🏭 Imagine a workshop. On the wall there's a shelf of **blueprints** – that's the metaspace. In the big hall stand the **things that were built** – that's the heap. And on the desk there's a **pile of notes**: the note for the job you're doing right now is always on top. It says, for example: "katze1 is in the hall at spot 7." That's the stack.` },
        { k: 'inApp', md: `At the bottom left of OOPlayground there's a small button with a memory icon. A click opens the **JVM memory** window with three coloured columns:

- {{Stack}} – one **frame** per method call with local variables, parameters and references. At the very bottom is the frame of \`main(String[] args)\`.
- {{Heap}} – all **objects** with their fields. Every object has an **address**, for example \`@1159cc2d\`.
- {{Metaspace}} – the **description of the classes**: fields, methods and who they inherit from.

Hover over an object or an address. Then everything that belongs to it lights up: the variable on the stack, the object in the heap and its class in the metaspace.

Every concept on this page has an **In memory** block. It tells you what happens in memory for that concept.` },
        { k: 'remember', md: `Metaspace = blueprints. Heap = objects. Stack = what is running right now.` },
        { k: 'code', md: `\`\`\`java
public static void main(String[] args) {   // frame of main() on the stack
    Katze katze1 = new Katze();
    // katze1      → variable on the stack, only holds the address
    // new Katze() → the object in the heap
    // Katze       → the blueprint in the metaspace
}
\`\`\`` }
      ]
    },
    {
      id: 'begriff-feld', group: 'begriffe', num: 'B4', nav: 'Field & state', type: 'concept', demo: 'demo-zustand',
      title: 'What are fields, and what is state?',
      blocks: [
        { k: 'short', md: `A **field** is a property of an object – a little compartment with a name and a value. All the values together are called the object's **state**.` },
        { k: 'life', md: `📋 Think of a profile card: "Name: Cat. Legs: 4. Can fly: no." Each line is a field. And the state can change: a lamp is sometimes on, sometimes off. An engine is sometimes running, sometimes not.` },
        { k: 'inApp', md: `Fields are listed in every card under **Fields**, and their names are blue. Example: \`int anzahlBeine = 4;\`. Before the name comes the **type** – it says what fits into the compartment:
- \`String\` – a piece of text, e.g. \`"Katze"\`
- \`int\` – a whole number, e.g. \`4\`
- \`boolean\` – yes or no: \`true\` or \`false\`

The state changes, for example, with the engine: before starting it shows \`laeuft = false\` (running = false), afterwards \`laeuft = true\`. And every object has its **own** state: if you start the engine of \`auto1\`, the engine of \`auto2\` still isn't running.` },
        { k: 'memory', md: `The values of the fields are stored **inside the object** in the {{Heap}}. Every object has its **own** compartments – that's why nothing changes for \`auto2\` when the engine of \`auto1\` starts. The {{Metaspace}} only says **which** fields there are and what type they have – but no values.

Small values like \`4\` or \`true\` sit directly in the compartment. If the value is an object – for example the field \`motor\` –, the compartment only holds an **address**. It points to another object in the heap.

Fields marked \`static\` (there are none in OOPlayground) don't belong to an object but to the class. There is only **one** value of them for all objects.` },
        { k: 'remember', md: `Fields = what an object knows. State = the values right now.` }
      ]
    },
    {
      id: 'begriff-methode', group: 'begriffe', num: 'B5', nav: 'Method', type: 'concept', demo: 'demo-methode',
      title: 'What is a method?',
      blocks: [
        { k: 'short', md: `A method is something an object can **do** – a command it understands.` },
        { k: 'life', md: `🐕 A dog understands "Sit!". When you say it, the dog sits down. "Sit" is like a method: a command the dog knows and can carry out.` },
        { k: 'inApp', md: `Methods are listed in every card under **Methods**. Their names are green and end with brackets: \`essen()\` (eat), \`bewegen()\` (move), \`motorStarten()\` (start engine). With the **Run** button you call a method. The object then does something and answers in the **Output**. Some methods change the state while doing so – for example, \`motorStarten()\` starts the engine.` },
        { k: 'memory', md: `The code of a method lives **once** in the {{Metaspace}}, with its class – not in every object. So a hundred cats share one single \`essen()\`.

When you call a method, the JVM puts a new **frame** on top of the {{Stack}}. It holds \`this\` (the address of the object that is working right now), the parameters and the local variables. When the method is done, the frame is taken away again. In the **memory** window, after **Run** you briefly see the frame \`Katze.essen()\` above the frame of \`main()\`.

How does the JVM know **which** \`essen()\` to use? It looks at the object in the {{Heap}}, checks which class it belongs to and picks the matching version there. This is called **dynamic dispatch** – more about it in [Polymorphism](#begriff-polymorphie).` },
        { k: 'remember', md: `Method = what an object can do. Calling it = "Do it now!"` },
        { k: 'code', md: `\`\`\`java
katze1.essen();   // call the method
// output: The cat eats fish.
\`\`\`` }
      ]
    },
    {
      id: 'begriff-instanziierung', group: 'begriffe', num: 'B6', nav: 'Instantiation & constructor', type: 'concept', demo: 'demo-instanziieren',
      title: 'What does instantiation mean?',
      blocks: [
        { k: 'short', md: `To **instantiate** means to build a real object from a class. The finished object is called an **instance**.` },
        { k: 'life', md: `🍪 You press the cookie cutter into the dough – and there's a new cookie. Every time you press, a **new** cookie appears.` },
        { k: 'inApp', md: `Open the class card of **Tier** and click **Katze** under **Subclasses**. In the program this runs \`new Katze()\`. A new object appears: \`katze1\`. Click again and you get \`katze2\`. Both are cats – but two different objects.

**The constructor:** while an object is being built, a special method runs automatically: the **constructor**. It fills the fields with starting values, for example \`name = "Katze"\` and \`anzahlBeine = 4\`. That's why the fields in the object card are already filled in – while in the class card of Tier they are still empty.` },
        { k: 'memory', md: `\`Katze katze1 = new Katze();\` happens in four steps:

1. \`new\` takes the blueprint \`Katze\` from the {{Metaspace}}.
2. Space for **all** fields is reserved in the {{Heap}} – the ones inherited from Tier and the cat's own. At first they hold default values: \`0\`, \`false\` or \`null\`.
3. The constructor runs – with its own frame on the {{Stack}} – and fills the fields with starting values.
4. The address of the new object goes into the variable \`katze1\` on the {{Stack}}.

In the **memory** window the new variable and the new object light up briefly after the click.` },
        { k: 'remember', md: `\`new\` + class = new object.` },
        { k: 'code', md: `\`\`\`java
Katze katze1 = new Katze();  // instance no. 1
Katze katze2 = new Katze();  // instance no. 2 – a different object

class Katze extends Tier {
    boolean schnurrt;

    Katze() {                // the constructor
        super();             // first build the Tier part
        this.name = "Katze";
        this.anzahlBeine = 4;
        this.schnurrt = true;
    }
}
\`\`\`` }
      ]
    },
    {
      id: 'begriff-abstrakte-klasse', group: 'begriffe', num: 'B7', nav: 'Abstract class', type: 'concept', demo: 'demo-abstrakt',
      title: 'What is an abstract class?',
      blocks: [
        { k: 'short', md: `An abstract class is a blueprint that is **unfinished on purpose**. You can't build an object from it – only from its children.` },
        { k: 'life', md: `🦁 If someone says "Bring me an animal!", you immediately ask: "Which one?" There's no such thing as "just an animal". There are only cats, crocodiles, humans … "Animal" is an **idea**. It describes what all animals have in common.` },
        { k: 'inApp', md: `\`Tier\` (animal), \`Transport\` and \`Figur\` (shape) are abstract. That's why their cards say \`abstract class\`. The \`new Tier()\` button tries to build an animal directly anyway – and the output reports an error: "Abstract classes cannot be instantiated."

**Abstract methods:** a method with the purple {{abstract}} badge only has a name, but no content yet. With it the class says: "Every animal **must** be able to eat – but **how** is up to each child." The cat eats fish, the crocodile eats meat, the human eats pizza.` },
        { k: 'memory', md: `\`Tier\` has its place in the {{Metaspace}} too: the children need its fields and its finished methods such as \`halten()\`. But in the {{Heap}} you will **never** find an object of class \`Tier\` – only cats, crocodiles, humans and owls.

For an abstract method like \`essen()\` the metaspace only holds the name, but no code. The children provide the code.` },
        { k: 'remember', md: `Abstract = just an idea, not finished yet. Only the children finish it.` },
        { k: 'code', md: `\`\`\`java
abstract class Tier {                // "abstract" = unfinished on purpose
    String name = "Unbenannt";
    int anzahlBeine;

    public abstract void essen();    // just the name, no content yet

    public void halten() {           // already finished – the same for all children
        System.out.println(name + " stops.");
    }
}

Tier tier = new Tier();   // ✗ error: Tier is abstract and cannot be instantiated
\`\`\`` }
      ]
    },
    {
      id: 'begriff-abstraktion', group: 'begriffe', num: 'B8', nav: 'Abstraction', type: 'concept', pillar: 1, demo: 'demo-abstraktion',
      title: 'Abstraction',
      overline: 'Pillar 1 of 4',
      blocks: [
        { k: 'short', md: `Abstraction means showing only what **matters** and leaving out unimportant details.` },
        { k: 'life', md: `🗺️ On a map, roads are just lines. Trees, cars and houses are missing. And yet you find your way – even more easily! The map only shows what you need to find it.` },
        { k: 'inApp', md: `The class \`Transport\` only says the most important things about **all** vehicles: they have a top speed, wheels and an engine. They can start the engine and move. Whether it's a car, a plane or a train doesn't matter here. Anyone working with a vehicle only needs to know this.

So an abstract class is a tool for abstraction: it collects what everyone has in common and leaves the details for later.` },
        { k: 'memory', md: `A variable on the {{Stack}} may have a general type: \`Transport t = new Auto();\`. In the {{Heap}} there is still a completely normal car with all its fields.

The variable's type is like a pair of **glasses**: through the "Transport" glasses you only see what all vehicles have in common. The object itself doesn't get any smaller. (In OOPlayground the variables always have the exact type, for example \`Auto auto1\`.)` },
        { k: 'remember', md: `Abstraction = What do they all have in common? The rest comes later.` }
      ]
    },
    {
      id: 'begriff-vererbung', group: 'begriffe', num: 'B9', nav: 'Inheritance', type: 'concept', pillar: 2, demo: 'demo-vererbung',
      title: 'Inheritance',
      overline: 'Pillar 2 of 4',
      blocks: [
        { k: 'short', md: `Inheritance means a class automatically gets everything from its **parent class** – and can add things of its own.` },
        { k: 'life', md: `👨‍👧 Maybe you inherited your eye colour from your mum. You don't have to "make" it yourself – you just have it. But you also have things that are all your own, like your favourite hobby.` },
        { k: 'inApp', md: `\`Katze\` (cat) inherits from \`Tier\` (animal). In code you write: \`class Katze extends Tier\`. In the object card of \`katze1\` you can see this from the badges:
- Fields like \`anzahlBeine\` (number of legs) or \`hatSchwanz\` (has a tail) have {{inherited}} – they come from Tier.
- The field \`schnurrt\` (purrs) has {{own}} – only the cat has it.

The parent is called the **superclass**, the children are called **subclasses**. In the class card the children are listed under **Subclasses**.` },
        { k: 'memory', md: `In the {{Heap}} there is **no** extra Tier object inside the cat. \`katze1\` is **one single** object, and all fields are in it together: the five inherited from Tier and its own \`schnurrt\`. You can see this in the **memory** window: \`katze1\` is one box with six fields.

In the {{Metaspace}} it's different: every class stands on its own there. \`Katze\` only lists \`schnurrt\` plus \`extends Tier\` – the other fields are listed with \`Tier\`. So the class Katze points to its parent class, and when building an object the JVM collects the fields from both.` },
        { k: 'remember', md: `Child = everything from the parents + something of its own.` },
        { k: 'code', md: `\`\`\`java
class Katze extends Tier {   // "extends" = inherits from
    boolean schnurrt;

    Katze() {
        super();               // build the inherited Tier part
        this.schnurrt = true;  // add something of its own
    }
}
\`\`\`` }
      ]
    },
    {
      id: 'begriff-ueberschreiben', group: 'begriffe', num: 'B10', nav: 'Overriding', type: 'concept', demo: 'demo-ueberschreiben',
      title: 'Overriding',
      blocks: [
        { k: 'short', md: `Overriding means the child class writes an inherited method **anew**, in its own way. The name stays the same.` },
        { k: 'life', md: `🥞 Your grandma has a pancake recipe. You inherited it – but you make them with chocolate. The recipe is still called "pancakes". Only your version is different.` },
        { k: 'inApp', md: `In the object card of \`katze1\`, \`essen()\` has the yellow {{overridden}} badge: the cat wrote its own version – it eats fish. The method \`halten()\` (stop), on the other hand, has {{inherited}}: the cat simply uses Tier's version without changing anything.` },
        { k: 'memory', md: `In the {{Metaspace}} the class \`Krokodil\` has its **own** code for \`essen()\`. For \`halten()\` it has none – that exists only once, with \`Tier\`.

Every class has a kind of table of contents of its methods, the **method table**. For the crocodile it says: \`essen()\` → Krokodil's code, \`halten()\` → Tier's code. So overriding means: in the child's table of contents, one of the parent's entries is replaced by its own.

You can see this in the **memory** window on the classes: \`Katze\` lists \`essen()\`, \`bewegen()\` and \`lautGeben()\`, but no \`halten()\`.` },
        { k: 'remember', md: `Overriding = same name, own way.` },
        { k: 'code', md: `\`\`\`java
class Krokodil extends Tier {
    @Override                  // its own version of essen()
    public void essen() {
        System.out.println("The crocodile eats meat.");
    }
    // halten() is not rewritten → Tier's version is used
}
\`\`\`` }
      ]
    },
    {
      id: 'begriff-polymorphie', group: 'begriffe', num: 'B11', nav: 'Polymorphism', type: 'concept', pillar: 3, demo: 'demo-polymorphie',
      title: 'Polymorphism',
      overline: 'Pillar 3 of 4',
      blocks: [
        { k: 'short', md: `Polymorphism means "many forms": you give many different objects **the same command** – and each one carries it out in **its own way**.` },
        { k: 'life', md: `🏫 The teacher says to the whole class: "Please come to the front!" One child walks, one hops, one rolls up in a wheelchair. The teacher doesn't have to explain to each one **how** to get to the front. Everyone knows that themselves.` },
        { k: 'inApp', md: `The **Move all** button tells every animal and vehicle: \`bewegen()\` (move). The cat walks on four paws, the crocodile crawls, the plane flies through the air. The program never asks: "Are you a cat? Are you a car?" It simply calls the same method on all of them. Each object knows by itself what to do – because each child has overridden \`bewegen()\`.` },
        { k: 'memory', md: `This is where **dynamic dispatch** happens. In the loop, the variable \`tier\` on the {{Stack}} holds the address of three different objects, one after the other. At \`tier.bewegen()\` the JVM asks every time, **only at that moment**:

1. Which object is at this address in the {{Heap}}?
2. Which class does it belong to?
3. Which version of \`bewegen()\` does this class have in the {{Metaspace}}?

So the variable's type (\`Tier\`) doesn't decide **which** code runs – the object itself does. Try it in the **memory** window: hover over an object, and its class in the metaspace lights up. That's exactly where the JVM looks for the method.` },
        { k: 'remember', md: `Polymorphism = one command, many different answers.` },
        { k: 'code', md: `\`\`\`java
Tier[] tiere = { new Katze(), new Krokodil(), new Mensch() };

for (Tier tier : tiere) {
    tier.bewegen();            // the same command for everyone
}
// Walks on four paws.
// Crawls.
// Walks on two legs.
\`\`\`` }
      ]
    },
    {
      id: 'begriff-kapselung', group: 'begriffe', num: 'B12', nav: 'Encapsulation', type: 'concept', pillar: 4, demo: 'demo-kapselung',
      title: 'Encapsulation',
      overline: 'Pillar 4 of 4',
      blocks: [
        { k: 'short', md: `Encapsulation means an object **hides its insides**. From the outside you may only press the buttons you're allowed to.` },
        { k: 'life', md: `📺 On a TV remote you only press the buttons. You can't see the wires and chips inside, and you're not supposed to touch them – something might break. You don't even need to know about them to watch TV.` },
        { k: 'inApp', md: `The engine has one public button: \`public starten()\` (start). It also has three secret steps marked \`private\`, for example \`kraftstoffEinspritzen()\` (inject fuel). If you click **test** next to a secret step, you get: "Access denied". The secret steps only run when the engine calls them **itself** – while starting.

The shapes have a secret too: their rotation angle. It isn't shown in the card, and only the method \`drehen90()\` can change it.

**Interface:** all of an object's public methods together are called its **interface**. They are its "buttons" to the outside world.` },
        { k: 'memory', md: `In the {{Heap}} private fields sit in the object just like all the others. In the **memory** window you can see, for example, \`private #winkel = 90\` on the shapes – even though the angle is missing from the object card. The engine's private methods are listed quite normally in the {{Metaspace}} too, with their class.

So encapsulation isn't a safe in memory, but a **rule of the language**: the compiler and the JVM simply don't let code from outside get at it.` },
        { k: 'remember', md: `\`public\` = for everyone. \`private\` = only for myself.` },
        { k: 'code', md: `\`\`\`java
class Benzinmotor extends Motor {
    private void zuenden() { /* secret */ }   // private = only from the inside
    public void starten() {                   // public
        this.zuenden();                       // allowed from the inside
        this.laeuft = true;
    }
}

motor.starten();   // ✓ works
motor.zuenden();   // ✗ forbidden – not reachable from outside
\`\`\`` }
      ]
    },
    {
      id: 'begriff-nachrichten', group: 'begriffe', num: 'B13', nav: 'Message passing', type: 'concept', demo: 'demo-nachrichten',
      title: 'Message passing – objects send each other messages',
      blocks: [
        { k: 'short', md: `Objects work together by sending each other **messages**. Sending a message means calling a method of another object. The answer is whatever the method gives back.` },
        { k: 'life', md: `✉️ You text your friend: "Could you bring me the book?" You don't tell her **how** to do it. She gets the message, does it her own way and replies: "Sure, done!"` },
        { k: 'inApp', md: `When you click **Run** next to \`motorStarten()\` on \`auto1\`, you send the car the message: "Start your engine!" But the car doesn't start the engine itself. It sends its engine a new message: \`starten()\`. The engine performs its secret steps and answers: "Engine started!" Then the car answers you: "Engine started successfully." That's why you see **two** answers in the output.

**Move all** is message passing too: one message – \`bewegen()\` – goes to many objects at once.` },
        { k: 'memory', md: `Every message is a method call – and every call puts a frame on the {{Stack}}. For \`auto1.motorStarten()\` the pile grows like this:

\`\`\`text
│ Benzinmotor.zuenden()    │  ← on top: what is happening right now
│ Benzinmotor.starten()    │
│ Auto.motorStarten()      │
│ main()                   │
└──────────────────────────┘
\`\`\`

When a method is done, its frame is taken away and its answer goes to the frame below. That's why the output shows the engine's answer first and then the car's. In the **memory** window OOPlayground only shows the frame of the message that **you** send.` },
        { k: 'remember', md: `Calling a method = sending a message. Return value = the answer.` },
        { k: 'code', md: `\`\`\`text
You ──motorStarten()──▶ auto1 ──starten()──▶ Benzinmotor
                                                └─ secret steps
You ◀─"Engine started successfully."─ auto1 ◀─"Engine started!"─ Benzinmotor
\`\`\`` }
      ]
    },
    {
      id: 'begriff-komposition', group: 'begriffe', num: 'B14', nav: 'Composition & delegation', type: 'concept', demo: 'demo-komposition',
      title: 'Composition and delegation',
      blocks: [
        { k: 'short', md: `**Composition** means an object **is made of** other objects. **Delegation** means it hands a task over to one of those parts.` },
        { k: 'life', md: `🚲 A bicycle has wheels, brakes and a bell. When you want to ring, the whole bike doesn't ring – the bell does. The bike "delegates" the ringing to the bell.` },
        { k: 'inApp', md: `The \`motor\` field of \`auto1\` doesn't contain text but a whole object of its own: a \`Benzinmotor\` (petrol engine). That's why you can hover over it and open a separate card. When you call \`motorStarten()\`, the car hands the work over to its engine – that's delegation.

**Inheritance or composition?**
- "**is a**" → inheritance: a cat **is an** animal.
- "**has a**" → composition: a car **has an** engine. (A car isn't an engine, after all!)` },
        { k: 'memory', md: `With composition there are **two** objects in the {{Heap}}: the car and its engine. The field \`motor\` of \`auto1\` only holds the engine's **address**. In the **memory** window the engine is its own box right below the car (\`auto1.motor\`). Hover over the address at the field \`motor\` – the engine and its class \`Benzinmotor\` light up.

Compare this with inheritance: a cat is **one** object, with Tier's fields inside it. A car with an engine is **two** objects, connected by an address.` },
        { k: 'remember', md: `is a → inheritance. has a → composition.` },
        { k: 'code', md: `\`\`\`java
class Auto extends Transport {           // a car IS A transport
    Motor motor;

    Auto() {
        super();
        this.motor = new Benzinmotor();      // a car HAS AN engine
    }

    public void motorStarten() {
        this.motor.starten();                // hand the work to the engine
    }
}
\`\`\`` }
      ]
    },
    {
      id: 'begriff-wiederverwendung', group: 'begriffe', num: 'B15', nav: 'Reuse', type: 'concept', demo: 'demo-wiederverwendung',
      title: 'Reuse',
      blocks: [
        { k: 'short', md: `Reuse means writing code **once** and using it in **many** places.` },
        { k: 'life', md: `📖 You write down a recipe once. Then you can cook from it as often as you like – and your friends can use it too. Nobody has to invent the recipe again each time.` },
        { k: 'inApp', md: `The method \`drehen90()\` (rotate by 90°) appears **only once** in the code – in the class \`Figur\` (shape). Dreieck (triangle), Kreis (circle) and Stern (star) inherit it and can all rotate. Nobody had to write the method three times. That's why \`drehen90()\` has the {{implemented}} badge in Figur's class card and {{inherited}} in the object cards.

Reuse is one of the biggest advantages of inheritance: less code, fewer mistakes. And if you improve the method once, all shapes get better at the same time.` },
        { k: 'memory', md: `\`drehen90()\` is in the {{Metaspace}} only **once**, with \`Figur\`. Dreieck, Kreis and Stern have no copy of their own – their method tables all point to the same code.

The data, on the other hand, is separate: every shape has its own \`#winkel\` in the {{Heap}}. Code is shared, state is not.` },
        { k: 'remember', md: `Write once, use often.` }
      ]
    },
    {
      id: 'begriff-null', group: 'begriffe', num: 'B16', nav: 'Reference & null', type: 'concept', demo: 'demo-null',
      title: 'Reference and null',
      blocks: [
        { k: 'short', md: `A name like \`katze1\` is like a pointer to an object. It's called a **reference**. \`null\` means: "This name doesn't point to anything any more."` },
        { k: 'life', md: `🎈 Imagine a balloon on a string. The string is the name, the balloon is the object. If you let go of the string (\`= null\`), the balloon floats away. When nobody is holding it any more, JavaScript eventually tidies it up by itself. This is called **garbage collection** – the program's rubbish collection.` },
        { k: 'inApp', md: `At the very bottom of every object card there's the \`katze1 = null\` button. One click – and the object is gone. **Delete all** does this for all objects at once.

And the numbers? As long as there is still a cat, numbers aren't given out twice. Only when there are **no** cats left does counting start again at \`katze1\`.` },
        { k: 'memory', md: `The variable \`katze1\` on the {{Stack}} only holds an address. \`katze1 = null\` deletes this address – at first the object in the {{Heap}} simply stays where it is. Once no variable and no field points to it any more, it is **unreachable**. Then the JVM's **garbage collector** removes it at some point and frees the space. The class \`Katze\` in the {{Metaspace}} stays – it's still needed.

OOPlayground is quicker: after \`katze1 = null\` the variable on the stack and the object in the heap disappear at once.` },
        { k: 'remember', md: `Reference = the string to the object. \`null\` = no string any more.` }
      ]
    },
    {
      id: 'demo-vorbereitung', group: 'vorfuehren', num: 'D0', nav: 'Getting ready', type: 'demo',
      title: 'Getting ready',
      blocks: [
        { k: 'goal', md: `Start with a clean slate so that everything looks exactly like in the instructions.` },
        { k: 'steps', md: `1. Open OOPlayground with the **Open playground** button at the top of this page. Ideally, put both windows side by side: OOPlayground on the left, this guide on the right.
2. Choose the language in the top right: **EN** or **DE**.
3. Are there objects already? Then click **\`[[Delete all]]\`**.
4. In the output, click **\`[[Clear]]\`**.` },
        { k: 'watch', md: `- Steps 3 and 4 are worth doing before each new walkthrough. Then the names (\`katze1\`, \`auto1\` …) and the output match the examples exactly.
- Did a card suddenly close? Just hover over the symbol again.` }
      ]
    },
    {
      id: 'demo-abstraktion', group: 'vorfuehren', num: 'D1', nav: 'Discover abstraction', type: 'demo',
      title: 'Discover abstraction',
      blocks: [
        { k: 'goal', md: `Discover that a class describes only what things have **in common** – the "what", not the "how".` },
        { k: 'steps', md: `1. Hover over **Transport**. The \`abstract class Transport\` card opens.
2. Read the **fields**: \`name\`, \`kannFliegen\` (can fly), \`hoechstgeschwindigkeit\` (top speed), \`anzahlRaeder\` (number of wheels), \`motor\` (engine). **Every** vehicle has these – no matter which one.
3. Notice that almost all fields have **no value** yet. Only \`name\` has the placeholder \`"Unbenannt"\` (unnamed).
4. Look at the **methods**: \`motorStarten()\` and \`bewegen()\` have the {{abstract}} badge. That means: every vehicle can do this – but **how** isn't written here yet.
5. Do the same briefly with **Tier** and with **Figur**.` },
        { k: 'output', md: `Nothing yet – you're only looking at the blueprints.` },
        { k: 'watch', md: `- The class says **what** exists, not exactly **how** it is.
- Car, plane or train: anyone who only knows "Transport" already knows enough to work with it.` }
      ],
      related: [{ id: 'begriff-abstraktion', label: 'Abstraction' }, { id: 'begriff-abstrakte-klasse', label: 'Abstract class' }]
    },
    {
      id: 'demo-abstrakt', group: 'vorfuehren', num: 'D2', nav: 'Try an abstract class', type: 'demo',
      title: 'Try an abstract class',
      blocks: [
        { k: 'goal', md: `Try to build an object from an abstract class – and find out that you **can't**.` },
        { k: 'steps', md: `1. Hover over **Tier**.
2. Read the title: \`abstract class Tier\`.
3. Look at the badges: {{abstract}} on \`essen()\`, \`bewegen()\` and \`lautGeben()\`, {{implemented}} on \`halten()\`.
4. At the very bottom of the card, click **\`[[new Tier()]]\`**. (When you hover over it, it says: "Instantiate directly (forbidden)".)
5. Look at the **Output**.
6. If you like: try the same with \`new Transport()\` and \`new Figur()\`.` },
        { k: 'output', md: `\`\`\`console
> new Tier()
!! Abstract classes cannot be instantiated.
\`\`\`` },
        { k: 'watch', md: `- **Nothing** new has appeared under **Created objects**.
- The error is real, not made up: Tier's constructor checks whether someone says \`new Tier()\` directly – and forbids it.
- Purple {{abstract}} = "The children have to finish this." Green {{implemented}} = "This is already finished."` }
      ],
      related: [{ id: 'begriff-abstrakte-klasse', label: 'Abstract class' }, { id: 'begriff-instanziierung', label: 'Instantiation' }]
    },
    {
      id: 'demo-instanziieren', group: 'vorfuehren', num: 'D3', nav: 'Create objects', type: 'demo',
      title: 'Create objects (class → object)',
      blocks: [
        { k: 'goal', md: `See how **many** objects are created from **one** class.` },
        { k: 'steps', md: `1. Hover over **Tier**.
2. Under **Subclasses**, hover over the **\`[[Katze]]\`** button. It says: "Instantiate".
3. Click **\`[[Katze]]\`**. \`katze1\` appears under **Created objects**.
4. Click **\`[[Katze]]\`** two more times. Now there are also \`katze2\` and \`katze3\`.
5. Hover over \`katze1\`. The top of the card says \`class Katze katze1\`.
6. Hover over \`katze2\`. The top says \`class Katze katze2\`.
7. Compare with the **Tier** card: there the fields were empty. In \`katze1\` they are filled in.` },
        { k: 'output', md: `\`\`\`console
> Object katze1 was created.
> Object katze2 was created.
> Object katze3 was created.
\`\`\`` },
        { k: 'watch', md: `- **One** class (\`Katze\`) – **three** objects. Each one has its own name.
- Clicking **Katze** doesn't "initialise" the class – it builds a **new object**: \`new Katze()\`.
- The fields are filled in straight away. The **constructor** did that while building.
- Open **memory** at the bottom left: the stack holds three variables, the heap three objects – but the class \`Katze\` exists in the metaspace only **once**.` }
      ],
      related: [{ id: 'begriff-objekt', label: 'Object' }, { id: 'begriff-klasse', label: 'Class' }, { id: 'begriff-instanziierung', label: 'Instantiation' }]
    },
    {
      id: 'demo-zustand', group: 'vorfuehren', num: 'D4', nav: 'Observe state', type: 'demo',
      title: 'Observe state',
      blocks: [
        { k: 'goal', md: `Observe that every object has its **own state** and that methods can change it.` },
        { k: 'steps', md: `1. Hover over **Transport** and click **\`[[Auto]]\`** twice. Now there are \`auto1\` and \`auto2\`.
2. Hover over \`auto1\`. In the card, hover over \`Benzinmotor\` (in the \`motor\` field). The engine card opens. It says: \`laeuft = false\`.
3. In the \`auto1\` card, click **\`[[Run]]\`** next to \`motorStarten()\`. The car in the picture starts up.
4. Hover over \`auto1\`'s \`Benzinmotor\` again. Now it says: \`laeuft = true\`.
5. Hover over \`auto2\` and then over its \`Benzinmotor\`. There it still says: \`laeuft = false\`.
6. On \`auto1\`, click **Run** next to \`motorStarten()\` once more.` },
        { k: 'output', md: `\`\`\`console
> Object auto1 was created.
> Object auto2 was created.
> auto1.motorStarten()
  Engine started!
  Engine started successfully.
> auto1.motorStarten()
  The engine is already running.
\`\`\`` },
        { k: 'watch', md: `- Same class, **different** state: \`auto1\`'s engine is running, \`auto2\`'s isn't.
- The method \`motorStarten()\` **changed** the state (\`false\` → \`true\`).
- The second time, the car answers differently – it **remembers** its state.
- After **Run**, the card is redrawn and the engine card closes. That's normal – just open it again.
- In **memory**, \`laeuft\` is stored in the heap with the engine of \`auto1\`. The engine of \`auto2\` is a different box with its own value.` }
      ],
      related: [{ id: 'begriff-feld', label: 'Field & state' }, { id: 'begriff-objekt', label: 'Object' }]
    },
    {
      id: 'demo-methode', group: 'vorfuehren', num: 'D5', nav: 'Call a method', type: 'demo',
      title: 'Call a method',
      blocks: [
        { k: 'goal', md: `Give an object a command and read what it answers.` },
        { k: 'steps', md: `1. Create a cat: **Tier** → **\`[[Katze]]\`**. \`katze1\` appears.
2. Hover over \`katze1\`. Under **Methods** you'll find: \`essen()\` (eat), \`bewegen()\` (move), \`lautGeben()\` (make a sound), \`halten()\` (stop).
3. Click **\`[[Run]]\`** next to \`essen()\`. The cat in the picture eats.
4. Click **\`[[Run]]\`** next to \`bewegen()\`. The cat walks.
5. Click **\`[[Run]]\`** next to \`halten()\`. The cat stops.` },
        { k: 'output', md: `\`\`\`console
> Object katze1 was created.
> katze1.essen()
  The cat eats fish.
> katze1.bewegen()
  Walks on four paws
> katze1.halten()
  Cat stops.
\`\`\`` },
        { k: 'watch', md: `- The line with \`>\` is the **command** you sent: \`katze1.essen()\`. That's what a method call looks like in code.
- The indented line is the object's **answer**.
- Behind **Run** there's a real call of the JavaScript method – nothing is faked.` }
      ],
      related: [{ id: 'begriff-methode', label: 'Method' }, { id: 'begriff-nachrichten', label: 'Message passing' }]
    },
    {
      id: 'demo-vererbung', group: 'vorfuehren', num: 'D6', nav: 'Discover inheritance', type: 'demo',
      title: 'Discover inheritance',
      blocks: [
        { k: 'goal', md: `Discover that children get everything from their parents – plus something of their own.` },
        { k: 'steps', md: `1. Hover over **Tier** and read its fields: \`name\`, \`kannFliegen\` (can fly), \`anzahlBeine\` (number of legs), \`hatSchwanz\` (has a tail), \`kannGestreicheltWerden\` (can be petted).
2. Under **Subclasses**, click **\`[[Katze]]\`**, **\`[[Krokodil]]\`** and **\`[[Mensch]]\`** one after another.
3. Hover over \`katze1\`. You'll see: Tier's five fields are there and marked {{inherited}}. At the very bottom is \`schnurrt = true\` (purrs) marked {{own}}.
4. Hover over \`krokodil1\`. Its own field: \`anzahlZaehne = 66\` (number of teeth).
5. Hover over \`mensch1\`. Its own field: \`beruf = "Student"\` (job).
6. Hover over **Tier** once more: these own fields do **not** exist there.` },
        { k: 'output', md: `\`\`\`console
> Object katze1 was created.
> Object krokodil1 was created.
> Object mensch1 was created.
\`\`\`` },
        { k: 'watch', md: `- The children did **not have to reinvent** Tier's fields – they inherited them.
- Each child still has **something of its own**.
- The inherited fields have different **values** in each child: the cat has 4 legs, the human 2.
- In **memory**, \`katze1\` is **one** box with all six fields. In the metaspace, on the other hand, \`Katze\` only lists \`schnurrt\` – the rest is listed with \`Tier\`.` }
      ],
      related: [{ id: 'begriff-vererbung', label: 'Inheritance' }]
    },
    {
      id: 'demo-ueberschreiben', group: 'vorfuehren', num: 'D7', nav: 'Try overriding', type: 'demo',
      title: 'Try overriding',
      blocks: [
        { k: 'goal', md: `Try out how children can rewrite an inherited method in their own way – or simply take it over as it is.` },
        { k: 'before', md: `**Before you start:** \`katze1\`, \`krokodil1\` and \`mensch1\` should exist (see [Discover inheritance](#demo-vererbung)).` },
        { k: 'steps', md: `1. Hover over **Tier**. You'll see: \`essen()\` is {{abstract}}, \`halten()\` is {{implemented}}.
2. Hover over \`katze1\`. You'll see: \`essen()\`, \`bewegen()\` and \`lautGeben()\` are {{overridden}}, \`halten()\` is {{inherited}}.
3. Click **\`[[Run]]\`** next to \`essen()\` – first on \`katze1\`, then on \`krokodil1\`, then on \`mensch1\`.
4. Click **\`[[Run]]\`** next to \`halten()\` – on \`katze1\` and on \`krokodil1\`.` },
        { k: 'output', md: `\`\`\`console
> katze1.essen()
  The cat eats fish.
> krokodil1.essen()
  The crocodile eats meat.
> mensch1.essen()
  The human eats a pizza.
> katze1.halten()
  Cat stops.
> krokodil1.halten()
  Crocodile stops.
\`\`\`` },
        { k: 'watch', md: `- \`essen()\` is {{overridden}}: three animals, three **different** answers.
- \`halten()\` is {{inherited}}: they all use the **same** method from Tier. Only the name in the sentence differs – because the method reads the name from the \`name\` field.` }
      ],
      related: [{ id: 'begriff-ueberschreiben', label: 'Overriding' }, { id: 'begriff-vererbung', label: 'Inheritance' }]
    },
    {
      id: 'demo-polymorphie', group: 'vorfuehren', num: 'D8', nav: 'Experience polymorphism', type: 'demo',
      title: 'Experience polymorphism',
      blocks: [
        { k: 'goal', md: `Experience how **one** command makes **different** objects do **different** things.` },
        { k: 'steps', md: `1. Click **\`[[Delete all]]\`**, and **\`[[Clear]]\`** in the output.
2. Create a shape: **Figur** → **\`[[Dreieck]]\`**. Notice: **Move all** is still grey – shapes can't move.
3. Create three animals: **Tier** → **\`[[Katze]]\`**, **\`[[Krokodil]]\`**, **\`[[Mensch]]\`**. Now **Move all** is active.
4. Create three vehicles: **Transport** → **\`[[Auto]]\`**, **\`[[Flugzeug]]\`**, **\`[[Zug]]\`**.
5. Click **\`[[Move all]]\`**. All animals and vehicles move at the same time – each one differently.` },
        { k: 'output', note: '(after step 5)', md: `\`\`\`console
> Move all
  katze1: Walks on four paws.
  krokodil1: Crawls.
  mensch1: Walks on two legs.
  auto1: Drives on the road.
  flugzeug1: Flies through the air.
  zug1: Runs on rails.
\`\`\`` },
        { k: 'watch', md: `- **One** command – **six** different answers.
- The program never asks "Are you a cat?". It simply calls \`bewegen()\` on everyone. Each object knows by itself how to move.
- \`dreieck1\` is missing from the list: shapes have no \`bewegen()\` method, so they aren't asked at all.
- Polymorphism works because each child has **overridden** \`bewegen()\`.
- In **memory** you can see how it works: hover over an object – its class in the metaspace lights up. That's where the JVM looks up the matching \`bewegen()\` on every call (dynamic dispatch).` }
      ],
      related: [{ id: 'begriff-polymorphie', label: 'Polymorphism' }, { id: 'begriff-ueberschreiben', label: 'Overriding' }]
    },
    {
      id: 'demo-kapselung', group: 'vorfuehren', num: 'D9', nav: 'Test encapsulation', type: 'demo',
      title: 'Test encapsulation',
      blocks: [
        { k: 'goal', md: `Test whether you can get at the inside of the engine – and find out: it's secret, and you can only start it the allowed way.` },
        { k: 'steps', md: `1. Create a car: **Transport** → **\`[[Auto]]\`**. \`auto1\` appears.
2. Hover over \`auto1\` and then over \`Benzinmotor\`. The engine card \`class Benzinmotor extends Motor\` opens.
3. Look at the methods: at the top \`public void starten()\` (start), below it three grey \`private\` methods: \`kraftstoffEinspritzen()\` (inject fuel), \`zuenden()\` (ignite), \`kolbenBewegen()\` (move pistons).
4. Click **\`[[test]]\`** next to \`kraftstoffEinspritzen()\`. A red error appears in the output.
5. Read the hint on the card: "Only motorStarten() is called on the transport object."
6. Click **\`[[Show implementation]]\`**. A list opens:
   1. \`kraftstoffEinspritzen()  →  Fuel is injected\`
   2. \`zuenden()  →  Spark ignites the mixture\`
   3. \`kolbenBewegen()  →  Pistons start moving\`
7. Now the right way: in the \`auto1\` card, click **\`[[Run]]\`** next to \`motorStarten()\`.` },
        { k: 'output', md: `\`\`\`console
> Object auto1 was created.
> motor['#kraftstoffEinspritzen']()
!! Access denied – #kraftstoffEinspritzen is private. (TypeError)
> auto1.motorStarten()
  Engine started!
  Engine started successfully.
\`\`\`` },
        { k: 'watch', md: `- The forbidden way (**test**) **never** works. The right way (**motorStarten()**) always does.
- The ban is real: in JavaScript, methods with \`#\` in front of their name are private. You can't reach them from outside.
- **Show implementation** is only for **looking**. You can't press the steps – that's exactly what encapsulation is.
- Whoever drives the car doesn't need to know how fuel is injected. One button is enough.` }
      ],
      related: [{ id: 'begriff-kapselung', label: 'Encapsulation' }]
    },
    {
      id: 'demo-nachrichten', group: 'vorfuehren', num: 'D10', nav: 'Follow message passing', type: 'demo',
      title: 'Follow message passing',
      blocks: [
        { k: 'goal', md: `Follow how objects send each other messages to get a job done.` },
        { k: 'steps', md: `1. Create a train: **Transport** → **\`[[Zug]]\`**. \`zug1\` appears.
2. Hover over \`zug1\` and click **\`[[Run]]\`** next to \`motorStarten()\`.
3. Read the output line by line:
   - \`> zug1.motorStarten()\` – **your** message to the train.
   - \`Engine started!\` – the **engine's** answer to the train.
   - \`Engine started successfully.\` – the **train's** answer to you.
4. Optional: open the \`Elektromotor\` engine card and click **\`[[Show implementation]]\`**. This shows what the engine did after receiving the message.
5. Click **\`[[Run]]\`** next to \`halten()\` (stop). The train stops and sends its engine the message \`stoppen()\` (stop).` },
        { k: 'output', md: `\`\`\`console
> Object zug1 was created.
> zug1.motorStarten()
  Engine started!
  Engine started successfully.
> zug1.halten()
  Train comes to a halt.
  Engine stopped.
\`\`\`

This is how the message travels:
\`\`\`text
You ──motorStarten()──▶ zug1 ──starten()──▶ Elektromotor
                                               └─ batterieAktivieren()
                                               └─ spannungAnlegen()
                                               └─ rotorDrehen()
\`\`\`` },
        { k: 'watch', md: `- You send only **one** message. The objects sort out the rest among themselves.
- Every object answers – that's why there are two answer lines.
- **Move all** is message passing too: one message, many receivers.` }
      ],
      related: [{ id: 'begriff-nachrichten', label: 'Message passing' }, { id: 'begriff-methode', label: 'Method' }, { id: 'begriff-komposition', label: 'Composition & delegation' }]
    },
    {
      id: 'demo-komposition', group: 'vorfuehren', num: 'D11', nav: 'Discover composition', type: 'demo',
      title: 'Discover composition',
      blocks: [
        { k: 'goal', md: `Discover that a vehicle **has** an engine – as an object of its own.` },
        { k: 'steps', md: `1. Hover over **Transport**. Look at the field \`Motor motor;\` – its type isn't a number or text but a **class**: \`Motor\`.
2. Create **\`[[Auto]]\`**, **\`[[Flugzeug]]\`** and **\`[[Zug]]\`**.
3. Hover over \`auto1\` and then over its \`motor\` field → engine card **Benzinmotor**: \`typ = "Benzin"\`, \`leistung = 150\` (hp).
4. Hover over \`flugzeug1\` → **Turbofan**: \`leistung = 120\` (kN).
5. Hover over \`zug1\` → **Elektromotor**: \`leistung = 5600\` (kW).` },
        { k: 'output', md: `\`\`\`console
> Object auto1 was created.
> Object flugzeug1 was created.
> Object zug1 was created.
\`\`\`` },
        { k: 'watch', md: `- Each vehicle **has an** engine. But no vehicle **is an** engine – that's why this isn't inheritance but **composition**.
- The engine is an **object of its own** with its own card, its own fields and its own methods.
- All three vehicles start their engine with the same method \`motorStarten()\`. Each one **delegates** the work to its own engine – and each engine does it differently (see **Show implementation**).
- In **memory** there are **two** objects in the heap for every vehicle: the vehicle and its engine. The field \`motor\` only holds the engine's address.` }
      ],
      related: [{ id: 'begriff-komposition', label: 'Composition & delegation' }, { id: 'begriff-nachrichten', label: 'Message passing' }]
    },
    {
      id: 'demo-wiederverwendung', group: 'vorfuehren', num: 'D12', nav: 'Try reuse', type: 'demo',
      title: 'Try reuse',
      blocks: [
        { k: 'goal', md: `Find out how a method written only once is used by all the children.` },
        { k: 'steps', md: `1. Hover over **Figur**. Notice: \`drehen90()\` has {{implemented}} – it's already finished, not abstract!
2. Create **\`[[Dreieck]]\`**, **\`[[Kreis]]\`** and **\`[[Stern]]\`**.
3. Hover over \`dreieck1\`. Here \`drehen90()\` has {{inherited}}.
4. Click **\`[[Run]]\`** next to \`drehen90()\` – on \`dreieck1\`, \`kreis1\` and \`stern1\`. The shapes rotate.
5. Click **Run** on \`dreieck1\` three more times. The triangle turns all the way round.` },
        { k: 'output', md: `\`\`\`console
> Object dreieck1 was created.
> Object kreis1 was created.
> Object stern1 was created.
> dreieck1.drehen90()
  Triangle was rotated by 90° (now 90°).
> kreis1.drehen90()
  Circle was rotated by 90° (now 90°).
> stern1.drehen90()
  Star was rotated by 90° (now 90°).
> dreieck1.drehen90()
  Triangle was rotated by 90° (now 180°).
> dreieck1.drehen90()
  Triangle was rotated by 90° (now 270°).
> dreieck1.drehen90()
  Triangle was rotated by 90° (now 0°).
\`\`\`` },
        { k: 'watch', md: `- \`drehen90()\` appears only **once** in the code (in \`Figur\`) – and all three shapes can do it.
- With the circle you may barely see the rotation – it's round, after all! But the output shows: the method still ran.
- Each shape remembers its **own** angle: \`dreieck1\` is at 0°, \`kreis1\` is still at 90°. The angle is private – only \`drehen90()\` may change it (that's encapsulation again).` }
      ],
      related: [{ id: 'begriff-wiederverwendung', label: 'Reuse' }, { id: 'begriff-vererbung', label: 'Inheritance' }]
    },
    {
      id: 'demo-null', group: 'vorfuehren', num: 'D13', nav: 'Delete objects (null)', type: 'demo',
      title: 'Delete objects with null',
      blocks: [
        { k: 'goal', md: `See what happens when a name no longer points to an object.` },
        { k: 'steps', md: `1. Click **\`[[Delete all]]\`** and **\`[[Clear]]\`**.
2. Create two cats: **Tier** → **\`[[Katze]]\`** twice. There are now \`katze1\` and \`katze2\`.
3. Hover over \`katze1\` and click **\`[[katze1 = null]]\`** at the very bottom. \`katze1\` disappears, \`katze2\` stays.
4. Click **\`[[Katze]]\`** once more. The new cat is called \`katze3\` – not \`katze1\`!
5. Click **\`[[Delete all]]\`**. All objects are gone.
6. Click **\`[[Katze]]\`** once more. Now it's called \`katze1\` again.` },
        { k: 'output', md: `\`\`\`console
> Object katze1 was created.
> Object katze2 was created.
> katze1 = null
  Object katze1 was deleted.
> Object katze3 was created.
> Delete all
  2 object(s) were deleted.
> Object katze1 was created.
\`\`\`` },
        { k: 'watch', md: `- \`katze1 = null\` means: "The name \`katze1\` doesn't point to anything any more." After that the object can't be reached.
- Deleting \`katze1\` does **not** affect \`katze2\` – every object is independent.
- As long as a cat is still alive, no name is given out twice. Only when none are left does counting start again.
- In **memory**, after \`katze1 = null\` the variable on the stack and the object in the heap are gone. The class \`Katze\` stays in the metaspace.` }
      ],
      related: [{ id: 'begriff-null', label: 'Reference & null' }]
    },
    {
      id: 'demo-speicher', group: 'vorfuehren', num: 'D14', nav: 'Look into memory', type: 'demo',
      title: 'Look into memory',
      blocks: [
        { k: 'goal', md: `Find out where variables, objects and classes are stored in the JVM's memory.` },
        { k: 'steps', md: `1. Click **\`[[Delete all]]\`** and, in the output, **\`[[Clear]]\`**.
2. Click the button with the memory icon at the bottom left. (When you hover over it, it says: "Take a look into memory".) You'll see: stack and heap are empty – but all classes are already in the metaspace.
3. Close the window with **×** and create **Tier** → **\`[[Katze]]\`** and **Transport** → **\`[[Auto]]\`**.
4. Open memory again. You'll see: the stack holds \`Katze katze1\` and \`Auto auto1\`. The heap holds **three** boxes: \`katze1\`, \`auto1\` and its \`Benzinmotor\`.
5. On the stack, hover over the address of \`katze1\`. The variable, the object and the class \`Katze\` light up.
6. In the heap, hover over the address at the field \`motor\` of \`auto1\`. Now the petrol engine and its class light up.
7. Close the window and click **\`[[Run]]\`** next to \`motorStarten()\` on \`auto1\`. Open memory straight away: the frame \`Auto.motorStarten()\` is briefly on top of the stack, and the engine now shows \`laeuft = true\`.
8. Close the window, click **\`[[katze1 = null]]\`** on \`katze1\` and open memory once more.` },
        { k: 'output', md: `\`\`\`console
> Object katze1 was created.
> Object auto1 was created.
> auto1.motorStarten()
  Engine started!
  Engine started successfully.
> katze1 = null
  Object katze1 was deleted.
\`\`\`` },
        { k: 'watch', md: `- The metaspace never changes: the classes are there before the first object is built, and they stay when all objects are gone.
- A car with an engine is **two** objects in the heap, but only **one** variable on the stack. You can only reach the engine through the car.
- The frame of \`motorStarten()\` only stays while the start animation plays once (about two seconds). Missed it? No problem – the field \`laeuft\` still shows that the method ran.
- After \`katze1 = null\` the variable and the object are gone. The class \`Katze\` stays in the metaspace.` }
      ],
      related: [{ id: 'begriff-speicher', label: 'Memory (JVM)' }, { id: 'begriff-objekt', label: 'Object' }, { id: 'begriff-null', label: 'Reference & null' }]
    }
  ]
};
