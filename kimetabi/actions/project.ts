"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

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
  const endDate = formData.get("endDate") as string
  const description = formData.get("description") as string
  const price = formData.get("price") as string
  //追加でgroupIdも受け取る
  const groupId = formData.get("groupId") as string | null

  if (!title || !departureDate) {
    throw new Error("タイトルと出発日は必須です")
  }

  type memberData = {
    userId: string
    role: "MASTER" | "PARTICIPANT"
    status: "PENDING" | "ACCEPTED" | "DECLINED"
  }
  let membersData: memberData[] = []

  if (groupId) {
    const groupMembers = await prisma.groupMember.findMany({
      where: {
        groupId: groupId
      }
    })
    //ProjectMember用のデータに変換を行う
    membersData = groupMembers.map((member) => ({
      userId: member.userId,
      role: member.userId === userId ? "MASTER" : "PARTICIPANT",
      status: member.userId === userId ? "ACCEPTED" : "PENDING"
    }))
  } else {
    //単発旅行の時(作成者だけを登録)
    membersData = [{
      userId: userId,
      role: "MASTER",
      status: "ACCEPTED",
    }]
  }

  //3. prismaのネスト書き込みで旅行とメンバーを同時
  await prisma.project.create({
    data: {
      title: title,
      departureDate: new Date(departureDate),
      description: description,
      endDate: new Date(endDate),
      groupId: groupId || null,
      price: Number(price),
      members: {
        createMany: {
          data: membersData
        }
      }
    }
  })

  redirect("/")
}

// 参加ステータスを更新する関数
export async function updateParticipantStatus(projectId: string, userId: string, status: "ACCEPTED" | "DECLINED") {
  await prisma.projectMember.update({
    where: {
      projectId_userId: {
        projectId: projectId,
        userId: userId
      }
    },
    data: { status }
  })

  // 更新後にページを再検証して最新の状態を表示
  revalidatePath(`/projects/${projectId}`)
}
