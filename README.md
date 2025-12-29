<p align="center">
<img alt="Advanced Ruby logo" src="./assets/logo_default.svg">
</p>

---

Advanced Ruby provides robust, language‑independent ruby annotation rendering and editing for [Obsidian](https://github.com/obsidianmd).

While ruby is commonly used to show the pronunciation of Japanese and other East Asian characters, it can be applied to annotate any kind of text.

This plugin supports the full range of Unicode, making it suitable not only for phonetic guides but also for semantic glosses and layered annotations.

It renders Markdown ruby syntax (`{base|ruby}`) as HTML ruby tags (`<ruby>base<rt>ruby</rt></ruby>`) without modifying your notes.

In editing mode, you can insert Markdown ruby wrappers and convert between Markdown and HTML ruby syntaxes.

## Features

- Fast and efficient parsing  
- Skips code blocks automatically  
- Command to wrap selected text in ruby syntax or insert an empty wrapper  
- Context menu option for wrapping selected text  
- Command to convert between Markdown and HTML ruby syntaxes  
- Touch support for mobile  
- Granular style customization via the [Obsidian Style Settings plugin](https://github.com/mgmeyers/obsidian-style-settings) (supports up to two layers)  
- Non‑destructive rendering  
- Support for complex nested markup  
- Intuitive UI  

## How to Use

- Use the wrapper command to wrap selected text or insert an empty wrapper. You can also use the context menu, or simply write ruby markup manually.  
- Ruby annotations render in reading and editing modes, but not in source mode. Ruby inside code blocks or inline code will not render.  
- To edit an existing ruby annotation, click on it or move the cursor into it using the left and right arrow keys.  
- If smart arrows are enabled, the cursor will jump over ruby annotations without unwrapping them. Press the arrow key in the opposite direction after a jump to edit the skipped annotation. You can disable smart arrows if you prefer ruby to unwrap on cursor contact. (Note: smart arrows may slightly slow cursor movement.)  
- If the note contains any Markdown ruby, the conversion command will convert them to HTML. If the note contains only HTML ruby, the command will convert all of them to Markdown ruby.  

<img src="./assets/sample.png">

## Design Choices

- Markdown and HTML markup inside ruby annotations are not supported.

## Roadmap

- This plugin is considered feature‑complete. No new features are planned beyond maintenance.  
- Feature requests, bug reports, and pull requests are welcome.

## Security

- This plugin does not store or transmit any data and requires no internet connection.  
- I use this plugin daily and fix issues as I encounter them. If you prefer a version reviewed by the Obsidian team, use version 1.03.

## Acknowledgments

This project includes code derived from:

- Markdown Furigana Plugin (Obsidian) (https://github.com/steven-kraft/obsidian-markdown-furigana), licensed under the MIT License. Copyright (c) 2021 Steven Kraft.

- Obsidian Furigana (https://github.com/uonr/obsidian-furigana), licensed under the MIT License. Copyright (c) 2021 Koppa.

- Japanese Novel Ruby Plugin for Obsidian (https://github.com/k-quels/japanese-novel-ruby), licensed under the MIT License. Copyright (c) 2024 quels <@k-quels>.

- Mahgen Renderer (https://github.com/MichaelFW-ui/mahgen-renderer), licensed under the MIT License. Copyright (c) 2024 Michael Francis Williams.
