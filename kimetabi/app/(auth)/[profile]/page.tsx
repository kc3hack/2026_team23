import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth"; // auth.jsのパス
import prisma from "@/lib/prisma"; // prismaのパス
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ProfilePageProps = {
  params: Promise<{
    profile: string
  }>
}



export default async function ProfilePage(props: ProfilePageProps) {

  const { profile } = await props.params
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }

  const userInformation = await prisma.user.findUnique({
    where: {
      id: profile
    }

  })
  if (!userInformation) {
    notFound()
  }
  /*まつばやしTODO
   * 1. userInformationから名前とメアド、プロフィール写真を取得してカードコンポーネントを作成してからこのファイルに置く。
   * 2. アカウント削除ボタンを作成する。=> serverActionで削除するプログラムも必要だよね。
   * 3. 戻るボタン(components/backprevious-buttonを使用しよう)を配置
   * */

  return (
    <div>


    </div>
  )
}

