import { UserProfileData } from "@/app/profile/actions";
import { Card, CardContent } from "@/client/shared/ui/card";
import { formatDate } from "@/client/shared/lib/utils";

interface AboutTabProps {
  user: UserProfileData;
  publishedPostsCount: number;
}

export function AboutTab({ user, publishedPostsCount }: AboutTabProps) {
  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Bio</h3>
          <p className="text-muted-foreground">
            {user.bio || "No bio provided."}
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Member Since</h3>
          <p className="text-muted-foreground">{formatDate(user.createdAt)}</p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Stats</h3>
          <div className="space-y-1 text-muted-foreground">
            <p>Total posts: {user.totalPosts}</p>
            <p>Published posts: {publishedPostsCount}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
