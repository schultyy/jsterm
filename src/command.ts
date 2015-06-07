/// <reference path="../typings/node/node.d.ts" />
'use strict';
import fs = require('fs');
import path = require('path');
import env = require("./environment");
var Promise = require("promise");

export interface Command {
  execute(env: env.Environment, argumentList: Array<string>, finished: (env: env.Environment)=>void): void;
}

export class BaseCommand {
  stdout: (data: any) => void;
  stderr: (data: any) => void;
  constructor(stdout: (data: string) => void,
  stderr: (data: string) => void){
    this.stdout = stdout;
    this.stderr = stderr;
  }
}

export class Ls extends BaseCommand implements Command {
  static canHandle(commandName: string) {
    return commandName === 'ls';
  }

  execute(env: env.Environment, argumentList: Array<string>, finished: (env: env.Environment) => void) {
    var readdir = Promise.denodeify(fs.readdir);
    readdir(env.workingDirectory).done((files, error) => {
      if(error) {
        this.stderr(error.message);
        return;
      }
      if(argumentList.indexOf('-a') == -1) {
        this.filterHiddenFiles(files).forEach((file) => {
          if(file === null) return;
          this.stdout(file.toString());
        });
      }
      else {
        files.forEach((file) => {
          this.stdout(file.toString());
        });
      }

      finished(env);
    });
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

export class Pwd extends BaseCommand implements Command {
  static canHandle(commandName: string) {
    return commandName === 'pwd';
  }
  execute(environment: env.Environment, argumentList: Array<string>, finished: (env: env.Environment) => void){
    this.stdout(environment.workingDirectory);
    finished(environment);
  }
}

export class Cd extends BaseCommand implements Command {
  static canHandle(commandName: string) {
    return commandName === 'cd';
  }

  execute(environment: env.Environment, argumentList: Array<string>, finished: (env: env.Environment) => void) {
    if(argumentList.length === 0) {
      finished(environment);
      return;
    }
    var newFolder = argumentList[0];
    if(newFolder === "..") {
      finished(this.navigateBack(environment));
      return;
    }
    var newPath = path.join(environment.workingDirectory, newFolder);
    if(fs.existsSync(newPath)){
      finished(new env.Environment(newPath));
    }
    else if(fs.existsSync(newFolder)) {
      finished(new env.Environment(newFolder));
    }
    else {
      finished(environment);
    }
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

export class Exit extends BaseCommand implements Command {
  static canHandle(commandName: string) {
    return commandName === 'exit';
  }

  execute(environment: env.Environment, argumentList: Array<string>, finished: (env: env.Environment) => void) {
    process.exit();
  }
}
