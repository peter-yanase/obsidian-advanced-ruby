import { type Plugin } from "obsidian";

import { convertToHTMLCmds } from "./commands/convertToHTMLCmds";
import { convertToMDCmds } from "./commands/convertToMDCmds";
import { copyWithoutRubyCmds } from "./commands/copyWithoutRubyCmds";
import { removeRubyCmds } from "./commands/removeRubyCmds";
import { wrapCmds } from "./commands/wrapCmds";

// Wrapper function
export function addCommands(plugin: Plugin): void {
	for (const command of [
		...convertToHTMLCmds,
		...convertToMDCmds,
		...copyWithoutRubyCmds,
		...removeRubyCmds,
		...wrapCmds,
	]) {
		command(plugin);
	}
}
