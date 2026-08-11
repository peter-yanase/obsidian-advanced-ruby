// OK
import { type EditorView } from "@codemirror/view";

import { type Ruby } from "./types";
import { isCursorInsideRuby, isInsideCode, isRubyUnusable } from "./utils";

export function getRubyUnderCursor(
	view: EditorView,
	cachedRuby: Ruby[],
): Ruby | undefined {
	let rubyUnderCursor: Ruby | undefined = undefined;

	cachedRuby.some((ruby) => {
		if (
			!isCursorInsideRuby(ruby, view) ||
			isInsideCode(ruby.start, view) ||
			isRubyUnusable(ruby, view)
		) {
			return false;
		}
		rubyUnderCursor = ruby;
		return true;
	});
	return rubyUnderCursor;
}
