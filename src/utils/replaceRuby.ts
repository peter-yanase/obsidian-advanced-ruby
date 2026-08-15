export function replaceRuby(
	text: string,
	sourceHead: string,
	regex: RegExp,
	replacer: (...args: string[]) => string,
): string {
	let mutatedText: string = text;
	for (let i = 0; i < 2; i += 1) {
		if (!mutatedText.contains(sourceHead)) break;
		mutatedText = mutatedText.replace(regex, replacer);
	}
	return mutatedText;
}
