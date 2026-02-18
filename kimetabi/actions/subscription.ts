"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

// 購読情報をDBに保存するアクション
export async function saveSubscription(subscription: PushSubscription) {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    throw new Error("ログインが必要です")
  }

  // PushSubscriptionオブジェクトから必要なデータを抽出
  // ※ブラウザのAPIが返すJSON構造に合わせています
  const subData = JSON.parse(JSON.stringify(subscription))
  const endpoint = subData.endpoint
  const p256dh = subData.keys?.p256dh
  const authKey = subData.keys?.auth

  if (!endpoint || !p256dh || !authKey) {
    throw new Error("無効な購読データです")
  }

  // Prismaで保存（すでに同じ端末・ブラウザからの登録があれば更新する upsert が便利です）
  await prisma.pushSubscription.upsert({
    where: { endpoint: endpoint },
    update: {
      userId: userId,
      p256dh: p256dh,
      auth: authKey,
    },
    create: {
      userId: userId,
      endpoint: endpoint,
      p256dh: p256dh,
      auth: authKey,
    }
  })

  return { success: true }
}

// （おまけ）購読を解除するアクション
export async function deleteSubscription(endpoint: string) {
  try {
    await prisma.pushSubscription.delete({
      where: { endpoint: endpoint }
    })
    return { success: true }
  } catch (e) {
    // 存在しない場合のエラーなどを無視する
    return { success: false }
  }
}
