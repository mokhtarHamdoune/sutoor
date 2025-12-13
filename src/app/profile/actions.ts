"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import UserService from "@/lib/services/user-service";
import ProfileService, {
  type ProfileView,
} from "@/lib/services/profile-service";

const userService = new UserService();
const profileService = new ProfileService();

export type UserProfileData = ProfileView;

export async function getUserProfile(
  userId: string
): Promise<UserProfileData | null> {
  try {
    return await profileService.getProfileView(userId, {
      previewLimit: 12,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

export async function updateUserProfile(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const name = formData.get("name") as string;
  const bio = formData.get("bio") as string;

  try {
    await userService.updateUserProfile(session.user.id, {
      name: name || null,
      bio: bio || null,
    });

    revalidatePath(`/profile/${session.user.id}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, error: "Failed to update profile" };
  }
}
