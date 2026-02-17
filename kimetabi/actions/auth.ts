"use server"

import { signOut } from "@/auth"

export async function logOut() {
  //ログアウトしてログイン画面にリダイレクトする
  await signOut({ redirectTo: "/login" })
}
