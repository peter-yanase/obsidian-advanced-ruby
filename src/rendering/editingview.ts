import type {
	ViewUpdate,
	EditorView,
	PluginValue,
	DecorationSet,
	PluginSpec,
} from "@codemirror/view";
import type { RubyMatch } from "utils/types.ts";
import { RangeSetBuilder } from "@codemirror/state";
import { Decoration, ViewPlugin } from "@codemirror/view";
import { RubyWidget } from "./rubywidget.ts";
import { extractRuby } from "utils/rubyextractor.ts";
import { isInsideCode, inSourceMode } from "utils/utils.ts";

class ARViewPlugin implements PluginValue {
	decorations: DecorationSet;

	// Cached ruby matches for the visible ranges
	private cachedRubyMatches: RubyMatch[] = [];

	// Flag for source mode
	private previouslyInSourceMode: boolean = false;

	// Variable used to compare cursor positions
	private lastEnclosingRubyStart: number | null = null;

	constructor(view: EditorView) {
		this.buildRubyCache(view);
		this.decorations = this.buildRubyDecorations(view);
	}

	update(update: ViewUpdate): void {
		// Remove decorations in source mode
		if (inSourceMode(update.view)) {
			this.previouslyInSourceMode = true;
			this.decorations = Decoration.none;
			return;
		}

		let needsRebuild: boolean = false;

		// Rebuild after switching off source mode
		if (this.previouslyInSourceMode) {
			needsRebuild = true;
			this.previouslyInSourceMode = false;
		}

		// Re-parse & rebuild when the document or viewport changes
		if (update.docChanged || update.viewportChanged) {
			this.buildRubyCache(update.view);
			needsRebuild = true;
		}

		// Rebuild when entering or leaving a ruby
		if (update.selectionSet) {
			const cursorPosition: number = update.state.selection.main.head;

			let currentRubyStart: number | null = null;

			this.cachedRubyMatches.some((match) => {
				const view = update.view;
				const start = match.start;
				const end = match.end;
				if (
					!this.isCursorBetween(start, end, cursorPosition) ||
					this.isMultiLine(view, start, end) ||
					isInsideCode(view, start)
				)
					return false;
				currentRubyStart = start;
				return true;
			});

			if (currentRubyStart !== this.lastEnclosingRubyStart) {
				needsRebuild = true;
				this.lastEnclosingRubyStart = currentRubyStart;
			}
		}

		if (needsRebuild) {
			this.decorations = this.buildRubyDecorations(update.view);
		}
	}

	private buildRubyCache(view: EditorView): void {
		const rubyMatches: RubyMatch[] = [];

		// Get the visible slices of the documents
		for (const { from, to } of view.visibleRanges) {
			const documentSlice: string = view.state.sliceDoc(from, to);

			// Push the matches one by one
			rubyMatches.push(...extractRuby(documentSlice, from));
		}

		// Replace the cache
		this.cachedRubyMatches = rubyMatches;
	}

	private buildRubyDecorations(view: EditorView): DecorationSet {
		const builder = new RangeSetBuilder<Decoration>();
		const cursorPosition: number = view.state.selection.main.head;
		for (const { start, end, base, ruby } of this.cachedRubyMatches) {
			// Skip ruby that should not be rendered
			if (
				this.isCursorBetween(start, end, cursorPosition) ||
				this.isMultiLine(view, start, end) ||
				isInsideCode(view, start)
			)
				continue;

			// Decorate
			builder.add(
				start,
				end,
				Decoration.replace({ widget: new RubyWidget(base, ruby) }),
			);
		}
		return builder.finish();
	}

	private isCursorBetween(
		start: number,
		end: number,
		cursorPosition: number,
	): boolean {
		return cursorPosition > start && cursorPosition < end;
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

export const rubyRenderingExtension = ViewPlugin.fromClass(ARViewPlugin, pluginSpec);
