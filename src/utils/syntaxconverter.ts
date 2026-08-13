// OK
import { type Editor } from "obsidian";

import { convertRubySyntax } from "./rubyblocktransformer";
import { SyntaxType } from "./types";

export function convertAndReplace(editor: Editor, target: SyntaxType): void {
	const originalText: string = editor.getValue();
	const newText: string = convertRubySyntax(originalText, target);
	editor.setValue(newText);
}
