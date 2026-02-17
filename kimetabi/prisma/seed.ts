// prisma/seed.ts
import { PrismaClient } from '../generated/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 シード処理を開始します...')

  // 10人のテストユーザーをループで作成
  for (let i = 1; i <= 10; i++) {
    const dummyEmail = `testuser${i}@example.com`

    // upsertを使うことで、何度実行しても同じデータが重複して作られないようにします
    const user = await prisma.user.upsert({
      where: { email: dummyEmail },
      update: {},
      create: {
        name: `テストユーザー ${i}号`,
        email: dummyEmail,
        // おまけ：見分けがつくようにダミーのアイコン画像URLを入れる
        image: `https://api.dicebear.com/7.x/avataaars/svg?seed=test${i}`,
      },
    })
    console.log(`👤 ユーザー作成: ${user.name}`)
  }

  console.log('✨ シード処理が完了しました！')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
