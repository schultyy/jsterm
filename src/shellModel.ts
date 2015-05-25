const ipc = require("ipc");

export class ShellModel {
  constructor() {
    ipc.on("execute-command", function(ev: any, arg: string){
      console.log("arg " + arg);
      ev.sender.send('command-results', arg);
    });
  }
}
