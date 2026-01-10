import { App, PluginSettingTab, Setting } from "obsidian";
import AdvancedRuby from "../main";

export class ARSettingTab extends PluginSettingTab {
	plugin: AdvancedRuby;

	constructor(app: App, plugin: AdvancedRuby) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl).setHeading().setName("Arrow key behavior");

		new Setting(containerEl)
			.setName("Smart arrows keys")
			.setDesc(
				"Jump over Markdown ruby in editing mode. Press the opposite arrow after a jump to edit ruby.",
			)
			.addToggle((component) =>
				component
					.setValue(this.plugin.settings.smartarrows)
					.onChange(async (value) => {
						this.plugin.settings.smartarrows = value;
						await this.plugin.saveSettings();
					}),
			);
	}
}
