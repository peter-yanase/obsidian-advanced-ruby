import { CODE_REGEX, PLACEHOLDER_SYNTAX } from "../constants";

export function protectCode(text: string): {
	textWithPlaceholders: string;
	protectedSpans: string[];
} {
	const protectedSpans: string[] = [];

	const textWithPlaceholders: string = text.replace(CODE_REGEX, (match) => {
		protectedSpans.push(match);
		return `${PLACEHOLDER_SYNTAX.head}${protectedSpans.length - 1}${PLACEHOLDER_SYNTAX.tail}`;
	});

	return { textWithPlaceholders, protectedSpans };
}
