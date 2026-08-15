import { PLACEHOLDER_REGEX } from "../constants";

export function restoreProtectedSpans(
	text: string,
	protectedSpans: string[],
): string {
	return text.replace(
		PLACEHOLDER_REGEX,
		(_match, number) => protectedSpans[+number]!,
	);
}
