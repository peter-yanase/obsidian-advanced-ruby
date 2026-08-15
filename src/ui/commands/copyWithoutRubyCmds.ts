import { type Editor, type Menu, type Plugin } from "obsidian";

import { addToClipboardWithoutRuby } from "utils/addToClipboardWithoutRuby";
import { ICONS, NAMES } from "../../constants";

export const copyWithoutRubyCmds = [cmdCopyWithoutRuby, clickCopyWithoutRuby];

function cmdCopyWithoutRuby(plugin: Plugin): void {
	plugin.addCommand({
		id: "copy-without-ruby",
		name: NAMES["copyWithoutRuby"],
		icon: ICONS["copyWithoutRuby"],
		editorCheckCallback: (checking: boolean, editor: Editor) => {
			if (!checking) {
				const selection: string = editor.getSelection();
				if (!selection) return false;
				addToClipboardWithoutRuby(selection);
			}
			return true;
		},
	});
}

function clickCopyWithoutRuby(plugin: Plugin): void {
	plugin.registerEvent(
		plugin.app.workspace.on(
			"editor-menu",
			(menu: Menu, editor: Editor, _) => {
				const selection: string = editor.getSelection();
				if (!selection) return;
				menu.addItem((item) => {
					item.setTitle(NAMES["copyWithoutRuby"])
						.setIcon(ICONS["copyWithoutRuby"])
						.onClick(() => addToClipboardWithoutRuby(selection));
				});
			},
		),
	);
}
