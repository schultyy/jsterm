/// <reference path="../typings/node/node.d.ts" />
import fs = require('fs');
import path = require('path');
import env = require("./environment");

export interface Command {
  canHandle(commandName: string): boolean;
  execute(env: env.Environment, argumentList: Array<string>): any;
}

export class NullCommand implements Command {
  canHandle(commandName: string) {
    return false;
  }
  execute(env: env.Environment, argumentList: Array<string>){

  }
}

export class Ls implements Command {
  canHandle(commandName: string) {
    return commandName === 'ls';
  }

  execute(env: env.Environment, argumentList: Array<string>) {
    return fs.readdirSync(env.workingDirectory);
  }
}

export class Pwd implements Command {
  canHandle(commandName: string) {
    return commandName === 'pwd';
  }
  execute(environment: env.Environment, argumentList: Array<string>){
    return environment.workingDirectory;
  }
}

export class Cd implements Command {
  canHandle(commandName: string) {
    return commandName === 'cd';
  }

  execute(environment: env.Environment, argumentList: Array<string>) {
    console.log("cd");
    if(argumentList.length === 0) {
      return environment;
    }
    var newFolder = argumentList[0];
    var newPath = path.join(environment.workingDirectory, newFolder);
    console.log("newPath", newPath);
    if(fs.exists(newPath)){
      return new env.Environment(newPath);
    }
    return environment;
  }
}