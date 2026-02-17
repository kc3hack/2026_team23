import { auth, signOut } from "@/auth"
import SignIn from "@/components/sign-in";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth()

  if (!session) return (
    redirect('/login')
  )
  return (
    <div>
      <p>こんにちは、{session.user?.name}さん</p>

      <form
        action={async () => {
          "use server"
          await signOut()
        }}
      >
        <button type="submit" style={{ marginTop: '20px', padding: '8px 16px' }}>
          ログアウト
        </button>
      </form>
      <Button>
        Hello
      </Button>

    </div>
  );
}
