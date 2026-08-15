import { type EditorView } from "@codemirror/view";

import { type Ruby } from "../types";

export function isCursorInsideRuby(ruby: Ruby, view: EditorView): boolean {
	const cursorPosition = view.state.selection.main.head;
	return cursorPosition > ruby.start && cursorPosition < ruby.end;
}
