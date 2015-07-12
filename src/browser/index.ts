///<reference path="../../typings/jquery/jquery.d.ts" />
'use strict';

interface Window { $: JQueryStatic; ipc: any; }

window.$ = require("jquery");
window.ipc = require('ipc');

function sendCommand(ev: KeyboardEvent) {
  var command = $('.command').val().trim();
  switch(ev.keyCode) {
    case 13: //return
      $(".command").val('').focus();
      historyEntry("$ " + command);
      window.ipc.send('execute-command', command);
      scrollToBottom();
      $("#command-input").hide();
      break;
    case 38: //up
      window.ipc.send('last-command');
      break;
    case 40: //down
      window.ipc.send('next-command');
      break;
  }
}

function initialize() : void {
  $(".command").keydown(sendCommand).focus();
  window.ipc.on('last-history-command', (command: string) => {
    $(".command").val(command);
  });
  window.ipc.on('next-history-command', (command: string) => {
    $(".command").val(command);
  });
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
    window.ipc.on('command-exit', (code: number, signal: any) => {
      $('#command-input').show();
      scrollToBottom();
      $('#command-input .command').focus();
    });
}

function scrollToBottom() {
  $('html, body').animate({scrollTop: $(".command").offset().top}, 0);
}

function modifier(platform: string) {
  if(platform === 'darwin') {
    return function(shortcut: string) {
      return 'Command' + '+' + shortcut;
    }
  }
  else {
    return function(shortcut: string) {
      return 'Ctrl' + '+' + shortcut;
    }
  }
}

function buildMenu(platform: string) {
  var remote = require('remote');
  var Menu = remote.require('menu');
  var MenuItem = remote.require('menu-item');
  var osModifier = modifier(platform);

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
          label: 'Quit',
          accelerator: osModifier('Q'),
          selector: 'terminate:'
        },
      ]
    },
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Cut',
          accelerator: osModifier('X'),
          selector: 'cut:'
        },
        {
          label: 'Copy',
          accelerator: osModifier('C'),
          selector: 'copy:'
        },
        {
          label: 'Paste',
          accelerator: osModifier('V'),
          selector: 'paste:'
        }
      ]
    }
  ];

  var menu = Menu.buildFromTemplate(template);

  Menu.setApplicationMenu(menu);
}

function platform() {
  window.ipc.send('platform');
  window.ipc.on('platform', buildMenu);
}

function fetchSettings() {
  window.ipc.send('load-configuration');
  window.ipc.on('user-configuration', (configuration) => {
    console.log(configuration);
    $('*').css('font-size', configuration.fontsize + 'px');
    $('*').css('color', configuration.fontColor);
    $('*').css('background-color', configuration.backgroundColor);
    $('*').css('font-family', configuration.fontFamily);
  });
}

$(() => {
  initialize();
  registerCallbacks();
  $('#history').click(function(){
    $(".command").focus();
  });
  platform();
  fetchSettings();
});
