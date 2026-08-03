import type { ARSettings } from "./types";

export function refreshARStyle(settings: ARSettings) {
	document.body.setCssProps({
		"--ar-lv1-base-color": `${settings.lv1BaseColor}`,
		"--ar-lv1-ruby-color": `${settings.lv1RubyColor}`,
		"--ar-lv1-ruby-size": `${settings.lv1RubySize}%`,
		"--ar-lv1-ruby-position": `${settings.lv1RubyPosition}`,
		"--ar-lv1-ruby-relative-offset": `${settings.lv1RubyRelativeOffset}em`,
		"--ar-lv1-ruby-distribution": `${settings.lv1RubyDistribution}`,

		"--ar-lv2-base-color": `${settings.lv2BaseColor}`,
		"--ar-lv2-ruby-color": `${settings.lv2RubyColor}`,
		"--ar-lv2-ruby-size": `${settings.lv2RubySize}%`,
		"--ar-lv2-ruby-position": `${settings.lv2RubyPosition}`,
		"--ar-lv2-ruby-relative-offset": `${settings.lv2RubyRelativeOffset}em`,
		"--ar-lv2-ruby-distribution": `${settings.lv2RubyDistribution}`,
	});
}