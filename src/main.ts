// OK
import { Plugin } from "obsidian";

import { rubyRenderingExtension } from "rendering/editingview";
import { rubyPostProcessor } from "rendering/readingview";
import { addCommands } from "ui/commands";
import { smartArrowkeysExtension } from "ui/keymaps";
import { ARSettingTab } from "ui/settingstab";
import { DEFAULT_SETTINGS } from "utils/constants";
import { startRubyClassHandler } from "utils/rubyclassadder";
import { setCSSVariables } from "utils/stylebuilder";
import { type ARSettings, type Jump } from "utils/types";

export default class AdvancedRuby extends Plugin {
	declare settings: ARSettings;
	lastJump: Jump = undefined;

	async onload(): Promise<void> {
		await this.loadSettings(); // OK

		this.registerEditorExtension(rubyRenderingExtension); // OK

		this.registerEditorExtension(smartArrowkeysExtension(this)); // OK

		this.registerMarkdownPostProcessor(rubyPostProcessor);

		this.addSettingTab(new ARSettingTab(this.app, this));

		addCommands(this); // OK

		setCSSVariables(this.settings); // OK

		startRubyClassHandler(document); // OK
	}

	async loadSettings(): Promise<void> {
		// OK
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData(),
		);
	}

	async saveSettings(): Promise<void> {
		// OK
		await this.saveData(this.settings);
	}
}
