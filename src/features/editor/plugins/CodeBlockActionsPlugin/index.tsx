import { $isCodeNode } from "@lexical/code";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection } from "lexical";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Button } from "@/shared/ui/button";
// TODO: hide this under another abstraction layer
import { toast, Toaster } from "sonner";
import { Clipboard } from "lucide-react";

export const CodeBlockActionsPlugin = () => {
  const [editor] = useLexicalComposerContext();

  const [codeBlockRect, setCodeBlockRect] = useState<DOMRect | null>(null);
  const [programmingLanguage, setProgrammingLanguage] =
    useState<string>("javascript");

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if (!selection) {
          return;
        }
        if ($isRangeSelection(selection)) {
          const element = selection.anchor.getNode().getTopLevelElement();
          if ($isCodeNode(element)) {
            const domElement = editor.getElementByKey(element.getKey());
            const rect = domElement?.getBoundingClientRect();
            setCodeBlockRect(rect || null);
            setProgrammingLanguage(element.getLanguage() || "javascript");
          }
        }
      });
    });
  }, [editor]);

  const handleLanguageChange = (language: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if (!selection) {
        return;
      }

      if ($isRangeSelection(selection)) {
        const element = selection.anchor.getNode().getTopLevelElement();
        if ($isCodeNode(element)) {
          element.setLanguage(language);
          setProgrammingLanguage(language);
        }
      }
    });
  };

  const copyToClipboard = () => {
    editor.read(() => {
      const selection = $getSelection();
      if (!selection) {
        return;
      }

      if ($isRangeSelection(selection)) {
        const element = selection.anchor.getNode().getTopLevelElement();
        if ($isCodeNode(element)) {
          const codeContent = element.getTextContent();
          navigator.clipboard
            .writeText(codeContent)
            .then(() => {
              toast.success("Code copied to clipboard");
            })
            .catch(() => {
              toast.error("Failed to copy code");
            });
        }
      }
    });
  };

  if (!codeBlockRect) {
    return null;
  }

  return (
    <div
      className="absolute"
      style={{
        top: codeBlockRect.top,
        left: codeBlockRect.left + codeBlockRect.width - 200,
      }}
    >
      <div className="px-2 py-1 flex items-center space-x-2">
        <Toaster />
        <Select
          value={programmingLanguage}
          onValueChange={handleLanguageChange}
        >
          <SelectTrigger title="select language" className="bg-white">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="javascript">Javascript</SelectItem>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="go">Go</SelectItem>
            <SelectItem value="typescript">Typescript</SelectItem>
            <SelectItem value="json">JSON</SelectItem>
            <SelectItem value="sql">SQL</SelectItem>
            <SelectItem value="css">CSS</SelectItem>
            <SelectItem value="html">HTML</SelectItem>
            <SelectItem value="java">Java</SelectItem>
            <SelectItem value="kotlin">Kotlin</SelectItem>
            <SelectItem value="csharp">C#</SelectItem>
            <SelectItem value="cpp">C++</SelectItem>
            <SelectItem value="ruby">Ruby</SelectItem>
            <SelectItem value="php">PHP</SelectItem>
            <SelectItem value="rust">Rust</SelectItem>
            <SelectItem value="swift">Swift</SelectItem>
            <SelectItem value="bash">Bash</SelectItem>
            <SelectItem value="shell">Shell</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="icon"
          aria-label="Submit"
          title="copy to clipboard"
          onClick={copyToClipboard}
        >
          <Clipboard />
        </Button>
      </div>
    </div>
  );
};

export default CodeBlockActionsPlugin;
