// OK
import { type Editor, type Plugin } from "obsidian";
import { convertAndReplace } from "utils/syntaxconverter";

export function cmdConvertToHTML(plugin: Plugin) {
	plugin.addCommand({
		id: "convert-to-html",
		name: "Convert to HTML ruby syntax",
		icon: "replace-all",
		editorCheckCallback: (checking: boolean, editor: Editor) => {
			if (!checking) convertAndReplace(editor, "HTML");
			return true;
		},
	});
}

export function cmdConvertToMD(plugin: Plugin) {
	plugin.addCommand({
		id: "convert-to-md",
		name: "Convert to Markdown ruby syntax",
		icon: "replace-all",
		editorCheckCallback: (checking: boolean, editor: Editor) => {
			if (!checking) convertAndReplace(editor, "MD");
			return true;
		},
	});
}
