import { type Ruby } from "../types";
import { createRubyElement } from "./createRubyElement";
import { extractRuby } from "./extractRuby";

export function renderRubyBaseText(text: string): Node[] {
	const nodes: Node[] = [];
	const rubyMatches: Ruby[] = extractRuby(text, 0);

	if (rubyMatches.length > 0) {
		let pointerPosition: number = 0;
		for (const ruby of rubyMatches) {
			// Add the text before the match
			if (pointerPosition < ruby.start)
				nodes.push(
					activeDocument.createTextNode(
						text.slice(pointerPosition, ruby.start),
					),
				);

			// Add the ruby
			nodes.push(
				createRubyElement(
					// Recurse
					renderRubyBaseText(ruby.base),
					ruby.ruby,
				),
			);

			pointerPosition = ruby.end;
		}

		// Add the remaining text
		if (pointerPosition < text.length)
			nodes.push(
				activeDocument.createTextNode(text.slice(pointerPosition)),
			);
	}
	// Push the whole text if no ruby was found
	else {
		nodes.push(activeDocument.createTextNode(text));
	}

	return nodes;
}
