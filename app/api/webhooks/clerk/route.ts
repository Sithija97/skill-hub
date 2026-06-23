import { NextRequest } from 'next/server'
import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  let event
  try {
    event = await verifyWebhook(req)
  } catch {
    return new Response('Invalid signature', { status: 400 })
  }

  switch (event.type) {
    case 'user.created': {
      const { id, username, first_name, last_name, image_url, email_addresses } = event.data
      const derivedUsername = username ?? email_addresses[0]?.email_address.split('@')[0] ?? id
      const displayName = [first_name, last_name].filter(Boolean).join(' ') || derivedUsername

      await db.user.upsert({
        where: { id },
        create: {
          id,
          username: derivedUsername,
          displayName,
          avatarUrl: image_url ?? null,
        },
        update: {},
      }).catch((err) => {
        console.error(`Webhook user.created failed for ${id}:`, err)
      })
      break
    }

    case 'user.updated': {
      const { id, username, first_name, last_name, image_url } = event.data
      const displayName = [first_name, last_name].filter(Boolean).join(' ') || undefined

      await db.user.update({
        where: { id },
        data: {
          ...(username ? { username } : {}),
          ...(displayName ? { displayName } : {}),
          avatarUrl: image_url ?? null,
        },
      }).catch((err) => {
        console.error(`Webhook user.updated: user ${id} not found:`, err)
      })
      break
    }

    case 'user.deleted': {
      const { id } = event.data
      if (id) {
        await db.$transaction(async (tx) => {
          const likedSkillIds = (await tx.skillLike.findMany({
            where: { userId: id },
            select: { skillId: true },
          })).map((l) => l.skillId)

          const savedSkillIds = (await tx.skillSave.findMany({
            where: { userId: id },
            select: { skillId: true },
          })).map((s) => s.skillId)

          if (likedSkillIds.length > 0) {
            await tx.skill.updateMany({
              where: { id: { in: likedSkillIds } },
              data: { likesCount: { decrement: 1 } },
            })
          }

          if (savedSkillIds.length > 0) {
            await tx.skill.updateMany({
              where: { id: { in: savedSkillIds } },
              data: { savesCount: { decrement: 1 } },
            })
          }

          await tx.user.delete({ where: { id } })
        }).catch((err) => {
          console.error(`Webhook user.deleted: failed for ${id}:`, err)
        })
      }
      break
    }
  }

  return new Response('OK', { status: 200 })
}
