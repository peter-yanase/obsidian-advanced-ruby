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
import { RangeSetBuilder, EditorSelection } from "@codemirror/state";
import { type RubyMatch } from "../types";
import { isInsideCode, isSourceMode } from "../utils/utils";

function parseRuby(text: string, offset: number = 0): RubyMatch[] {
	// Handle nested ruby
	function findAtDepth(
		target: string,
		depth: number,
		text: string,
		start: number,
	): number | void {
		for (let index: number = start; index < text.length; index++) {
			const character = text[index];
			if (character === "{") depth++;
			else if (character === "}") depth--;
			if (character === target && depth === 0) return index;
		}
		return;
	}

	let results: RubyMatch[] = [];
	let scanIndex: number = 0;

	while (scanIndex < text.length) {
		// Skip until next opening brace
		if (text[scanIndex] !== "{") {
			scanIndex++;
			continue;
		}

		const openingBraceIndex: number = scanIndex;
		const closingBraceIndex: number | void = findAtDepth(
			"}",
			1,
			text,
			openingBraceIndex + 1,
		);
		if (!closingBraceIndex) break;

		const braceContent: string = text.slice(
			openingBraceIndex + 1,
			closingBraceIndex,
		);

		const pipeIndex: number | void = findAtDepth("|", 0, braceContent, 0);

		if (pipeIndex && !braceContent.endsWith("|")) {
			// This is a valid ruby block
			results.push({
				start: offset + openingBraceIndex,
				end: offset + closingBraceIndex + 1,
				base: braceContent.slice(0, pipeIndex),
				ruby: braceContent.slice(pipeIndex + 1),
			});
		} else {
			// No top-level pipe = normal braces
			// Brace content ends with pipe = empty syntax
			// But it may contain ruby blocks, so recurse
			results.push(
				...parseRuby(braceContent, offset + openingBraceIndex + 1),
			);
		}
		scanIndex = closingBraceIndex + 1;
	}
	return results;
}

class RubyWidget extends WidgetType {
	constructor(
		private readonly base: string,
		private readonly ruby: string,
	) {
		super();
	}
	toDOM(view: EditorView) {
		const baseNodes: Node[] = this.renderRubyText(this.base);
		const rubyEl = this.createRubyElement(baseNodes, this.ruby);
		// Move the cursor if clicked
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

	private renderRubyText(text: string): Node[] {
		const nodes: Node[] = [];
		const matches: RubyMatch[] = parseRuby(text, 0);

		// Push text if no nodes were found
		if (matches.length === 0) {
			nodes.push(document.createTextNode(text));
			return nodes;
		}

		let cursor: number = 0;

		for (const match of matches) {
			// Add the text before the match
			if (match.start > cursor) {
				nodes.push(
					document.createTextNode(text.slice(cursor, match.start)),
				);
			}

			// Add the ruby
			nodes.push(
				this.createRubyElement(
					this.renderRubyText(match.base),
					match.ruby,
				),
			);

			cursor = match.end;
		}

		// Add the remaining text
		if (cursor < text.length) {
			nodes.push(document.createTextNode(text.slice(cursor)));
		}
		return nodes;
	}

	private createRubyElement(baseNodes: Node[], ruby: string): HTMLElement {
		const rubyEl: HTMLElement = document.createElement("ruby");
		// Render nested ruby first
		for (const node of baseNodes) rubyEl.appendChild(node);
		// Add the parent's annotatation
		const rtEl: HTMLElement = document.createElement("rt");
		rtEl.textContent = ruby;
		rubyEl.appendChild(rtEl);
		return rubyEl;
	}
}

class ARViewPlugin implements PluginValue {
	decorations: DecorationSet;

	constructor(view: EditorView) {
		this.decorations = this.buildDecorations(view);
	}

	update(update: ViewUpdate): void {
		if (isSourceMode(update.view)) {
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
			const text: string = view.state.sliceDoc(from, to);

			const rubyMatches: RubyMatch[] = parseRuby(text, from);

			for (const { start, end, base, ruby } of rubyMatches) {
				if (
					isInsideCode(view, start) ||
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
}

const pluginSpec: PluginSpec<ARViewPlugin> = {
	decorations: (value: ARViewPlugin) => value.decorations,
};

export const editingView = ViewPlugin.fromClass(ARViewPlugin, pluginSpec);
