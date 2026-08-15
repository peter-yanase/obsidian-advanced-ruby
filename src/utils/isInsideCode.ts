import { syntaxTree } from "@codemirror/language";
import { type EditorView } from "@codemirror/view";

export function isInsideCode(position: number, view: EditorView): boolean {
	let insideCode: boolean = false;

	syntaxTree(view.state).iterate({
		from: position,
		to: position + 1,
		enter: (node) => {
			if (node.name.includes("code")) {
				insideCode = true;
			}
		},
	});
	return insideCode;
}
