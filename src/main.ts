import { Plugin } from "obsidian";

import { rubyPostProcessor } from "rendering/rubyPostProcessor";
import { rubyRenderingExtension } from "rendering/rubyRenderingExtension";
import { addCommands } from "ui/addCommands";
import { SettingTab } from "ui/SettingTab";
import { smartArrowkeysExtension } from "ui/smartArrowkeysExtension";
import { setCSSVariables } from "utils/setCSSVariables";
import { startRubyClassHandler } from "utils/startRubyClassHandler";
import { DEFAULT_SETTINGS } from "./constants";
import { type Jump, type Settings } from "./types";

export default class AdvancedRuby extends Plugin {
	declare settings: Settings;
	lastJump: Jump = undefined;

	async onload(): Promise<void> {
		await this.loadSettings();

		this.registerEditorExtension(rubyRenderingExtension);

		this.registerEditorExtension(smartArrowkeysExtension(this));

		this.registerMarkdownPostProcessor(rubyPostProcessor);

		this.addSettingTab(new SettingTab(this.app, this));

		addCommands(this);

		setCSSVariables(this.settings);

		startRubyClassHandler(document);
	}

	async loadSettings(): Promise<void> {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData(),
		);
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
	}
}
