import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
} from "@/client/shared/ui/card";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import ferrari_img from "@/client/assets/images/ferrari-f40.jpg";
import { Avatar } from "@/client/shared/ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Bookmark } from "lucide-react";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    coverImage: string | null;
    publishedAt: Date | null;
    createdAt: Date;
  };
  author?: {
    name: string | null;
    image: string | null;
  };
}

export function PostCard({ post, author }: PostCardProps) {
  const displayDate = post.publishedAt || post.createdAt;
  const timeAgo = formatDistanceToNow(new Date(displayDate), {
    addSuffix: true,
  });

  return (
    <Card className="rounded-xl p-3 shadow-none hover:shadow-lg transition-shadow gap-2">
      <Link href={`/post/${post.slug}`}>
        <CardHeader className="p-0">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-muted">
            <Image
              className="object-cover"
              src={post.coverImage || ferrari_img}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </CardHeader>
      </Link>
      <CardContent className="p-0 flex flex-col gap-2">
        <Link href={`/post/${post.slug}`}>
          <CardTitle className="text-lg line-clamp-2 hover:text-primary transition-colors">
            {post.title}
          </CardTitle>
        </Link>
      </CardContent>
      {author && (
        <CardFooter className="border border-slate-200 p-2 rounded-xl">
          <div className="flex items-center gap-2 flex-1">
            <Avatar>
              <AvatarImage
                src={author.image || undefined}
                alt={author.name || "Author"}
              />
              <AvatarFallback>
                {author.name?.[0]?.toUpperCase() || "A"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-sm font-medium">
                {author.name || "Anonymous"}
              </h3>
              <p className="text-xs text-gray-500">{timeAgo}</p>
            </div>
          </div>
          <Bookmark
            className="text-gray-300 text-lg hover:text-gray-400 cursor-pointer"
            strokeWidth={1.75}
          />
        </CardFooter>
      )}
    </Card>
  );
}

export default PostCard;
