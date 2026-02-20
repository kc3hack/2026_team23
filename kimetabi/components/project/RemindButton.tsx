"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
// ※実装済みのサーバーアクションをインポート（関数名やパスは適宜合わせてください）
import { sendNotification } from "@/actions/sendNotificationToOther"

type RemindButtonProps = {
  targetUserId: string
  targetUserName: string
  projectId: string // 通知タップ時の遷移先URLを作るために追加！
}


export function RemindButton({ targetUserId, targetUserName, projectId }: RemindButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  // タイトルと本文（body）のStateを分離
  const [title, setTitle] = useState("旅行の回答のお願い🙇‍♂️")
  const [body, setBody] = useState(`${targetUserName}さん、旅行の予定は確認できましたか？回答をお願いします！`)

  const [isPending, startTransition] = useTransition()

  const handleSend = () => {
    startTransition(async () => {
      try {
        // notificationProps の型に合わせてオブジェクト形式で渡す
        await sendNotification({
          userId: targetUserId,
          title: title,
          body: body,
          url: `/projects/${projectId}`, // 通知をタップしたらプロジェクト詳細画面へ飛ぶように設定
          icon: "/kimetabi-icon-192x192.png" // publicディレクトリのアイコンを指定
        })

        setIsOpen(false)
        alert("通知を送信しました！") // ハッカソン用の簡易フィードバック
      } catch (error) {
        console.error("通知の送信に失敗しました", error)
        alert("送信に失敗しました...")
      }
    })
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="text-blue-600 border-blue-600 hover:bg-blue-50"
      >
        つつく👆
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg space-y-4">
            <h3 className="text-lg font-bold">{targetUserName} さんへ通知を送る</h3>

            {/* 通知タイトルの入力 */}
            <div className="space-y-2">
              <Label htmlFor="title">通知タイトル</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例: 旅行の回答のお願い"
              />
            </div>

            {/* 通知本文(body)の入力 */}
            <div className="space-y-2">
              <Label htmlFor="body">メッセージ内容</Label>
              <Textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="回答を急かしたり、意気込みを伝えたりしましょう！"
                rows={4}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <Button
                variant="ghost"
                onClick={() => setIsOpen(false)}
                disabled={isPending}
              >
                キャンセル
              </Button>
              <Button
                onClick={handleSend}
                disabled={isPending || !title.trim() || !body.trim()} // タイトルか本文が空なら押せないように
              >
                {isPending ? "送信中..." : "送信する"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
