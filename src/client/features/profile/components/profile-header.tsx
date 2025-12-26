"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserProfileData } from "@/app/profile/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/client/shared/ui/avatar";
import { Button } from "@/client/shared/ui/button";
import { Card, CardHeader } from "@/client/shared/ui/card";
import { Badge } from "@/client/shared/ui/badge";
import { EditProfileDialog } from "./edit-profile-dialog";
import { daysTillNow, getInitials } from "@/client/shared/lib/utils";

interface ProfileHeaderProps {
  user: UserProfileData;
  isOwnProfile: boolean;
}

export function ProfileHeader({ user, isOwnProfile }: ProfileHeaderProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const router = useRouter();

  const handleEditSuccess = () => {
    setShowEditDialog(false);
    router.refresh();
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Avatar className="size-24 md:size-32">
              <AvatarImage
                src={user.image || undefined}
                alt={user.name || ""}
              />
              <AvatarFallback className="text-2xl">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-3">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <h1 className="text-3xl font-bold">
                    {user.name || "Anonymous User"}
                  </h1>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>

                {isOwnProfile && (
                  <Button onClick={() => setShowEditDialog(true)}>
                    Edit Profile
                  </Button>
                )}
              </div>

              {user.bio && (
                <p className="text-base text-foreground/90">{user.bio}</p>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span>Joined {daysTillNow(user.createdAt)}</span>
                <span>•</span>
                <span>
                  {user.totalPosts} {user.totalPosts === 1 ? "post" : "posts"}
                </span>
                {user.role === "ADMIN" && (
                  <>
                    <span>•</span>
                    <Badge variant="secondary">Admin</Badge>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {isOwnProfile && (
        <EditProfileDialog
          user={user}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          onSuccess={handleEditSuccess}
        />
      )}
    </>
  );
}
