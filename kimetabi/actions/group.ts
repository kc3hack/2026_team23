"use server"

import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"


export async function deleteGroupAction(groupId: string) {
  await prisma.group.delete({
    where: { id: groupId }
  })

  redirect("/groups")
}
