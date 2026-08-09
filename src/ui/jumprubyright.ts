// OK
import { EditorSelection, type Text } from "@codemirror/state";
import { type EditorView } from "@codemirror/view";
import type AdvancedRuby from "main";
import { JUMPSEARCHWINDOW } from "utils/constants";
import { isInsideCode, isSourceMode, MDRubyRegex } from "utils/utils";

export function jumpRubyRight(view: EditorView, plugin: AdvancedRuby): boolean {
	if (isSourceMode(view)) return false;
	const cursorPosition: number = view.state.selection.main.head;
	if (isInsideCode(cursorPosition, view)) return false;
	const doc: Text = view.state.doc;
	const isRubyStart: boolean =
		doc.sliceString(cursorPosition, cursorPosition + 1) === "{";
	if (!isRubyStart) {
		plugin.lastJump = undefined;
		return false;
	}
	const end: number = Math.min(doc.length, cursorPosition + JUMPSEARCHWINDOW);
	const slice: string = doc.sliceString(cursorPosition, end);
	MDRubyRegex.lastIndex = 0;
	const match: RegExpExecArray | null = MDRubyRegex.exec(slice);
	if (!match) {
		plugin.lastJump = undefined;
		return false;
	}
	const from: number = cursorPosition + match.index;
	if (from !== cursorPosition) {
		plugin.lastJump = undefined;
		return false;
	}
	const to: number = from + match[0].length;
	const backJump: boolean = plugin.lastJump === "left";
	plugin.lastJump = "right";
	view.dispatch({
		selection: EditorSelection.cursor(
			backJump ? to - match[2]!.length - 1 : to,
		),
		scrollIntoView: true,
	});
	return true;
}
