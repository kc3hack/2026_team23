"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { error } from "console"

//1.グループ削除機能
export async function deleteGroupAction(groupId: string) {
  await prisma.group.delete({
    where: { id: groupId }
  })
  redirect("/groups")
}

//2.ユーザー検索機能
export async function searchUsersAction(query: string) {
  //空文字は空配列を返却する
  if (!query || query.trim() === "") {
    return [];
  }

  const session = await auth()
  const currentUserId = session?.user?.id

  if (!currentUserId) {
    throw new Error("認証されていません")
  }
  try {
    const users = await prisma.user.findMany({
      where: {
        id: { not: currentUserId },
        email: {
          contains: query,
          mode: "insensitive"
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },

      take: 5 //検索結果を５件までに限定することによってパフォーマンス改善
    })
    return users
  } catch (error) {
    console.error("ユーザー検索エラー", error)
    return []
  }

}

//3. グループ作成機能
export async function createGroupAction(name: string, description: string, memberIds: string[]) {
  const session = await auth()
  const currentUserId = session?.user?.id

  if (!currentUserId) {
    throw new Error("認証されていません。")
  }

  if (!name || name.trim() === '') {
    return { success: false, error: "グループ名を入力してください" }
  }

  if (!description) {
    const desc = "説明なし"
  } else {

  }

  try {
    await prisma.group.create({
      data: {
        name: name,
        description: description,
        members: {
          create: [
            {
              userId: currentUserId,
              role: "ADMIN"
            },
            ...memberIds.map((id) => ({
              userId: id,
              role: "MEMBER" as const
            }))
          ]
        }
      }
    })
  } catch (error) {
    console.error("グループ作成エラー", error)
    return { success: false, error: "グループ作成に失敗しました。" }
  }
}
