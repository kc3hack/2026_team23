
// app/(auth)/projects/[id]/page.tsx
import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import { updateParticipantStatus } from "@/actions/project"
import { Button } from "@/components/ui/button"
import IcsDownloadButton from "@/components/project/DownloadIcsFileButton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RemindButton } from "@/components/project/RemindButton"
import { DeleteProject } from "@/components/project/delete_project"

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  const userId = session?.user?.id


  if (!userId) return <div>ログインしてください</div>

  // プロジェクト情報と、参加メンバーの情報を取得
  const project = await prisma.project.findUnique({
    where: { id: id },
    include: {
      members: {
        include: { user: true } // ユーザー情報（名前など）も一緒に取得
      }
    }
  })

  if (!project) notFound()

  // 自分がこのプロジェクトのメンバーかどうか確認
  const myMembership = project.members.find(m => m.userId === userId)
  if (!myMembership) return <div>あなたはこの旅行に招待されていません。</div>

  const isMaster = myMembership.role === 'MASTER'
  const myStatus = myMembership.status

  // Server ActionsをFormから呼び出すためのラッパー
  const handleAccept = async () => {
    "use server"
    await updateParticipantStatus(project.id, userId, 'ACCEPTED')
  }

  const handleDecline = async () => {
    "use server"
    await updateParticipantStatus(project.id, userId, 'DECLINED')
  }

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <div className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
        <p className="text-gray-600 mb-4">{project.description}</p>
        <p className="font-semibold">
          日程: {project.departureDate.toLocaleDateString()} 〜 {project.endDate.toLocaleDateString()}
        </p>
        <div className="text-black py-2 font-semibold">
          予算の目安 : ￥{project.price}
        </div>
      </div>

      {isMaster ? (
        /* 主催者 (MASTER) の場合のビュー */
        <div className="relative">
          <div className="absolute right-3">
            <DeleteProject tripId={project.id} />
          </div>
          <h2 className="text-2xl font-bold mb-4">👑 参加状況ダッシュボード</h2>
          <div className="bg-white shadow rounded-lg p-4">
            <ul className="space-y-3">
              {project.members.map((member) => {

                const isMe = member.userId === userId
                return (
                  <li key={member.id} className="flex justify-between items-center border-b pb-2">
                    <div className="flex justify-center px-2">
                      <Avatar>
                        <AvatarImage src={member.user.image || undefined} />
                        <AvatarFallback>{member.user.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="ml-4 flex justify-center items-center text-sm">
                        {member.user.name || "名無しユーザー"}
                      </div>
                    </div>
                    <div>
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${member.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' :
                        member.status === 'DECLINED' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                        {member.status === 'ACCEPTED' ? '参加' :
                          member.status === 'DECLINED' ? '不参加' : '未回答 (PENDING)'}

                      </span>
                      {member.status === "PENDING" && !isMe && (
                        <RemindButton
                          targetUserId={member.userId}
                          targetUserName={member.user.name ?? ""}
                          projectId={project.id}
                        />)}
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      ) : (
        /* 招待された人 (PARTICIPANT) の場合のビュー */
        <div>
          <h2 className="text-2xl font-bold mb-4">✉️ 招待状</h2>
          <div>
            {/* 右側カラム: メンバー一覧 */}
            <div className="col-span-12 lg:col-span-8 mb-6">
              <h3 className="text-lg font-bold mb-3">参加予定メンバー</h3>

              {/* ここから直接 project.members を展開（ループ）する */}
              <ul className="bg-white shadow-sm border rounded-lg p-4 space-y-3">
                {project.members.map((member) => (
                  <li key={member.id} className="flex items-center gap-3 border-b last:border-0 pb-2 last:pb-0">

                    {/* アバター画像 */}
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.user.image || undefined} />
                      <AvatarFallback>{member.user.name?.charAt(0) || "?"}</AvatarFallback>
                    </Avatar>

                    {/* 名前とステータス */}
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">
                        {member.user.name || "名無しユーザー"}
                        {member.userId === userId && " (あなた)"} {/* 自分なら(あなた)と表示 */}
                      </span>
                      <span className={`text-xs font-bold ${member.status === 'ACCEPTED' ? 'text-green-600' :
                          member.status === 'DECLINED' ? 'text-red-600' :
                            'text-gray-400'
                        }`}>
                        {member.status === 'ACCEPTED' ? '🟢 参加' :
                          member.status === 'DECLINED' ? '🔴 不参加' : '⚪️ 未回答'}
                      </span>
                    </div>

                  </li>
                ))}
              </ul>
            </div>

          </div>
          {myStatus === 'PENDING' ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">

              <p className="mb-6 text-lg">この旅行に参加しますか？</p>
              <div className="flex gap-4">
                <form action={handleAccept}>
                  <Button type="submit" size="lg" className="bg-green-600 hover:bg-green-700">
                    はい（参加する）
                  </Button>
                </form>
                <form action={handleDecline}>
                  <Button type="submit" size="lg" variant="destructive">
                    いいえ（今回は見送る）
                  </Button>
                </form>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border rounded-lg p-6">
              <p className="text-lg font-bold mb-2">
                あなたの回答: {myStatus === 'ACCEPTED' ? '🟢 参加する' : '🔴 参加しない'}
              </p>
              {myStatus === 'ACCEPTED' && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">忘れないようにカレンダーに予定をロックしましょう！</p>
                  <IcsDownloadButton project={project} />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </main>
  )
}
