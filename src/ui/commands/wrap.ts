import { type Editor, type Menu, type Plugin } from "obsidian";
import { addMDRubyWrapper } from "utils/rubywrapper";

export function cmdWrap(plugin: Plugin): void {
	plugin.addCommand({
		id: "add-md-ruby-wrapper",
		name: "Wrap in Markdown ruby syntax",
		icon: "braces",
		editorCheckCallback: (checking: boolean, editor: Editor) => {
			const selection: string = editor.getSelection();
			if (!selection) return false;
			if (!checking) addMDRubyWrapper(editor, selection);
			return true;
		},
	});
}

export function clickWrap(plugin: Plugin): void {
	plugin.registerEvent(
		plugin.app.workspace.on(
			"editor-menu",
			(menu: Menu, editor: Editor, _) => {
				const selection: string = editor.getSelection();
				if (!selection || selection.trim() === "") return;
				menu.addItem((item) => {
					item.setTitle("Add ruby wrapper")
						.setIcon("braces")
						.onClick(() => addMDRubyWrapper(editor, selection));
				});
			},
		),
	);
}
