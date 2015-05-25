///<reference path="command.ts" />
const ipc = require("ipc");
import command = require("./command");
import environment = require("./environment");

export class ShellModel {
  commands: Array<command.Command>;
  env: environment.Environment;
  constructor() {
    this.env = new environment.Environment('/home');
    this.commands = new Array<command.Command>();
    this.commands.push(new command.Ls());
  }
  registerCallback() {
    ipc.on("execute-command", function(ev: any, arg: string){
      console.log("arg " + arg);
      ev.sender.send('command-results', arg);
    });
  }
  resolve(cmdName: string) {
    // this.commands.find(function(cmd: command.Command) {
    //   return cmd.canHandle(cmdName);
    // });
  }
}
