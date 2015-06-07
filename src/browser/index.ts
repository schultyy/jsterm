///<reference path="../../typings/jquery/jquery.d.ts" />
'use strict';

interface Window { $: JQueryStatic; ipc: any; }

window.$ = require("jquery");
window.ipc = require('ipc');

function sendCommand(ev: KeyboardEvent) {
  var command = $('.command').val();
  if(ev.keyCode == 13 && command !== '') {
    $(".command").val('').focus();
    historyEntry(command);
    window.ipc.send('execute-command', command);
  }
}

function initialize() : void {
  var commandInput = $("<input>");
  commandInput.addClass("command");
  commandInput.keydown(sendCommand);
  $("#terminal").append(commandInput);
  commandInput.focus();
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
    });
}

$(() => {
  initialize();
  registerCallbacks();
});
