import SelectionTracker from "./selection-tracker";
const FloatingToolbar = () => {
  return (
    <SelectionTracker allowTracking={true}>
      <div className="bg-white p-2 rounded shadow">Toolbar</div>
    </SelectionTracker>
  );
};

export default FloatingToolbar;
