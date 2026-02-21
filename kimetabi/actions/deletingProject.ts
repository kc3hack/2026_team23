"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function deleteProjectAction(tripId: string) {
   try {
    await prisma.project.delete({
      where: {
        id: tripId
      }
    })
  } catch (error) {
    console.error("削除エラー:", error)
    throw new Error("削除に失敗しました")
  }
  revalidatePath("/")
  redirect("/")
}