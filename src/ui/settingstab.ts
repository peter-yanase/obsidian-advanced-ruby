import type { App, SettingDefinitionItem } from "obsidian";
import type AdvancedRuby from "main.ts";
import { PluginSettingTab } from "obsidian";

export class ARSettingTab extends PluginSettingTab {
	plugin: AdvancedRuby;

	constructor(app: App, plugin: AdvancedRuby) {
		super(app, plugin);
		this.plugin = plugin;
	}

	getSettingDefinitions(): SettingDefinitionItem[] {
		return [
			{
				type: "group",
				heading: "Arrow key behavior",
				items: [
					{
						name: "Smart arrows keys",
						desc: "Jump over Markdown ruby in editing mode. Press the opposite arrow after a jump to edit ruby.",
						control: {
							type: "toggle",
							key: "smartarrows",
						},
					},
				],
			},
		];
	}
}
