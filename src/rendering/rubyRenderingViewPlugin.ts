import {
	Decoration,
	type DecorationSet,
	type EditorView,
	type PluginValue,
	type ViewUpdate,
} from "@codemirror/view";

import { getRubyDecorations } from "utils/getRubyDecorations";
import { getRubyUnderCursor } from "utils/getRubyUnderCursor";
import { getVisibleRuby } from "utils/getVisibleRuby";
import { isSourceMode } from "utils/isSourceMode";
import { type Ruby } from "../types";

export class rubyRenderingViewPlugin implements PluginValue {
	decorations: DecorationSet;
	cachedRuby: Ruby[] = [];
	lastRubyEntered: Ruby | undefined = undefined;
	private wasSourceMode: boolean = false;

	constructor(view: EditorView) {
		this.cachedRuby = getVisibleRuby(view);
		this.decorations = getRubyDecorations(view, this.cachedRuby);
	}

	update(update: ViewUpdate): void {
		const view: EditorView = update.view;

		if (isSourceMode(view)) {
			// Leave early if we have entered source mode earlier
			if (this.wasSourceMode) return;

			// Remove decorations on entering source mode
			this.decorations = Decoration.none;

			this.lastRubyEntered = undefined;
			this.wasSourceMode = true;
			return;
		}

		// Re-parse & rebuild after switching off source mode
		if (this.wasSourceMode) {
			this.cachedRuby = getVisibleRuby(view);
			this.decorations = getRubyDecorations(view, this.cachedRuby);
			this.lastRubyEntered = getRubyUnderCursor(view, this.cachedRuby);
			this.wasSourceMode = false;
			return;
		} else {
			// Re-parse & rebuild if document or viewport changed
			if (
				// docChanged must come first to account for characters that change shape during input
				update.docChanged ||
				update.viewportChanged
			) {
				this.cachedRuby = getVisibleRuby(view);
				this.decorations = getRubyDecorations(view, this.cachedRuby);
				this.lastRubyEntered = getRubyUnderCursor(
					view,
					this.cachedRuby,
				);
				return;
			}
			// Rebuild when the cursor enters or leaves a ruby
			else if (update.selectionSet) {
				const rubyUnderCursor = getRubyUnderCursor(
					view,
					this.cachedRuby,
				);
				if (rubyUnderCursor !== this.lastRubyEntered) {
					this.decorations = getRubyDecorations(
						view,
						this.cachedRuby,
					);
					this.lastRubyEntered = rubyUnderCursor;
				}
			}
		}
	}
}
