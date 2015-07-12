'use strict';

export class HistoryModel {
  private executedCommands: Array<string>;
  private commandPointer: number;
  constructor() {
    this.executedCommands = [];
    this.commandPointer = 0;
  }
  addCommand(command: string): void {
    if(command === undefined || command === '') {
      return;
    }
    this.executedCommands.push(command);
    this.commandPointer = this.executedCommands.length - 1;
  }
  lastCommand() {
    if(this.commandPointer -1 >= 0) {
      return this.executedCommands[this.commandPointer--];
    }
    return this.executedCommands[this.commandPointer];
  }
  nextCommand() {
    if(this.commandPointer + 1 < this.executedCommands.length) {
      return this.executedCommands[this.commandPointer++];
    }
    return this.executedCommands[this.commandPointer];
  }
}
