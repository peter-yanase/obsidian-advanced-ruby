// OK
import { RangeSetBuilder } from "@codemirror/state";
import {
	Decoration,
	type DecorationSet,
	type EditorView,
} from "@codemirror/view";

import { RubyWidget } from "rendering/rubywidget";
import { type Ruby } from "./types";
import { isCursorInsideRuby, isInsideCode, isRubyUnusable } from "./utils";

export function getRubyDecorations(
	view: EditorView,
	rubyToDecorate: Ruby[],
): DecorationSet {
	const builder = new RangeSetBuilder<Decoration>();
	for (const ruby of rubyToDecorate) {
		if (
			isCursorInsideRuby(ruby, view) ||
			isInsideCode(ruby.start, view) ||
			isRubyUnusable(ruby, view)
		)
			continue;

		builder.add(
			ruby.start,
			ruby.end,
			Decoration.replace({
				widget: new RubyWidget(ruby.base, ruby.ruby),
			}),
		);
	}
	const rubyDecorations = builder.finish();
	return rubyDecorations;
}
