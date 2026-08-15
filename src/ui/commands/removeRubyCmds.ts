import { type Editor, type Menu, type Plugin } from "obsidian";

import { ICONS, NAMES } from "../../constants";
import { removeRubyFromSelection } from "../../utils/removeRubyFromSelection";

export const removeRubyCmds = [cmdRemoveRuby, clickRemoveRuby];

function cmdRemoveRuby(plugin: Plugin): void {
	plugin.addCommand({
		id: "remove-ruby",
		name: NAMES["removeRuby"],
		icon: ICONS["removeRuby"],
		editorCheckCallback: (checking: boolean, editor: Editor) => {
			if (!checking) {
				const selection: string = editor.getSelection();
				if (!selection) return false;
				removeRubyFromSelection(editor, selection);
			}
			return true;
		},
	});
}

function clickRemoveRuby(plugin: Plugin): void {
	plugin.registerEvent(
		plugin.app.workspace.on(
			"editor-menu",
			(menu: Menu, editor: Editor, _) => {
				const selection: string = editor.getSelection();
				if (!selection) return;
				menu.addItem((item) => {
					item.setTitle(NAMES["removeRuby"])
						.setIcon(ICONS["removeRuby"])
						.onClick(() =>
							removeRubyFromSelection(editor, selection),
						);
				});
			},
		),
	);
}
