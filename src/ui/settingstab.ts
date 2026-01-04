import { App, MarkdownView, PluginSettingTab, Setting } from "obsidian";
import AdvancedRuby from "../main";
import { ARKeymapCompartment, ARKeymap } from "../ui/keymaps";

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
			.addToggle((c) =>
				c
					.setValue(this.plugin.settings.smartarrows)
					.onChange(async (v) => {
						this.plugin.settings.smartarrows = v;
						await this.plugin.saveSettings();
						const newKeymap = v ? ARKeymap : [];
						for (const leaf of this.plugin.app.workspace.getLeavesOfType(
							"markdown",
						)) {
							// @ts-expect-error, not typed
							const cm = (leaf.view as MarkdownView).editor.cm;
							cm?.dispatch({
								effects:
									ARKeymapCompartment.reconfigure(newKeymap),
							});
						}
					}),
			);
	}
}
