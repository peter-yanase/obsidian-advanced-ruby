import {
	HTML_RUBY_REGEX,
	HTML_RUBY_SYNTAX,
	MD_RUBY_REGEX,
	MD_RUBY_SYNTAX,
} from "../constants";
import { type Syntax, type SyntaxType } from "../types";
import { protectCode } from "./protectCode";
import { replaceRuby } from "./replaceRuby";
import { restoreProtectedSpans } from "./restoreProtectedSpans";

export function convertRubySyntax(
	originalText: string,
	targetSyntax: SyntaxType,
): string {
	const { textWithPlaceholders, protectedSpans } = protectCode(originalText);

	const { head, divider, tail }: Record<string, string> =
		targetSyntax === "HTML" ? HTML_RUBY_SYNTAX : MD_RUBY_SYNTAX;
	const { head: sourceHead }: Syntax =
		targetSyntax === "HTML" ? MD_RUBY_SYNTAX : HTML_RUBY_SYNTAX;
	const regex: RegExp =
		targetSyntax === "HTML" ? MD_RUBY_REGEX : HTML_RUBY_REGEX;

	let mutatedText: string = replaceRuby(
		textWithPlaceholders,
		sourceHead,
		regex,
		(_match, base, ruby) => `${head}${base}${divider}${ruby}${tail}`,
	);

	mutatedText = restoreProtectedSpans(mutatedText, protectedSpans);
	return mutatedText;
}
