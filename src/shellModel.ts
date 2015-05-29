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
    console.log("registering callback");
    ipc.on("execute-command", (ev: any, arg: string) => {
      var parsedCommand = parser.parse(arg);
      var commandName = parsedCommand.shift();
      var cmd = this.resolve(commandName);

      var results = cmd.execute(this.env, parsedCommand);
      ev.sender.send('command-results', results);
    });
  }
  resolve(cmdName: string): command.Command {
    for(var i = 0; i < this.commands.length; i++) {
      if(this.commands[i].canHandle(cmdName)){
        return this.commands[i];
      }
    }
    return new command.NullCommand();
  }
}
