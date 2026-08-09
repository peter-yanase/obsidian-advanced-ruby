import { ARSettings } from "./types";

export const DEFAULT_SETTINGS: Partial<ARSettings> = {
	smartarrows: true,

	lv1BaseColor: "unset",
	lv1RubyColor: "unset",
	lv1RubySize: 50,
	lv1RubyPosition: "over",
	lv1RubyRelativeOffset: 0.2,
	lv1RubyDistribution: "space-around",

	lv2BaseColor: "unset",
	lv2RubyColor: "unset",
	lv2RubySize: 50,
	lv2RubyPosition: "under",
	lv2RubyRelativeOffset: -0.2,
	lv2RubyDistribution: "center",
};

export const colorOptions: Record<string, string> = {
	unset: "unset",
	"var(--color-red)": "red",
	"var(--color-orange)": "orange",
	"var(--color-yellow)": "yellow",
	"var(--color-green)": "green",
	"var(--color-cyan)": "cyan",
	"var(--color-blue)": "blue",
	"var(--color-purple)": "purple",
	"var(--color-pink)": "pink",
	"var(--color-base-50)": "base-50",
	"var(--color-base-60)": "base-60",
	"var(--color-base-70)": "base-70",
	"var(--color-accent)": "accent",
	"var(--color-accent-1)": "accent-1",
	"var(--color-accent-2)": "accent-2",
};

export const rubyPositionOptions: Record<string, string> = {
	over: "over",
	under: "under",
};

export const rubyDistributionOptions: Record<string, string> = {
	start: "start",
	center: "center",
	"space-between": "space-between",
	"space-around": "space-around",
};

export const cssVariableMap: Partial<Record<keyof ARSettings, string>> = {
	lv1BaseColor: "--ar-lv1-base-color",
	lv1RubyColor: "--ar-lv1-ruby-color",
	lv1RubySize: "--ar-lv1-ruby-size",
	lv1RubyPosition: "--ar-lv1-ruby-position",
	lv1RubyRelativeOffset: "--ar-lv1-ruby-relative-offset",
	lv1RubyDistribution: "--ar-lv1-ruby-distribution",
	lv2BaseColor: "--ar-lv2-base-color",
	lv2RubyColor: "--ar-lv2-ruby-color",
	lv2RubySize: "--ar-lv2-ruby-size",
	lv2RubyPosition: "--ar-lv2-ruby-position",
	lv2RubyRelativeOffset: "--ar-lv2-ruby-relative-offset",
	lv2RubyDistribution: "--ar-lv2-ruby-distribution",
};

export const cssUnits: Partial<Record<keyof ARSettings, string>> = {
	lv1RubySize: "%",
	lv1RubyRelativeOffset: "em",
	lv2RubySize: "%",
	lv2RubyRelativeOffset: "em",
};

export const JUMPSEARCHWINDOW: number = 20;
