import { MD_RUBY_REGEX, MD_RUBY_SYNTAX } from "../constants";
import { type Syntax } from "../types";
import { protectCode } from "./protectCode";
import { replaceRuby } from "./replaceRuby";
import { restoreProtectedSpans } from "./restoreProtectedSpans";

export function removeRuby(originalText: string): string {
	const { head: sourceHead }: Syntax = MD_RUBY_SYNTAX;
	const regex: RegExp = MD_RUBY_REGEX;

	const { textWithPlaceholders, protectedSpans } = protectCode(originalText);

	let newText = replaceRuby(
		textWithPlaceholders,
		sourceHead,
		regex,
		(_match, base) => `${base}`,
	);

	newText = restoreProtectedSpans(newText, protectedSpans);
	return newText;
}
