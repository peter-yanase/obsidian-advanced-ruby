import { type Editor, type Menu, type Plugin } from "obsidian";

import { addMDRubyWrapper } from "utils/addMDRubyWrapper";
import { ICONS, NAMES } from "../../constants";

export const wrapCmds = [cmdWrap, clickWrap];

function cmdWrap(plugin: Plugin): void {
	plugin.addCommand({
		id: "wrap",
		name: NAMES["wrap"],
		icon: ICONS["wrap"],
		editorCheckCallback: (checking: boolean, editor: Editor) => {
			const selection: string = editor.getSelection();
			if (!selection) return false;
			if (!checking) addMDRubyWrapper(editor, selection);
			return true;
		},
	});
}

function clickWrap(plugin: Plugin): void {
	plugin.registerEvent(
		plugin.app.workspace.on(
			"editor-menu",
			(menu: Menu, editor: Editor, _) => {
				const selection: string = editor.getSelection();
				if (!selection) return;
				menu.addItem((item) => {
					item.setTitle(NAMES["wrap"])
						.setIcon(ICONS["wrap"])
						.onClick(() => addMDRubyWrapper(editor, selection));
				});
			},
		),
	);
}
