/// <reference path="../typings/node/node.d.ts" />
import fs = require('fs');
import env = require("./environment");

export interface Command {
  canHandle(commandName: string): boolean;
  execute(env: env.Environment, argumentList: Array<string>): any;
}

export class Ls implements Command {
  canHandle(commandName: string) {
    return commandName === 'ls';
  }

  execute(env: env.Environment, argumentList: Array<string>) {
    return fs.readdirSync(env.workingDirectory);
  }
}
