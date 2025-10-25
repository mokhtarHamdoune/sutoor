/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { JSX } from "react";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $insertNodeToNearestRoot } from "@lexical/utils";
import {
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalCommand,
} from "lexical";
import { useEffect } from "react";

import { $createYouTubeNode, YouTubeNode } from "../../nodes/YouTubeNode";
import { useCommandRegistry } from "../../hooks";
import { Youtube } from "lucide-react";
import { INSERT_EMBED_COMMAND } from "@lexical/react/LexicalAutoEmbedPlugin";

export const INSERT_YOUTUBE_COMMAND: LexicalCommand<string> = createCommand(
  "INSERT_YOUTUBE_COMMAND"
);

export function YouTubePlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  const { registerCommand } = useCommandRegistry();

  useEffect(() => {
    if (!editor.hasNodes([YouTubeNode])) {
      throw new Error("YouTubePlugin: YouTubeNode not registered on editor");
    }

    registerCommand({
      id: "insert_youtube_command",
      label: "Youtube",
      keywords: ["youtube"],
      category: "media",
      description: "Insert a Youtube video",
      icon: <Youtube />,
      execute(editor) {
        editor.dispatchCommand(INSERT_EMBED_COMMAND, "youtube-video");
      },
    });

    return editor.registerCommand<string>(
      INSERT_YOUTUBE_COMMAND,
      (payload) => {
        const youTubeNode = $createYouTubeNode(payload);
        $insertNodeToNearestRoot(youTubeNode);

        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor, registerCommand]);

  return null;
}

export default YouTubePlugin;
