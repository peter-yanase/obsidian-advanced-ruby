import type { ARSettings } from "utils/types.ts";
import { Plugin } from "obsidian";
import { addCommands } from "ui/commands.ts";
import { smartarrowExtension } from "ui/keymaps.ts";
import { ARSettingTab } from "ui/settingstab.ts";
import { DEFAULT_SETTINGS } from "utils/constants.ts";
import { startRubyClassHandler } from "utils/rubyclassadder.ts";
import { setCSSVariables } from "utils/stylebuilder.ts";
import { rubyRenderingExtension } from "rendering/editingview.ts";
import { rubyPostProcessor } from "rendering/readingview.ts";

export default class AdvancedRuby extends Plugin {
	settings!: ARSettings;

	async onload() {
		await this.loadSettings();

		this.registerEditorExtension(rubyRenderingExtension);

		this.registerEditorExtension(smartarrowExtension(this));

		this.registerMarkdownPostProcessor(rubyPostProcessor);

		this.addSettingTab(new ARSettingTab(this.app, this));

		addCommands(this);

		setCSSVariables(this.settings);

		startRubyClassHandler(document);
	}

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
}
