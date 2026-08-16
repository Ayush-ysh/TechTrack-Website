import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth/auth"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const activity = await prisma.adminActivity.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
      include: {
        admin: { select: { name: true } },
      },
    })

    return NextResponse.json({ activity })
  } catch (error) {
    console.error("Error fetching activity:", error)
    return NextResponse.json({ error: "Failed to fetch activity" }, { status: 500 })
  }
}