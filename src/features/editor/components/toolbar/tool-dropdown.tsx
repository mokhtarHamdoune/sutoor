import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shared/ui/select";
import { DropdownTool } from "../../interfaces/tool";
export function ToolDropDown({ tool }: { tool: DropdownTool }) {
  // Component logic goes here
  return (
    <Select value={tool.value} onValueChange={(value) => tool.execute(value)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={tool.label} />
      </SelectTrigger>
      <SelectContent>
        {tool.items.map((item) => (
          <SelectItem
            key={item.value}
            value={item.value}
            onClick={() => tool.execute(item.value)}
          >
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default ToolDropDown;
