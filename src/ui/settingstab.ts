import type { App, SettingDefinitionItem } from "obsidian";
import type AdvancedRuby from "main.ts";
import { PluginSettingTab } from "obsidian";
import {
	colorOptions,
	distributionOptions,
	positionOptions,
} from "utils/constants";

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
			{
				type: "group",
				heading: "Level 1 style settings",
				items: [
					{
						name: "LV1 base color",
						desc: "Inherits its parent by default.",
						render: (setting) => {
							setting.addDropdown((dropdown) =>
								dropdown
									.addOptions(colorOptions)
									.setValue(this.plugin.settings.lv1BaseColor)
									.onChange(async (value) => {
										this.plugin.settings.lv1BaseColor =
											value;
										await this.plugin.saveSettings();
									}),
							);
						},
					},
					{
						name: "LV1 ruby color",
						desc: "Inherits LV1 base color by default.",
						render: (setting) => {
							setting.addDropdown((dropdown) =>
								dropdown
									.addOptions(colorOptions)
									.setValue(this.plugin.settings.lv1RubyColor)
									.onChange(async (value) => {
										this.plugin.settings.lv1RubyColor =
											value;
										await this.plugin.saveSettings();
									}),
							);
						},
					},
					{
						name: "LV1 ruby size",
						desc: "Size compared to LV 1 base text in percentage.",
						render: (setting) => {
							setting.addSlider((slider) =>
								slider
									.setLimits(30, 80, 5)
									.setValue(this.plugin.settings.lv1RubySize)
									.onChange(async (value) => {
										this.plugin.settings.lv1RubySize =
											value;
										await this.plugin.saveSettings();
									}),
							);
						},
					},
					{
						name: "LV1 ruby position",
						render: (setting) => {
							setting.addDropdown((dropdown) =>
								dropdown
									.addOptions(positionOptions)
									.setValue(
										this.plugin.settings.lv1RubyPosition,
									)
									.onChange(async (value) => {
										this.plugin.settings.lv1RubyPosition =
											value;
										await this.plugin.saveSettings();
									}),
							);
						},
					},
					{
						name: "LV1 ruby relative offset",
						desc: "Uses em units, does not effect line height.",
						render: (setting) => {
							setting.addSlider((slider) =>
								slider
									.setLimits(-1, 1, 0.1)
									.setValue(
										this.plugin.settings
											.lv1RubyRelativeOffset,
									)
									.onChange(async (value) => {
										this.plugin.settings.lv1RubyRelativeOffset =
											value;
										await this.plugin.saveSettings();
									}),
							);
						},
					},
					{
						name: "LV1 ruby distribution",
						render: (setting) => {
							setting.addDropdown((dropdown) =>
								dropdown
									.addOptions(distributionOptions)
									.setValue(
										this.plugin.settings
											.lv1RubyDistribution,
									)
									.onChange(async (value) => {
										this.plugin.settings.lv1RubyDistribution =
											value;
										await this.plugin.saveSettings();
									}),
							);
						},
					},
				],
			},
			{
				type: "group",
				heading: "Level 2 style settings",
				items: [
					{
						name: "LV2 base color",
						desc: "Inherits its parent by default.",
						render: (setting) => {
							setting.addDropdown((dropdown) =>
								dropdown
									.addOptions(colorOptions)
									.setValue(this.plugin.settings.lv2BaseColor)
									.onChange(async (value) => {
										this.plugin.settings.lv2BaseColor =
											value;
										await this.plugin.saveSettings();
									}),
							);
						},
					},
					{
						name: "LV2 ruby color",
						desc: "Inherits LV2 base color by default.",
						render: (setting) => {
							setting.addDropdown((dropdown) =>
								dropdown
									.addOptions(colorOptions)
									.setValue(this.plugin.settings.lv2RubyColor)
									.onChange(async (value) => {
										this.plugin.settings.lv2RubyColor =
											value;
										await this.plugin.saveSettings();
									}),
							);
						},
					},
					{
						name: "LV2 ruby size",
						desc: "Size compared to LV2 base text in percentage.",
						render: (setting) => {
							setting.addSlider((slider) =>
								slider
									.setLimits(30, 80, 5)
									.setValue(this.plugin.settings.lv2RubySize)
									.onChange(async (value) => {
										this.plugin.settings.lv2RubySize =
											value;
										await this.plugin.saveSettings();
									}),
							);
						},
					},
					{
						name: "LV2 ruby position",
						render: (setting) => {
							setting.addDropdown((dropdown) =>
								dropdown
									.addOptions(positionOptions)
									.setValue(
										this.plugin.settings.lv2RubyPosition,
									)
									.onChange(async (value) => {
										this.plugin.settings.lv2RubyPosition =
											value;
										await this.plugin.saveSettings();
									}),
							);
						},
					},
					{
						name: "LV2 ruby relative offset",
						desc: "Uses em units, does not effect line height.",
						render: (setting) => {
							setting.addSlider((slider) =>
								slider
									.setLimits(-1, 1, 0.1)
									.setValue(
										this.plugin.settings
											.lv2RubyRelativeOffset,
									)
									.onChange(async (value) => {
										this.plugin.settings.lv2RubyRelativeOffset =
											value;
										await this.plugin.saveSettings();
									}),
							);
						},
					},
					{
						name: "LV2 ruby distribution",
						render: (setting) => {
							setting.addDropdown((dropdown) =>
								dropdown
									.addOptions(distributionOptions)
									.setValue(
										this.plugin.settings
											.lv2RubyDistribution,
									)
									.onChange(async (value) => {
										this.plugin.settings.lv2RubyDistribution =
											value;
										await this.plugin.saveSettings();
									}),
							);
						},
					},
				],
			},
		];
	}
}
