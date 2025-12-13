import { Plugin } from "obsidian";
import { addCommands } from "./ui/commands";
import { ARKeymap } from "./ui/keymaps";
import { readingView } from "./rendering/readingview";
import { editingView } from "./rendering/editingview";

export default class AdvancedRuby extends Plugin {

	async onload() {

		this.registerMarkdownPostProcessor(readingView);

    this.registerEditorExtension(editingView);

		this.registerEditorExtension(ARKeymap);

		addCommands(this);
	}
}
