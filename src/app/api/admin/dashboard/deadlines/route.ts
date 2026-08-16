import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth/auth"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const now = new Date()
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

    const events = await prisma.event.findMany({
      where: {
        OR: [
          {
            registrationDeadline: {
              gte: now,
              lte: thirtyDaysFromNow,
            },
          },
          {
            startDate: {
              gte: now,
              lte: thirtyDaysFromNow,
            },
            registrationDeadline: null,
          },
        ],
        published: true,
        status: { not: "CANCELLED" },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        registrationDeadline: true,
        startDate: true,
      },
      orderBy: [
        { registrationDeadline: "asc" },
        { startDate: "asc" },
      ],
      take: 10,
    })

    return NextResponse.json({ deadlines: events })
  } catch (error) {
    console.error("Error fetching deadlines:", error)
    return NextResponse.json({ error: "Failed to fetch deadlines" }, { status: 500 })
  }
}