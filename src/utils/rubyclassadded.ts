export function rubyClassHandler(document: Document) {
	const observer = new MutationObserver(() => {
		const allRuby: NodeListOf<HTMLElement> =
			document.querySelectorAll("ruby");

		for (const ruby of allRuby) {
			// Create an array of ruby from children
			const nestedRuby: Element[] = Array.from(ruby.children).filter(
				(child) => child.tagName === "RUBY",
			);

			// No nesting = level 1
			if (nestedRuby.length === 0) {
				ruby.addClass("ar-lv1");
			}
			// Nested only once = level 2
			else if (!nestedRuby.some((ruby) => ruby.querySelector("ruby"))) {
				ruby.addClass("ar-lv2");
			}
		}
	});

	observer.observe(document, {
		childList: true,
		subtree: true,
	});
}
