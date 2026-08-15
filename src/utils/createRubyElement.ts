export function createRubyElement(
	baseNodes: Node[],
	rubyText: string,
): HTMLElement {
	const rubyEl: HTMLElement = createEl("ruby");

	// Append nested ruby
	for (const node of baseNodes) rubyEl.appendChild(node);

	// Add the annotation
	const rtEl: HTMLElement = createEl("rt");
	rtEl.textContent = rubyText;
	rubyEl.appendChild(rtEl);

	return rubyEl;
}
