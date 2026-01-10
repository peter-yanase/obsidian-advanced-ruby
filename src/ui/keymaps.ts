import { keymap, EditorView } from "@codemirror/view";
import { EditorSelection, Prec, Text } from "@codemirror/state";
import { isInsideCode, isSourceMode, MDRubyRegex } from "../utils/utils";
import AdvancedRuby from "main";

export function ARKeymap(plugin: AdvancedRuby) {
	return Prec.highest(
		keymap.of([
			{
				key: "ArrowRight",
				run: (view) => {
					if (!plugin.settings.smartarrows) return false;
					return jumpRubyRight(view);
				},
			},
			{
				key: "ArrowLeft",
				run: (view) => {
					if (!plugin.settings.smartarrows) return false;
					return jumpRubyLeft(view);
				},
			},
		]),
	);
}

const searchWindow: number = 20;
let lastJump: "" | "left" | "right" = "";

function noJump() {
	lastJump = "";
	return false;
}

function jumpRubyRight(view: EditorView) {
	if (isSourceMode(view)) return false;
	const pos: number = view.state.selection.main.head;
	if (isInsideCode(view, pos)) return false;
	const doc: Text = view.state.doc;
	const isRubyStart: boolean = doc.sliceString(pos, pos + 1) === "{";
	if (!isRubyStart) return noJump();
	const end: number = Math.min(doc.length, pos + searchWindow);
	const slice: string = doc.sliceString(pos, end);
	MDRubyRegex.lastIndex = 0;
	const match: RegExpExecArray | null = MDRubyRegex.exec(slice);
	if (!match) return noJump();
	const from: number = pos + match.index;
	if (from !== pos) return noJump();
	const to: number = from + match[0].length;
	const backJump: boolean = lastJump === "left";
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
	const pos: number = view.state.selection.main.head;
	if (pos === 0) return noJump();
	if (isInsideCode(view, pos)) return false;
	const doc: Text = view.state.doc;
	const isRubyEnd: boolean = doc.sliceString(pos - 1, pos) === "}";
	if (!isRubyEnd) noJump();
	const start: number = Math.max(0, pos - searchWindow);
	const slice: string = doc.sliceString(start, pos);
	MDRubyRegex.lastIndex = 0;
	let match: RegExpExecArray | null;
	for (const match of slice.matchAll(MDRubyRegex)) {
		const from: number = start + match.index;
		const to: number = from + match[0].length;
		if (to === pos) {
			const backJump: boolean = lastJump === "right";
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
	return noJump();
}
