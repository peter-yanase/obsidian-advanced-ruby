// OK
import { type EditorView } from "@codemirror/view";

import { extractRuby } from "./rubyextractor";
import { type Ruby } from "./types";

export function getVisibleRuby(view: EditorView): Ruby[] {
	const visibleRuby: Ruby[] = [];
	for (const { from, to } of view.visibleRanges) {
		const documentSlice: string = view.state.sliceDoc(from, to);
		const offset = from;
		visibleRuby.push(...extractRuby(documentSlice, offset));
	}
	return visibleRuby;
}
