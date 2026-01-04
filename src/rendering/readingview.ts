import { transformRubyBlocks } from "../utils/utils";
import { sanitizeHTMLToDom } from "obsidian";

const notRendering: Set<string> = new Set(["CODE", "PRE"]);

export function readingView(element: HTMLElement) {
	// Skip early if no curly brackets
	if (!element.innerText.includes("{")) return;

	// Create walker
	const walker: TreeWalker = document.createTreeWalker(
		element,
		NodeFilter.SHOW_TEXT, // Only process nodes containing text
	);

	// Create array of nodes to mutate
	const nodesToMutate: Text[] = [];
	while (walker.nextNode()) {
		const candidateNode: Text = walker.currentNode as Text;
		const candidateNodeTag: string | undefined =
			candidateNode.parentElement?.tagName;
		if (candidateNodeTag && notRendering.has(candidateNodeTag)) continue;
		nodesToMutate.push(candidateNode);
	}

	// Mutate nodes
	for (const nodeToMutate of nodesToMutate) {
		const originalText: string = nodeToMutate.nodeValue!;

		//Mutate text
		const newText: string = transformRubyBlocks(originalText);

		// Sanitize HTML
		const safeFragment: DocumentFragment = sanitizeHTMLToDom(newText);

		// Inject sanitized fragment into the document
		nodeToMutate.replaceWith(safeFragment);
	}
}
