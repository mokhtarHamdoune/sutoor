import { Avatar, AvatarFallback, AvatarImage } from "@/client/shared/ui/avatar";
import { Badge } from "@/client/shared/ui/badge";
import { Button } from "@/client/shared/ui/button";
import { Calendar, Edit } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getInitials, formatDate } from "@/client/shared/lib/utils";

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
  coverImage: string | null;
  isAuthor?: boolean;
}

export function PostHeader({
  title,
  author,
  publishedAt,
  categories,
  slug,
  coverImage,
  isAuthor = false,
}: PostHeaderProps) {
  return (
    <header className="-mx-6 -mt-6 md:-mx-10 md:-mt-10 lg:-mx-12 lg:-mt-12 mb-8">
      {/* Hero Section with Cover Image */}
      <div className="relative w-full aspect-21/9 md:aspect-21/8 lg:aspect-21/7 overflow-hidden bg-linear-to-br from-slate-800 via-slate-700 to-slate-900">
        {/* Cover Image */}
        {coverImage && (
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover"
            priority
          />
        )}

        {/* Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />

        {/* Edit Button - Top Right */}
        {isAuthor && (
          <div className="absolute top-4 right-4 md:top-6 md:right-6 z-10">
            <Link href={`/posts/${slug}/edit`}>
              <Button
                variant="secondary"
                size="sm"
                className="backdrop-blur-sm bg-white/90 hover:bg-white cursor-pointer"
              >
                <Edit className="h-4 w-4" />
                Edit Post
              </Button>
            </Link>
          </div>
        )}

        {/* Content Overlay - Bottom */}
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 lg:p-10">
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-white drop-shadow-lg">
              {title}
            </h1>

            {/* Author Info Card - Bottom Left */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <Link
                href={`/profile/${author.id}`}
                className="flex items-center gap-3 hover:opacity-90 transition-opacity group"
              >
                <Avatar className="h-10 w-10 md:h-12 md:w-12 ring-2 ring-white/30">
                  <AvatarImage
                    src={author.image || undefined}
                    alt={author.name || "User"}
                  />
                  <AvatarFallback className="bg-white/20 text-white">
                    {getInitials(author.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-semibold text-white drop-shadow-md">
                    {author.name || "Anonymous"}
                  </span>
                  <div className="flex items-center gap-1.5 text-sm text-white/90">
                    <Calendar className="h-3.5 w-3.5" />
                    <span className="drop-shadow">
                      {formatDate(publishedAt)}
                    </span>
                  </div>
                </div>
              </Link>

              {/* Categories */}
              {categories.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  {categories.map((category) => (
                    <Badge
                      key={category.id}
                      variant="secondary"
                      className="backdrop-blur-sm bg-white/20 text-white border-white/30 hover:bg-white/30"
                    >
                      {category.label}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
