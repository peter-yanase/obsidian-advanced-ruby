import {
	CODE_REGEX,
	HTML_RUBY_REGEX,
	HTML_RUBY_SYNTAX,
	MD_RUBY_REGEX,
	MD_RUBY_SYNTAX,
	PLACEHOLDER,
} from "./constants";
import { SyntaxType } from "./types";

export function convertRubySyntax(
	originalText: string,
	targetSyntax: SyntaxType,
): string {
	let currentTextMutation: string = originalText;
	let previousTextMutation: string;
	let mutationCount: number = 0;

	// Extract protected spans
	const protectedSpans: string[] = [];
	currentTextMutation = currentTextMutation.replace(CODE_REGEX, (match) => {
		protectedSpans.push(match);
		const numberedSpan: string = `@@PROTECTED${protectedSpans.length - 1}@@`;
		return numberedSpan;
	});

	const { head, divider, tail }: Record<string, string> =
		targetSyntax === "HTML" ? HTML_RUBY_SYNTAX : MD_RUBY_SYNTAX;
	const regex = targetSyntax === "HTML" ? MD_RUBY_REGEX : HTML_RUBY_REGEX;

	do {
		previousTextMutation = currentTextMutation;
		currentTextMutation = currentTextMutation.replace(
			regex,
			(_, base, ruby) => {
				return `${head}${base}${divider}${ruby}${tail}`;
			},
		);
		mutationCount += 1;
	} while (currentTextMutation !== previousTextMutation && mutationCount < 2);

	// Restore protected spans
	currentTextMutation = currentTextMutation.replace(
		PLACEHOLDER,
		(_, number) => protectedSpans[+number]!,
	);
	return currentTextMutation;
}
