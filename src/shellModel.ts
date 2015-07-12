///<reference path="command.ts" />
///<reference path="environment.ts" />
'use strict';

var ipc = require("ipc");
import command = require("./command");
import environment = require("./environment");
import parser = require('./commandparser');
import syscommand = require('./system_command');
import history = require('./historyModel');

export class ShellModel {
  commands: Array<any>;
  env: environment.Environment;
  history: history.HistoryModel;

  constructor(workingDirectory: string) {
    this.env = new environment.Environment(workingDirectory);
    this.commands = new Array<any>();
    this.history = new history.HistoryModel();
    this.commands.push(command.Ls);
    this.commands.push(command.Pwd);
    this.commands.push(command.Cd);
    this.commands.push(command.Exit);
    this.commands.push(command.Tail);
  }
  registerCallback() {
    ipc.on("execute-command", (event: any, arg: string) => {
      this.execute(event, arg);
      this.history.addCommand(arg);
    });
    ipc.on("last-command", (event: any, arg: string) => {
      event.sender.send('last-history-command', this.history.lastCommand());
    });
    ipc.on("next-command", (event: any, arg: string) => {
      event.sender.send('next-history-command', this.history.nextCommand());
    });
  }
  execute(event: any, arg: string) {
    var parsedCommand = parser.parse(arg);
    var commandName = parsedCommand.shift();
    var cmdClass = this.resolve(commandName);
    var stdout = function(data: string){
      event.sender.send('command-results', data.toString());
    };
    var stderr = function(data: string) {
      event.sender.send('command-results', data.toString());
    };
    var close = function(code: number, signal: any) {
      event.sender.send('command-exit', {
        code: code,
        signal: signal
      });
    }
    if(cmdClass === null) {
      syscommand.execute(commandName, parsedCommand, this.env, {
        stdout: stdout,
        stderr: stderr,
        close: close
      });
    } else {
      var cmd = new cmdClass(stdout, stderr);
      cmd.execute(this.env, parsedCommand, (workingDirectory) =>{
        this.env = workingDirectory;
        close(0, null);
      });
    }
  }
  resolve(cmdName: string) {
    for(var i = 0; i < this.commands.length; i++) {
      if(this.commands[i].canHandle(cmdName)){
        return this.commands[i];
      }
    }
    return null;
  }
}
