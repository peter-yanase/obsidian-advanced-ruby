// TODO Do we need the depth option?
import type { EditorView } from "@codemirror/view";
import { syntaxTree } from "@codemirror/language";
import { editorLivePreviewField } from "obsidian";
import { Ruby } from "./types";

export const MDRubyRegex: RegExp = /{([^{]+?)\|(.+?)}/g;
export const HTMLRubyRegex: RegExp = /<ruby>(.+?)<rt>(.+?)<\/rt><\/ruby>/g;

export const notRenderingRegex =
	/(`[^`]+?`|```[\s\S]+?```|<code>[\s\S]+?<\/code>|<pre>[\s\S]+?<\/pre>)/g;


export function isSourceMode(view: EditorView): boolean {
	return !view.state.field(editorLivePreviewField);
}

export function isCursorInsideRuby(ruby: Ruby, view: EditorView): boolean {
	// OK
	const cursorPosition = view.state.selection.main.head;
	return cursorPosition > ruby.start && cursorPosition < ruby.end;
}

export function isCursorTouchingRuby(ruby: Ruby, view: EditorView): boolean {
	// OK
	const cursorPosition = view.state.selection.main.head;
	return cursorPosition === ruby.start || cursorPosition === ruby.end;
}

export function isInsideCode(position: number, view: EditorView): boolean {
	// OK
	let insideCode: boolean = false;

	syntaxTree(view.state).iterate({
		from: position,
		to: position + 1,
		enter: (node) => {
			if (node.name.includes("code")) {
				insideCode = true;
			}
		},
	});
	return insideCode;
}

export function isRubyMultiLine(ruby: Ruby, view: EditorView): boolean {
	// OK
	const doc = view.state.doc;
	const { start, end } = ruby;
	if (start > doc.length || end > doc.length) {
		return false;
	}
	return doc.lineAt(start).number !== doc.lineAt(end).number;
}

export function findCharAtDepthFrom( // OK
	target: string,
	depth: number,
	text: string,
	start: number,
): number | undefined {
	for (let index: number = start; index < text.length; index += 1) {
		const character: string | undefined = text[index];

		// Go down a level if an opening brace was found
		if (character === "{") depth += 1;
		// Go up a level if a closing brace was found
		else if (character === "}") depth -= 1;

		if (character === target && depth === 0) return index;
	}
	return;
}
