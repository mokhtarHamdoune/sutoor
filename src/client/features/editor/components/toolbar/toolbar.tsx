import { Tool } from "../../interfaces/tool";
import ToolButton from "./tool-btn";
import ToolToggleGroup from "./toggle-group";
import ToolDropDown from "./tool-dropdown";
import ToolColorPicker from "./tool-color-picker";
import { memo } from "react";

export const Toolbar: React.FC<{
  tools: Tool[];
}> = memo(({ tools }) => {
  return (
    <div className="flex items-center gap-1 p-2 bg-white rounded shadow">
      {tools.map((t) => (
        <ToolRenderer key={t.id} tool={t} />
      ))}
    </div>
  );
});

Toolbar.displayName = "Toolbar";

export const ToolRenderer: React.FC<{ tool: Tool }> = memo(({ tool }) => {
  switch (tool.type) {
    case "toggle":
      return <ToolButton tool={tool} />;
    case "toggle-group":
      return <ToolToggleGroup tool={tool} />;
    case "dropdown":
      return <ToolDropDown tool={tool} />;
    case "value":
      return <ToolColorPicker tool={tool} />;
    case "custom":
      return tool.render();
    default:
      return null;
  }
});

ToolRenderer.displayName = "ToolRenderer";

export default Toolbar;
