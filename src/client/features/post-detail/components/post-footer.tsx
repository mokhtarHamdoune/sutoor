import { Avatar, AvatarFallback, AvatarImage } from "@/client/shared/ui/avatar";
import { Card, CardContent } from "@/client/shared/ui/card";
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
  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <footer className="mt-12 pt-8 border-t border-slate-200">
      <Card className="bg-slate-50 border-slate-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <Link href={`/profile/${author.id}`}>
              <Avatar className="h-16 w-16 hover:opacity-80 transition-opacity">
                <AvatarImage
                  src={author.image || undefined}
                  alt={author.name || "User"}
                />
                <AvatarFallback className="text-lg">
                  {getInitials(author.name)}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-slate-600">Written by</span>
                <Link
                  href={`/profile/${author.id}`}
                  className="font-semibold text-slate-900 hover:text-slate-700 transition-colors"
                >
                  {author.name || "Anonymous"}
                </Link>
              </div>
              {author.bio ? (
                <p className="text-slate-700 leading-relaxed">{author.bio}</p>
              ) : (
                <p className="text-slate-500 italic">No bio available</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </footer>
  );
}
