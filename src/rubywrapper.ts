import { Editor } from "obsidian";

// Wrap selected text in MD ruby markup
export function addMDRubyWrapper(
	editor: Editor,
	selected: string,
	reading?: string,
): void {
	editor.replaceSelection(`{${selected}|${reading ?? ""}}`);

	// Step inside the bracket for user input if no reading was found
	if (!reading) {
		const cursor = editor.getCursor();
		editor.setCursor({ line: cursor.line, ch: cursor.ch - 1 });
	}
}
