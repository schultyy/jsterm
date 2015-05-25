///<reference path="command.ts" />
const ipc = require("ipc");
import command = require("./command");
import environment = require("./environment");

export class ShellModel {
  commands: Array<command.Command>;
  env: environment.Environment;
  constructor(workingDirectory: string) {
    this.env = new environment.Environment(workingDirectory);
    this.commands = new Array<command.Command>();
    this.commands.push(new command.Ls());
  }
  registerCallback() {
    ipc.on("execute-command", (ev: any, arg: string) => {
      var cmd = this.resolve(arg);
      var results = cmd.execute(this.env, []);
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
