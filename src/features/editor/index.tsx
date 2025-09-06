"use client";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { editorConfig } from "./config";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import ContentEditable from "./ui/ContentEditable";

export default function Editor() {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <RichTextPlugin
        contentEditable={
          <div className="editor">
            <ContentEditable placeholder="Write your thoughts here." />
          </div>
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
    </LexicalComposer>
  );
}
