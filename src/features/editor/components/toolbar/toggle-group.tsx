import { ToggleGroupTools } from "../../interfaces/tool";
import { ToggleGroup, ToggleGroupItem } from "@/shared/ui/toggle-group";
const ToolToggleGroup = ({ tool }: { tool: ToggleGroupTools }) => {
  return (
    <ToggleGroup
      variant={"outline"}
      type="multiple"
      value={tool.tools.filter((tl) => tl.isActive).map((tl) => tl.id)}
    >
      {tool.tools.map((tl) => {
        return (
          <ToggleGroupItem value={tl.id} key={tl.id} onClick={tl.execute}>
            {tl.icon}
          </ToggleGroupItem>
        );
      })}
    </ToggleGroup>
  );
};

export default ToolToggleGroup;
