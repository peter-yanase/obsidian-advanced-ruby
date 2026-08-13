// OK
import {
	CODE_REGEX,
	HTML_RUBY_REGEX,
	HTML_RUBY_SYNTAX,
	MD_RUBY_REGEX,
	MD_RUBY_SYNTAX,
	PLACEHOLDER,
	PLACEHOLDER_SYNTAX,
} from "./constants";
import { Syntax, SyntaxType } from "./types";

export function convertRubySyntax(
	originalText: string,
	targetSyntax: SyntaxType,
): string {
	let mutatedText: string = originalText;

	// Extract protected spans
	const protectedSpans: string[] = [];
	mutatedText = mutatedText.replace(CODE_REGEX, (match) => {
		protectedSpans.push(match);
		const numberedSpan: string = `${PLACEHOLDER_SYNTAX.head}${protectedSpans.length - 1}${PLACEHOLDER_SYNTAX.tail}`;
		return numberedSpan;
	});

	const { head, divider, tail }: Record<string, string> =
		targetSyntax === "HTML" ? HTML_RUBY_SYNTAX : MD_RUBY_SYNTAX;
	const { head: sourceHead }: Syntax =
		targetSyntax === "HTML" ? MD_RUBY_SYNTAX : HTML_RUBY_SYNTAX;
	const regex: RegExp =
		targetSyntax === "HTML" ? MD_RUBY_REGEX : HTML_RUBY_REGEX;

	for (let i = 0; i < 2; i += 1) {
		if (!mutatedText.contains(sourceHead)) break;
		mutatedText = mutatedText.replace(
			regex,
			(_match, base, ruby) => `${head}${base}${divider}${ruby}${tail}`,
		);
	}

	// Restore protected spans
	mutatedText = mutatedText.replace(
		PLACEHOLDER,
		(_match, number) => protectedSpans[+number]!,
	);
	return mutatedText;
}
