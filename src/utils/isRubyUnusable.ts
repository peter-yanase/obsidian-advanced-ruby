import { type Text } from "@codemirror/state";
import { type EditorView } from "@codemirror/view";

import { type Ruby } from "../types";

export function isRubyUnusable(ruby: Ruby, view: EditorView): boolean {
	const doc: Text = view.state.doc;
	const { start, end } = ruby;
	const rubyUnusable =
		// Out of range
		start > doc.length ||
		end > doc.length ||
		// Multiline
		doc.lineAt(start).number !== doc.lineAt(end).number;
	return rubyUnusable;
}
