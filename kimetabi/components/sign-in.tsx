// components/sign-in.tsx
import { handleGoogleSignIn } from "@/actions/google-auth.ts"; // 「一つ上の階層のlib」を指す

export default function SignIn() {
  return (
    <form action={handleGoogleSignIn}>  
      <button 
        className="relative w-full bg-white text-[#5f6368] hover:bg-gray-100 hover:text-black font-bold py-6 px-12 rounded-full shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-4 group"
        type="submit"
      >
        <img 
          src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/google/google-original.svg" 
          alt="Google logo" 
          className="w-6 h-6 transition-transform group-hover:rotate-12"
        />
        <span className="text-base">Googleでログイン</span>
      </button>
    </form>
  )
}