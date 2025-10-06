<p align="center"><img src="./assets/logo_on_dark.svg"></p>

Advanced Ruby enables complex, language-independent ruby annotation rendering in [Obsidian](https://github.com/obsidianmd).
It renders `{base|ruby}` syntax into semantic `<ruby><rt>` tags in reading mode without modifying your notes.
While ruby is commonly used for showing the pronounciation of East Asian characters, it can be used to any kind of text.
This plugin supports the full range of Unicode, making it suitable for not only phonetic guides, but also semantic glosses, or layered annotations across languages and notes.

## Features

- Fast and efficient parsing
- Code block skipping
- Command to wrap selected text in ruby syntax
- Granular style settings via the [Obsidian Style Settings Plugin](https://github.com/mgmeyers/obsidian-style-settings) (up to two layers)
- Non-destructive rendering
- Supporting complex nested markup

<img src="./assets/sample.png">

## Design choices

- Markdown and HTML inside ruby annotations are not supported
- Live Preview is not supported
	- To preview ruby while editing, open a second pane in reading mode

 ## Acknowledgments

Standing on the shoulders of giants:

 - [Markdown Furigana Plugin (Obsidian)](https://github.com/steven-kraft/obsidian-markdown-furigana)
 - [Obsidian Furigana](https://github.com/uonr/obsidian-furigana)
 - [Japanese Novel Ruby Plugin for Obsidian](https://github.com/k-quels/japanese-novel-ruby)
