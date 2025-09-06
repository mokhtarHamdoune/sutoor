import { InitialConfigType } from "@lexical/react/LexicalComposer";
import { editorTheme } from "./editor-theme";
export const editorConfig: InitialConfigType = {
  namespace: "sutoor-editor",
  theme: editorTheme,
  onError: (error) => console.log(error),
};
