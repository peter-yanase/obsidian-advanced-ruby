// OK
import { type Editor } from "obsidian";
import { SyntaxType } from "./types";
import { convertRubySyntax } from "./rubyblocktransformer";

export function convertAndReplace(editor: Editor, target: SyntaxType) {
	const text = convertRubySyntax(editor.getValue(), target);
	editor.setValue(text);
	//	editor.setValue(convertRubySyntax(editor.getValue(), target));
}
