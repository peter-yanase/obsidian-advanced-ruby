import { Plugin, MarkdownView, sanitizeHTMLToDom } from "obsidian";
import { addMDRubyWrapper } from "./rubyutils";

const MDRubyRegex: RegExp = /\{(.+?)\|(.+?)\}/g;
const notRendering: Set<string> = new Set(["CODE", "PRE"]);

export default class AdvancedRuby extends Plugin {
	async onload() {
		this.registerMarkdownPostProcessor((element, context) => {
			// Skip early if no curly brackets
			if (!element.innerText.includes("{")) return;

			// Create walker
			const walker: TreeWalker = document.createTreeWalker(
				element,
				NodeFilter.SHOW_TEXT // Only process nodes containing text
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
				let currentTextMutation: string = originalText;
				let previousTextMutation: string;
				const maxMutations: number = 5;
				let mutationCount: number = 0;
				do {
					previousTextMutation = currentTextMutation;
					currentTextMutation = currentTextMutation.replace(
						MDRubyRegex,
						(_, base, ruby) =>
							`<ruby>${base}<rt>${ruby}</rt></ruby>`
					);
					mutationCount++;
				} while (
					currentTextMutation !== previousTextMutation &&
					mutationCount < maxMutations
				);
				const newText: string = currentTextMutation;

				// Sanitize HTML
				const safeFragment = sanitizeHTMLToDom(newText);

				// Inject sanitized fragment into the document
				nodeToMutate.replaceWith(safeFragment);
			}
		});

		this.addCommand({
			id: "add-md-ruby-wrapper",
			name: "Wrap in Markdown ruby syntax",
			checkCallback: (checking: boolean) => {
				const markdownView =
					this.app.workspace.getActiveViewOfType(MarkdownView);
				if (!markdownView) return false;
				const editor = markdownView.editor;
				if (!editor) return false;
				const selection = editor.getSelection();
				if (!selection) return false;
				if (!checking) {
					addMDRubyWrapper(editor, selection);
				}
				return true;
			},
		});
	}
}
