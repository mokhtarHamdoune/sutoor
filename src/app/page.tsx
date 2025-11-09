import { Button } from "@/client/shared/ui/button";
import { postService } from "@/lib/services";
import Link from "next/link";

export default async function Home() {
  const posts = await postService.getBy({});

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="w-9/12">
        <div className="flex ">
          <Link href="/post/new">
            <Button>Create New Post</Button>
          </Link>
        </div>
        <ul>
          {posts.map((post) => (
            <li key={post.id} className="hover:text-blue-300">
              <Link href={`/post/${post.slug}`}>{post.title}</Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
