import type { EditorView } from "@codemirror/view";
import type { Ruby } from "utils/types";
import { EditorSelection } from "@codemirror/state";
import { WidgetType } from "@codemirror/view";
import { extractRuby } from "utils/rubyextractor";

export class RubyWidget extends WidgetType {
	constructor(
		private readonly base: string,
		private readonly ruby: string,
	) {
		super();
	}
	toDOM(view: EditorView) {
		const baseNodes: Node[] = this.renderRubyBaseText(this.base);
		const rubyEl = this.createRubyElement(baseNodes, this.ruby);

		// Move the cursor behind the pipe if the user clicks on the ruby
		rubyEl.addEventListener("click", () => {
			view.dispatch({
				selection: EditorSelection.cursor(
					view.posAtDOM(rubyEl) + 1 + this.base.length + 1,
				),
			});
		});

		return rubyEl;
	}

	private renderRubyBaseText(text: string): Node[] {
		const nodes: Node[] = [];
		const rubyMatches: Ruby[] = extractRuby(text, 0);

		if (rubyMatches.length > 0) {
			let pointerPosition: number = 0;
			for (const rubyMatch of rubyMatches) {
				// Add the text before the match
				if (pointerPosition < rubyMatch.start)
					nodes.push(
						activeDocument.createTextNode(
							text.slice(pointerPosition, rubyMatch.start),
						),
					);

				// Add the ruby
				nodes.push(
					this.createRubyElement(
						this.renderRubyBaseText(rubyMatch.base),
						rubyMatch.ruby,
					),
				);

				pointerPosition = rubyMatch.end;
			}

			// Add the remaining text
			if (pointerPosition < text.length)
				nodes.push(
					activeDocument.createTextNode(text.slice(pointerPosition)),
				);
		}
		// Push the whole text if no ruby was found
		else {
			nodes.push(activeDocument.createTextNode(text));
		}

		return nodes;
	}

	private createRubyElement(baseNodes: Node[], ruby: string): HTMLElement {
		const rubyEl: HTMLElement = createEl("ruby");

		// Render nested ruby first
		for (const node of baseNodes) rubyEl.appendChild(node);

		// Add the parent's annotation
		const rtEl: HTMLElement = createEl("rt");
		rtEl.textContent = ruby;
		rubyEl.appendChild(rtEl);

		return rubyEl;
	}
}
