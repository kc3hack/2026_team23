"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export async function createProject(formData: FormData) {
  //ログインしてるユーザーの情報を取得
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    throw new Error("ログインが必要です")
  }

  // 2.フォームから送信されたデータを受理
  const title = formData.get("title") as string
  const departureDate = formData.get("departureDate") as string

  if (!title || !departureDate) {
    throw new Error("タイトルと出発日は必須です")
  }

  //3. prismaのネスト書き込みで旅行とメンバーを同時
  const newProject = await prisma.project.create({
    data: {
      title: title,
      departureDate: new Date(departureDate),

      members: {
        create: {
          userId: userId,
          role: "MASTER", //主催者として参加
          status: "ACCEPTED"
        }
      }
    }
  })

  redirect("/")
}
