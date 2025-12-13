import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { UserProfile } from "@/client/features/profile/user-profile";
import { getUserProfile } from "../actions";

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;
  const session = await auth();

  const userProfile = await getUserProfile(id);

  if (!userProfile) {
    notFound();
  }

  const isOwnProfile = session?.user?.id === id;

  return (
    <div className="container m-auto max-w-6xl py-8">
      <UserProfile
        user={userProfile}
        isOwnProfile={isOwnProfile}
        currentUserId={session?.user?.id}
      />
    </div>
  );
}
