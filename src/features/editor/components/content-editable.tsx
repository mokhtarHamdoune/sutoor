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
      className={className ?? "px-10 py-4 h-full"}
      aria-placeholder={placeholder}
      placeholder={<div>{placeholder}</div>}
    />
  );
}
