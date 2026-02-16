import { auth } from "@/auth"
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


    </div>
  );
}
