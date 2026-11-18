import './styles/main.css';
import { mountHeader } from './components/Header/Header.js';
import { mountClassPanel } from './components/ClassPanel/ClassPanel.js';
import { mountWorkspace } from './components/ObjectWorkspace/ObjectWorkspace.js';
import { mountConsole } from './components/Console/Console.js';
import { uebersetzeDom, folgeAnderenTabs } from './i18n/i18n.js';

mountHeader(document.getElementById('header'));
mountClassPanel(document.getElementById('class-panel'));
mountWorkspace(document.getElementById('workspace'));
mountConsole(document.getElementById('console'));
uebersetzeDom(); // gespeicherte Sprache auf statische Texte (index.html) anwenden
folgeAnderenTabs(); // Sprachwechsel auf der Erklärungsseite hier übernehmen
