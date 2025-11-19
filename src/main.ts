import {
	Plugin,
	MarkdownView,
	sanitizeHTMLToDom,
	Notice,
	Editor,
} from "obsidian";
import { addMDRubyWrapper } from "./rubyutils";

const MDRubyRegex: RegExp = /{(.+?)\|(.+?)}/g;
const HTMLRubyRegex: RegExp = /<ruby>(.+?)<rt>(.+?)<\/rt><\/ruby>/g;
const notRendering: Set<string> = new Set(["CODE", "PRE"]);

function transformRubyBlocks(
	originalText: string,
	autoDetectRuby: boolean = false,
): string {
	let maxMutations: number = 5;
	let currentTextMutation: string = originalText;
	let previousTextMutation: string;
	let mutationCount: number = 0;
	let regex: RegExp = MDRubyRegex;
	let direction: string = "md-to-html";

	if (autoDetectRuby && !MDRubyRegex.test(originalText)) {
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
			return originalText;
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

	return currentTextMutation;
}

export default class AdvancedRuby extends Plugin {
	// eslint-disable-next-line require-await
	async onload() {
		this.registerMarkdownPostProcessor((element, context) => {
			// Skip early if no curly brackets
			if (!element.innerText.includes("{")) return;

			// Create walker
			const walker: TreeWalker = document.createTreeWalker(
				element,
				NodeFilter.SHOW_TEXT, // Only process nodes containing text
			);

			// Create array of nodes to mutate
			const nodesToMutate: Text[] = [];
			while (walker.nextNode()) {
				const candidateNode: Text = walker.currentNode as Text;
				const candidateNodeTag: string | undefined =
					candidateNode.parentElement?.tagName;
				if (candidateNodeTag && notRendering.has(candidateNodeTag))
					continue;
				nodesToMutate.push(candidateNode);
			}

			// Mutate nodes
			for (const nodeToMutate of nodesToMutate) {
				const originalText: string = nodeToMutate.nodeValue!;

				//Mutate text
				const newText: string = transformRubyBlocks(originalText);

				// Sanitize HTML
				const safeFragment: DocumentFragment =
					sanitizeHTMLToDom(newText);

				// Inject sanitized fragment into the document
				nodeToMutate.replaceWith(safeFragment);
			}
		});

		this.addCommand({
			id: "add-md-ruby-wrapper",
			name: "Wrap in Markdown ruby syntax",
			checkCallback: (checking: boolean) => {
				const markdownView: MarkdownView | null =
					this.app.workspace.getActiveViewOfType(MarkdownView);
				if (!markdownView) return false;
				if (markdownView.getMode() !== "source") return false;
				const editor: Editor = markdownView.editor;
				if (!editor) return false;
				const selection: string = editor.getSelection();
				if (!selection) return false;
				if (!checking) {
					addMDRubyWrapper(editor, selection);
				}
				return true;
			},
		});

		this.addCommand({
			id: "convert-between-formats",
			name: "Convert between Markdown and HTML ruby syntaxes",
			checkCallback: (checking: boolean) => {
				const markdownView: MarkdownView | null =
					this.app.workspace.getActiveViewOfType(MarkdownView);
				if (!markdownView) return false;
				if (markdownView.getMode() !== "source") return false;
				const editor: Editor = markdownView.editor;
				if (!editor) return false;
				if (!checking) {
					const fullText: string = editor.getValue();
					const convertedText: string = transformRubyBlocks(
						fullText,
						true,
					);
					editor.setValue(convertedText);
					new Notice("Ruby blocks converted successfully.");
				}
				return true;
			},
		});
	}
}
