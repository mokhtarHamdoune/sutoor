import { InitialConfigType } from "@lexical/react/LexicalComposer";
import { editorTheme } from "./editor-theme";
import { HeadingNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { LinkNode } from "@lexical/link";
export const editorConfig: InitialConfigType = {
  namespace: "sutoor-editor",
  theme: editorTheme,
  onError: (error) => console.log(error),
  nodes: [HeadingNode, ListNode, ListItemNode, LinkNode],
};
