import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
export default async function MyProjectsList() {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return null
  // PENDING(未回答)とACCEPTED(参加)の両方を取得 (DECLINEDは除外)
  const memberships = await prisma.projectMember.findMany({
    where: {
      userId: userId,
      status: {
        in: ['PENDING', 'ACCEPTED'] // ここで両方のステータスを指定
      }
    },
    include: {
      project: true
    },
    orderBy: {
      project: { departureDate: 'asc' } // 出発日が近い順に並べる
    }
  })

  if (memberships.length === 0) {
    return (
      <div className="text-gray-500 text-center py-8">
        現在、予定されている旅行や招待はありません。下のGroupボタンから新しい旅行を企画してみましょう！
      </div>
    )
  }

  // 取得したデータをステータスごとに振り分け
  const pendingProjects = memberships.filter(m => m.status === 'PENDING')
  const acceptedProjects = memberships.filter(m => m.status === 'ACCEPTED')

  return (
    <div className="space-y-8 mb-8 ml-4 mr-4">

      {/* 🔴 未回答の招待セクション（目立たせる） */}
      {pendingProjects.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4 text-red-500 animate-pulse">
            🔔 新しい旅行の招待が届いています！（未回答）
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pendingProjects.map(({ project }) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card className="border-red-300 bg-red-50 hover:bg-red-100 transition-colors h-full cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-xl text-red-700">{project.title}</CardTitle>
                    <CardDescription className="text-red-600 font-semibold">
                      出発日: {project.departureDate.toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 line-clamp-2">{project.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm font-bold text-red-600 bg-white px-3 py-1 rounded-full border border-red-200">
                        未回答
                      </span>
                      <span className="text-sm font-bold text-red-600">
                        タップして回答 👉
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 🟢 参加予定の旅行セクション */}
      {acceptedProjects.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4 text-shadow-black">
            参加予定の旅行
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {acceptedProjects.map(({ project }) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card className="border-green-200 bg-white hover:bg-green-50 transition-colors h-full cursor-pointer shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-800">{project.title}</CardTitle>
                    <CardDescription className="text-gray-600 font-medium">
                      日程: {project.departureDate.toLocaleDateString()} 〜 {project.endDate.toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                        参加確定
                      </span>
                      <span className="text-sm text-gray-500">
                        詳細を見る
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

    </div>
  )
}
