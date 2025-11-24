import { Button } from "@/client/shared/ui/button";
import { postService } from "@/lib/services";
import Link from "next/link";
import PostCard from "@/client/components/post-card";
import MostRecentPost from "@/client/components/most-recent-post";

export default async function Home() {
  const posts = await postService.getBy({});

  return (
    <main className="w-11/12  max-w-7xl m-auto">
      <div className="flex ">
        <Link href="/post/new">
          <Button>Create New Post</Button>
        </Link>
      </div>
      <div>
        {posts.length > 0 && (
          <MostRecentPost
            id={posts[0].id}
            title={posts[0].title}
            summary="This is summary of the latest blog we need somehow to generate summary of the blog"
            imageUrl={posts[0].coverImage || ""}
          />
        )}
        <ul className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {posts.map((post) => (
            <li key={post.id} className="hover:text-blue-300">
              <Link href={`/post/${post.slug}`}>
                <PostCard
                  title={post.title}
                  content={
                    "This is just content to fill the body of the card it usually does not take much."
                  }
                  imageUrl={post.coverImage || ""}
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
