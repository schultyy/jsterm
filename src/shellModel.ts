const ipc = require("ipc");

export class ShellModel {
  constructor() {
    ipc.on("execute-command", function(event: any, arg: string){
      console.log("arg " + arg);
      event.sender.send('command-results', arg);
    });
  }
}
