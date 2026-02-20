"use server"

import webpush from "web-push"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"


webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || "mailto:mugimugiworks105@gmail.com", // .envに設定したメールアドレス
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

type notificationProps = {
  userId: string,
  title: string,
  body: string,
  url?: string,
  icon?: string,
}

export async function sendNotification(Props: notificationProps) {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return { success: false, error: "ログインしてません" }
  }

  //DBから自分の購読情報(PushSubscriptionを取得)
  const subscriptions = await prisma.pushSubscription.findMany({
    where: { userId: Props.userId }
  })

  if (subscriptions.length === 0) {
    return { success: false, error: "通知がONになってません。ホーム画面で通知を有効化してください。" }
  }

  const payload = JSON.stringify({
    title: Props.title,
    body: Props.body,
    url: Props.url ?? "/", // クリックした時に開くページ
    icon: session?.user?.image ?? "/favicon.ico" // 必要に応じてアプリアイコンのパスに変更
  })

  try {
    // 4. 取得したすべての端末（ブラウザ）に対して通知を送信
    const sendPromises = subscriptions.map((sub) => {
      // DBに保存した平坦なデータを、web-pushが求める階層構造に戻す
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth
        }
      }
      return webpush.sendNotification(pushSubscription, payload)
    })

    // 全ての送信処理が完了するのを待つ
    await Promise.all(sendPromises)

    return { success: true }
  } catch (error) {
    console.error("通知送信エラー:", error)
    return { success: false, error: "通知の送信に失敗しました" }
  }
}
