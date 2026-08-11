import { type Plugin } from "obsidian";
import { cmdConvertToHTML, cmdConvertToMD } from "./commands/convert";
import { clickWrap, cmdWrap } from "./commands/wrap";

// Wrapper function
export function addCommands(plugin: Plugin) {
	cmdWrap(plugin);
	clickWrap(plugin);
	cmdConvertToHTML(plugin);
	cmdConvertToMD(plugin);
}
