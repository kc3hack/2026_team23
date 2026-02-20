
// app/(auth)/projects/[id]/page.tsx
import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import { updateParticipantStatus } from "@/actions/project"
import { Button } from "@/components/ui/button"
import IcsDownloadButton from "@/components/project/DownloadIcsFileButton"

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
      </div>

      {isMaster ? (
        /* 主催者 (MASTER) の場合のビュー */
        <div>
          <h2 className="text-2xl font-bold mb-4">👑 参加状況ダッシュボード</h2>
          <div className="bg-white shadow rounded-lg p-4">
            <ul className="space-y-3">
              {project.members.map(member => (
                <li key={member.id} className="flex justify-between items-center border-b pb-2">
                  <span>{member.user.name || "名無しユーザー"}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${member.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' :
                    member.status === 'DECLINED' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                    {member.status === 'ACCEPTED' ? '参加' :
                      member.status === 'DECLINED' ? '不参加' : '未回答 (PENDING)'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        /* 招待された人 (PARTICIPANT) の場合のビュー */
        <div>
          <h2 className="text-2xl font-bold mb-4">✉️ 招待状</h2>

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
