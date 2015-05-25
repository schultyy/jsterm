///<reference path="../typings/github-electron/github-electron.d.ts" />
///<reference path="../typings/node/node.d.ts" />

'use strict';
const app = require('app');
const BrowserWindow = require('browser-window');
const ipc = require("ipc");
const process = require("process");
import shellModule = require("./shellModel");

function getUserHome(): string {
  return process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
}

// report crashes to the Electron project
require('crash-reporter').start();

// prevent window being GC'd
let mainWindow = null;
let shell = null;

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('ready', function () {
	mainWindow = new BrowserWindow({
		width: 1024,
		height: 768,
		resizable: true
	});
	shell = new shellModule.ShellModel(getUserHome());
	shell.registerCallback();
	mainWindow.openDevTools();
	mainWindow.loadUrl(`file://${__dirname}/../static/index.html`);

	mainWindow.on('closed', function () {
		// deref the window
		// for multiple windows store them in an array
		shell = null;
		mainWindow = null;
	});
});
