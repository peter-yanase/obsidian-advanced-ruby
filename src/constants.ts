import { type Settings, type Syntax } from "./types";

export const DEFAULT_SETTINGS: Partial<Settings> = {
	//OK
	smartarrowkeys: true,

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

export const COLOR_OPTIONS: Record<string, string> = {
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

export const RUBY_POSITION_OPTIONS: Record<string, string> = {
	over: "over",
	under: "under",
};

export const RUBY_DISTRIBUTION_OPTIONS: Record<string, string> = {
	start: "start",
	center: "center",
	"space-between": "space-between",
	"space-around": "space-around",
};

export const CSS_VARIABLE_MAP: Partial<Record<keyof Settings, string>> = {
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

export const CSS_UNITS: Partial<Record<keyof Settings, string>> = {
	lv1RubySize: "%",
	lv1RubyRelativeOffset: "em",
	lv2RubySize: "%",
	lv2RubyRelativeOffset: "em",
};

export const MD_RUBY_SYNTAX: Syntax = {
	head: "{",
	divider: "|",
	tail: "}",
};

export const MD_RUBY_REGEX = new RegExp(
	[
		RegExp.escape(MD_RUBY_SYNTAX.head),
		"([^{\\n]+?)",
		RegExp.escape(MD_RUBY_SYNTAX.divider),
		"(.+?)",
		RegExp.escape(MD_RUBY_SYNTAX.tail),
	].join(""),
	"g",
);

export const HTML_RUBY_SYNTAX: Syntax = {
	head: "<ruby>",
	divider: "<rt>",
	tail: "</rt></ruby>",
};

export const HTML_RUBY_REGEX = new RegExp(
	[
		RegExp.escape(HTML_RUBY_SYNTAX.head),
		"(.+?)",
		RegExp.escape(HTML_RUBY_SYNTAX.divider),
		"(.+?)",
		RegExp.escape(HTML_RUBY_SYNTAX.tail),
	].join(""),
	"g",
);

export const CODE_REGEX = new RegExp(
	[
		"<code>[\\s\\S]+?<\\/code>",
		"```[\\s\\S]+?```",
		"``.+?``", // code with backticks
		"`.+?`",
	].join("|"),
	"g",
);

export const PLACEHOLDER_SYNTAX: Partial<Syntax> = {
	head: "@@PROTECTED",
	tail: "@@",
};

export const PLACEHOLDER_REGEX: RegExp = new RegExp(
	[
		RegExp.escape(PLACEHOLDER_SYNTAX.head!),
		"(\\d+)", // number
		RegExp.escape(PLACEHOLDER_SYNTAX.tail!),
	].join(""),
	"g",
);

export const ICONS = {
	removeRuby: "file-braces-corner",
	convertToHTML: "file-code",
	convertToMD: "file-braces",
	copyWithoutRuby: "clipboard-plus",
	wrap: "braces"

};

export const NAMES = {
	removeRuby: "Remove ruby",
	convertToHTML: "Convert to HTML syntax",
	convertToMD: "Convert to Markdown syntax",
	copyWithoutRuby: "Copy without ruby",
	wrap: "Add ruby wrapper"

};
