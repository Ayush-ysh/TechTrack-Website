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

    const [
      totalUsers,
      totalEvents,
      upcomingEvents,
      ongoingEvents,
      totalRegistrations,
      teamMembers,
      unreadMessages,
      recruitmentApplications,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.event.count(),
      prisma.event.count({
        where: {
          status: { in: ["UPCOMING", "REGISTRATION_OPEN"] },
          startDate: { gte: now },
          published: true,
        },
      }),
      prisma.event.count({
        where: {
          status: "ONGOING",
          OR: [
            { endDate: null, startDate: { lte: now } },
            { endDate: { gte: now }, startDate: { lte: now } },
          ],
          published: true,
        },
      }),
      prisma.eventRegistration.count({
        where: { status: { in: ["PENDING", "CONFIRMED", "WAITLISTED"] } },
      }),
      prisma.teamMember.count({ where: { active: true } }),
      prisma.contactMessage.count({ where: { status: "NEW" } }),
      prisma.recruitmentApplication.count({ where: { status: "SUBMITTED" } }),
    ])

    return NextResponse.json({
      stats: {
        totalUsers,
        totalEvents,
        upcomingEvents,
        ongoingEvents,
        totalRegistrations,
        teamMembers,
        unreadMessages,
        recruitmentApplications,
      },
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}