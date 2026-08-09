// OK
import type AdvancedRuby from "main";
import { Prec } from "@codemirror/state";
import { keymap } from "@codemirror/view";
import { jumpRubyRight } from "./jumprubyright";
import { jumpRubyLeft } from "./jumprubyleft";
import { jumpRubyRightAndSelect } from "./jumprubyrightandselect";
import { jumpRubyLeftAndSelect } from "./jumprubyleftandselect";

export function smartArrowkeysExtension(plugin: AdvancedRuby) {
	return Prec.highest(
		keymap.of([
			{
				key: "ArrowRight",
				run: (view) => {
					if (!plugin.settings.smartarrows) return false;
					return jumpRubyRight(view, plugin);
				},
			},
			{
				key: "ArrowLeft",
				run: (view) => {
					if (!plugin.settings.smartarrows) return false;
					return jumpRubyLeft(view, plugin);
				},
			},
			{
				key: "Shift-ArrowRight",
				run: (view) => {
					if (!plugin.settings.smartarrows) return false;
					return jumpRubyRightAndSelect(view, plugin);
				},
			},
			{
				key: "Shift-ArrowLeft",
				run: (view) => {
					if (!plugin.settings.smartarrows) return false;
					return jumpRubyLeftAndSelect(view, plugin);
				},
			},
		]),
	);
}
