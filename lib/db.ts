import { PrismaClient } from './generated/prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'

const connectionString = process.env.DATABASE_URL!

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

export const db = globalForPrisma.prisma ?? new PrismaClient({
  adapter: new PrismaNeon({ connectionString }),
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
