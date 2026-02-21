"use client"

import { useState } from "react"
import { useNotificationManager } from "@/hooks/useNotificationManager"

export default function NotificationToggle() {
  const { isSupported, subscription, error, subscribeToPush, unsubscribeFromPush } = useNotificationManager()
  // 連打防止用のローディングステート
  const [isLoading, setIsLoading] = useState(false)

  // トグルがクリックされた時の処理
  const handleToggle = async () => {
    setIsLoading(true)
    try {
      if (subscription) {
        // すでにオンならオフにする
        await unsubscribeFromPush()
      } else {
        // オフならオンにする
        await subscribeToPush()
      }
    } finally {
      setIsLoading(false)
    }
  }

  // ブラウザが対応していない場合の表示
  if (!isSupported) {
    return <p className="text-sm text-gray-500">お使いの端末はプッシュ通知に非対応です</p>
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="relative inline-flex items-center cursor-pointer max-w-max">
        {/* 見えないチェックボックス本体 */}
        <input
          type="checkbox"
          className="sr-only peer"
          checked={!!subscription}
          onChange={handleToggle}
          disabled={isLoading}
        />
        {/* トグルスイッチの見た目部分 */}
        <div className={`
          w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer 
          peer-checked:after:translate-x-full peer-checked:after:border-white 
          after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
          after:bg-white after:border-gray-300 after:border after:rounded-full 
          after:h-5 after:w-5 after:transition-all
          ${subscription ? 'bg-blue-600' : 'bg-gray-200'}
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        `}></div>
        {/* ラベルテキスト */}
        <span className="ml-3 text-sm font-medium text-gray-900">
          プッシュ通知を受け取る
        </span>
      </label>

      {/* エラーがあれば表示 */}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
