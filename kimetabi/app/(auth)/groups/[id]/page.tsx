import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth"; // auth.jsのパス
import prisma from "@/lib/prisma"; // prismaのパス

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GroupOptionMenu } from "@/components/group/GroupOptionsMenu";
import { BackpreviousButton } from "@/components/backprevious-button";
import { GroupMembersCard } from "@/components/groupcard";
import CreateProjectByGroupButton from "@/components/group/createProjects/CreateProjects_byGroup-button";


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
        <BackpreviousButton href="/groups" />
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold tracking-tight">{group.name}</h1>
          { }
          <GroupOptionMenu groupId={groupId} />
        </div>
      </div>
      {/*12カラムのグリッドコンテナでデザインしてみましょうか...やったことないけど。*/}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <CreateProjectByGroupButton groupId={groupId} />
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
          <GroupMembersCard members={group.members} />
        </div>
      </div>
    </div>
  )
}
