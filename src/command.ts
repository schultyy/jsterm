/// <reference path="../typings/node/node.d.ts" />
'use strict';
import fs = require('fs');
import path = require('path');
import env = require("./environment");
//import process = require("process");

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
    var files = fs.readdirSync(env.workingDirectory);
    if(argumentList.indexOf('-a') == -1) {
      return this.filterHiddenFiles(files);
    }
    return files;
  }

  private filterHiddenFiles(files: Array<string>) {
    return files.map(function(file) {
        if((/(^|.\/)\.+[^\/\.]/g).test(file)){
          return null;
        }
        return file;
    });
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
    if(argumentList.length === 0) {
      return environment;
    }
    var newFolder = argumentList[0];
    if(newFolder === "..") {
      return this.navigateBack(environment);
    }
    var newPath = path.join(environment.workingDirectory, newFolder);
    if(fs.existsSync(newPath)){
      return new env.Environment(newPath);
    }
    else if(fs.existsSync(newFolder)) {
      return new env.Environment(newFolder);
    }
    return environment;
  }

  private navigateBack(environment: env.Environment) {
    var newPath = this.pathByRemovingLastComponent(environment.workingDirectory);
    if(fs.existsSync(newPath)){
      return new env.Environment(newPath);
    }
  }

  private pathByRemovingLastComponent(path: string): string {
    return path.substring(0, path.lastIndexOf("/"));
  }
}

export class Exit implements Command {
  canHandle(commandName: string) {
    return commandName === 'exit';
  }

  execute(environment: env.Environment, argumentList: Array<string>) {
    process.exit();
  }
}
