import { ContentEditable } from "@lexical/react/LexicalContentEditable";
type Props = {
  className?: string;
  placeholder: string;
};

export default function LexicalContentEditable({
  className,
  placeholder,
}: Props) {
  return (
    <ContentEditable
      className={
        className ??
        "p-10 py-4 h-full min-h-full  outline-none focus:outline-none focus:ring-1 focus:ring-ring focus:ring-offset-1 rounded-md"
      }
      aria-placeholder={placeholder}
      placeholder={
        <div className="text-gray-300 absolute top-4 left-10 pointer-events-none">
          {placeholder}
        </div>
      }
    />
  );
}
