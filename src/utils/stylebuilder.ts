import { cssVariableMap, cssUnits } from "./constants.ts";
import type { ARSettings } from "./types.ts";

export function setCSSVariables(settings: ARSettings) {
	const props: Record<string, string> = {};

	for (const key in cssVariableMap) {
		const cssVar = cssVariableMap[key as keyof ARSettings]!;
		const unit = cssUnits[key as keyof ARSettings] ?? "";
		const value = settings[key as keyof ARSettings];

		props[cssVar] = `${value}${unit}`;
	}

	document.body.setCssProps(props);
}
