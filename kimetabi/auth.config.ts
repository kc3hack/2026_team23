// auth.config.ts
import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

export const authConfig: NextAuthConfig = {
  providers: [Google], // googleの認証プロバイダ
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      // token.sub(Googleからの一意ID)
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
};
