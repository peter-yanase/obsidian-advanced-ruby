import type { Editor } from "obsidian";

import { removeRuby } from "utils/removeRuby";

export function removeRubyFromSelection(editor: Editor, selection: string): void {
	editor.replaceSelection(removeRuby(selection));
}
