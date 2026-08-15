import { EditorPosition, type Editor } from "obsidian";

// Wrap selected text in MD ruby markup
export function addMDRubyWrapper(editor: Editor, selection: string): void {
	editor.replaceSelection(`{${selection}|}`);

	// Step inside the bracket for user input
	const cursor: EditorPosition = editor.getCursor();
	editor.setCursor({ line: cursor.line, ch: cursor.ch - 1 });
}
