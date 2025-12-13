import { keymap, EditorView } from "@codemirror/view";
import { EditorSelection } from "@codemirror/state";

const MDRubyRegex: RegExp = /{([^{]+?)\|(.+?)}/g;

export const ARKeymap = keymap.of([
  { key: "ArrowRight", run: jumpRubyRight },
  { key: "ArrowLeft", run: jumpRubyLeft }
]);

function jumpRubyRight(view: EditorView) {
  const pos = view.state.selection.main.head;
  const text = view.state.doc.toString();

  let match;
  while ((match = MDRubyRegex.exec(text)) !== null) {
    const from = match.index;
    const to = from + match[0].length;
    if (pos === from) {
      view.dispatch({
        selection: EditorSelection.cursor(to),
        scrollIntoView: true,
      });
      return true;
    }
  }
  return false;
}

function jumpRubyLeft(view: EditorView) {
  const pos = view.state.selection.main.head;
  const text = view.state.doc.toString();

  let match;
  while ((match = MDRubyRegex.exec(text)) !== null) {
    const from = match.index;
    const to = from + match[0].length;
    if (pos === to) {
      view.dispatch({
        selection: EditorSelection.cursor(from),
        scrollIntoView: true,
      });
      return true;
    }
  }
  return false;
}

