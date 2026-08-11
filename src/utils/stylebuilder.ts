import { CSS_VARIABLE_MAP, CSS_UNITS } from "./constants";
import type { ARSettings } from "./types";

export function setCSSVariables(settings: ARSettings) {
	const props: Record<string, string> = {};

	for (const key in CSS_VARIABLE_MAP) {
		const cssVar = CSS_VARIABLE_MAP[key as keyof ARSettings]!;
		const unit = CSS_UNITS[key as keyof ARSettings] ?? "";
		const value = settings[key as keyof ARSettings];

		props[cssVar] = `${value}${unit}`;
	}

	document.body.setCssProps(props);
}
