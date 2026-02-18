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
import { ArrowLeft, CirclePlus } from "lucide-react"; // アイコン用（lucide-reactはshadcnに同梱されています）

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
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="space-y-4 mb-5">
        <Button variant="ghost" asChild className="ml-1 text-muted-foreground">
          <Link href="/groups">
            <ArrowLeft className="mr-2 h-4 w-4" />
            グループ一覧へ戻る
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{group.name}</h1>
        </div>
      </div>
      {/*12カラムのグリッドコンテナでデザインしてみましょうか...やったことないけど。*/}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <Button className="w-full">
            <CirclePlus className="mr-2 h-4 w-4" /> メンバーを招待する
          </Button>
          <Card>
            <CardHeader>
              <CardTitle>概要</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm">
                {group.description || "グループの説明はありません"}
              </p>
              <div className="pt-4 border-t text-sm space-y-2 flex justify-between">
                <span className="text-muted-foreground">作成日</span>
                <span className="font-medium">
                  {new Date(group.createdAt).toLocaleDateString('ja-JP')}
                </span>
              </div>
              <div className="flex justify-between" >
                <span className="text-muted-foreground">メンバー数</span>
                <span className="font-medium">
                  {group.members.length}名
                </span>
              </div>
            </CardContent>
          </Card>

        </div>


        {/*右側カラム: メンバー一覧
        スマホ:12列全て
PC: 8列分
のデザインでいく
        */}
        <div className="col-span-12 lg:col-span-8">
          <Card>
            <CardHeader>
              <CardTitle>メンバー</CardTitle>
              <CardDescription>このグループに所属しているメンバー</CardDescription>
            </CardHeader>

            <CardContent className="p-0">
              <ul className="divide-y">
                {group.members.map((gm) => (
                  <li key={gm.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={gm.user.image || ""} alt={gm.user.name || "User"} />
                        <AvatarFallback>
                          {gm.user.name ? gm.user.name.slice(0, 1).toUpperCase() : "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium leading-none">{gm.user.name || "名前未設定ユーザー"}</p>
                        <p className="text-sm text-muted-foreground mt-1">{gm.user.email} </p>
                      </div>
                    </div>
                    <div>
                      {gm.role === "ADMIN" ? (
                        <Badge variant="default">管理者</Badge>
                      ) : (
                        <Badge variant="secondary">メンバー</Badge>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
