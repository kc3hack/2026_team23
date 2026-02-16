import NextAuth from "next-auth";
import Google from "next-auth/providers/google";


export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google], //googleの認証プロバイダを追加していく
})
