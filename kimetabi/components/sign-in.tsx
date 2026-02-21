// components/sign-in.tsx
"use client";
import { handleGoogleSignIn } from "@/actions/google-auth.ts"; // 「一つ上の階層のlib」を指す
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button"; // 既存のbuttonタグをshadcnのButtonに置き換えるため追加

export default function SignIn() {
  const { pending } = useFormStatus();

  return (
    <form action={handleGoogleSignIn}>  
      <Button 
        className="relative w-full bg-white text-[#5f6368] hover:bg-gray-100 hover:text-black font-bold py-6 px-12 rounded-full shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-4 group"
        type="submit"
        isLoading={pending}
      >
        <img 
          src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/google/google-original.svg" 
          alt="Google logo" 
          className="w-6 h-6 transition-transform group-hover:rotate-12"
        />
        <span className="text-base">{pending ? "処理中..." : "Googleでログイン"}</span>
      </Button>
    </form>
  )
}