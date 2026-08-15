import { EditorSelection } from "@codemirror/state";
import { type EditorView } from "@codemirror/view";

import type AdvancedRuby from "main";
import { getUpcomingRuby } from "utils/getUpcomingRuby";
import { type Jump, type Ruby } from "../types";

export function jumpRuby(
	view: EditorView,
	plugin: AdvancedRuby,
	direction: Jump,
	select: boolean = false,
): boolean {
	const upcomingRuby: Ruby | undefined = getUpcomingRuby(view, direction);
	if (!upcomingRuby) {
		if (plugin.lastJump) plugin.lastJump = undefined;
		return false;
	}
	const rubyTextStart: number =
		upcomingRuby.start + upcomingRuby.base.length + 2;
	const target: number =
		direction === "left"
			? plugin.lastJump === "right"
				? rubyTextStart
				: upcomingRuby.start
			: plugin.lastJump === "left"
				? rubyTextStart
				: upcomingRuby.end;
	view.dispatch({
		selection: select
			? EditorSelection.range(view.state.selection.main.anchor, target)
			: EditorSelection.cursor(target),
		scrollIntoView: true,
	});
	plugin.lastJump = direction;
	return true;
}
