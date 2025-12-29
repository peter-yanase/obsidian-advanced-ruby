import { Plugin } from "obsidian";
import { addCommands } from "./ui/commands";
import { ARKeymap, ARKeymapCompartment } from "./ui/keymaps";
import { ARSettingTab } from "./ui/settingstab";
import { readingView } from "./rendering/readingview";
import { editingView } from "./rendering/editingview";
import { ARSettings, DEFAULT_SETTINGS } from "./types";

export default class AdvancedRuby extends Plugin {
	settings: ARSettings;

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData(),
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new ARSettingTab(this.app, this));

		this.registerMarkdownPostProcessor(readingView);

		this.registerEditorExtension(editingView);

		this.registerEditorExtension(
			ARKeymapCompartment.of(this.settings.smartarrows ? ARKeymap : []),
		);

		addCommands(this);
	}
}
