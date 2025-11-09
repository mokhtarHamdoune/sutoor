import Editor from "@/client/features/editor";
import { Button } from "@/client/shared/ui/button";
import { postService } from "@/lib/services";
import { Edit } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await postService.getBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <div className="w-full flex justify-end">
        <Link href={`/post/${slug}/edit`}>
          <Button variant="outline" className="mb-4">
            <Edit />
            Edit
          </Button>
        </Link>
      </div>
      <h1 className="text-3xl mb-4">{post.title}</h1>

      {/* Later: Replace with HTML rendering */}
      <Editor editable={false} initContent={String(post.content)} />
    </>
  );
}

export default PostPage;
