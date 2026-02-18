import { signIn } from "@/auth"

export default function SignIn() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("google", { redirectTo: "/" }) // "google"を指定して呼び出し
      }}
    >
      <button type="submit">Googleでログイン</button>
    </form>
  )
}
