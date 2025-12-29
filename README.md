<p align="center">
	<img alt="Advanced Ruby logo" src="./assets/logo_default.svg">
</p>

---


Advanced Ruby enables complex, language-independent ruby annotation rendering and editing in [Obsidian](https://github.com/obsidianmd).

While ruby is commonly used for showing the pronounciation of Japanese and other East Asian characters, it can be used to annotate any kind of text.

This plugin supports the full range of Unicode, making it suitable for not only phonetic guides, but also semantic glosses or layered annotations.

In reading mode, it renders markdown ruby syntax (`{base|ruby}`) into HTML ruby tags (`<ruby>base<rt>ruby</rt></ruby>`) without modifying your notes.

In editing mode, you can insert Markdown ruby wrappers and convert between Markdown and HTML ruby syntaxes.

(IMPORTANT: Do not use version 1.0.4 or 1.0.5)

## Features

- Fast and efficient parsing
- Code block skipping
- Command to wrap selected text in ruby syntax
- Command to convert between Markdown and HTML syntaxes
- Granular style settings via the [Obsidian Style Settings Plugin](https://github.com/mgmeyers/obsidian-style-settings) (up to two layers)
- Non-destructive rendering
- Support for complex nested markup
- Intuitive UI

<img src="./assets/sample.png">

## Design choices

- Markdown and HTML inside ruby annotations are not supported

## Roadmap

- [ ] Settings tab
- [ ] Rendering multiple layers in editing view
- [ ] Caching

## Acknowledgments

Standing on the shoulders of giants:

 - [Markdown Furigana Plugin (Obsidian)](https://github.com/steven-kraft/obsidian-markdown-furigana)
 - [Obsidian Furigana](https://github.com/uonr/obsidian-furigana)
 - [Japanese Novel Ruby Plugin for Obsidian](https://github.com/k-quels/japanese-novel-ruby)
- [Mahgen Renderer](https://github.com/MichaelFW-ui/mahgen-renderer)
 
