"use server"

import { signIn } from "../auth"; // 階層に合わせて修正（@/auth でもいけるはずです）

export async function handleGoogleSignIn() {
   await signIn("google", { redirectTo: "/" });
}