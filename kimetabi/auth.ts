import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import { prisma } from "@/lib/prisma"
import Google from "next-auth/providers/google";


export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google], //googleの認証プロバイダを追加していく
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    session({ session, token }) {
      //token.sub(Googleからの一意ID
      if (session.user && token.sub) {
        session.user.id = token.sub
      }
      return session
    }
  }
})
