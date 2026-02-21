"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function deleteUserAction() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("ログインが必要です");
}

  await prisma.user.delete({
    where: {
      id: session.user.id,
    },
  });

  return { success: true };
}