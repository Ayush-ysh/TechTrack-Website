import { auth } from '@/lib/auth/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export async function requireUser() {
  const session = await auth()
  if (!session?.user) {
    redirect('/login?redirect=' + encodeURIComponent('/profile'))
  }
  return session
}

export async function requireAdmin() {
  const session = await auth()
  if (!session?.user) {
    redirect('/login?redirect=' + encodeURIComponent('/admin'))
  }
  if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
    redirect('/')
  }
  return session
}

export async function requireSuperAdmin() {
  const session = await auth()
  if (!session?.user) {
    redirect('/login?redirect=' + encodeURIComponent('/admin'))
  }
  if (session.user.role !== 'SUPER_ADMIN') {
    redirect('/admin')
  }
  return session
}

export async function getCurrentUser() {
  const session = await auth()
  if (!session?.user) return null

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      phone: true,
      college: true,
      course: true,
      branch: true,
      year: true,
      role: true,
      createdAt: true,
    },
  })

  return user
}

export async function isAdmin(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  })
  return user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN'
}