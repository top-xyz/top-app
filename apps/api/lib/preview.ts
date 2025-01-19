import { database } from '@repo/database'

class PreviewSystem {
  async create({ contextId, userId }: { contextId: string; userId: string }) {
    const preview = await database.preview.create({
      data: {
        contextId,
        userId,
        status: 'PENDING'
      }
    })

    return preview
  }

  async get(id: string) {
    const preview = await database.preview.findUnique({
      where: { id }
    })

    return preview
  }

  async update(id: string, data: { status: string; url?: string }) {
    const preview = await database.preview.update({
      where: { id },
      data
    })

    return preview
  }
}

export const previewSystem = new PreviewSystem() 