import { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import EventDetailClient from "./EventDetailClient"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const event = await prisma.event.findUnique({
    where: { slug },
    select: { title: true, tagline: true, description: true, poster: true, startDate: true, venue: true },
  })

  if (!event) {
    return { title: "Event Not Found | TechTrack" }
  }

  return {
    title: `${event.title} | TechTrack`,
    description: event.tagline || event.description?.slice(0, 160),
    openGraph: {
      title: `${event.title} | TechTrack`,
      description: event.tagline || event.description?.slice(0, 160),
      images: event.poster ? [{ url: event.poster }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${event.title} | TechTrack`,
      description: event.tagline || event.description?.slice(0, 160),
      images: event.poster ? [event.poster] : [],
    },
  }
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params

  const event = await prisma.event.findUnique({
    where: { slug },
    include: {
      coordinators: { orderBy: { order: "asc" } },
      scheduleItems: { orderBy: { order: "asc" } },
    },
  })

  if (!event) {
    notFound()
  }

  // Cast rounds to the expected type since it's stored as JSON
  const eventWithTypedRounds = {
    ...event,
    rounds: (event.rounds as { name: string; description: string }[]) || null,
  }

  // Calculate derived status
  const now = new Date()
  let derivedStatus = event.status

  if (event.status !== "CANCELLED" && event.status !== "DRAFT") {
    if (event.endDate && now > event.endDate) {
      derivedStatus = "COMPLETED"
    } else if (now >= event.startDate && (!event.endDate || now <= event.endDate)) {
      derivedStatus = "ONGOING"
    } else if (event.registrationOpenDate && event.registrationDeadline &&
               now >= event.registrationOpenDate && now <= event.registrationDeadline &&
               event.internalRegistrationEnabled) {
      derivedStatus = "REGISTRATION_OPEN"
    } else if (event.registrationDeadline && now > event.registrationDeadline) {
      derivedStatus = "COMPLETED"
    } else {
      derivedStatus = "UPCOMING"
    }
  }

  // Get registration count
  const [registrationCount, teamRegistrationCount] = await Promise.all([
    prisma.eventRegistration.count({
      where: { eventId: event.id, status: { in: ["PENDING", "CONFIRMED", "WAITLISTED"] } },
    }),
    prisma.teamRegistration.count({
      where: { eventId: event.id, status: { in: ["PENDING", "CONFIRMED", "WAITLISTED"] } },
    }),
  ])

  const totalRegistrations = registrationCount + teamRegistrationCount

  return (
    <EventDetailClient
      initialEvent={eventWithTypedRounds}
      derivedStatus={derivedStatus}
      registrationCount={totalRegistrations}
      isRegistrationOpen={derivedStatus === "REGISTRATION_OPEN" && (!event.participantLimit || totalRegistrations < event.participantLimit)}
      isFull={event.participantLimit ? totalRegistrations >= event.participantLimit : false}
    />
  )
}