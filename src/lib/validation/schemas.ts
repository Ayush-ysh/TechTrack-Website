import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  redirect: z.string().optional(),
})

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  college: z.string().min(1, 'College is required'),
  course: z.string().min(1, 'Course is required'),
  branch: z.string().min(1, 'Branch is required'),
  year: z.string().min(1, 'Academic year is required'),
  redirect: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const profileUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100).optional(),
  phone: z.string().optional(),
  college: z.string().optional(),
  course: z.string().optional(),
  branch: z.string().optional(),
  year: z.string().optional(),
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const eventRegistrationSchema = z.object({
  eventId: z.string().min(1, 'Event ID is required'),
  participantType: z.enum(['INDIVIDUAL', 'TEAM']),
  teamName: z.string().optional(),
  members: z.array(z.object({
    memberName: z.string().min(1, 'Member name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    college: z.string().optional(),
    role: z.string().optional(),
  })).optional(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
}).refine((data) => {
  if (data.participantType === 'TEAM') {
    return data.members && data.members.length > 0
  }
  return true
}, {
  message: 'Team members are required for team registration',
  path: ['members'],
})

export const createEventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens').optional(),
  subtitle: z.string().max(200).optional(),
  tagline: z.string().max(500).optional(),
  shortDescription: z.string().max(500).optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.enum(['HACKATHON', 'IDEATHON', 'WORKSHOP', 'COMPETITION', 'MEETUP', 'SEMINAR', 'OTHER']),
  status: z.enum(['DRAFT', 'UPCOMING', 'REGISTRATION_OPEN', 'ONGOING', 'COMPLETED', 'CANCELLED']),
  poster: z.string().url('Invalid poster URL').optional().or(z.literal('')),
  banner: z.string().url('Invalid banner URL').optional().or(z.literal('')),
  startDate: z.string().datetime('Invalid start date'),
  endDate: z.string().datetime('Invalid end date').optional(),
  registrationOpenDate: z.string().datetime('Invalid registration open date').optional(),
  registrationDeadline: z.string().datetime('Invalid registration deadline').optional(),
  registrationUrl: z.string().url('Invalid registration URL').optional().or(z.literal('')),
  internalRegistrationEnabled: z.boolean().default(true),
  venue: z.string().optional(),
  room: z.string().optional(),
  onlineUrl: z.string().url('Invalid online URL').optional().or(z.literal('')),
  teamMinSize: z.number().int().min(1).default(1),
  teamMaxSize: z.number().int().min(1).default(1),
  participantLimit: z.number().int().min(1).optional(),
  allowWaitlist: z.boolean().default(false),
  prize: z.string().optional(),
  rules: z.array(z.string()).default([]),
  eligibility: z.string().optional(),
  schedule: z.string().optional(),
  rounds: z.array(z.object({
    name: z.string(),
    description: z.string(),
  })).optional(),
  organizer: z.string().optional(),
  contactInformation: z.string().optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  coordinators: z.array(z.object({
    name: z.string().min(1, 'Coordinator name is required'),
    contact: z.string().min(1, 'Contact is required'),
    role: z.string().optional(),
    order: z.number().int().default(0),
  })).optional(),
  scheduleItems: z.array(z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    startTime: z.string().datetime('Invalid start time'),
    endTime: z.string().datetime('Invalid end time').optional(),
    location: z.string().optional(),
    order: z.number().int().default(0),
  })).optional(),
})

export const updateEventSchema = createEventSchema.partial()

export const teamMemberSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  slug: z.string().min(2, 'Slug must be at least 2 characters').max(100).regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  role: z.string().min(1, 'Role is required').max(100),
  division: z.enum(['LEADERSHIP', 'DESIGN', 'TECH', 'MULTIMEDIA', 'SOCIAL_MEDIA', 'MANAGEMENT']),
  bio: z.string().max(1000).optional(),
  photo: z.string().url('Invalid photo URL').optional().or(z.literal('')),
  linkedin: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  instagram: z.string().url('Invalid Instagram URL').optional().or(z.literal('')),
  github: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
  portfolio: z.string().url('Invalid portfolio URL').optional().or(z.literal('')),
  displayOrder: z.number().int().default(0),
  active: z.boolean().default(true),
  featured: z.boolean().default(false),
  startYear: z.number().int().min(2020).max(2030).optional(),
  endYear: z.number().int().min(2020).max(2030).optional(),
})

export const achievementSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  slug: z.string().min(2, 'Slug must be at least 2 characters').max(100).regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  year: z.number().int().min(2020).max(2030),
  date: z.string().datetime('Invalid date').optional(),
  category: z.string().max(100).optional(),
  image: z.string().url('Invalid image URL').optional().or(z.literal('')),
  externalUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  displayOrder: z.number().int().default(0),
})

export const galleryAlbumSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  slug: z.string().min(2, 'Slug must be at least 2 characters').max(100).regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  description: z.string().max(1000).optional(),
  eventId: z.string().optional(),
  coverImage: z.string().url('Invalid cover image URL').optional().or(z.literal('')),
  date: z.string().datetime('Invalid date').optional(),
  published: z.boolean().default(true),
})

export const galleryImageSchema = z.object({
  albumId: z.string().min(1, 'Album ID is required'),
  imageUrl: z.string().url('Invalid image URL'),
  thumbnailUrl: z.string().url('Invalid thumbnail URL').optional().or(z.literal('')),
  caption: z.string().max(500).optional(),
  photographer: z.string().max(100).optional(),
  displayOrder: z.number().int().default(0),
})

export const announcementSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  type: z.enum(['INFO', 'EVENT', 'RECRUITMENT', 'IMPORTANT']),
  url: z.string().url('Invalid URL').optional().or(z.literal('')),
  active: z.boolean().default(true),
  startDate: z.string().datetime('Invalid start date').optional(),
  endDate: z.string().datetime('Invalid end date').optional(),
})

export const recruitmentDriveSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  open: z.boolean().default(false),
  startDate: z.string().datetime('Invalid start date').optional(),
  deadline: z.string().datetime('Invalid deadline').optional(),
  eligibleYears: z.array(z.string()).default([]),
  availableDivisions: z.array(z.enum(['LEADERSHIP', 'DESIGN', 'TECH', 'MULTIMEDIA', 'SOCIAL_MEDIA', 'MANAGEMENT'])).default([]),
})

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export const recruitmentApplicationSchema = z.object({
  driveId: z.string().min(1, 'Drive ID is required'),
  division: z.enum(['LEADERSHIP', 'DESIGN', 'TECH', 'MULTIMEDIA', 'SOCIAL_MEDIA', 'MANAGEMENT']),
  secondPreference: z.enum(['LEADERSHIP', 'DESIGN', 'TECH', 'MULTIMEDIA', 'SOCIAL_MEDIA', 'MANAGEMENT']).optional(),
  whyJoin: z.string().min(50, 'Please write at least 50 characters').max(2000),
  experience: z.string().max(2000).optional(),
  portfolioUrl: z.string().url('Invalid portfolio URL').optional().or(z.literal('')),
  githubUrl: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
  linkedinUrl: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
})

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}