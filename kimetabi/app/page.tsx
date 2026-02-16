import { auth, signOut } from "@/auth"
import SignIn from "@/components/sign-in";
import Image from "next/image";

export default async function Home() {
  const session = await auth()

  if (!session) return <SignIn />
  return (
    <div>
      <p>こんにちは、{session.user?.name}さん</p>
      <Image
        src={session.user?.image ?? ""}
        alt="ユーザーアイコン"
        width={100}
        height={100}
      />
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

    </div>
  );
}
