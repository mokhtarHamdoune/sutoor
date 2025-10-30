/**
 * CodeActionMenu Component
 *
 * A floating action menu that appears on code blocks, providing:
 * - Language selector for syntax highlighting
 * - Copy to clipboard functionality
 *
 * The menu uses fixed positioning relative to the viewport to handle scrolling correctly.
 */

import { Clipboard } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/client/shared/ui/select";
import { Button } from "@/client/shared/ui/button";
import { SUPPORTED_LANGUAGES } from "./languages";

export interface CodeActionMenuProps {
  /** Current programming language of the code block */
  language: string;
  /** Position of the code block for absolute positioning */
  position: {
    top: number;
    left: number;
    width: number;
  };
  /** Callback when language is changed */
  onLanguageChange: (language: string) => void;
  /** Callback when copy button is clicked */
  onCopy: () => void;
}

/**
 * Renders the code block action menu with language selector and copy button.
 *
 * Positioned at the top-right corner of the code block for easy access
 * while not obstructing code content.
 */
export function CodeActionMenu({
  language,
  position,
  onLanguageChange,
  onCopy,
}: CodeActionMenuProps) {
  return (
    <div
      className="fixed z-10"
      style={{
        top: position.top + 4, // Small offset to align with code block padding
        right: window.innerWidth - (position.left + position.width) + 8, // Position from right edge with padding
      }}
    >
      <div className="flex items-center gap-1.5">
        <Select value={language} onValueChange={onLanguageChange}>
          <SelectTrigger
            title="Select programming language"
            size="sm"
            className="h-7 min-w-[120px] text-xs bg-white dark:bg-zinc-800 border-border hover:bg-zinc-50 dark:hover:bg-zinc-700"
          >
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="sm"
          className="h-7 w-7 p-0 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700"
          aria-label="Copy code to clipboard"
          title="Copy to clipboard"
          onClick={onCopy}
        >
          <Clipboard className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

export default CodeActionMenu;
