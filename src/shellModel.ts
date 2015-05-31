///<reference path="command.ts" />
///<reference path="environment.ts" />
'use strict';

var ipc = require("ipc");
import command = require("./command");
import environment = require("./environment");
import parser = require('./commandparser');

export class ShellModel {
  commands: Array<command.Command>;
  env: environment.Environment;
  constructor(workingDirectory: string) {
    this.env = new environment.Environment(workingDirectory);
    this.commands = new Array<command.Command>();
    this.commands.push(new command.Ls());
    this.commands.push(new command.Pwd());
    this.commands.push(new command.Cd());
  }
  registerCallback() {
    ipc.on("execute-command", (ev: any, arg: string) => {
      var parsedCommand = parser.parse(arg);
      var commandName = parsedCommand.shift();
      var cmd = this.resolve(commandName);
      if(cmd === null) {
        ev.sender.send('command-results', 'invalid command ' + commandName);
      } else {
        var results = <environment.Environment> cmd.execute(this.env, parsedCommand);
        if(results.workingDirectory) {
          this.env = results;
        }
        ev.sender.send('command-results', results);
      }
    });
  }
  resolve(cmdName: string): command.Command {
    for(var i = 0; i < this.commands.length; i++) {
      if(this.commands[i].canHandle(cmdName)){
        return this.commands[i];
      }
    }
    return null;
  }
}
