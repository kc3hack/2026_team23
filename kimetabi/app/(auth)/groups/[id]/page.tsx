import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth"; // auth.jsのパス
import prisma from "@/lib/prisma"; // prismaのパス
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react"; // アイコン用（lucide-reactはshadcnに同梱されています）
import { Session } from "inspector";

type GroupDetailPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function groupdetailPage(props: GroupDetailPageProps) {

  const { id } = await props.params
  const seesion = await auth()

  //静的解析でエラーでるからしゃあなしエラーハンドリング書いてる
  if (!seesion?.user?.id) {
    redirect("/login")
  }

  const userId = seesion.user.id
  const groupId = id

  //prismaでデータを取り出す
  const group = await prisma.group.findUnique({
    where: {
      id: groupId
    },
    include: {
      members: {
        include: {
          user: true
        },
        orderBy: {
          role: 'asc'
        }
      }
    }
  })
  if (!group) {
    notFound()
  }

  const isMember = group.members.some((member) => member.userId === userId)
  if (!isMember) {
    redirect("/groups")
  }


  return (
    <>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" asChild className="-ml-4">
          <Link href="/groups">← 戻る</Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{group.name}</h1>
      </div>
    </>
  )
}
