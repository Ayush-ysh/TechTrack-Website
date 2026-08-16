import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    const published = searchParams.get('published')
    const eventId = searchParams.get('eventId')

    if (slug) {
      const album = await prisma.galleryAlbum.findUnique({
        where: { slug },
        include: {
          images: { orderBy: { displayOrder: 'asc' } },
          event: { select: { title: true, slug: true } },
        },
      })

      if (!album) {
        return NextResponse.json({ error: 'Album not found' }, { status: 404 })
      }

      if (!album.published && published !== 'false') {
        return NextResponse.json({ error: 'Album not found' }, { status: 404 })
      }

      return NextResponse.json({ album })
    }

    const where: Record<string, unknown> = {}
    if (published !== 'false') {
      where.published = true
    }
    if (eventId) {
      where.eventId = eventId
    }

    const albums = await prisma.galleryAlbum.findMany({
      where,
      include: {
        images: {
          take: 1,
          orderBy: { displayOrder: 'asc' },
        },
        event: { select: { title: true, slug: true } },
      },
      orderBy: { date: 'desc' },
    })

    return NextResponse.json({ albums })
  } catch (error) {
    console.error('Error fetching gallery:', error)
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 })
  }
}