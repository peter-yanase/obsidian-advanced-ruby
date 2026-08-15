import { type Editor } from "obsidian";

import { type SyntaxType } from "../types";
import { convertRubySyntax } from "./convertRubySyntax";

export function convertAndReplace(editor: Editor, target: SyntaxType): void {
	const originalText: string = editor.getValue();
	const newText: string = convertRubySyntax(originalText, target);
	editor.setValue(newText);
}
