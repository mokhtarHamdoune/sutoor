import { InitialConfigType } from "@lexical/react/LexicalComposer";
import { editorTheme } from "./editor-theme";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { CodeNode, CodeHighlightNode } from "@lexical/code";
import { ImageNode, YouTubeNode } from "../nodes";
export const editorConfig: InitialConfigType = {
  namespace: "sutoor-editor",
  theme: editorTheme,
  onError: (error) => console.log(error),
  nodes: [
    HeadingNode,
    QuoteNode,
    ListNode,
    ListItemNode,
    LinkNode,
    CodeNode,
    CodeHighlightNode,
    ImageNode,
    AutoLinkNode,
    YouTubeNode,
  ],
};
