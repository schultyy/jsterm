///<reference path="../../typings/jquery/jquery.d.ts" />
///<reference path="../../typings/backbone/backbone.d.ts" />
'use strict';

interface Window { $: JQueryStatic; Backbone: any; ipc: any; }

window.$ = require("jquery");
window.Backbone = require("backbone");
window.ipc = require('ipc');

class HistoryList extends Backbone.Collection<HistoryEntry> {

}

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
  history = new HistoryList();
  commandView: any;
  commandModel: CommandEntry;
  constructor () {
		super();
    this.setElement($('#terminal'), true);
    this.commandModel = new CommandEntry();

    this.commandModel.on("change", this.onCommand);
    _.bindAll(this, 'onCommand');

    this.render();
    this.registerCallback();
  }
  registerCallback() {
    window.ipc.on('command-results', (arg: any) => {
      if(arg instanceof Array) {
        arg.forEach((elem: string) => {
          var model = new HistoryEntry({
            'content': elem
          });
          $("#history").append(new HistoryEntryView({
            model: model
          }).render().$el);
        });
      }else {
        var model = new HistoryEntry({
          'content': arg
        });
        $("#history").append(new HistoryEntryView({
          model: model
        }).render().$el);
      }
    });
  }
  render() {
    var cmd = new CommandEntryView({
      model: this.commandModel
    });
    cmd.render();
    this.$el.append(cmd.$el);
    cmd.$el.focus();
    return this;
  }
  onCommand(ev: CommandEntry) {
    var model = new HistoryEntry({
      'content': ev.get('content')
    });
    $("#history").append(new HistoryEntryView({
      model: model
    }).render().$el);
    window.ipc.send('execute-command', model.get("content"));
  }
}

class CommandEntryView extends Backbone.View<CommandEntry>{
  model: CommandEntry;
  constructor(options?) {
    this.tagName = 'input';
    this.className = 'command';
    this.events = <any>{
      'keydown': 'commandSubmit'
    };
    super(options);
    _.bindAll(this, 'render', 'commandSubmit');
  }
  render() {
    this.$el.select();
    this.$el.focus();
    return this;
  }
  commandSubmit(ev: KeyboardEvent) {
    if(ev.keyCode == 13 && this.$el.val() !== '') {

      this.model.set('content', this.$el.val());
      this.$el.val('');
      this.$el.focus();
    }
  }
}

class HistoryEntryView extends Backbone.View<HistoryEntry> {
  constructor(args?) {
    this.tagName = 'li';
    this.className = 'historyEntry';
    super(args);
  }
  render() {
    var pre = $("<pre>");
    pre.text(this.model.get("content").toString());
    this.$el.html(pre.html());
    return this;
  }
}

$(() => {
  new MainView();
});
