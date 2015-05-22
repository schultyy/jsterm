///<reference path="../../typings/jquery/jquery.d.ts" />
///<reference path="../../typings/backbone/backbone.d.ts" />
///<reference path="../../typings/requirejs/require.d.ts" />
'use strict';

interface Window { $: JQueryStatic; Backbone: any; }

window.$ = require("jquery");
window.Backbone = require("backbone");

class MainView extends Backbone.View<any> {
  template: (data: any) => string;

  render() {
    var header = $("<div>");
    header.html("foo bar baz");
    this.$el.append(header);
    return this;
  }
}

$(document).ready(function(){
  var mainView = new MainView({
    el: $(".container")
  });
  mainView.render();
});
