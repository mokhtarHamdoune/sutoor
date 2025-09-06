import { LexicalEditor } from "lexical";
import { Tool } from "../../interfaces/tool";
import ToolButton from "./tool-btn";

export const Toolbar: React.FC<{
  editor: LexicalEditor;
  tools: Tool[];
  className?: string;
}> = ({ editor, tools, className }) => {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        gap: 4,
        alignItems: "center",
        padding: 8,
        background: "white",
        borderRadius: 6,
        boxShadow: "0 1px 6px rgba(0,0,0,0.12)",
      }}
    >
      {tools.map((t) => (
        <ToolButton key={t.id} tool={t} editor={editor} />
      ))}
    </div>
  );
};

export default Toolbar;
