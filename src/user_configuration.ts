///<reference path="../typings/node/node.d.ts" />
import fs = require('fs');
import path = require("path");
import utils = require('./utils');
var Promise = require("promise");

export class UserConfiguration {
  fontColor: string;
  fontsize: number;
  backgroundColor: string;

  constructor(args?: any) {
    if(args) {
      this.fontsize = args.fontsize;
      this.fontColor = args.fontColor;
      this.backgroundColor = args.backgroundColor;
    } else {
      this.defaults();
    }
  }

  private defaults() {
    this.backgroundColor = "#0B1D2E";
    this.fontColor = "#FCFDF2";
    this.fontsize = 12;
  }
}


export function loadConfiguration() {
  return readFile(path.join(utils.getUserHome(), ".jstermrc"))
  .then((contents) => { return Promise.resolve(JSON.parse(contents)); })
  .then((configObj) => {
    return Promise.resolve(new UserConfiguration(configObj))
  })
  .catch((err) => {
    console.error(err);
    return new UserConfiguration();
  })
}

function readFile(filename: string) {
  return new Promise(function(resolve, reject) {
    fs.readFile(filename, (err,content) => {
      if(err) {
        return reject(err);
      } else {
        resolve(content.toString());
      }
    });
  });
}
