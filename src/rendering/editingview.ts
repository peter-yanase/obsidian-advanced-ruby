import {
	Decoration,
	ViewPlugin,
	ViewUpdate,
	WidgetType,
	EditorView,
	PluginValue,
	DecorationSet,
	PluginSpec,
} from "@codemirror/view";
import { editorLivePreviewField } from "obsidian";
import { RangeSetBuilder, EditorSelection } from "@codemirror/state";
import { MDRubyRegex } from "../utils/utils";
import { syntaxTree } from "@codemirror/language";

class RubyWidget extends WidgetType {
	constructor(
		private readonly base: string,
		private readonly ruby: string,
	) {
		super();
	}
	toDOM(view: EditorView) {
		const rubyEl: HTMLElement = document.createElement("ruby");
		rubyEl.innerText = this.base;
		const rtEL: HTMLElement = document.createElement("rt");
		rtEL.innerText = this.ruby;
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

class ARViewPlugin implements PluginValue {
	decorations: DecorationSet;

	constructor(view: EditorView) {
		this.decorations = this.buildDecorations(view);
	}

	update(update: ViewUpdate): void {
		const sourceMode: boolean = update.state.field(editorLivePreviewField)
			? false
			: true;

		if (sourceMode) {
			this.decorations = Decoration.none;
			return;
		}

		if (
			update.docChanged ||
			update.viewportChanged ||
			update.selectionSet
		) {
			this.decorations = this.buildDecorations(update.view);
		}
	}

	private buildDecorations(view: EditorView): DecorationSet {
		const builder = new RangeSetBuilder<Decoration>();
		const cursorPos: number = view.state.selection.main.head;

		for (let { from, to } of view.visibleRanges) {
			const text = view.state.sliceDoc(from, to);

			let match: RegExpExecArray | null;

			while ((match = MDRubyRegex.exec(text)) !== null) {
				const start: number = from + match.index;
				const end: number = start + match[0].length;

				const base: string = match[1]!;
				const ruby: string = match[2]!;

				if (
					this.isInsideCode(view, start) ||
					this.isCursorInside(start, end, cursorPos) ||
					this.isMultiLine(view, start, end)
				)
					continue;

				builder.add(
					start,
					end,
					Decoration.replace({ widget: new RubyWidget(base, ruby) }),
				);
			}
		}
		return builder.finish();
	}

	private isCursorInside(
		start: number,
		end: number,
		cursorPos: number,
	): boolean {
		return cursorPos > start && cursorPos < end;
	}

	private isMultiLine(view: EditorView, start: number, end: number): boolean {
		return (
			view.state.doc.lineAt(start).number !==
			view.state.doc.lineAt(end).number
		);
	}

	private isInsideCode(view: EditorView, pos: number): boolean {
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
}

const pluginSpec: PluginSpec<ARViewPlugin> = {
	decorations: (value: ARViewPlugin) => value.decorations,
};

export const editingView = ViewPlugin.fromClass(ARViewPlugin, pluginSpec);
