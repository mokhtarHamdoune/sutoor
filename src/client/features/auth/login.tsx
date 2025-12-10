"use client";

import Link from "next/link";
import { Button } from "@/client/shared/ui/button";
import { Input } from "@/client/shared/ui/input";
import { Label } from "@/client/shared/ui/label";
import { Quote, Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { signInWithEmail, signInWithGithub, signInWithGoogle } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Sending magic link...
        </>
      ) : (
        "Send magic link"
      )}
    </Button>
  );
}

export default function LoginForm() {
  return (
    <div className="flex h-screen w-full">
      {/* Left Side - Visual & Messaging */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-primary/10 via-primary/5 to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 mask-[radial-gradient(white,transparent_85%)]" />
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 max-w-2xl">
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl xl:text-5xl font-bold tracking-tight mb-4">
                Welcome back,
                <br />
                <span className="text-primary">writer</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Continue your journey of sharing ideas and stories that matter.
              </p>
            </div>

            <div className="space-y-6">
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <Quote className="h-8 w-8 text-primary/40 mb-4" />
                <blockquote className="space-y-2">
                  <p className="text-lg italic">
                    &quot;The scariest moment is always just before you start.
                    After that, things can only get better.&quot;
                  </p>
                  <footer className="text-sm text-muted-foreground">
                    — Stephen King
                  </footer>
                </blockquote>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="rounded-lg border bg-card p-4">
                  <div className="text-3xl font-bold text-primary">∞</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Stories to tell
                  </div>
                </div>
                <div className="rounded-lg border bg-card p-4">
                  <div className="text-3xl font-bold text-primary">✍️</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Your voice matters
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Sign in to Sutoor
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Pick up where you left off
            </p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => signInWithGithub()}
              >
                <svg
                  role="img"
                  className="mr-2 h-4 w-4"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>GitHub</title>
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                GitHub
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => signInWithGoogle()}
              >
                <svg
                  className="mr-2 h-4 w-4"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fab"
                  data-icon="google"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 488 512"
                >
                  <path
                    fill="currentColor"
                    d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                  ></path>
                </svg>
                Google
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>

            <form action={signInWithEmail} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <SubmitButton />
            </form>

            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/register"
                className="font-semibold text-primary hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
