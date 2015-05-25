///<reference path="../typings/github-electron/github-electron.d.ts" />
///<reference path="../typings/node/node.d.ts" />

'use strict';
const app = require('app');
const BrowserWindow = require('browser-window');
const ipc = require("ipc");
import shellModel = require("./shellModel");

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
	shell = new shellModel.ShellModel();
	mainWindow.openDevTools();
	mainWindow.loadUrl(`file://${__dirname}/../static/index.html`);

	mainWindow.on('closed', function () {
		// deref the window
		// for multiple windows store them in an array
		shell = null;
		mainWindow = null;
	});
});
