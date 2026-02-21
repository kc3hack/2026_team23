"use client"

import { useEffect, useState } from "react"
// 先ほど作成を提案したServer Actionをインポートします
import { saveSubscription, deleteSubscription } from "@/actions/subscription"

export function useNotificationManager() {
  const [isSupported, setIsSupported] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // ブラウザがService WorkerとPush APIに対応しているかチェック
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true)
      registerServiceWorker()
    }
  }, [])

  // 1. Service Workerの登録と現在の購読状態の取得
  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
        updateViaCache: "none",
      })

      // すでに通知許可＆購読済みなら、その情報を取得してStateに入れる
      const sub = await registration.pushManager.getSubscription()
      setSubscription(sub)
    } catch (error) {
      if (error instanceof Error) setError(error.message)
    }
  }

  // 2. Base64文字列をUint8Arrayに変換するヘルパー関数
  function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  // 3. 通知の購読（オンにする）
  const subscribeToPush = async () => {
    try {
      setError(null) // エラーをリセット
      const permission = await Notification.requestPermission()
      if (permission !== "granted") {
        throw new Error("通知の許可を得られませんでした")
      }

      const registration = await navigator.serviceWorker.ready
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY

      if (!vapidPublicKey) throw new Error("環境変数にVAPIDキーが設定されていません")

      // ブラウザで購読処理を実行
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      })

      // ★ Server Actionを呼び出してDBに保存！
      // Prismaを使ってPushSubscriptionテーブルに書き込む処理です
      const subJSON = sub.toJSON()
      if (!subJSON.endpoint || !subJSON.keys?.p256dh || !subJSON.keys?.auth) {
        throw new Error("無効なデータが生成されました")
      }
      await saveSubscription({
        endpoint: subJSON.endpoint,
        keys: {
          p256dh: subJSON.keys.p256dh,
          auth: subJSON.keys.auth,
        }
      })

      setSubscription(sub)
    } catch (error) {
      if (error instanceof Error && error !== null) setError(error.message)
    }
  }

  // 4. 通知の購読解除（オフにする）
  const unsubscribeFromPush = async () => {
    try {
      setError(null)
      if (!subscription) return

      const endpoint = subscription.endpoint

      // ブラウザ側で購読解除
      await subscription.unsubscribe()
      setSubscription(null)

      // ★ Server Actionを呼び出してDBから削除！
      await deleteSubscription(endpoint)

    } catch (error) {
      if (error instanceof Error) setError(error.message)
    }
  }

  return {
    isSupported,
    subscription,
    error,
    subscribeToPush,
    unsubscribeFromPush,
  }
}
