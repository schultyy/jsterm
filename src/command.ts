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
      this.navigateBack(environment).then((env)=>{
        finished(env);
      });
      return;
    }
    var newPath = path.join(environment.workingDirectory, newFolder);
    var fsExists = Promise.denodeify(fs.exists);
    new Promise(function(resolve, reject){
      fs.exists(newPath, (exists)=>{
        resolve(exists);
      });
    }).then((exists) => {
      if(exists) {
        finished(new env.Environment(newPath));
        return;
      }

      new Promise(function(resolve, reject){
        fs.exists(newFolder, (exists)=>{
          resolve(exists);
        });
      }).then((exists) => {
        if(exists) {
          finished(new env.Environment(newFolder));
        } else {
          finished(environment);
        }
      });
    });
  }

  private navigateBack(environment: env.Environment) {
    var newPath = this.pathByRemovingLastComponent(environment.workingDirectory);
    return new Promise(function(resolve, reject) {
      fs.exists(newPath, (exists) => {
        if(exists) {
          resolve(new env.Environment(newPath));
        } else {
          resolve(environment);
        }
      });
    });
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

export class Tail extends BaseCommand implements Command {
  static canHandle(commandName: string) {
    return commandName === 'tail';
  }

  execute(environment: env.Environment, argumentList: Array<string>, finished: (env: env.Environment) => void) {
    var fileName = argumentList.pop();

    var lines = this.statFile(fileName).then((stats: fs.Stats) => {
      if(stats.isFile()) {
        return this.readLines(fileName);
      } else {
        throw "Invalid argument " + fileName;
      }
    })
    .then((contents)=>{
      return Promise.resolve(this.takeLines(contents, this.lineCount(argumentList)));
    })
    .then((lines) => {
      lines.forEach((line) => this.stdout(line));
    })
    .catch((err) => {
      this.stderr(err);
    }).done(()=>{
      finished(environment);
    });
  }

  private lineCount(argumentList: Array<string>) {
    var indexCount = argumentList.indexOf("-n");
    if(indexCount === -1) {
      return 10;
    }
    return parseInt(argumentList[indexCount + 1]);
  }

  private takeLines(content: string, count: number) {
    var lines = content.split("\n");
    if(lines.length === 0 || lines.length <= count) {
      return lines;
    }
    return lines.slice(lines.length - count);
  }

  private readLines(filename: string) {
    return new Promise(function(resolve, reject) {
      fs.readFile(filename, (err, content) => {
        if(err)
          reject(err);
        else
          resolve(content.toString());
      });
    });
  }

  private statFile(fileName: string) {
    return new Promise(function(resolve, reject){
      fs.stat(fileName, (err, stats)=>{
        if(err)
          reject(err);
        else
          resolve(stats);
      });
    });
  }
}
