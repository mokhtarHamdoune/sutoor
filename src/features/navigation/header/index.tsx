"use client";

import * as React from "react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/shared/ui/navigation-menu";

export function Header() {
  return (
    <div className="flex items-center w-full">
      <div className="flex-1/6 text-center">
        <span className="font-bold">Sutoor</span>
      </div>
      <div className="flex-4/6 text-center flex justify-center">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                href={"/"}
              >
                Home
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Catalogue</NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink>Development and IT</NavigationMenuLink>
                <NavigationMenuLink>Stories</NavigationMenuLink>
                <NavigationMenuLink>Minds</NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem className="cursor-pointer">
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                href="/editor"
              >
                Start Writing
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="flex-1/6 text-center">
        <span>Login</span>
      </div>
    </div>
  );
}
