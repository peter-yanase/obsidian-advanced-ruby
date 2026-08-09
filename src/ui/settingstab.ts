import type { App, SettingDefinitionItem } from "obsidian";
import type AdvancedRuby from "main";
import { PluginSettingTab } from "obsidian";
import {
	colorOptions,
	cssVariableMap,
	cssUnits,
	rubyDistributionOptions,
	rubyPositionOptions,
} from "utils/constants";
import { ARSettings } from "utils/types";

export class ARSettingTab extends PluginSettingTab {
	plugin: AdvancedRuby;

	constructor(app: App, plugin: AdvancedRuby) {
		super(app, plugin);
		this.plugin = plugin;
	}

	private async updateSetting<K extends keyof ARSettings>(
		key: K,
		value: ARSettings[K],
		unit: string = cssUnits[key] ?? "",
	) {
		this.plugin.settings[key] = value;
		await this.plugin.saveSettings();
		document.body.setCssProps({
			[cssVariableMap[key] as string]: `${value}${unit}`,
		});
	}

	getSettingDefinitions(): SettingDefinitionItem[] {
		return [
			{
				type: "group",
				heading: "Arrow key behavior",
				items: [
					{
						name: "Smart arrows keys",
						desc: "Jump over Markdown ruby in editing mode. Press the opposite arrow after a jump to edit the ruby.",
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
										await this.updateSetting(
											"lv1BaseColor",
											value,
										);
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
										await this.updateSetting(
											"lv1RubyColor",
											value,
										);
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
										await this.updateSetting(
											"lv1RubySize",
											value,
										);
									}),
							);
						},
					},
					{
						name: "LV1 ruby position",
						render: (setting) => {
							setting.addDropdown((dropdown) =>
								dropdown
									.addOptions(rubyPositionOptions)
									.setValue(
										this.plugin.settings.lv1RubyPosition,
									)
									.onChange(async (value) => {
										await this.updateSetting(
											"lv1RubyPosition",
											value,
										);
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
										await this.updateSetting(
											"lv1RubyRelativeOffset",
											value,
										);
									}),
							);
						},
					},
					{
						name: "LV1 ruby distribution",
						render: (setting) => {
							setting.addDropdown((dropdown) =>
								dropdown
									.addOptions(rubyDistributionOptions)
									.setValue(
										this.plugin.settings
											.lv1RubyDistribution,
									)
									.onChange(async (value) => {
										await this.updateSetting(
											"lv1RubyDistribution",
											value,
										);
									}),
							);
						},
					},
				],
			},
			{
				type: "group",
				heading: "Level  style settings",
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
										await this.updateSetting(
											"lv2BaseColor",
											value,
										);
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
										await this.updateSetting(
											"lv2RubyColor",
											value,
										);
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
										await this.updateSetting(
											"lv2RubySize",
											value,
										);
									}),
							);
						},
					},
					{
						name: "LV2 ruby position",
						render: (setting) => {
							setting.addDropdown((dropdown) =>
								dropdown
									.addOptions(rubyPositionOptions)
									.setValue(
										this.plugin.settings.lv2RubyPosition,
									)
									.onChange(async (value) => {
										await this.updateSetting(
											"lv2RubyPosition",
											value,
										);
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
										await this.updateSetting(
											"lv2RubyRelativeOffset",
											value,
										);
									}),
							);
						},
					},
					{
						name: "LV2 ruby distribution",
						render: (setting) => {
							setting.addDropdown((dropdown) =>
								dropdown
									.addOptions(rubyDistributionOptions)
									.setValue(
										this.plugin.settings
											.lv2RubyDistribution,
									)
									.onChange(async (value) => {
										await this.updateSetting(
											"lv2RubyDistribution",
											value,
										);
									}),
							);
						},
					},
				],
			},
		];
	}
}
