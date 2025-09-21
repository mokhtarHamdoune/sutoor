import { createContext, useCallback, useMemo, useState } from "react";

// Keep it simple: enumerate currently present tools here
type ToolOpenState = {
  "color-picker": boolean;
};

export const ToolbarUIContext = createContext<{
  // Query whether a tool is open by its id
  isOpen: (toolId: keyof ToolOpenState) => boolean;
  // Set a tool's open state
  setOpen: (toolId: keyof ToolOpenState, open: boolean) => void;
  // Toggle a tool
  toggle: (toolId: keyof ToolOpenState) => void;
  // Close all tools
  closeAll: () => void;
  // Whether any tool is currently open
  anyOpen: boolean;
} | null>(null);

export const ToolbarUIProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [openMap, setOpenMap] = useState<ToolOpenState>({
    "color-picker": false,
  });

  const isOpen = useCallback(
    (toolId: keyof ToolOpenState) => {
      return !!openMap[toolId];
    },
    [openMap]
  );

  const setOpen = useCallback((toolId: keyof ToolOpenState, open: boolean) => {
    setOpenMap((prev) => ({ ...prev, [toolId]: open }));
  }, []);

  const toggle = useCallback((toolId: keyof ToolOpenState) => {
    setOpenMap((prev) => ({ ...prev, [toolId]: !prev[toolId] }));
  }, []);

  const closeAll = useCallback(
    () =>
      setOpenMap((prev) => {
        const newState = { ...prev };
        Object.keys(newState).forEach((key) => {
          if (typeof newState[key as keyof ToolOpenState] === "boolean") {
            newState[key as keyof ToolOpenState] = false;
          }
        });
        return newState;
      }),
    []
  );

  const anyOpen = useMemo(
    () => Object.values(openMap).some(Boolean),
    [openMap]
  );

  const value = useMemo(
    () => ({ isOpen, setOpen, toggle, closeAll, anyOpen }),
    [isOpen, setOpen, toggle, closeAll, anyOpen]
  );

  return (
    <ToolbarUIContext.Provider value={value}>
      {children}
    </ToolbarUIContext.Provider>
  );
};
