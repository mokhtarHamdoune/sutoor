import { useContext } from "react";
import { ToolbarUIContext } from "../contexts/toolbar-ui-context";

export const useToolbarUI = () => {
  const context = useContext(ToolbarUIContext);
  if (!context) {
    throw new Error("useToolbarUI must be used within a ToolbarUIProvider");
  }
  return context;
};
