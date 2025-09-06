import SelectionTracker from "./selection-tracker";
const FloatingToolbar = ({ children }: { children: React.ReactNode }) => {
  return <SelectionTracker allowTracking={true}>{children}</SelectionTracker>;
};

export default FloatingToolbar;
