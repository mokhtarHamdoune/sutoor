"use client";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { editorConfig } from "./config/editor-config";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import ContentEditable from "./components/content-editable";
import {
  AutoFocusPlugin,
  CodeBlockActionsPlugin,
  CodeHighlightPlugin,
  DraggableBlockPlugin,
  FloatingLink,
  FloatingToolbarPlugin,
  ImagesPlugin,
  LinkPlugin,
  CommandPlugin,
} from "./plugins";
// TODO : move this to the plugin do not import directly from lexical package
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { useState } from "react";
import "./config/editor-theme.css";
import { ToolbarUIProvider } from "./contexts/toolbar-ui-context";
import { CommandProvider } from "./contexts/command-context";

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
    <CommandProvider>
      <ToolbarUIProvider>
        <LexicalComposer initialConfig={editorConfig}>
          <FloatingToolbarPlugin />
          <RichTextPlugin
            contentEditable={
              <div className="relative h-full" ref={onRef}>
                <ContentEditable placeholder="Write your thoughts here." />
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          {floatingAnchorElem && (
            <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
          )}
          <ListPlugin hasStrictIndent />
          <LinkPlugin hasLinkAttributes={true} />
          <FloatingLink />
          <AutoFocusPlugin />
          <CodeHighlightPlugin />
          <CodeBlockActionsPlugin />
          <ImagesPlugin />
          <CommandPlugin />
        </LexicalComposer>
      </ToolbarUIProvider>
    </CommandProvider>
  );
}
