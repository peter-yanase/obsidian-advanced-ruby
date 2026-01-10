import { EditorView } from "@codemirror/view";
import { syntaxTree } from "@codemirror/language";
import { editorLivePreviewField } from "obsidian";

export const MDRubyRegex: RegExp = /{([^{]+?)\|(.+?)}/g;
export const HTMLRubyRegex: RegExp = /<ruby>(.+?)<rt>(.+?)<\/rt><\/ruby>/g;

const notRenderingRegex =
	/(`[^`]+?`|```[\s\S]+?```|<code>[\s\S]+?<\/code>|<pre>[\s\S]+?<\/pre>)/g;

export function transformRubyBlocks(
	originalText: string,
	autoDetectRuby: boolean = false,
): { text: string; direction: "md-to-html" | "html-to-md" } {
	let maxMutations: number = 5;
	let currentTextMutation: string = originalText;
	let previousTextMutation: string;
	let mutationCount: number = 0;
	let regex: RegExp = MDRubyRegex;
	let direction: "md-to-html" | "html-to-md" = "md-to-html";

	// Extract protected spans
	const protectedSpans: string[] = [];
	currentTextMutation = currentTextMutation.replace(
		notRenderingRegex,
		(match) => {
			protectedSpans.push(match);
			return `@@PROTECTED${protectedSpans.length - 1}@@`;
		},
	);

	if (autoDetectRuby && !MDRubyRegex.test(currentTextMutation)) {
		direction = "html-to-md";
	}

	let head: string, divider: string, tail: string;
	switch (direction) {
		case "md-to-html":
			head = "<ruby>";
			divider = "<rt>";
			tail = "</rt></ruby>";
			break;
		case "html-to-md":
			head = "{";
			divider = "|";
			tail = "}";
			regex = HTMLRubyRegex;
			break;
		default:
			return { text: originalText, direction };
	}

	do {
		previousTextMutation = currentTextMutation;
		currentTextMutation = currentTextMutation.replace(
			regex,
			(_, base, ruby) => {
				return `${head}${base}${divider}${ruby}${tail}`;
			},
		);
		mutationCount++;
	} while (
		currentTextMutation !== previousTextMutation &&
		mutationCount < maxMutations
	);

	// Restore protected spans
	currentTextMutation = currentTextMutation.replace(
		/@@PROTECTED(\d+)@@/g,
		(_, i) => protectedSpans[+i]!,
	);
	return { text: currentTextMutation, direction };
}

export function isInsideCode(view: EditorView, pos: number): boolean {
	let insideCode: boolean = false;

	syntaxTree(view.state).iterate({
		from: pos,
		to: pos + 1,
		enter: (node) => {
			if (node.name.includes("code")) {
				insideCode = true;
			}
		},
	});
	return insideCode;
}

export function isSourceMode(view: EditorView): boolean {
	return !view.state.field(editorLivePreviewField);
}
