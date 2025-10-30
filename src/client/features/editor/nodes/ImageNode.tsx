/**
 * ImageNode - Lexical DecoratorNode for images
 *
 * Handles image storage, serialization, and rendering in the editor.
 * Supports: lazy loading, captions, resizing, paste from clipboard
 */

import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from "lexical";
import type { JSX } from "react";

import { $applyNodeReplacement, DecoratorNode } from "lexical";
import * as React from "react";

// Lazy load the component that renders the image
const ImageComponent = React.lazy(() => import("../components/image-node"));

// ============================================================================
// TYPES
// ============================================================================

/** Payload for creating an image node */
export interface ImagePayload {
  src: string; // Image URL or data URL
  altText: string; // Alt text for accessibility
  caption?: string; // Optional simple text caption
  width?: number; // Optional width in pixels
  height?: number; // Optional height in pixels
  maxWidth?: number; // Max width (default 500)
  key?: NodeKey; // Optional Lexical node key
}

/** Serialized format for save/load */
export type SerializedImageNode = Spread<
  {
    src: string;
    altText: string;
    caption: string;
    width?: number;
    height?: number;
    maxWidth: number;
  },
  SerializedLexicalNode
>;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Converts HTML <img> element to ImageNode when pasting
 */
function $convertImageElement(domNode: Node): null | DOMConversionOutput {
  const img = domNode as HTMLImageElement;
  const src = img.getAttribute("src");

  // Skip local file paths (security) and missing src
  if (!src || src.startsWith("file:///")) {
    return null;
  }

  const { alt: altText, width, height } = img;
  const node = $createImageNode({
    src,
    altText: altText || "",
    width: width ? Number(width) : undefined,
    height: height ? Number(height) : undefined,
  });

  return { node };
}

// ============================================================================
// IMAGE NODE CLASS
// ============================================================================

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __altText: string;
  __caption: string;
  __width: "inherit" | number;
  __height: "inherit" | number;
  __maxWidth: number;

  static getType(): string {
    return "image";
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(
      node.__src,
      node.__altText,
      node.__caption,
      node.__maxWidth,
      node.__width,
      node.__height,
      node.__key
    );
  }

  /** Loads ImageNode from saved JSON */
  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { altText, caption, height, width, maxWidth, src } = serializedNode;
    return $createImageNode({
      src,
      altText,
      caption,
      width,
      height,
      maxWidth,
    });
  }

  /** Tells Lexical how to convert pasted HTML to ImageNode */
  static importDOM(): DOMConversionMap | null {
    return {
      img: () => ({
        conversion: $convertImageElement,
        priority: 0,
      }),
    };
  }

  constructor(
    src: string,
    altText: string,
    caption: string,
    maxWidth: number,
    width?: "inherit" | number,
    height?: "inherit" | number,
    key?: NodeKey
  ) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__caption = caption;
    this.__maxWidth = maxWidth;
    this.__width = width || "inherit";
    this.__height = height || "inherit";
  }

  /** Saves ImageNode to JSON for persistence */
  exportJSON(): SerializedImageNode {
    return {
      ...super.exportJSON(),
      src: this.__src,
      altText: this.__altText,
      caption: this.__caption,
      width: this.__width === "inherit" ? 0 : this.__width,
      height: this.__height === "inherit" ? 0 : this.__height,
      maxWidth: this.__maxWidth,
    };
  }

  /** Converts ImageNode to HTML for clipboard/export */
  exportDOM(): DOMExportOutput {
    const imgElement = document.createElement("img");
    imgElement.setAttribute("src", this.__src);
    imgElement.setAttribute("alt", this.__altText);

    if (typeof this.__width === "number") {
      imgElement.setAttribute("width", this.__width.toString());
    }
    if (typeof this.__height === "number") {
      imgElement.setAttribute("height", this.__height.toString());
    }

    return { element: imgElement };
  }

  /** Creates the DOM wrapper element */
  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement("span");
    const theme = config.theme;
    const className = theme.image;
    if (className !== undefined) {
      span.className = className;
    }
    return span;
  }

  /** We use React for rendering, so DOM never needs updating */
  updateDOM(): false {
    return false;
  }

  /** Renders the React component inside the node */
  decorate(): JSX.Element {
    return (
      <ImageComponent
        src={this.__src}
        altText={this.__altText}
        caption={this.__caption}
        width={this.__width}
        height={this.__height}
        maxWidth={this.__maxWidth}
        nodeKey={this.getKey()}
        resizable={true}
      />
    );
  }

  // ──────────────────────────────────────────────────────────────────────
  // GETTERS & SETTERS
  // ──────────────────────────────────────────────────────────────────────

  getSrc(): string {
    return this.__src;
  }

  getAltText(): string {
    return this.__altText;
  }

  getCaption(): string {
    return this.__caption;
  }

  /** Updates image dimensions (called by ImageResizer) */
  setWidthAndHeight(
    width: "inherit" | number,
    height: "inherit" | number
  ): void {
    const writable = this.getWritable();
    writable.__width = width;
    writable.__height = height;
  }

  /** Updates the caption text */
  setCaption(caption: string): void {
    const writable = this.getWritable();
    writable.__caption = caption;
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Factory function to create an ImageNode
 * Use this instead of `new ImageNode()` directly
 */
export function $createImageNode({
  src,
  altText,
  caption = "",
  width,
  height,
  maxWidth = 500,
  key,
}: ImagePayload): ImageNode {
  return $applyNodeReplacement(
    new ImageNode(src, altText, caption, maxWidth, width, height, key)
  );
}

/**
 * Type guard to check if a node is an ImageNode
 */
export function $isImageNode(
  node: LexicalNode | null | undefined
): node is ImageNode {
  return node instanceof ImageNode;
}
