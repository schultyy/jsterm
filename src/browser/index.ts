///<reference path="../../typings/jquery/jquery.d.ts" />
'use strict';

interface Window { $: JQueryStatic; ipc: any; }

window.$ = require("jquery");
window.ipc = require('ipc');

function sendCommand(ev: KeyboardEvent) {
  var command = $('.command').val();
  if(ev.keyCode == 13) {
    $(".command").val('').focus();
    historyEntry("$ " + command);
    window.ipc.send('execute-command', command);
    scrollToBottom();
  }
}

function initialize() : void {
  $(".command").keydown(sendCommand).focus();
}

function historyEntry(arg: any) {
  var pre = $("<pre>");
  var li = $("<li>");
  li.addClass("historyEntry");
  pre.text(arg.toString());
  li.html(pre.html());
  $("#history").append(li);
}

function registerCallbacks() : void {
  window.ipc.on('command-results', (arg: any) => {
      if(arg instanceof Array) {
        arg.forEach(historyEntry);
      }else {
        historyEntry(arg);
      }
      scrollToBottom();
    });
}

function scrollToBottom() {
  $('html, body').animate({scrollTop: $(".command").offset().top}, 0);
}

function menu() {
  var remote = require('remote');
  var Menu = remote.require('menu');
  var MenuItem = remote.require('menu-item');

  var template = [
    {
      label: 'Electron',
      submenu: [
        {
          label: 'About Electron',
          selector: 'orderFrontStandardAboutPanel:'
        },
        {
          type: 'separator'
        },
        {
          label: 'Services',
          submenu: []
        },
        {
          type: 'separator'
        },
        {
          label: 'Hide Electron',
          accelerator: 'Command+H',
          selector: 'hide:'
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Shift+H',
          selector: 'hideOtherApplications:'
        },
        {
          label: 'Show All',
          selector: 'unhideAllApplications:'
        },
        {
          type: 'separator'
        },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          selector: 'terminate:'
        },
      ]
    },
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'Command+Z',
          selector: 'undo:'
        },
        {
          label: 'Redo',
          accelerator: 'Shift+Command+Z',
          selector: 'redo:'
        },
        {
          type: 'separator'
        },
        {
          label: 'Cut',
          accelerator: 'Command+X',
          selector: 'cut:'
        },
        {
          label: 'Copy',
          accelerator: 'Command+C',
          selector: 'copy:'
        },
        {
          label: 'Paste',
          accelerator: 'Command+V',
          selector: 'paste:'
        },
        {
          label: 'Select All',
          accelerator: 'Command+A',
          selector: 'selectAll:'
        }
      ]
    }
  ];

  var menu = Menu.buildFromTemplate(template);

  Menu.setApplicationMenu(menu);
}

$(() => {
  initialize();
  registerCallbacks();
  $('#history').click(function(){
    $(".command").focus();
  });
  menu();
});
