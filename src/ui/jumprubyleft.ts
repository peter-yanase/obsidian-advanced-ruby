// OK
import { EditorSelection, type Text } from "@codemirror/state";
import { type EditorView } from "@codemirror/view";
import type AdvancedRuby from "main";
import { JUMPSEARCHWINDOW } from "utils/constants";
import { isInsideCode, isSourceMode, MDRubyRegex } from "utils/utils";

export function jumpRubyLeft(view: EditorView, plugin: AdvancedRuby) {
	if (isSourceMode(view)) return false;
	const cursorPos: number = view.state.selection.main.head;
	if (cursorPos === 0) {
		plugin.lastJump = undefined;
		return false;
	}
	if (isInsideCode(cursorPos, view)) return false;
	const doc: Text = view.state.doc;
	const isRubyEnd: boolean =
		doc.sliceString(cursorPos - 1, cursorPos) === "}";
	if (!isRubyEnd) {
		plugin.lastJump = undefined;
		return false;
	}
	const start: number = Math.max(0, cursorPos - JUMPSEARCHWINDOW);
	const slice: string = doc.sliceString(start, cursorPos);
	MDRubyRegex.lastIndex = 0;
	for (const match of slice.matchAll(MDRubyRegex)) {
		const from: number = start + match.index;
		const to: number = from + match[0].length;
		if (to === cursorPos) {
			const backJump: boolean = plugin.lastJump === "right";
			plugin.lastJump = "left";
			view.dispatch({
				selection: EditorSelection.cursor(
					backJump ? to - match[2]!.length - 1 : from,
				),
				scrollIntoView: true,
			});
			return true;
		}
	}
	plugin.lastJump = undefined;
	return false;
}
