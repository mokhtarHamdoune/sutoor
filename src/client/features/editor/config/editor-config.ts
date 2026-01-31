import { InitialConfigType } from "@lexical/react/LexicalComposer";
import { editorTheme } from "./editor-theme";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { TableNode, TableCellNode, TableRowNode } from "@lexical/table";
import { CodeNode, CodeHighlightNode } from "@lexical/code";
import { ImageNode, YouTubeNode, HorizontalRuleNode } from "../nodes";
export const editorConfig: InitialConfigType = {
  namespace: "sutoor-editor",
  theme: editorTheme,
  onError: (error) => console.log(error),
  nodes: [
    AutoLinkNode,
    CodeNode,
    CodeHighlightNode,
    HeadingNode,
    HorizontalRuleNode,
    ImageNode,
    ListNode,
    ListItemNode,
    LinkNode,
    QuoteNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    YouTubeNode,
  ],
};
