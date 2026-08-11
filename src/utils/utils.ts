// TODO Do we need the depth option?
import { syntaxTree } from "@codemirror/language";
import type { EditorView } from "@codemirror/view";
import { editorLivePreviewField } from "obsidian";
import { MD_RUBY_SYNTAX } from "./constants";
import { Ruby, Syntax } from "./types";
import { Text } from "@codemirror/state";

export function isSourceMode(view: EditorView): boolean {
	// OK
	const sourceMode: boolean = !view.state.field(editorLivePreviewField);
	return sourceMode;
}

export function isCursorInsideRuby(ruby: Ruby, view: EditorView): boolean {
	// OK
	const cursorPosition = view.state.selection.main.head;
	const cursorInsideRuby: boolean =
		cursorPosition > ruby.start && cursorPosition < ruby.end;
	return cursorInsideRuby;
}

export function isCursorTouchingRuby(ruby: Ruby, view: EditorView): boolean {
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

export function isRubyUnusable(ruby: Ruby, view: EditorView): boolean {
	// OK
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

export function findCharAtDepthFrom( // OK
	target: string,
	depth: number,
	text: string,
	start: number,
	limit: number = 2,
): number | undefined {
	const { head: openingBrace, tail: closingBrace }: Syntax = MD_RUBY_SYNTAX;
	for (let index: number = start; index < text.length; index += 1) {
		if (depth > limit) return;
		const character: string | undefined = text[index];
		if (character === openingBrace) depth += 1;
		else if (character === closingBrace) depth -= 1;
		if (character === target && depth === 0) return index;
	}
	return;
}
