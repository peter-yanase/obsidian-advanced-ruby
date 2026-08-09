// OK
import { type Ruby } from "./types";
import { findCharAtDepthFrom } from "./utils";

export function extractRuby(text: string, offset: number = 0): Ruby[] {
	let extractedRuby: Ruby[] = [];
	let pointerPosition: number = 0;
	while (pointerPosition < text.length) {
		// Skip until the next opening brace
		if (text[pointerPosition] !== "{") {
			pointerPosition += 1;
			continue;
		}
		const openingBraceIndex: number = pointerPosition;

		// Search for a closing brace at the same nesting level
		const closingBraceIndex: number | undefined = findCharAtDepthFrom(
			"}",
			1,
			text,
			openingBraceIndex + 1,
		);

		// If no valid closing brace was found, try looking for another opening brace
		if (!closingBraceIndex) {
			pointerPosition += 1;
			continue;
		}

		// Carve out brace content
		const braceContent: string = text.slice(
			openingBraceIndex + 1,
			closingBraceIndex,
		);

		// Look for the top-level pipe inside the content
		const pipeIndexInside: number | undefined = findCharAtDepthFrom(
			"|",
			0,
			braceContent,
			0,
		);

		if (
			// No top-level pipe = normal braces
			!pipeIndexInside ||
			// Brace content ends with top-level pipe = empty syntax
			openingBraceIndex + 1 + pipeIndexInside === closingBraceIndex - 1
		) {
			// But it may contain valid ruby markup, so recurse
			const newOffset = offset + openingBraceIndex + 1;
			extractedRuby.push(...extractRuby(braceContent, newOffset));
		} else {
			// This is valid ruby markup
			extractedRuby.push({
				start: offset + openingBraceIndex,
				end: offset + closingBraceIndex + 1,
				base: braceContent.slice(0, pipeIndexInside),
				ruby: braceContent.slice(pipeIndexInside + 1),
			});
		}
		pointerPosition = closingBraceIndex + 1;
	}
	return extractedRuby;
}
