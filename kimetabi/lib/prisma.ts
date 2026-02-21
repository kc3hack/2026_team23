// ./prisma.ts (または ./lib/prisma.ts)
import { PrismaClient } from "@prisma/client" // 標準のクライアント

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

// インスタンスを一つに制限する（これはNext.js 16でも必須！）
export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export default prisma
