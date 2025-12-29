import { keymap, EditorView } from "@codemirror/view";
import { Compartment, EditorSelection } from "@codemirror/state";
import { isInsideCode, isSourceMode, MDRubyRegex } from "../utils/utils";

export const ARKeymapCompartment = new Compartment();

export const ARKeymap = keymap.of([
	{ key: "ArrowRight", run: jumpRubyRight },
	{ key: "ArrowLeft", run: jumpRubyLeft },
]);

let lastJump: "" | "left" | "right" = "";

function jumpRubyRight(view: EditorView) {
	if (isSourceMode(view)) return false;
	const pos = view.state.selection.main.head;
	if (isInsideCode(view, pos)) return false;
	const doc = view.state.doc;
	if (doc.sliceString(pos, pos + 1) !== "{") {
		lastJump = "";
		return false;
	}
	const end = Math.min(doc.length, pos + 100);
	const slice = doc.sliceString(pos, end);
	MDRubyRegex.lastIndex = 0;
	const match = MDRubyRegex.exec(slice);
	if (!match) {
		lastJump = "";
		return false;
	}
	const from = pos + match.index;
	if (from !== pos) {
		lastJump = "";
		return false;
	}
	const to = from + match[0].length;
	const backJump = lastJump === "left";
	lastJump = "right";
	view.dispatch({
		selection: EditorSelection.cursor(
			backJump ? to - match[2]!.length - 1 : to,
		),
		scrollIntoView: true,
	});
	return true;
}

function jumpRubyLeft(view: EditorView) {
	if (isSourceMode(view)) return false;
	const pos = view.state.selection.main.head;
	if (pos === 0) {
		lastJump = "";
		return false;
	}
	const doc = view.state.doc;
	if (doc.sliceString(pos - 1, pos) !== "}") {
		lastJump = "";
		return false;
	}
	const start = Math.max(0, pos - 100);
	const slice = doc.sliceString(start, pos);
	MDRubyRegex.lastIndex = 0;
	let match;
	while ((match = MDRubyRegex.exec(slice)) !== null) {
		const from = start + match.index;
		const to = from + match[0].length;
		if (to === pos) {
			const backJump = lastJump === "right";
			lastJump = "left";
			view.dispatch({
				selection: EditorSelection.cursor(
					backJump ? to - match[2]!.length - 1 : from,
				),
				scrollIntoView: true,
			});
			return true;
		}
	}
	lastJump = "";
	return false;
}
