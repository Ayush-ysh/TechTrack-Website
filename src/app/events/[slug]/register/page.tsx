import { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import EventRegisterClient from "./EventRegisterClient"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const event = await prisma.event.findUnique({
    where: { slug },
    select: { title: true },
  })

  if (!event) {
    return { title: "Register | TechTrack" }
  }

  return {
    title: `Register for ${event.title} | TechTrack`,
    description: `Register for ${event.title} - ${event.title} event by TechTrack`,
  }
}

export default async function EventRegisterPage({ params }: PageProps) {
  const { slug } = await params

  const event = await prisma.event.findUnique({
    where: { slug },
    include: {
      coordinators: { orderBy: { order: "asc" } },
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

  if (!event.published || event.status === "CANCELLED" || event.status === "COMPLETED") {
    notFound()
  }

  const now = new Date()
  if (event.registrationDeadline && now > new Date(event.registrationDeadline)) {
    notFound()
  }

  if (!event.internalRegistrationEnabled) {
    notFound()
  }

  return <EventRegisterClient initialEvent={eventWithTypedRounds} />
}