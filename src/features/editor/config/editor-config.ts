import { InitialConfigType } from "@lexical/react/LexicalComposer";
import { editorTheme } from "./editor-theme";
import { HeadingNode } from "@lexical/rich-text";
export const editorConfig: InitialConfigType = {
  namespace: "sutoor-editor",
  theme: editorTheme,
  onError: (error) => console.log(error),
  nodes: [HeadingNode],
};
