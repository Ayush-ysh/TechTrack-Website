import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth/auth'
import { galleryAlbumSchema, galleryImageSchema, slugify } from '@/lib/validation/schemas'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const albumId = searchParams.get('albumId')

    if (albumId) {
      const album = await prisma.galleryAlbum.findUnique({
        where: { id: albumId },
        include: {
          images: { orderBy: { displayOrder: 'asc' } },
          event: { select: { title: true, slug: true } },
        },
      })
      return NextResponse.json({ album })
    }

    const albums = await prisma.galleryAlbum.findMany({
      include: {
        images: { take: 1, orderBy: { displayOrder: 'asc' } },
        event: { select: { title: true, slug: true } },
      },
      orderBy: { date: 'desc' },
    })

    return NextResponse.json({ albums })
  } catch (error) {
    console.error('Error fetching admin gallery:', error)
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { images, ...albumData } = body

    const albumValidation = galleryAlbumSchema.safeParse(albumData)
    if (!albumValidation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: albumValidation.error.flatten() },
        { status: 400 }
      )
    }

    const data = albumValidation.data
    let slug = data.slug || slugify(data.title)

    let existing = await prisma.galleryAlbum.findUnique({ where: { slug } })
    let counter = 1
    while (existing) {
      slug = `${slugify(data.title)}-${counter}`
      existing = await prisma.galleryAlbum.findUnique({ where: { slug } })
      counter++
    }

    const album = await prisma.galleryAlbum.create({
      data: {
        ...data,
        slug,
        date: data.date ? new Date(data.date) : null,
        images: images?.length ? {
          create: images.map((img: Record<string, unknown>, i: number) => ({
            ...img,
            displayOrder: img.displayOrder ?? i,
          })),
        } : undefined,
      },
      include: { images: { orderBy: { displayOrder: 'asc' } } },
    })

    await prisma.adminActivity.create({
      data: {
        adminId: session.user.id,
        action: 'CREATE_GALLERY_ALBUM',
        targetType: 'GalleryAlbum',
        targetId: album.id,
        metadata: { title: album.title },
      },
    })

    return NextResponse.json(album, { status: 201 })
  } catch (error) {
    console.error('Error creating gallery album:', error)
    return NextResponse.json({ error: 'Failed to create gallery album' }, { status: 500 })
  }
}