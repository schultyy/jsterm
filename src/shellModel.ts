///<reference path="command.ts" />
///<reference path="environment.ts" />
'use strict';

var ipc = require("ipc");
import command = require("./command");
import environment = require("./environment");
import parser = require('./commandparser');
import syscommand = require('./system_command');

export class ShellModel {
  commands: Array<command.Command>;
  env: environment.Environment;
  constructor(workingDirectory: string) {
    this.env = new environment.Environment(workingDirectory);
    this.commands = new Array<command.Command>();
    this.commands.push(new command.Ls());
    this.commands.push(new command.Pwd());
    this.commands.push(new command.Cd());
    this.commands.push(new command.Exit());
  }
  registerCallback() {
    ipc.on("execute-command", (event: any, arg: string) => { this.execute(event, arg); });
  }
  execute(event: any, arg: string) {
    var parsedCommand = parser.parse(arg);
    var commandName = parsedCommand.shift();
    var cmd = this.resolve(commandName);
    if(cmd === null) {
      syscommand.execute(commandName, parsedCommand, this.env, {
        stdout: function(data: string) {
          event.sender.send('command-results', data.toString());
        },stderr: function(data: string) {
          event.sender.send('command-results', data.toString());
        }
      });
    } else {
      var results = <environment.Environment> cmd.execute(this.env, parsedCommand);
      if(results.workingDirectory) {
        this.env = results;
      }
      event.sender.send('command-results', results);
    }
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
