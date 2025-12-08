import { Plugin } from "obsidian";
import { addCommands } from "./commands";
import { readingView } from "./readingview";

export default class AdvancedRuby extends Plugin {
	onload() {
		this.registerMarkdownPostProcessor(readingView);
		addCommands(this);
	}
}
