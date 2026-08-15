import { ViewPlugin } from "@codemirror/view";

import { rubyRenderingViewPlugin } from "rendering/rubyRenderingViewPlugin";

export const rubyRenderingExtension = ViewPlugin.fromClass(
	rubyRenderingViewPlugin,
	{
		decorations: (value: rubyRenderingViewPlugin) => value.decorations,
	},
);
