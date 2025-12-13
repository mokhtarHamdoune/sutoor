import Link from "next/link";
import { UserProfileData } from "@/app/profile/actions";
import { Button } from "@/client/shared/ui/button";
import { Card, CardContent } from "@/client/shared/ui/card";
import { PostCard } from "@/client/components/post-card";

interface PostsTabProps {
  posts: UserProfileData["postsPreview"];
  isOwnProfile: boolean;
}

export function PostsTab({ posts, isOwnProfile }: PostsTabProps) {
  if (posts.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            {isOwnProfile
              ? "You haven't published any posts yet."
              : "This user hasn't published any posts yet."}
          </p>
          {isOwnProfile && (
            <Button asChild className="mt-4">
              <Link href="/post/new">Write Your First Post</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
