"use client";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { editorConfig } from "./config/editor-config";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import ContentEditable from "./components/content-editable";
import { FloatingToolbarPlugin } from "./plugins";
import "./config/editor-theme.css";

export default function Editor() {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <FloatingToolbarPlugin />
      <RichTextPlugin
        contentEditable={
          <ContentEditable placeholder="Write your thoughts here." />
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
      <p> lorem ipsum just some text to test.</p>
    </LexicalComposer>
  );
}
