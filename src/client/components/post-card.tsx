import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
} from "@/client/shared/ui/card";
import Image from "next/image";
import ferrari_img from "@/client/assets/images/ferrari-f40.jpg";
import { Avatar } from "@/client/shared/ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Bookmark } from "lucide-react";

function PostCard({
  title,
  content,
  imageUrl,
}: {
  title: string;
  content: string;
  imageUrl: string;
}) {
  return (
    <Card className="rounded-xl p-3 shadow-none hover:shadow-lg transition-shadow gap-2">
      <CardHeader className="p-0">
        <Image
          className="rounded-xl"
          src={imageUrl || ferrari_img}
          alt={title}
        />
      </CardHeader>
      <CardContent className="p-0 flex flex-col gap-2">
        <CardTitle className="text-lg truncate">{title}</CardTitle>
        <p className="text-sm text-gray-600 mt-1">{content}</p>
      </CardContent>
      <CardFooter className="border border-slate-200 p-2 rounded-xl">
        <div className="flex items-center gap-2 flex-1">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-sm font-medium">Shadcn</h3>
            <p className="text-xs text-gray-500">2 hours ago</p>
          </div>
        </div>
        <Bookmark
          className="text-gray-300 text-lg hover:text-gray-400"
          strokeWidth={1.75}
        />
      </CardFooter>
    </Card>
  );
}
export default PostCard;
