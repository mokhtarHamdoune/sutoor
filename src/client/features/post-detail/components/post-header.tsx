import { Avatar, AvatarFallback, AvatarImage } from "@/client/shared/ui/avatar";
import { Badge } from "@/client/shared/ui/badge";
import { Button } from "@/client/shared/ui/button";
import { Calendar, Edit } from "lucide-react";
import Link from "next/link";

interface PostHeaderProps {
  title: string;
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
  publishedAt: Date | null;
  categories: { id: string; label: string; slug: string }[];
  slug: string;
  isAuthor?: boolean;
}

export function PostHeader({
  title,
  author,
  publishedAt,
  categories,
  slug,
  isAuthor = false,
}: PostHeaderProps) {
  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Draft";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };

  return (
    <header className="space-y-6">
      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold leading-tight text-slate-900">
        {title}
      </h1>

      {/* Metadata row */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          {/* Author info */}
          <Link
            href={`/profile/${author.id}`}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={author.image || undefined}
                alt={author.name || "User"}
              />
              <AvatarFallback>{getInitials(author.name)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-slate-900">
                {author.name || "Anonymous"}
              </span>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(publishedAt)}
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Edit button for author */}
        {isAuthor && (
          <Link href={`/posts/${slug}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4" />
              Edit Post
            </Button>
          </Link>
        )}
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {categories.map((category) => (
            <Badge key={category.id} variant="secondary">
              {category.label}
            </Badge>
          ))}
        </div>
      )}

      {/* Divider */}
      <div className="border-b border-slate-200" />
    </header>
  );
}
