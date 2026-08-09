// OK
import { sanitizeHTMLToDom } from "obsidian";
import { transformRubyBlocks } from "utils/rubyblocktransformer";

// Render ruby in reading mode
export function rubyPostProcessor(element: HTMLElement) {
	// Skip early if there is no opening brace
	if (!element.innerText.includes("{")) return;

	const walker: TreeWalker = activeDocument.createTreeWalker(
		element,
		// Only process nodes containing text
		NodeFilter.SHOW_TEXT,
	);
	const nodesToMutate: Text[] = [];
	while (walker.nextNode()) {
		const candidate: Text = walker.currentNode as Text;

		// Skip code blocks
		const parentTag: string | undefined = candidate.parentElement?.tagName;
		if (parentTag && parentTag === "CODE") continue;

		nodesToMutate.push(candidate);
	}

	for (const node of nodesToMutate) {
		const originalText: string = node.nodeValue!;
		const { text: newText } = transformRubyBlocks(originalText);
		const safeFragment: DocumentFragment = sanitizeHTMLToDom(newText);
		node.replaceWith(safeFragment);
	}
}
