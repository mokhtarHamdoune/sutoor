import SelectionTracker from "./selection-tracker";
const FloatingToolbar = ({ children }: { children: React.ReactNode }) => {
  return <SelectionTracker>{children}</SelectionTracker>;
};

export default FloatingToolbar;
