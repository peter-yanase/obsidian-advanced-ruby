import { Plugin, Editor, Notice, Menu } from "obsidian";
import { transformRubyBlocks } from "../utils/utils";
import { addMDRubyWrapper } from "../utils/rubywrapper";

export function addCommands(plugin: Plugin) {
	cmdWrap(plugin);
	clickWrap(plugin);
	cmdConvert(plugin);
}

function cmdConvert(plugin: Plugin) {
	plugin.addCommand({
		id: "convert-between-formats",
		name: "Convert between Markdown and HTML ruby syntaxes",
		icon: "replace-all",
		editorCheckCallback: (checking: boolean, editor: Editor, _) => {
			if (!checking) {
				const fullText: string = editor.getValue();
				const convertedText: string = transformRubyBlocks(
					fullText,
					true,
				);
				editor.setValue(convertedText);
				new Notice("Ruby blocks converted successfully.");
			}
			return true;
		},
	});
}

function cmdWrap(plugin: Plugin) {
	plugin.addCommand({
		id: "add-md-ruby-wrapper",
		name: "Wrap in Markdown ruby syntax",
		icon: "braces",
		editorCheckCallback: (checking: boolean, editor: Editor, _) => {
			const selection: string = editor.getSelection();
			if (!selection) return false;
			if (!checking) {
				addMDRubyWrapper(editor, selection);
			}
			return true;
		},
	});
}

function clickWrap(plugin: Plugin) {
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
