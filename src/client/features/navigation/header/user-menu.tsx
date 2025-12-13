"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/client/shared/ui/avatar";
import { Button } from "@/client/shared/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/client/shared/ui/popover";

interface UserMenuProps {
  user: {
    id?: string | null;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function UserMenu({ user }: UserMenuProps) {
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user.email?.[0].toUpperCase() || "U";

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="h-auto p-0 rounded-full hover:bg-transparent focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Avatar className="size-8 hover:opacity-80 transition-opacity cursor-pointer">
            <AvatarImage src={user.image || undefined} alt={user.name || ""} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="end" sideOffset={8}>
        <div className="p-4">
          <div className="flex items-center gap-3 pb-3 border-b">
            <Avatar className="size-10">
              <AvatarImage
                src={user.image || undefined}
                alt={user.name || ""}
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          </div>
          <div className="pt-3 space-y-1">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href={`/profile/${user.id}`}>Profile</Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/post/new">Write a Post</Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
