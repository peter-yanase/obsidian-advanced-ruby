export const MDRubyRegex: RegExp = /{([^{]+?)\|(.+?)}/g;
export const HTMLRubyRegex: RegExp = /<ruby>(.+?)<rt>(.+?)<\/rt><\/ruby>/g;

export function transformRubyBlocks(
	originalText: string,
	autoDetectRuby: boolean = false,
): string {
	let maxMutations: number = 5;
	let currentTextMutation: string = originalText;
	let previousTextMutation: string;
	let mutationCount: number = 0;
	let regex: RegExp = MDRubyRegex;
	let direction: string = "md-to-html";

	if (autoDetectRuby && !MDRubyRegex.test(originalText)) {
		direction = "html-to-md";
	}

	let head: string, divider: string, tail: string;
	switch (direction) {
		case "md-to-html":
			head = "<ruby>";
			divider = "<rt>";
			tail = "</rt></ruby>";
			break;
		case "html-to-md":
			head = "{";
			divider = "|";
			tail = "}";
			regex = HTMLRubyRegex;
			break;
		default:
			return originalText;
	}

	do {
		previousTextMutation = currentTextMutation;
		currentTextMutation = currentTextMutation.replace(
			regex,
			(_, base, ruby) => {
				return `${head}${base}${divider}${ruby}${tail}`;
			},
		);
		mutationCount++;
	} while (
		currentTextMutation !== previousTextMutation &&
		mutationCount < maxMutations
	);

	return currentTextMutation;
}
