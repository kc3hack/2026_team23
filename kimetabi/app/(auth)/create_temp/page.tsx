import { createProject } from "@/actions/project" // ※実際のパスに合わせて適宜変更してください
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export default async function CreateProjectPage() {
  // ログインユーザーの情報を取得
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return <div>ログインが必要です</div>
  }

  // ユーザーが所属しているグループを取得（セレクトボックス用）
  const userGroups = await prisma.groupMember.findMany({
    where: { userId: userId },
    include: { group: true }
  })

  // 「3ヶ月後」のバリデーション用の最小日付を計算
  const minDate = new Date()
  minDate.setMonth(minDate.getMonth() + 3)
  const minDateString = minDate.toISOString().split("T")[0]

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">新しい旅行を計画する</h1>

      <form action={createProject} className="space-y-6">
        {/* タイトル */}
        <div className="space-y-2">
          <Label htmlFor="title">旅行のタイトル <span className="text-red-500">*</span></Label>
          <Input id="title" name="title" required placeholder="例: 卒業旅行、冬の温泉" />
        </div>

        {/* グループ選択 (任意) */}
        <div className="space-y-2">
          <Label htmlFor="groupId">グループ (任意)</Label>
          <select
            id="groupId"
            name="groupId"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">グループを指定しない (単発旅行)</option>
            {userGroups.map((gm) => (
              <option key={gm.groupId} value={gm.groupId}>
                {gm.group.name}
              </option>
            ))}
          </select>
        </div>

        {/* 日程 (出発日は3ヶ月後以降に制限) */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="departureDate">出発日 <span className="text-red-500">*</span></Label>
            <Input
              id="departureDate"
              name="departureDate"
              type="date"
              required
              min={minDateString} // 3ヶ月前のロック機能
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">終了日 <span className="text-red-500">*</span></Label>
            <Input
              id="endDate"
              name="endDate"
              type="date"
              required
              min={minDateString}
            />
          </div>
        </div>

        {/* 予算 */}
        <div className="space-y-2">
          <Label htmlFor="price">おおよその予算 (円) <span className="text-red-500">*</span></Label>
          <Input id="price" name="price" type="number" required placeholder="例: 50000" min="0" />
        </div>

        {/* 説明 */}
        <div className="space-y-2">
          <Label htmlFor="description">旅行の説明やメモ</Label>
          <Textarea id="description" name="description" placeholder="行きたい場所や目的などを自由に書いてください" />
        </div>

        <Button type="submit" className="w-full">
          計画を作成してメンバーに通知する！
        </Button>
      </form>
    </div>
  )
}
