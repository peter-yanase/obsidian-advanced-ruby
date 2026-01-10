import { transformRubyBlocks } from "../utils/utils";
import { sanitizeHTMLToDom } from "obsidian";

// List of nodes to skip
const dontRender: Set<string> = new Set(["CODE", "PRE"]);

export function readingView(element: HTMLElement) {
	// Skip early if there are no curly brackets
	if (!element.innerText.includes("{")) return;

	// Create walker
	const walker: TreeWalker = document.createTreeWalker(
		element,
		// Only process nodes containing text
		NodeFilter.SHOW_TEXT,
	);

	// Create array of nodes to mutate
	const nodesToMutate: Text[] = [];
	while (walker.nextNode()) {
		const candidateNode: Text = walker.currentNode as Text;

		// Skip code blocks
		const candidateNodeTag: string | undefined =
			candidateNode.parentElement?.tagName;
		if (candidateNodeTag && dontRender.has(candidateNodeTag)) continue;

		// Add node to the array
		nodesToMutate.push(candidateNode);
	}

	// Mutate nodes
	for (const nodeToMutate of nodesToMutate) {
		// Get the node text
		const originalText: string = nodeToMutate.nodeValue!;

		//Mutate text
		const { text: newText } = transformRubyBlocks(originalText);

		// Sanitize HTML
		const safeFragment: DocumentFragment = sanitizeHTMLToDom(newText);

		// Inject sanitized fragment into the document
		nodeToMutate.replaceWith(safeFragment);
	}
}
