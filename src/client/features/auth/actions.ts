"use server";

import { signIn } from "@/lib/auth";

export async function signInWithEmail(formData: FormData) {
  await signIn("nodemailer", {
    email: formData.get("email"),
    redirectTo: "/",
  });
}

export async function signInWithGithub() {
  await signIn("github", { redirectTo: "/" });
}

export async function signInWithGoogle() {
  await signIn("google", { redirectTo: "/" });
}
