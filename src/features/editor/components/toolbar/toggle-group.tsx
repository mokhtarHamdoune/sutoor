import { LexicalEditor } from "lexical";
import { ToggleGroupTools } from "../../interfaces/tool";
import { ToggleGroup, ToggleGroupItem } from "@/shared/ui/toggle-group";
const ToolToggleGroup = ({
  tool,
  editor,
}: {
  tool: ToggleGroupTools;
  editor: LexicalEditor;
}) => {
  return (
    <ToggleGroup variant={"outline"} type="multiple">
      {tool.tools.map((tl) => (
        <ToggleGroupItem
          value={tl.id}
          key={tl.id}
          onClick={() => tl.execute(editor)}
        >
          {tl.icon}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};

export default ToolToggleGroup;
