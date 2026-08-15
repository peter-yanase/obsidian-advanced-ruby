import { EditorSelection } from "@codemirror/state";
import { WidgetType, type EditorView } from "@codemirror/view";

import { createRubyElement } from "utils/createRubyElement";
import { renderRubyBaseText } from "utils/renderRubyBaseText";

export class RubyWidget extends WidgetType {
	constructor(
		private readonly base: string,
		private readonly ruby: string,
	) {
		super();
	}
	toDOM(view: EditorView): HTMLElement {
		const baseNodes: Node[] = renderRubyBaseText(this.base);
		const rubyEl: HTMLElement = createRubyElement(baseNodes, this.ruby);

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
}
