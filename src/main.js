import './styles/main.css';
import { mountHeader } from './components/Header/Header.js';
import { mountClassPanel } from './components/ClassPanel/ClassPanel.js';
import { mountWorkspace } from './components/ObjectWorkspace/ObjectWorkspace.js';
import { mountConsole } from './components/Console/Console.js';

mountHeader(document.getElementById('header'));
mountClassPanel(document.getElementById('class-panel'));
mountWorkspace(document.getElementById('workspace'));
mountConsole(document.getElementById('console'));
