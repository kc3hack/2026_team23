import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RemindButton } from "../project/RemindButton"
// ※ 次のステップで作るクライアントコンポーネントを想定してコメントアウトしておきます
// import { RemindButton } from "./RemindButton" 

export default async function HostedProjects() {
  // 1. ログインユーザーの取得
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return <div>ログインが必要です</div>
  }

  // 2. 自分が主催（MASTER）しているプロジェクトと、そのメンバー情報を取得
  const hostedProjects = await prisma.project.findMany({
    where: {
      members: {
        some: {
          userId: userId,
          role: "MASTER",
        },
      },
    },
    include: {
      members: {
        include: {
          user: true, // メンバーの名前やアイコンを表示するためにUserテーブルも結合
        },
        orderBy: {
          status: 'desc', // 未回答(PENDING)などが分かりやすいように適当にソート
        }
      },
    },
    orderBy: {
      departureDate: "asc", // 出発日が近い順に表示
    },
  })

  // 3. 主催している旅行がない場合の表示
  if (hostedProjects.length === 0) {
    return (
      <Card className="mt-8">
        <CardContent className="pt-6 text-center text-muted-foreground">
          現在主催している旅行はありません。新しい旅行を計画しましょう！
        </CardContent>
      </Card>
    )
  }

  // 4. データがある場合のリスト表示
  return (
    <div className="space-y-6 mt-8">
      <h2 className="text-2xl font-bold">主催している旅行の回答状況</h2>

      {hostedProjects.map((project) => (
        <Card key={project.id}>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>{project.title}</span>
              <span className="text-sm font-normal text-muted-foreground">
                出発日: {project.departureDate.toLocaleDateString("ja-JP")}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {project.members.map((member) => {
                // 自分自身は一覧で目立たせないか、除外してもOKです（今回は表示します）
                const isMe = member.userId === userId

                return (
                  <li key={member.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-md">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={member.user.image || undefined} />
                        <AvatarFallback>{member.user.name?.charAt(0) || "?"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.user.name || "名称未設定"}</p>
                        <p className="text-xs text-muted-foreground">
                          {isMe ? "主催者 (あなた)" : "参加者"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      {/* ステータスバッジの表示 */}
                      {member.status === "ACCEPTED" && <Badge className="bg-green-500">参加</Badge>}
                      {member.status === "DECLINED" && <Badge variant="destructive">不参加</Badge>}
                      {member.status === "PENDING" && <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">未回答</Badge>}

                      {/* 未回答かつ自分以外なら「つつく」ボタンを表示（次ステップで実装） */}
                      {member.status === "PENDING" && !isMe && (
                        // <RemindButton userId={member.userId} projectId={project.id} />
                        <RemindButton
                          targetUserId={member.userId}
                          targetUserName={member.user.name || "名称未設定"}
                          projectId={project.id} // ← これを追加！
                        />
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
