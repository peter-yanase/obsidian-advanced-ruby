import { type Editor, type Plugin } from "obsidian";

import { convertAndReplace } from "utils/convertAndReplace";
import { ICONS, NAMES } from "../../constants";

export const convertToMDCmds = [cmdConvertToMD];

function cmdConvertToMD(plugin: Plugin): void {
	plugin.addCommand({
		id: "convert-to-md",
		name: NAMES["convertToMD"],
		icon: ICONS["convertToMD"],
		editorCheckCallback: (checking: boolean, editor: Editor) => {
			if (!checking) convertAndReplace(editor, "MD");
			return true;
		},
	});
}
