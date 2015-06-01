///<reference path="../typings/node/node.d.ts" />
import child_process = require("child_process");

export interface Callbacks {
  stdout?: (data: string) => void;
  stderr?: (data: string) => void;
  close?: (data: string) => void;
}

export function execute(command: string, options: Array<string>, callbacks: Callbacks) {
    var process = child_process.spawn(command, options);
    if(callbacks.stdout){
      process.stdout.on('data', callbacks.stdout);
    }
    if(callbacks.stderr) {
      process.stderr.on('data', callbacks.stderr);
    }
    if(callbacks.close) {
      process.on('close', callbacks.close);
    }
}
