-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('STUDENT', 'MEMBER', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('DRAFT', 'UPCOMING', 'REGISTRATION_OPEN', 'ONGOING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "EventCategory" AS ENUM ('HACKATHON', 'IDEATHON', 'WORKSHOP', 'COMPETITION', 'MEETUP', 'SEMINAR', 'OTHER');

-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'WAITLISTED', 'CANCELLED', 'REJECTED', 'ATTENDED');

-- CreateEnum
CREATE TYPE "Division" AS ENUM ('LEADERSHIP', 'DESIGN', 'TECH', 'MULTIMEDIA', 'SOCIAL_MEDIA', 'MANAGEMENT');

-- CreateEnum
CREATE TYPE "TeamRegistrationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'WAITLISTED', 'CANCELLED', 'REJECTED');

-- CreateEnum
CREATE TYPE "AnnouncementType" AS ENUM ('INFO', 'EVENT', 'RECRUITMENT', 'IMPORTANT');

-- CreateEnum
CREATE TYPE "ContactMessageStatus" AS ENUM ('NEW', 'READ', 'RESPONDED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "RecruitmentApplicationStatus" AS ENUM ('SUBMITTED', 'REVIEWING', 'SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "passwordHash" TEXT,
    "image" TEXT,
    "phone" TEXT,
    "college" TEXT,
    "course" TEXT,
    "branch" TEXT,
    "year" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'STUDENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "tagline" TEXT,
    "shortDescription" TEXT,
    "description" TEXT NOT NULL,
    "category" "EventCategory" NOT NULL,
    "status" "EventStatus" NOT NULL DEFAULT 'DRAFT',
    "poster" TEXT,
    "banner" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "registrationOpenDate" TIMESTAMP(3),
    "registrationDeadline" TIMESTAMP(3),
    "registrationUrl" TEXT,
    "internalRegistrationEnabled" BOOLEAN NOT NULL DEFAULT true,
    "venue" TEXT,
    "room" TEXT,
    "onlineUrl" TEXT,
    "teamMinSize" INTEGER DEFAULT 1,
    "teamMaxSize" INTEGER DEFAULT 1,
    "participantLimit" INTEGER,
    "allowWaitlist" BOOLEAN NOT NULL DEFAULT false,
    "prize" TEXT,
    "rules" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "eligibility" TEXT,
    "schedule" TEXT,
    "rounds" JSONB,
    "organizer" TEXT,
    "contactInformation" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "cancelledReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventCoordinator" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "role" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "EventCoordinator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventScheduleItem" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "location" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "EventScheduleItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventRegistration" (
    "id" TEXT NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "participantType" TEXT NOT NULL DEFAULT 'INDIVIDUAL',
    "teamName" TEXT,
    "status" "RegistrationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamRegistration" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "teamName" TEXT NOT NULL,
    "leaderId" TEXT NOT NULL,
    "status" "TeamRegistrationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamRegistrationMember" (
    "id" TEXT NOT NULL,
    "teamRegistrationId" TEXT NOT NULL,
    "userId" TEXT,
    "memberName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "college" TEXT,
    "role" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeamRegistrationMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "division" "Division" NOT NULL,
    "bio" TEXT,
    "photo" TEXT,
    "linkedin" TEXT,
    "instagram" TEXT,
    "github" TEXT,
    "portfolio" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "startYear" INTEGER,
    "endYear" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achievement" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "date" TIMESTAMP(3),
    "category" TEXT,
    "image" TEXT,
    "externalUrl" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GalleryAlbum" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "eventId" TEXT,
    "coverImage" TEXT,
    "date" TIMESTAMP(3),
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GalleryAlbum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GalleryImage" (
    "id" TEXT NOT NULL,
    "albumId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "caption" TEXT,
    "photographer" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GalleryImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Announcement" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "AnnouncementType" NOT NULL DEFAULT 'INFO',
    "url" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecruitmentDrive" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "open" BOOLEAN NOT NULL DEFAULT false,
    "startDate" TIMESTAMP(3),
    "deadline" TIMESTAMP(3),
    "eligibleYears" TEXT[],
    "availableDivisions" "Division"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecruitmentDrive_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecruitmentApplication" (
    "id" TEXT NOT NULL,
    "driveId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "division" "Division" NOT NULL,
    "secondPreference" "Division",
    "whyJoin" TEXT NOT NULL,
    "experience" TEXT,
    "portfolioUrl" TEXT,
    "githubUrl" TEXT,
    "linkedinUrl" TEXT,
    "status" "RecruitmentApplicationStatus" NOT NULL DEFAULT 'SUBMITTED',
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecruitmentApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" "ContactMessageStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClubSettings" (
    "id" TEXT NOT NULL,
    "clubName" TEXT NOT NULL DEFAULT 'TECHTRACK',
    "collegeName" TEXT,
    "description" TEXT,
    "mission" TEXT,
    "vision" TEXT,
    "foundedYear" INTEGER,
    "email" TEXT,
    "instagram" TEXT,
    "linkedin" TEXT,
    "github" TEXT,
    "location" TEXT,
    "recruitmentOpen" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClubSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminActivity" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminActivity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "PasswordResetToken"("token");

-- CreateIndex
CREATE INDEX "PasswordResetToken_userId_idx" ON "PasswordResetToken"("userId");

-- CreateIndex
CREATE INDEX "PasswordResetToken_token_idx" ON "PasswordResetToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Event_slug_key" ON "Event"("slug");

-- CreateIndex
CREATE INDEX "Event_slug_idx" ON "Event"("slug");

-- CreateIndex
CREATE INDEX "Event_status_idx" ON "Event"("status");

-- CreateIndex
CREATE INDEX "Event_category_idx" ON "Event"("category");

-- CreateIndex
CREATE INDEX "Event_startDate_idx" ON "Event"("startDate");

-- CreateIndex
CREATE INDEX "Event_featured_idx" ON "Event"("featured");

-- CreateIndex
CREATE INDEX "Event_published_idx" ON "Event"("published");

-- CreateIndex
CREATE INDEX "EventCoordinator_eventId_idx" ON "EventCoordinator"("eventId");

-- CreateIndex
CREATE INDEX "EventScheduleItem_eventId_idx" ON "EventScheduleItem"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "EventRegistration_registrationNumber_key" ON "EventRegistration"("registrationNumber");

-- CreateIndex
CREATE INDEX "EventRegistration_eventId_idx" ON "EventRegistration"("eventId");

-- CreateIndex
CREATE INDEX "EventRegistration_userId_idx" ON "EventRegistration"("userId");

-- CreateIndex
CREATE INDEX "EventRegistration_registrationNumber_idx" ON "EventRegistration"("registrationNumber");

-- CreateIndex
CREATE INDEX "EventRegistration_status_idx" ON "EventRegistration"("status");

-- CreateIndex
CREATE UNIQUE INDEX "EventRegistration_eventId_userId_key" ON "EventRegistration"("eventId", "userId");

-- CreateIndex
CREATE INDEX "TeamRegistration_eventId_idx" ON "TeamRegistration"("eventId");

-- CreateIndex
CREATE INDEX "TeamRegistration_leaderId_idx" ON "TeamRegistration"("leaderId");

-- CreateIndex
CREATE INDEX "TeamRegistration_status_idx" ON "TeamRegistration"("status");

-- CreateIndex
CREATE INDEX "TeamRegistrationMember_teamRegistrationId_idx" ON "TeamRegistrationMember"("teamRegistrationId");

-- CreateIndex
CREATE INDEX "TeamRegistrationMember_userId_idx" ON "TeamRegistrationMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TeamMember_slug_key" ON "TeamMember"("slug");

-- CreateIndex
CREATE INDEX "TeamMember_division_idx" ON "TeamMember"("division");

-- CreateIndex
CREATE INDEX "TeamMember_slug_idx" ON "TeamMember"("slug");

-- CreateIndex
CREATE INDEX "TeamMember_active_idx" ON "TeamMember"("active");

-- CreateIndex
CREATE INDEX "TeamMember_displayOrder_idx" ON "TeamMember"("displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Achievement_slug_key" ON "Achievement"("slug");

-- CreateIndex
CREATE INDEX "Achievement_year_idx" ON "Achievement"("year");

-- CreateIndex
CREATE INDEX "Achievement_slug_idx" ON "Achievement"("slug");

-- CreateIndex
CREATE INDEX "Achievement_published_idx" ON "Achievement"("published");

-- CreateIndex
CREATE INDEX "Achievement_displayOrder_idx" ON "Achievement"("displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "GalleryAlbum_slug_key" ON "GalleryAlbum"("slug");

-- CreateIndex
CREATE INDEX "GalleryAlbum_slug_idx" ON "GalleryAlbum"("slug");

-- CreateIndex
CREATE INDEX "GalleryAlbum_eventId_idx" ON "GalleryAlbum"("eventId");

-- CreateIndex
CREATE INDEX "GalleryAlbum_published_idx" ON "GalleryAlbum"("published");

-- CreateIndex
CREATE INDEX "GalleryImage_albumId_idx" ON "GalleryImage"("albumId");

-- CreateIndex
CREATE INDEX "GalleryImage_displayOrder_idx" ON "GalleryImage"("displayOrder");

-- CreateIndex
CREATE INDEX "Announcement_active_idx" ON "Announcement"("active");

-- CreateIndex
CREATE INDEX "Announcement_type_idx" ON "Announcement"("type");

-- CreateIndex
CREATE INDEX "Announcement_startDate_idx" ON "Announcement"("startDate");

-- CreateIndex
CREATE INDEX "RecruitmentDrive_open_idx" ON "RecruitmentDrive"("open");

-- CreateIndex
CREATE INDEX "RecruitmentApplication_driveId_idx" ON "RecruitmentApplication"("driveId");

-- CreateIndex
CREATE INDEX "RecruitmentApplication_userId_idx" ON "RecruitmentApplication"("userId");

-- CreateIndex
CREATE INDEX "RecruitmentApplication_status_idx" ON "RecruitmentApplication"("status");

-- CreateIndex
CREATE INDEX "RecruitmentApplication_division_idx" ON "RecruitmentApplication"("division");

-- CreateIndex
CREATE UNIQUE INDEX "RecruitmentApplication_driveId_userId_key" ON "RecruitmentApplication"("driveId", "userId");

-- CreateIndex
CREATE INDEX "ContactMessage_status_idx" ON "ContactMessage"("status");

-- CreateIndex
CREATE INDEX "ContactMessage_createdAt_idx" ON "ContactMessage"("createdAt");

-- CreateIndex
CREATE INDEX "AdminActivity_adminId_idx" ON "AdminActivity"("adminId");

-- CreateIndex
CREATE INDEX "AdminActivity_targetType_targetId_idx" ON "AdminActivity"("targetType", "targetId");

-- CreateIndex
CREATE INDEX "AdminActivity_createdAt_idx" ON "AdminActivity"("createdAt");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventCoordinator" ADD CONSTRAINT "EventCoordinator_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventScheduleItem" ADD CONSTRAINT "EventScheduleItem_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRegistration" ADD CONSTRAINT "EventRegistration_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRegistration" ADD CONSTRAINT "EventRegistration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamRegistration" ADD CONSTRAINT "TeamRegistration_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamRegistration" ADD CONSTRAINT "TeamRegistration_leaderId_fkey" FOREIGN KEY ("leaderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamRegistrationMember" ADD CONSTRAINT "TeamRegistrationMember_teamRegistration_fkey" FOREIGN KEY ("teamRegistrationId") REFERENCES "TeamRegistration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamRegistrationMember" ADD CONSTRAINT "TeamRegistrationMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamRegistrationMember" ADD CONSTRAINT "TeamRegistrationMember_eventRegistration_fkey" FOREIGN KEY ("teamRegistrationId") REFERENCES "EventRegistration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GalleryAlbum" ADD CONSTRAINT "GalleryAlbum_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GalleryImage" ADD CONSTRAINT "GalleryImage_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "GalleryAlbum"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecruitmentApplication" ADD CONSTRAINT "RecruitmentApplication_driveId_fkey" FOREIGN KEY ("driveId") REFERENCES "RecruitmentDrive"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecruitmentApplication" ADD CONSTRAINT "RecruitmentApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminActivity" ADD CONSTRAINT "AdminActivity_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
