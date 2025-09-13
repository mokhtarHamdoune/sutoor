import { LexicalEditor } from "lexical";
import { Tool } from "../../interfaces/tool";
import ToolButton from "./tool-btn";
import ToolToggleGroup from "./toggle-group";
import ToolDropDown from "./tool-dropdown";

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
        <ToolRenderer key={t.id} tool={t} editor={editor} />
      ))}
    </div>
  );
};

export const ToolRenderer: React.FC<{ editor: LexicalEditor; tool: Tool }> = ({
  editor,
  tool,
}) => {
  switch (tool.type) {
    case "toggle":
      return <ToolButton tool={tool} editor={editor} />;
    case "toggle-group":
      return <ToolToggleGroup tool={tool} editor={editor} />;
    case "dropdown":
      return <ToolDropDown tool={tool} editor={editor} />;
    case "custom":
      return tool.render({ editor });
    default:
      return null;
  }
};

export default Toolbar;
