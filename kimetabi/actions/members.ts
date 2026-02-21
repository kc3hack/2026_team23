// actions/group.ts
"use server"; // ★これをつけることで、クライアントから呼び出せるようになります

import prisma from "@/lib/prisma";

export async function getGroupMemberIds(groupId: string) {
  try {
    // 1. groupIdに一致するメンバーをデータベースから探す
    const members = await prisma.groupMember.findMany({
      where: {
        groupId: groupId,
      },
      select: {
        userId: true, // ★ユーザーIDだけを取り出す（データ量が減って高速になります）
      }
    });

    // 2. [{ userId: "1" }, { userId: "2" }] という形を ["1", "2"] のシンプルな配列に変換
    const memberIds = members.map((member) => member.userId);

    return memberIds;

  } catch (error) {
    console.error("メンバーIDの取得に失敗しました:", error);
    throw new Error("メンバーIDの取得に失敗しました");
  }
}