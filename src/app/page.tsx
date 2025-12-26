import { postService } from "@/lib/services";
import Link from "next/link";
import PostCard from "@/client/components/post-card";
import MostRecentPost from "@/client/components/most-recent-post";

export default async function Home() {
  const posts = await postService.getBy({});

  return (
    <main className="w-11/12 max-w-7xl m-auto p-8">
      {posts.length > 0 && (
        <MostRecentPost
          id={posts[0].id}
          slug={posts[0].slug}
          title={posts[0].title}
          summary="This is summary of the latest blog we need somehow to generate summary of the blog"
          imageUrl={posts[0].coverImage || ""}
          authorName={posts[0].author.name || "Unknown Author"}
          authorImage={posts[0].author.image || undefined}
          publishedAt={posts[0].publishedAt || undefined}
        />
      )}
      <ul className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {posts.slice(1).map((post) => (
          <li key={post.id} className="hover:text-blue-300">
            <Link href={`/posts/${post.slug}`}>
              <PostCard post={post} />
            </Link>{" "}
          </li>
        ))}
      </ul>
    </main>
  );
}
