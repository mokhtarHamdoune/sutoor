import { ReactNode } from "react";

interface PostContentProps {
  children: ReactNode;
}

export function PostContent({ children }: PostContentProps) {
  return (
    <article className="prose prose-slate prose-lg max-w-none">
      {/* 
        Prose classes from Tailwind Typography plugin provide:
        - Proper typography spacing
        - Responsive font sizes
        - List styling
        - Code block styling
        - Table styling
        - etc.
      */}
      {children}
    </article>
  );
}
