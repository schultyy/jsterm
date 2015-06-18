///<reference path="../typings/github-electron/github-electron.d.ts" />
///<reference path="../typings/node/node.d.ts" />

'use strict';
var app = require('app');
var BrowserWindow = require('browser-window');
var ipc = require("ipc");
var process = require("process");
var Promise = require("promise");
import os = require("os");
import shellModule = require("./shellModel");
import userConfig = require("./user_configuration");
import utils = require('./utils');

// report crashes to the Electron project
require('crash-reporter').start();

// prevent window being GC'd
var mainWindow = null;
var shell = null;

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

ipc.on('platform', function(event, arg) {
  event.sender.send('platform', os.platform());
});

ipc.on('load-configuration', function(event, arg) {
  userConfig.loadConfiguration().then((config) => {
    event.sender.send('user-configuration', config);
  });
});

app.on('ready', function () {
	mainWindow = new BrowserWindow({
		width: 1024,
		height: 768,
		resizable: true
	});

	shell = new shellModule.ShellModel(utils.getUserHome());
	shell.registerCallback();
	// mainWindow.openDevTools();
	mainWindow.loadUrl(`file://${__dirname}/../static/index.html`);

	mainWindow.on('closed', function () {
		// deref the window
		// for multiple windows store them in an array
		shell = null;
		mainWindow = null;
	});
});
