/// <reference path="../../typings/jquery/jquery.d.ts" />
/// <reference path="../../typings/backbone/backbone.d.ts" />
/// <reference path="../../typings/requirejs/require.d.ts" />
interface Window {
    $: JQueryStatic;
    Backbone: any;
    ipc: any;
}
declare class HistoryList extends Backbone.Collection<HistoryEntry> {
}
declare class HistoryEntry extends Backbone.Model {
    defaults(): {
        content: string;
    };
    initialize(): void;
}
declare class CommandEntry extends Backbone.Model {
    defaults(): {
        command: string;
    };
    initialize(): void;
}
declare class MainView extends Backbone.View<any> {
    history: HistoryList;
    commandView: any;
    commandModel: CommandEntry;
    constructor();
    render(): MainView;
    onCommand(ev: CommandEntry): void;
}
declare class CommandEntryView extends Backbone.View<CommandEntry> {
    model: CommandEntry;
    constructor(options?: any);
    render(): CommandEntryView;
    commandSubmit(ev: KeyboardEvent): void;
}
declare class HistoryEntryView extends Backbone.View<HistoryEntry> {
    constructor(args?: any);
    render(): HistoryEntryView;
}
