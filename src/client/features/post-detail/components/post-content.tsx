import { ReactNode } from "react";

interface PostContentProps {
  children: ReactNode;
}

export function PostContent({ children }: PostContentProps) {
  return (
    <article className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-900 prose-code:text-slate-900 prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-slate-900 prose-img:rounded-lg prose-img:shadow-md">
      {children}
    </article>
  );
}
