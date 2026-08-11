// OK
import {
	Decoration,
	ViewPlugin,
	type DecorationSet,
	type EditorView,
	type PluginSpec,
	type PluginValue,
	type ViewUpdate,
} from "@codemirror/view";

import { getRubyUnderCursor } from "utils/enteredrubygetter";
import { getRubyDecorations } from "utils/rubydecorationbuilder";
import { type Ruby } from "utils/types";
import { isSourceMode } from "utils/utils";
import { getVisibleRuby } from "utils/visiblerubygetter";

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
				update.docChanged || // docChanged must come first
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

const pluginSpec: PluginSpec<rubyRenderingViewPlugin> = {
	decorations: (value: rubyRenderingViewPlugin) => value.decorations,
};

export const rubyRenderingExtension = ViewPlugin.fromClass(
	rubyRenderingViewPlugin,
	pluginSpec,
);
