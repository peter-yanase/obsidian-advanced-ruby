import { type EditorView } from "@codemirror/view";
import { editorLivePreviewField } from "obsidian";

export function isSourceMode(view: EditorView): boolean {
	return !view.state.field(editorLivePreviewField);
}







