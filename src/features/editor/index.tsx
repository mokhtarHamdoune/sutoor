"use client";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { editorConfig } from "./config/editor-config";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import ContentEditable from "./components/content-editable";
import { FloatingToolbarPlugin } from "./plugins";
import DraggableBlockPlugin from "./plugins/DraggableBlockPlugin";
import { useState } from "react";
import "./config/editor-theme.css";
import { ToolbarUIProvider } from "./contexts/toolbar-ui-context";

export default function Editor() {
  // These refs are required by the DraggableBlockPlugin
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);
  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  return (
    <ToolbarUIProvider>
      <LexicalComposer initialConfig={editorConfig}>
        <FloatingToolbarPlugin />
        <RichTextPlugin
          contentEditable={
            <div className="relative h-96" ref={onRef}>
              <ContentEditable placeholder="Write your thoughts here." />
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        {floatingAnchorElem && (
          <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
        )}
      </LexicalComposer>
    </ToolbarUIProvider>
  );
}
