import { RubyMatch } from "./types";

export function extractRuby(text: string, offset: number = 0): RubyMatch[] {
	// Handle nested ruby
	function findAtDepth(
		target: string,
		depth: number,
		text: string,
		start: number,
	): number | void {
		for (let index: number = start; index < text.length; index++) {
			const character: string | undefined = text[index];
			if (character === "{") depth++;
			else if (character === "}") depth--;
			if (character === target && depth === 0) return index;
		}
		return;
	}

	let results: RubyMatch[] = [];
	let scanIndex: number = 0;
	while (scanIndex < text.length) {
		// Skip until next opening brace
		if (text[scanIndex] !== "{") {
			scanIndex++;
			continue;
		}

		const openingBraceIndex: number = scanIndex;
		const closingBraceIndex: number | void = findAtDepth(
			"}",
			1,
			text,
			openingBraceIndex + 1,
		);
		if (!closingBraceIndex) break;

		const braceContent: string = text.slice(
			openingBraceIndex + 1,
			closingBraceIndex,
		);
		const pipeIndex: number | void = findAtDepth("|", 0, braceContent, 0);
		if (pipeIndex && !braceContent.endsWith("|")) {
			// This is a valid ruby block
			results.push({
				start: offset + openingBraceIndex,
				end: offset + closingBraceIndex + 1,
				base: braceContent.slice(0, pipeIndex),
				ruby: braceContent.slice(pipeIndex + 1),
			});
		} else {
			// No top-level pipe = normal braces
			// Brace content ends with pipe = empty syntax
			// But it may contain ruby blocks, so recurse
			results.push(
				...extractRuby(braceContent, offset + openingBraceIndex + 1),
			);
		}

		scanIndex = closingBraceIndex + 1;
	}

	return results;
}
