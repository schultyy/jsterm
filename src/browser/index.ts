///<reference path="../../typings/jquery/jquery.d.ts" />
///<reference path="../../typings/backbone/backbone.d.ts" />
///<reference path="../../typings/requirejs/require.d.ts" />
'use strict';

interface Window { $: JQueryStatic; Backbone: any; }

window.$ = require("jquery");
window.Backbone = require("backbone");

class HistoryEntry extends Backbone.Model {
  defaults() {
    return {
      content: ''
    };
  }
  initialize(){
    if(!this.get('content')){
      this.set({'content': this.defaults().content });
    }
  }
}

class CommandEntry extends Backbone.Model {
  defaults() {
    return {
      command: ''
    };
  }
  initialize() {
    if(!this.get('command')){
      this.set({'command': this.defaults().command });
    }
  }
}

class MainView extends Backbone.View<any> {
  constructor () {
		super();
    this.setElement($('#terminal'), true);
    var cmdModel = new CommandEntry();
    var cmd = new CommandEntryView({
      model: cmdModel
    });
    cmd.render();
    this.$el.append(cmd.$el);
  }
  render() {
    return this;
  }
}

class CommandEntryView extends Backbone.View<CommandEntry>{
  model: CommandEntry;
  constructor(options? ) {
    this.tagName = 'input';
    this.events = <any>{};
    super(options);
    _.bindAll(this, 'render');
    this.model.bind('change', this.render);
  }
  render() {
    var input = $('<input>');
    this.$el.append(input);
    this.$el.focus();
    return this;
  }
}

class HistoryEntryView extends Backbone.View<HistoryEntry> {}

$(() => {
  new MainView();
});
