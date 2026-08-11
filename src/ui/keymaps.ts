// OK
import { Prec, type Extension } from "@codemirror/state";
import { keymap, type EditorView } from "@codemirror/view";

import AdvancedRuby from "main";
import { jumpRuby } from "utils/rubyjump";
import { type Jump } from "utils/types";

export function smartArrowkeysExtension(plugin: AdvancedRuby): Extension {
	const binding = (key: string, direction: Jump, select: boolean) => ({
		key,
		run: (view: EditorView) => {
			if (!plugin.settings.smartarrows) return false;
			return jumpRuby(view, plugin, direction, select);
		},
	});

	const keyMapExtension: Extension = Prec.highest(
		keymap.of([
			binding("ArrowRight", "right", false),
			binding("ArrowLeft", "left", false),
			binding("Shift-ArrowRight", "right", true),
			binding("Shift-ArrowLeft", "left", true),
		]),
	);
	return keyMapExtension;
}
