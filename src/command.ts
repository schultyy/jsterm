/// <reference path="../typings/node/node.d.ts" />
import fs = require('fs');
import env = require("./environment");

module Commands {
  interface Command {
    canHandle(commandName: string): boolean;
    execute(env: env.Environment, argumentList: Array<string>): any;
  }

  class Ls implements Command {
    canHandle(commandName: string) {
      return commandName === 'ls';
    }

    execute(env: env.Environment, argumentList: Array<string>) {
      return fs.readdirSync(env.workingDirectory);
    }
  }
}
