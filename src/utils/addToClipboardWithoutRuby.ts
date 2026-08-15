import { removeRuby } from "utils/removeRuby";

export function addToClipboardWithoutRuby(selection: string): void {
	navigator.clipboard?.writeText(removeRuby(selection));
}
