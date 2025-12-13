"use client";

import { UserProfileData } from "@/app/profile/actions";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/client/shared/ui/tabs";
import { ProfileHeader, PostsTab, AboutTab } from "./components";

interface UserProfileProps {
  user: UserProfileData;
  isOwnProfile: boolean;
  currentUserId?: string;
}

export function UserProfile({ user, isOwnProfile }: UserProfileProps) {
  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <ProfileHeader user={user} isOwnProfile={isOwnProfile} />

      {/* Content Tabs */}
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="posts">Posts ({user.totalPosts})</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-4 mt-6">
          <PostsTab posts={user.postsPreview} isOwnProfile={isOwnProfile} />
        </TabsContent>

        <TabsContent value="about" className="mt-6">
          <AboutTab
            user={user}
            publishedPostsCount={user.publishedPostsCount}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
