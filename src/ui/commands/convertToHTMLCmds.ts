import { type Editor, type Plugin } from "obsidian";

import { convertAndReplace } from "utils/convertAndReplace";
import { ICONS, NAMES } from "../../constants";

export const convertToHTMLCmds = [cmdConvertToHTML];

function cmdConvertToHTML(plugin: Plugin): void {
	plugin.addCommand({
		id: "convert-to-html",
		name: NAMES["convertToHTML"],
		icon: ICONS["convertToHTML"],
		editorCheckCallback: (checking: boolean, editor: Editor) => {
			if (!checking) convertAndReplace(editor, "HTML");
			return true;
		},
	});
}
