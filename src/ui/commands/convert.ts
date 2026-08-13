// OK
import { type Editor, type Plugin } from "obsidian";
import { convertAndReplace } from "utils/syntaxconverter";

export function cmdConvertToHTML(plugin: Plugin): void {
	plugin.addCommand({
		id: "convert-to-html",
		name: "Convert ruby to HTML syntax",
		icon: "file-code",
		editorCheckCallback: (checking: boolean, editor: Editor) => {
			if (!checking) convertAndReplace(editor, "HTML");
			return true;
		},
	});
}

export function cmdConvertToMD(plugin: Plugin): void {
	plugin.addCommand({
		id: "convert-to-md",
		name: "Convert ruby to Markdown syntax",
		icon: "file-braces",
		editorCheckCallback: (checking: boolean, editor: Editor) => {
			if (!checking) convertAndReplace(editor, "MD");
			return true;
		},
	});
}
