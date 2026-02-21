import { redirect } from "next/navigation"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BackpreviousButton } from "@/components/backprevious-button"
import CreateGroupButton from "@/components/group/CreateGroupButton"

export default async function groupPage() {
  const session = await auth()

  //これでユーザーIDとれない時もリダイレクトする
  if (!session?.user?.id) {
    redirect("/login")
  }
  const userId = session.user.id;
  const userGroups = await prisma.groupMember.findMany({
    where: {
      userId: userId,
    },
    include: {
      group: true,
    },
    orderBy: {
      createdAt: 'desc',
    }
  })

  return (
    <div>
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <BackpreviousButton href="/" />
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">マイグループ</h1>

          <CreateGroupButton />
        </div>

        {userGroups.length === 0 ? (
          <div className="text-center py-20 border rounded-lg bg-muted/20">
            <p className="text-muted-foreground">現在所属しているグループはありません。</p>
            <p className="text-sm text-muted-foreground mt-1">新しく作成するか、招待を受け取りましょう！</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userGroups.map((gm) => (
              <Card key={gm.id} className="hover:shadow-md transition-shadow">
                <Link href={`/groups/${gm.groupId}`}>
                  <CardHeader>
                    <CardTitle>{gm.group.name}</CardTitle>
                    <CardDescription>
                      あなたの役割: {gm.role === "ADMIN" ? "管理者" : "メンバー"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* 説明文がない場合のフォールバックも用意しておくとUIが崩れません */}
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {gm.group.description || "グループの説明はありません"}
                    </p>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
