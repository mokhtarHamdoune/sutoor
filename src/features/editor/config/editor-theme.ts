import { EditorThemeClasses } from "lexical";
export const editorTheme: EditorThemeClasses = {
  text: {
    bold: "editor-text-bold",
    italic: "editor-text-italic",
    strikethrough: "editor-text-strikethrough",
    underline: "editor-text-underline",
    underlineStrikethrough: "editor-text-underlineStrikethrough",
  },
  heading: {
    h1: "editor-text-h1",
    h2: "editor-text-h2",
    h3: "editor-text-h3",
    h4: "editor-text-h4",
    h5: "editor-text-h5",
    h6: "editor-text-h6",
  },
  list: {
    checklist: "editor-checked-list",
    listitemChecked: "editor-checked-list-item-checked",
    listitemUnchecked: "editor-checked-list-item-unchecked",
    nested: {
      listitem: "editor-list-nested-item",
    },
    listitem: "editor-list-item",
    ul: "editor-list-ul",
    ol: "editor-list-ol",
    olDepth: [
      "editor-list-ol1",
      "editor-list-ol2",
      "editor-list-ol3",
      "editor-list-ol4",
      "editor-list-ol5",
    ],
  },
};
