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
			{
				key: "Shift-ArrowRight",
				run: (view) => {
					if (!plugin.settings.smartarrows) return false;
					return jumpRubyRightAndSelect(view);
				},
			},
			{
				key: "Shift-ArrowLeft",
				run: (view) => {
					if (!plugin.settings.smartarrows) return false;
					return jumpRubyLeftAndSelect(view);
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
	const cursorPos: number = view.state.selection.main.head;
	if (isInsideCode(view, cursorPos)) return false;
	const doc: Text = view.state.doc;
	const isRubyStart: boolean =
		doc.sliceString(cursorPos, cursorPos + 1) === "{";
	if (!isRubyStart) return noJump();
	const end: number = Math.min(doc.length, cursorPos + searchWindow);
	const slice: string = doc.sliceString(cursorPos, end);
	MDRubyRegex.lastIndex = 0;
	const match: RegExpExecArray | null = MDRubyRegex.exec(slice);
	if (!match) return noJump();
	const from: number = cursorPos + match.index;
	if (from !== cursorPos) return noJump();
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
	const cursorPos: number = view.state.selection.main.head;
	if (cursorPos === 0) return noJump();
	if (isInsideCode(view, cursorPos)) return false;
	const doc: Text = view.state.doc;
	const isRubyEnd: boolean =
		doc.sliceString(cursorPos - 1, cursorPos) === "}";
	if (!isRubyEnd) noJump();
	const start: number = Math.max(0, cursorPos - searchWindow);
	const slice: string = doc.sliceString(start, cursorPos);
	MDRubyRegex.lastIndex = 0;
	for (const match of slice.matchAll(MDRubyRegex)) {
		const from: number = start + match.index;
		const to: number = from + match[0].length;
		if (to === cursorPos) {
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

function jumpRubyRightAndSelect(view: EditorView) {
	if (isSourceMode(view)) return false;
	const cursorPos: number = view.state.selection.main.head;
	if (isInsideCode(view, cursorPos)) return false;
	const doc: Text = view.state.doc;
	const isRubyStart = doc.sliceString(cursorPos, cursorPos + 1) === "{";
	if (!isRubyStart) return noJump();
	const end = Math.min(doc.length, cursorPos + searchWindow);
	const slice = doc.sliceString(cursorPos, end);
	MDRubyRegex.lastIndex = 0;
	const match = MDRubyRegex.exec(slice);
	if (!match) return noJump();
	const from: number = cursorPos + match.index;
	if (from !== cursorPos) return noJump();
	const to: number = from + match[0].length;
	const backJump = lastJump === "left";
	lastJump = "right";
	view.dispatch({
		selection: EditorSelection.range(
			view.state.selection.main.anchor,
			backJump ? to - match[2]!.length - 1 : to,
		),
		scrollIntoView: true,
	});
	return true;
}

function jumpRubyLeftAndSelect(view: EditorView) {
	if (isSourceMode(view)) return false;
	const cursorPos: number = view.state.selection.main.head;
	if (cursorPos === 0) return noJump();
	if (isInsideCode(view, cursorPos)) return false;
	const doc: Text = view.state.doc;
	const isRubyEnd: boolean =
		doc.sliceString(cursorPos - 1, cursorPos) === "}";
	if (!isRubyEnd) noJump();
	const start: number = Math.max(0, cursorPos - searchWindow);
	const slice: string = doc.sliceString(start, cursorPos);
	MDRubyRegex.lastIndex = 0;
	for (const match of slice.matchAll(MDRubyRegex)) {
		const from: number = start + match.index;
		const to: number = from + match[0].length;
		if (to === cursorPos) {
			const backJump: boolean = lastJump === "right";
			lastJump = "left";
			view.dispatch({
				selection: EditorSelection.range(
					view.state.selection.main.anchor,
					backJump ? to - match[2]!.length - 1 : from,
				),
				scrollIntoView: true,
			});
			return true;
		}
	}
	return noJump();
}
