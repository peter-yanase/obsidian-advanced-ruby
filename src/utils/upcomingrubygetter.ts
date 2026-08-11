// OK
import { type EditorView } from "@codemirror/view";

import { rubyRenderingExtension } from "rendering/editingview";
import { type Jump, type Ruby } from "utils/types";
import { isInsideCode, isSourceMode } from "./utils";

export function getUpcomingRuby(
	view: EditorView,
	contact: Jump,
): Ruby | undefined {
	if (isSourceMode(view)) return;
	const cursorPosition: number = view.state.selection.main.head;
	if (isInsideCode(cursorPosition, view)) return;
	const upcomingRuby: Ruby | undefined = view
		.plugin(rubyRenderingExtension)!
		.cachedRuby.find((ruby) =>
			contact === "right"
				? cursorPosition === ruby.start
				: cursorPosition === ruby.end,
		);
	return upcomingRuby;
}
