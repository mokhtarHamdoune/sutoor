import { getInitials } from "@/client/shared/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/client/shared/ui/avatar";
import Link from "next/link";

interface PostFooterProps {
  author: {
    id: string;
    name: string | null;
    image: string | null;
    bio: string | null;
  };
}

export function PostFooter({ author }: PostFooterProps) {
  return (
    <footer className="py-12 border-t border-slate-200">
      <div className="flex items-start gap-6">
        <Link href={`/profile/${author.id}`} className="shrink-0">
          <Avatar className="h-20 w-20 hover:ring-4 hover:ring-slate-200 transition-all">
            <AvatarImage
              src={author.image || undefined}
              alt={author.name || "User"}
            />
            <AvatarFallback className="text-xl bg-slate-100 text-slate-700">
              {getInitials(author.name)}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1 min-w-0">
          <div className="mb-3">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-1">
              Written by
            </p>
            <Link
              href={`/profile/${author.id}`}
              className="text-2xl font-bold text-slate-900 hover:text-slate-700 transition-colors"
            >
              {author.name || "Anonymous"}
            </Link>
          </div>
          {author.bio ? (
            <p className="text-slate-600 leading-relaxed text-lg">
              {author.bio}
            </p>
          ) : (
            <p className="text-slate-400 italic">No bio available</p>
          )}
        </div>
      </div>
    </footer>
  );
}
