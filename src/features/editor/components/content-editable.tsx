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
      className={className ?? "border border-black h-96"}
      aria-placeholder={placeholder}
      placeholder={<div>{placeholder}</div>}
    />
  );
}
