import { prisma } from "@/db";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import Nodemailer from "next-auth/providers/nodemailer";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { nodemailerConfig } from "./email-provider";
import type { Adapter } from "next-auth/adapters";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    Github,
    Nodemailer({
      server: nodemailerConfig.server,
      from: nodemailerConfig.from,
    }),
  ],
  adapter: PrismaAdapter(prisma as never) as Adapter,
});
