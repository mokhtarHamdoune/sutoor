"use server";

import { signIn } from "@/lib/auth";

export async function signInWithEmail(formData: FormData) {
  await signIn("nodemailer", {
    email: formData.get("email"),
  });
}

export async function signInWithGithub() {
  await signIn("github");
}

export async function signInWithGoogle() {
  await signIn("google");
}
