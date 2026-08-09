// OK
import { RangeSetBuilder } from "@codemirror/state";
import {
	Decoration,
	type DecorationSet,
	type EditorView,
} from "@codemirror/view";
import { RubyWidget } from "rendering/rubywidget";
import { type Ruby } from "./types";
import { isCursorInsideRuby, isInsideCode, isRubyMultiLine } from "./utils";

export function getRubyDecorations(
	view: EditorView,
	cachedRubyMatches: Ruby[],
): DecorationSet {
	const builder = new RangeSetBuilder<Decoration>();
	for (const ruby of cachedRubyMatches) {
		if (
			isCursorInsideRuby(ruby, view) ||
			isInsideCode(ruby.start, view) ||
			isRubyMultiLine(ruby, view)
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
