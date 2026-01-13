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
			const character: string | undefined = text[index];
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

		let cursorPos: number = 0;
		for (const match of matches) {
			// Add the text before the match
			if (match.start > cursorPos) {
				nodes.push(
					document.createTextNode(text.slice(cursorPos, match.start)),
				);
			}

			// Add the ruby
			nodes.push(
				this.createRubyElement(
					this.renderRubyText(match.base),
					match.ruby,
				),
			);

			cursorPos = match.end;
		}

		// Add the remaining text
		if (cursorPos < text.length) {
			nodes.push(document.createTextNode(text.slice(cursorPos)));
		}

		return nodes;
	}

	private createRubyElement(baseNodes: Node[], ruby: string): HTMLElement {
		const rubyEl: HTMLElement = document.createElement("ruby");

		// Render nested ruby first
		for (const node of baseNodes) rubyEl.appendChild(node);

		// Add the parent's annotation
		const rtEl: HTMLElement = document.createElement("rt");
		rtEl.textContent = ruby;
		rubyEl.appendChild(rtEl);

		return rubyEl;
	}
}

class ARViewPlugin implements PluginValue {
	decorations: DecorationSet;

	// Cached ruby matches for the current viewport
	private rubyMatches: RubyMatch[] = [];

	// Variable used to compare cursor positions
	private previousRubyStart: number | null = null;

	constructor(view: EditorView) {
		this.updateRubyMatches(view);
		this.decorations = this.buildDecorations(view);
	}

	update(update: ViewUpdate): void {
		// Remove decorations in source mode
		if (isSourceMode(update.view)) {
			this.decorations = Decoration.none;
			return;
		}

		let needRebuild: boolean = false;

		// Re-parse & rebuild when the document or viewport changes
		if (update.docChanged || update.viewportChanged) {
			this.updateRubyMatches(update.view);
			needRebuild = true;
		}

		// Rebuild when entering or leaving a ruby
		if (update.selectionSet) {
			const cursorPos: number = update.state.selection.main.head;

			let currentRubyStart: number | null = null;

			this.rubyMatches.some((match) => {
				const view = update.view;
				const start = match.start;
				const end = match.end;
				if (
					!this.isCursorInside(start, end, cursorPos) ||
					this.isMultiLine(view, start, end) ||
					isInsideCode(view, start)
				)
					return false;
				currentRubyStart = start;
				return true;
			});

			if (currentRubyStart !== this.previousRubyStart) {
				needRebuild = true;
				this.previousRubyStart = currentRubyStart;
			}
		}

		if (needRebuild) {
			this.decorations = this.buildDecorations(update.view);
		}
	}

	private updateRubyMatches(view: EditorView): void {
		const matches: RubyMatch[] = [];

		for (const { from, to } of view.visibleRanges) {
			const text: string = view.state.sliceDoc(from, to);
			matches.push(...parseRuby(text, from));
		}
		this.rubyMatches = matches;
	}

	private buildDecorations(view: EditorView): DecorationSet {
		const builder = new RangeSetBuilder<Decoration>();
		const cursorPos: number = view.state.selection.main.head;
		for (const { start, end, base, ruby } of this.rubyMatches) {
			if (
				this.isCursorInside(start, end, cursorPos) ||
				this.isMultiLine(view, start, end) ||
				isInsideCode(view, start)
			)
				continue;

			builder.add(
				start,
				end,
				Decoration.replace({ widget: new RubyWidget(base, ruby) }),
			);
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
