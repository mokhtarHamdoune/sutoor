import Image from "next/image";
import BabiesStufImg from "@/client/assets/images/babies-stuff.jpg";
import { Avatar, AvatarFallback, AvatarImage } from "@/client/shared/ui/avatar";
import { Bookmark, Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/client/shared/ui/badge";
import Link from "next/link";
import { daysTillNow } from "../shared/lib/utils";

type MostRecentPostProps = {
  id: string;
  slug: string;
  imageUrl: string;
  title: string;
  summary: string;
  authorName?: string;
  authorImage?: string;
  publishedAt?: Date;
  category?: string;
};

const MostRecentPost = ({
  imageUrl,
  title,
  summary,
  authorName = "Shadcn",
  authorImage = "https://github.com/shadcn.png",
  publishedAt = new Date(),
  category = "Featured",
  slug,
}: MostRecentPostProps) => {
  return (
    <article className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
      {/* Background Image with Overlay */}
      <div className="relative h-[500px] w-full">
        <Image
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          src={imageUrl || BabiesStufImg}
          alt={title}
          fill
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-between p-8">
        {/* Top Section - Category Badge */}
        <div className="flex justify-between items-start">
          <Badge className="bg-white/90 text-gray-900 hover:bg-white backdrop-blur-sm px-4 py-1.5 text-sm font-medium">
            {category}
          </Badge>
          <button
            className="p-2 rounded-full bg-white/90 hover:bg-white backdrop-blur-sm transition-colors"
            aria-label="Bookmark post"
          >
            <Bookmark className="w-5 h-5 text-gray-700" strokeWidth={2} />
          </button>
        </div>

        {/* Bottom Section - Main Content */}
        <div className="space-y-6">
          {/* Title and Summary */}
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight line-clamp-2">
              {title}
            </h1>
            <p className="text-lg text-gray-200 line-clamp-2 max-w-3xl">
              {summary}
            </p>
          </div>

          {/* Author Info and Read More */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Author */}
              <div className="flex items-center gap-3">
                <Avatar className="size-12 ring-2 ring-white/20">
                  <AvatarImage src={authorImage} alt={authorName} />
                  <AvatarFallback className="bg-white text-gray-900">
                    {authorName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    {authorName}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-gray-300">
                    <Clock className="w-3 h-3" />
                    <span>{daysTillNow(publishedAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Read More Button */}
            <Link href={`/posts/${slug}`}>
              <button className="group/btn flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-full font-medium hover:bg-gray-100 transition-all cursor-pointer">
                <span>Read More</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default MostRecentPost;
