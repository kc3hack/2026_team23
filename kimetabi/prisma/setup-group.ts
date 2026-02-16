// prisma/setup-group.ts
import { PrismaClient } from '../generated/client'
import 'dotenv/config'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 グループ作成を開始します...')

  // 1. あなた自身のユーザー情報を取得（ご自身のGoogleメールアドレスに変更してください！）
  const myEmail = "asahhiy@gmail.com"

  const me = await prisma.user.findUnique({
    where: { email: myEmail }
  })

  if (!me) {
    throw new Error("⚠️ ユーザーが見つかりません！先にアプリ画面から一度ログインして、DBにあなたのアカウントを作ってください。")
  }

  // 2. 先ほど作ったテストユーザーを2人ほど取得
  const dummyUsers = await prisma.user.findMany({
    where: { email: { startsWith: 'testuser' } },
    take: 2
  })

  // 3. グループとメンバーを一気に作成！
  const newGroup = await prisma.group.create({
    data: {
      name: "大学のサークル",
      description: "Prisma Studioを使わずに作ったテスト用グループ",
      members: {
        create: [
          // 自分を管理者(ADMIN)として追加
          { userId: me.id, role: "ADMIN" },
          // ダミーユーザーたちを一般メンバー(MEMBER)として追加
          ...dummyUsers.map(u => ({
            userId: u.id,
            role: "MEMBER" as "ADMIN" | "MEMBER"
          }))
        ]
      }
    }
  })

  console.log(`✨ グループ「${newGroup.name}」を作成し、メンバーを追加しました！`)
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())
