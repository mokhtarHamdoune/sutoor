import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { Textarea } from "@/shared/ui/textarea";
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
      className={className}
      aria-placeholder={placeholder}
      placeholder={<Textarea placeholder={placeholder} />}
    />
  );
}
