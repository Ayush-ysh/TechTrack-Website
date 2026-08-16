import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth/auth'
import { galleryAlbumSchema, galleryImageSchema } from '@/lib/validation/schemas'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const album = await prisma.galleryAlbum.findUnique({
      where: { id },
      include: {
        images: { orderBy: { displayOrder: 'asc' } },
        event: { select: { title: true, slug: true } },
      },
    })

    if (!album) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 })
    }

    return NextResponse.json({ album })
  } catch (error) {
    console.error('Error fetching gallery album:', error)
    return NextResponse.json({ error: 'Failed to fetch album' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { images, ...albumData } = body

    if (images && images.length > 0) {
      // Update images
      const imageUpdates = images.map((img: Record<string, unknown>) =>
        prisma.galleryImage.upsert({
          where: { id: (img.id as string) || 'new' },
          update: {
            imageUrl: img.imageUrl as string,
            thumbnailUrl: img.thumbnailUrl as string || null,
            caption: img.caption as string || null,
            photographer: img.photographer as string || null,
            displayOrder: (img.displayOrder as number) || 0,
            albumId: id,
          },
          create: {
            imageUrl: img.imageUrl as string,
            thumbnailUrl: img.thumbnailUrl as string || null,
            caption: img.caption as string || null,
            photographer: img.photographer as string || null,
            displayOrder: (img.displayOrder as number) || 0,
            albumId: id,
          },
        })
      )
      await Promise.all(imageUpdates)
    }

    const albumValidation = galleryAlbumSchema.partial().safeParse(albumData)
    if (!albumValidation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: albumValidation.error.flatten() },
        { status: 400 }
      )
    }

    const data = albumValidation.data
    const album = await prisma.galleryAlbum.update({
      where: { id },
      data: { ...data, date: data.date ? new Date(data.date) : undefined },
      include: { images: { orderBy: { displayOrder: 'asc' } } },
    })

    await prisma.adminActivity.create({
      data: {
        adminId: session.user.id,
        action: 'UPDATE_GALLERY_ALBUM',
        targetType: 'GalleryAlbum',
        targetId: id,
        metadata: { title: album.title },
      },
    })

    return NextResponse.json(album)
  } catch (error) {
    console.error('Error updating gallery album:', error)
    return NextResponse.json({ error: 'Failed to update album' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const album = await prisma.galleryAlbum.findUnique({ where: { id } })

    if (!album) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 })
    }

    await prisma.galleryAlbum.delete({ where: { id } })

    await prisma.adminActivity.create({
      data: {
        adminId: session.user.id,
        action: 'DELETE_GALLERY_ALBUM',
        targetType: 'GalleryAlbum',
        targetId: id,
        metadata: { title: album.title },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting gallery album:', error)
    return NextResponse.json({ error: 'Failed to delete album' }, { status: 500 })
  }
}