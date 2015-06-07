///<reference path="../typings/node/node.d.ts" />
/// <reference path="./environment"/>

import child_process = require("child_process");
import environment = require("./environment");

export interface Callbacks {
  stdout?: (data: string) => void;
  stderr?: (data: string) => void;
  close?: (data: string) => void;
}

export function execute(command: string, options: Array<string>,
                        env: environment.Environment, callbacks: Callbacks) {
    var process = child_process.spawn(command, options, {
      cwd: env.workingDirectory
    });
    if(callbacks.stdout){
      process.stdout.on('data', callbacks.stdout);
    }
    if(callbacks.stderr) {
      process.stderr.on('data', callbacks.stderr);
      process.on('error', callbacks.stderr);
    }
    if(callbacks.close) {
      process.on('close', callbacks.close);
    }
}
