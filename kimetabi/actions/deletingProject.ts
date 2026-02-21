"use server"

import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"

export async function deleteProjectAction(tripId: string) {
  await prisma.project.delete({
    where: {
        id : tripId
    }
  })
  redirect("/")
}