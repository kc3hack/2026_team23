import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import { prisma } from "@/lib/prisma"
import { authConfig } from "./auth.config";
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  // スプレッド構文 (...) を使わず、プロパティを明示的に指定する
  providers: authConfig.providers,
  session: authConfig.session,
  callbacks: authConfig.callbacks,
});
