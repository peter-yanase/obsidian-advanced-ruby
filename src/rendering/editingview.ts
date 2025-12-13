import {
	Decoration,
	ViewPlugin,
	ViewUpdate,
	WidgetType,
	EditorView,
} from "@codemirror/view";
import { RangeSetBuilder, EditorSelection } from "@codemirror/state";
import { MDRubyRegex } from "../utils/utils";

class RubyWidget extends WidgetType {
	constructor(
		private base: string,
		private ruby: string,
	) {
		super();
	}
	toDOM(view: EditorView) {
		const rubyEl = document.createElement("ruby");
		rubyEl.textContent = this.base;
		const rtEL = document.createElement("rt");
		rtEL.textContent = this.ruby;
		rubyEl.appendChild(rtEL);
		rubyEl.addEventListener("click", () => {
			view.dispatch({
				selection: EditorSelection.cursor(
					view.posAtDOM(rubyEl) + 2 + this.base.length,
				),
				scrollIntoView: true,
			});
		});
		return rubyEl;
	}
}

export const editingView = ViewPlugin.fromClass(
	class {
		decorations;

		constructor(view: EditorView) {
			this.decorations = this.buildDecorations(view);
		}

		update(update: ViewUpdate) {
			if (
				update.docChanged ||
				update.viewportChanged ||
				update.selectionSet
			) {
				this.decorations = this.buildDecorations(update.view);
			}
		}

		buildDecorations(view: EditorView) {
			const builder = new RangeSetBuilder<Decoration>();
			const text = view.state.doc.toString();
			const cursorPos = view.state.selection.main.head;

			for (let match; (match = MDRubyRegex.exec(text)); ) {
				const from = match.index;
				const to = from + match[0].length;

				const base = match[1];
				const ruby = match[2];

				if (cursorPos > from && cursorPos < to) continue;
				builder.add(
					from,
					to,
					Decoration.replace({ widget: new RubyWidget(base, ruby) }),
				);
			}

			return builder.finish();
		}
	},
	{
		decorations: (v) => v.decorations,
	},
);
