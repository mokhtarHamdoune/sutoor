import { Button } from "@/client/shared/ui/button";
import { postService } from "@/lib/services";
import Link from "next/link";
import PostCard from "@/client/components/post-card";

export default async function Home() {
  const posts = await postService.getBy({});

  return (
    <main className="w-9/12 m-auto">
      <div className="flex ">
        <Link href="/post/new">
          <Button>Create New Post</Button>
        </Link>
      </div>
      <div>
        <ul className="grid grid-cols-4 gap-4 mt-4">
          {posts.map((post) => (
            <li key={post.id} className="hover:text-blue-300">
              <Link href={`/post/${post.slug}`}>
                <PostCard
                  title={post.title}
                  content={
                    "This is just content to fill the body of the card it usually does not take much."
                  }
                  imageUrl=""
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
