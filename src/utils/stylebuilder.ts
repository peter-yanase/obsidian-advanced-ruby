// OK
import { CSS_UNITS, CSS_VARIABLE_MAP } from "./constants";
import type { ARSettings } from "./types";

export function setCSSVariables(settings: ARSettings): void {
	const properties: Record<string, string> = {};

	for (const key in CSS_VARIABLE_MAP) {
		const cssVariable: string = CSS_VARIABLE_MAP[key as keyof ARSettings]!;
		const value: string | number | boolean =
			settings[key as keyof ARSettings];
		const unit: string = CSS_UNITS[key as keyof ARSettings] ?? "";

		properties[cssVariable] = `${value}${unit}`;
	}

	document.body.setCssProps(properties);
}
