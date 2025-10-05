import { Editor } from "obsidian";

// Wrap selected text in MD ruby
export function addMDRubyWrapper(
	editor: Editor,
	selected: string,
	reading?: string
): void {
	editor.replaceSelection(`{${selected}|${reading ?? ""}}`);
	if (!reading) {
		const cursor = editor.getCursor();
		editor.setCursor({ line: cursor.line, ch: cursor.ch - 1 });
	}
}
