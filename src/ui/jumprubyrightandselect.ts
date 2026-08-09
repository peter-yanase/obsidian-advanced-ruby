// OK
import { EditorSelection, type Text } from "@codemirror/state";
import { type EditorView } from "@codemirror/view";
import type AdvancedRuby from "main";
import { JUMPSEARCHWINDOW } from "utils/constants";
import { isInsideCode, isSourceMode, MDRubyRegex } from "utils/utils";

export function jumpRubyRightAndSelect(view: EditorView, plugin: AdvancedRuby) {
	if (isSourceMode(view)) return false;
	const cursorPos: number = view.state.selection.main.head;
	if (isInsideCode(cursorPos, view)) return false;
	const doc: Text = view.state.doc;
	const isRubyStart = doc.sliceString(cursorPos, cursorPos + 1) === "{";
	if (!isRubyStart) {
		plugin.lastJump = undefined;
		return false;
	}
	const end = Math.min(doc.length, cursorPos + JUMPSEARCHWINDOW);
	const slice = doc.sliceString(cursorPos, end);
	MDRubyRegex.lastIndex = 0;
	const match = MDRubyRegex.exec(slice);
	if (!match) {
		plugin.lastJump = undefined;
		return false;
	}
	const from: number = cursorPos + match.index;
	if (from !== cursorPos) {
		plugin.lastJump = undefined;
		return false;
	}
	const to: number = from + match[0].length;
	const backJump = plugin.lastJump === "left";
	plugin.lastJump = "right";
	view.dispatch({
		selection: EditorSelection.range(
			view.state.selection.main.anchor,
			backJump ? to - match[2]!.length - 1 : to,
		),
		scrollIntoView: true,
	});
	return true;
}
