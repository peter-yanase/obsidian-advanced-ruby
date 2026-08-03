import type { ARSettings } from "utils/types.ts";
import { Plugin } from "obsidian";
import { addCommands } from "ui/commands.ts";
import { ARKeymap } from "ui/keymaps.ts";
import { ARSettingTab } from "ui/settingstab.ts";
import { DEFAULT_SETTINGS } from "utils/constants.ts";
import { editingView } from "rendering/editingview.ts";
import { readingView } from "rendering/readingview.ts";
import { rubyClassHandler } from "utils/rubyclassadded.ts";

export default class AdvancedRuby extends Plugin {
	settings!: ARSettings;

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

		this.registerEditorExtension(ARKeymap(this));

		addCommands(this);

		rubyClassHandler(document);
	}
}
