// OK
import { type EditorView } from "@codemirror/view";
import { type Ruby } from "./types";
import { isCursorInsideRuby, isInsideCode, isRubyMultiLine } from "./utils";

export function getRubyUnderCursor(view: EditorView, cachedRuby: Ruby[]) {
	let rubyUnderCursor: Ruby | undefined = undefined;

	cachedRuby.some((ruby) => {
		if (
			!isCursorInsideRuby(ruby, view) ||
			isRubyMultiLine(ruby, view) ||
			isInsideCode(ruby.start, view)
		) {
			return false;
		}
		rubyUnderCursor = ruby;
		return true;
	});
	return rubyUnderCursor;
}
