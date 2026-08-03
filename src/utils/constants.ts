export const DEFAULT_SETTINGS = {
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

export const colorOptions = {
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

export const positionOptions = {
	over: "over",
	under: "under",
};

export const distributionOptions = {
	start: "start",
	center: "center",
	"space-between": "space-between",
	"space-around": "space-around",
};

export const dontRender = new Set(["CODE", "PRE"]);
