import React from "react";
import { Tool } from "../../interfaces/tool";
import { LexicalEditor } from "lexical";

const ToolButton: React.FC<{
  tool: Tool;
  editor: LexicalEditor;
}> = ({ tool, editor }) => {
  const [active, setActive] = React.useState(false);

  React.useEffect(() => {
    // Check active/disabled on mount and on editor state changes
    const updateState = () => {
      if (tool.isActive) {
        try {
          setActive(tool.isActive(editor));
        } catch {
          setActive(false);
        }
      }
    };

    // initial
    updateState();

    // subscribe to editor to update UI on changes
    // Lexical provides registerEditorStateUpdate or registerUpdateListener; use a simple approach:
    const unregister = editor.registerUpdateListener(() => {
      updateState();
    });

    return () => {
      unregister();
    };
  }, [editor, tool]);

  if (tool.render) {
    return <>{tool.render({ editor })}</>;
  }

  return (
    <button
      type="button"
      title={tool.label}
      onClick={() => tool.execute(editor)}
      aria-pressed={tool.type === "toggle" ? active : undefined}
      style={{
        padding: 6,
        borderRadius: 4,
        marginRight: 6,
        border: active ? "1px solid #333" : "1px solid transparent",
        background: active ? "#eee" : "transparent",
      }}
    >
      {tool.icon ?? tool.label}
    </button>
  );
};
export default ToolButton;
