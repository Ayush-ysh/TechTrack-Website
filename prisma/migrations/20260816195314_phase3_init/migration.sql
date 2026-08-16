-- CreateEnum
CREATE TYPE "ClubMemberStatus" AS ENUM ('PENDING_ONBOARDING', 'ACTIVE', 'ON_LEAVE', 'ALUMNI', 'INACTIVE', 'REMOVED');

-- CreateEnum
CREATE TYPE "MemberRole" AS ENUM ('TECHTRACK_LEAD', 'TECHTRACK_CO_LEAD', 'DEPARTMENT_LEAD', 'DEPARTMENT_COORDINATOR', 'MEMBER', 'TRAINEE', 'EVENT_COORDINATOR');

-- CreateEnum
CREATE TYPE "DepartmentVisibility" AS ENUM ('PUBLIC', 'MEMBERS_ONLY', 'LEADERSHIP_ONLY');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('IDEA', 'PLANNING', 'ACTIVE', 'BLOCKED', 'ON_HOLD', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ProjectVisibility" AS ENUM ('CLUB', 'DEPARTMENT', 'PRIVATE_TEAM', 'PUBLIC');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('BACKLOG', 'TODO', 'IN_PROGRESS', 'REVIEW', 'BLOCKED', 'DONE');

-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "MeetingType" AS ENUM ('GENERAL', 'DEPARTMENT', 'PROJECT', 'LEADERSHIP', 'EVENT', 'TRAINING', 'OTHER');

-- CreateEnum
CREATE TYPE "MeetingAttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'LATE', 'EXCUSED', 'NOT_MARKED');

-- CreateEnum
CREATE TYPE "RecruitmentPipelineStatus" AS ENUM ('SUBMITTED', 'SCREENING', 'SHORTLISTED', 'TASK_ASSIGNED', 'TASK_SUBMITTED', 'INTERVIEW', 'SELECTED', 'WAITLISTED', 'REJECTED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "RecruitmentRecommendation" AS ENUM ('STRONG_YES', 'YES', 'MAYBE', 'NO', 'STRONG_NO');

-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'CHANGES_REQUESTED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('DOCUMENT', 'LINK', 'TEMPLATE', 'GUIDE', 'BRAND_ASSET', 'CODE', 'DESIGN', 'VIDEO', 'POLICY', 'OTHER');

-- CreateEnum
CREATE TYPE "ResourceVisibility" AS ENUM ('CLUB', 'DEPARTMENT', 'LEADERSHIP', 'SPECIFIC_PROJECT');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('TASK_ASSIGNED', 'TASK_DUE', 'MEETING_SCHEDULED', 'MEETING_CHANGED', 'PROJECT_ADDED', 'ANNOUNCEMENT', 'RECRUITMENT_REVIEW_ASSIGNED', 'APPROVAL_REQUESTED', 'APPROVAL_COMPLETED', 'MEMBER_ONBOARDED');

-- DropIndex
DROP INDEX "Announcement_type_idx";

-- DropIndex
DROP INDEX "ContactMessage_status_idx";

-- DropIndex
DROP INDEX "Event_category_idx";

-- DropIndex
DROP INDEX "Event_status_idx";

-- DropIndex
DROP INDEX "EventRegistration_status_idx";

-- DropIndex
DROP INDEX "RecruitmentApplication_division_idx";

-- DropIndex
DROP INDEX "RecruitmentApplication_status_idx";

-- DropIndex
DROP INDEX "TeamMember_division_idx";

-- DropIndex
DROP INDEX "TeamRegistration_status_idx";

-- DropIndex
DROP INDEX "User_role_idx";

-- AlterTable
ALTER TABLE "RecruitmentApplication" ADD COLUMN     "pipelineStatus" "RecruitmentPipelineStatus" NOT NULL DEFAULT 'SUBMITTED';

-- CreateTable
CREATE TABLE "EventOrganizerAssignment" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventOrganizerAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "image" TEXT,
    "colorAccent" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClubMember" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "divisionId" TEXT NOT NULL,
    "primaryRole" "MemberRole" NOT NULL,
    "secondaryRole" "MemberRole",
    "membershipStatus" "ClubMemberStatus" NOT NULL DEFAULT 'PENDING_ONBOARDING',
    "joinDate" TIMESTAMP(3),
    "exitDate" TIMESTAMP(3),
    "academicYear" TEXT,
    "college" TEXT,
    "course" TEXT,
    "branch" TEXT,
    "year" TEXT,
    "bio" TEXT,
    "image" TEXT,
    "linkedin" TEXT,
    "github" TEXT,
    "instagram" TEXT,
    "portfolio" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "publicProfile" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClubMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "status" "ProjectStatus" NOT NULL DEFAULT 'IDEA',
    "priority" "TaskPriority" NOT NULL DEFAULT 'MEDIUM',
    "departmentId" TEXT,
    "ownerId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3),
    "targetDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "coverImage" TEXT,
    "repositoryUrl" TEXT,
    "demoUrl" TEXT,
    "designUrl" TEXT,
    "documentationUrl" TEXT,
    "visibility" "ProjectVisibility" NOT NULL DEFAULT 'CLUB',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectMember" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leftAt" TIMESTAMP(3),

    CONSTRAINT "ProjectMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "projectId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "TaskStatus" NOT NULL DEFAULT 'BACKLOG',
    "priority" "TaskPriority" NOT NULL DEFAULT 'MEDIUM',
    "assigneeId" TEXT,
    "assignedById" TEXT,
    "departmentId" TEXT,
    "dueDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskComment" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaskComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClubMeeting" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "departmentId" TEXT,
    "projectId" TEXT,
    "organizerId" TEXT NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3),
    "venue" TEXT,
    "meetingUrl" TEXT,
    "type" "MeetingType" NOT NULL DEFAULT 'GENERAL',
    "attendanceRequired" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClubMeeting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeetingAttendance" (
    "id" TEXT NOT NULL,
    "meetingId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "status" "MeetingAttendanceStatus" NOT NULL DEFAULT 'NOT_MARKED',
    "checkedAt" TIMESTAMP(3),
    "markedBy" TEXT,
    "note" TEXT,

    CONSTRAINT "MeetingAttendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InternalAnnouncement" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "AnnouncementType" NOT NULL DEFAULT 'INFO',
    "url" TEXT,
    "target" TEXT NOT NULL,
    "targetId" TEXT,
    "departmentId" TEXT,
    "projectId" TEXT,
    "authorId" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InternalAnnouncement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClubResource" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" "ResourceType" NOT NULL,
    "departmentId" TEXT,
    "projectId" TEXT,
    "url" TEXT,
    "fileUrl" TEXT,
    "visibility" "ResourceVisibility" NOT NULL DEFAULT 'CLUB',
    "uploadedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClubResource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecruitmentReview" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "score" INTEGER,
    "recommendation" "RecruitmentRecommendation",
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecruitmentReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterviewSession" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3),
    "venue" TEXT,
    "meetingUrl" TEXT,
    "interviewerId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "score" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InterviewSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Approval" (
    "id" TEXT NOT NULL,
    "requesterId" TEXT NOT NULL,
    "deciderId" TEXT,
    "resourceType" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "status" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Approval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "url" TEXT,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemberOnboarding" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "step" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MemberOnboarding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClubExpense" (
    "id" TEXT NOT NULL,
    "projectId" TEXT,
    "eventId" TEXT,
    "submittedById" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "estimatedCost" DECIMAL(10,2),
    "actualCost" DECIMAL(10,2),
    "receiptUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "approvedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClubExpense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemberAvailability" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "note" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MemberAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EventOrganizerAssignment_eventId_idx" ON "EventOrganizerAssignment"("eventId");

-- CreateIndex
CREATE INDEX "EventOrganizerAssignment_memberId_idx" ON "EventOrganizerAssignment"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "EventOrganizerAssignment_eventId_memberId_role_key" ON "EventOrganizerAssignment"("eventId", "memberId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "Department_slug_key" ON "Department"("slug");

-- CreateIndex
CREATE INDEX "Department_slug_idx" ON "Department"("slug");

-- CreateIndex
CREATE INDEX "Department_active_idx" ON "Department"("active");

-- CreateIndex
CREATE INDEX "Department_displayOrder_idx" ON "Department"("displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "ClubMember_userId_key" ON "ClubMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ClubMember_slug_key" ON "ClubMember"("slug");

-- CreateIndex
CREATE INDEX "ClubMember_divisionId_idx" ON "ClubMember"("divisionId");

-- CreateIndex
CREATE INDEX "ClubMember_slug_idx" ON "ClubMember"("slug");

-- CreateIndex
CREATE INDEX "ClubMember_membershipStatus_idx" ON "ClubMember"("membershipStatus");

-- CreateIndex
CREATE INDEX "ClubMember_primaryRole_idx" ON "ClubMember"("primaryRole");

-- CreateIndex
CREATE INDEX "ClubMember_userId_idx" ON "ClubMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- CreateIndex
CREATE INDEX "Project_slug_idx" ON "Project"("slug");

-- CreateIndex
CREATE INDEX "Project_departmentId_idx" ON "Project"("departmentId");

-- CreateIndex
CREATE INDEX "Project_ownerId_idx" ON "Project"("ownerId");

-- CreateIndex
CREATE INDEX "Project_visibility_idx" ON "Project"("visibility");

-- CreateIndex
CREATE INDEX "ProjectMember_projectId_idx" ON "ProjectMember"("projectId");

-- CreateIndex
CREATE INDEX "ProjectMember_memberId_idx" ON "ProjectMember"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectMember_projectId_memberId_key" ON "ProjectMember"("projectId", "memberId");

-- CreateIndex
CREATE INDEX "Task_projectId_idx" ON "Task"("projectId");

-- CreateIndex
CREATE INDEX "Task_assigneeId_idx" ON "Task"("assigneeId");

-- CreateIndex
CREATE INDEX "Task_departmentId_idx" ON "Task"("departmentId");

-- CreateIndex
CREATE INDEX "Task_dueDate_idx" ON "Task"("dueDate");

-- CreateIndex
CREATE INDEX "TaskComment_taskId_idx" ON "TaskComment"("taskId");

-- CreateIndex
CREATE INDEX "TaskComment_authorId_idx" ON "TaskComment"("authorId");

-- CreateIndex
CREATE INDEX "ClubMeeting_departmentId_idx" ON "ClubMeeting"("departmentId");

-- CreateIndex
CREATE INDEX "ClubMeeting_projectId_idx" ON "ClubMeeting"("projectId");

-- CreateIndex
CREATE INDEX "ClubMeeting_organizerId_idx" ON "ClubMeeting"("organizerId");

-- CreateIndex
CREATE INDEX "ClubMeeting_startAt_idx" ON "ClubMeeting"("startAt");

-- CreateIndex
CREATE INDEX "ClubMeeting_type_idx" ON "ClubMeeting"("type");

-- CreateIndex
CREATE INDEX "MeetingAttendance_meetingId_idx" ON "MeetingAttendance"("meetingId");

-- CreateIndex
CREATE INDEX "MeetingAttendance_memberId_idx" ON "MeetingAttendance"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "MeetingAttendance_meetingId_memberId_key" ON "MeetingAttendance"("meetingId", "memberId");

-- CreateIndex
CREATE INDEX "InternalAnnouncement_active_idx" ON "InternalAnnouncement"("active");

-- CreateIndex
CREATE INDEX "InternalAnnouncement_target_idx" ON "InternalAnnouncement"("target");

-- CreateIndex
CREATE INDEX "InternalAnnouncement_departmentId_idx" ON "InternalAnnouncement"("departmentId");

-- CreateIndex
CREATE INDEX "InternalAnnouncement_createdAt_idx" ON "InternalAnnouncement"("createdAt");

-- CreateIndex
CREATE INDEX "ClubResource_category_idx" ON "ClubResource"("category");

-- CreateIndex
CREATE INDEX "ClubResource_departmentId_idx" ON "ClubResource"("departmentId");

-- CreateIndex
CREATE INDEX "ClubResource_visibility_idx" ON "ClubResource"("visibility");

-- CreateIndex
CREATE INDEX "ClubResource_uploadedById_idx" ON "ClubResource"("uploadedById");

-- CreateIndex
CREATE INDEX "ClubResource_createdAt_idx" ON "ClubResource"("createdAt");

-- CreateIndex
CREATE INDEX "RecruitmentReview_applicationId_idx" ON "RecruitmentReview"("applicationId");

-- CreateIndex
CREATE INDEX "RecruitmentReview_reviewerId_idx" ON "RecruitmentReview"("reviewerId");

-- CreateIndex
CREATE INDEX "InterviewSession_applicationId_idx" ON "InterviewSession"("applicationId");

-- CreateIndex
CREATE INDEX "InterviewSession_interviewerId_idx" ON "InterviewSession"("interviewerId");

-- CreateIndex
CREATE INDEX "InterviewSession_scheduledAt_idx" ON "InterviewSession"("scheduledAt");

-- CreateIndex
CREATE INDEX "Approval_requesterId_idx" ON "Approval"("requesterId");

-- CreateIndex
CREATE INDEX "Approval_deciderId_idx" ON "Approval"("deciderId");

-- CreateIndex
CREATE INDEX "Approval_resourceType_resourceId_idx" ON "Approval"("resourceType", "resourceId");

-- CreateIndex
CREATE INDEX "Approval_status_idx" ON "Approval"("status");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_readAt_idx" ON "Notification"("readAt");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- CreateIndex
CREATE INDEX "MemberOnboarding_memberId_idx" ON "MemberOnboarding"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "MemberOnboarding_memberId_step_key" ON "MemberOnboarding"("memberId", "step");

-- CreateIndex
CREATE INDEX "ClubExpense_projectId_idx" ON "ClubExpense"("projectId");

-- CreateIndex
CREATE INDEX "ClubExpense_eventId_idx" ON "ClubExpense"("eventId");

-- CreateIndex
CREATE INDEX "ClubExpense_submittedById_idx" ON "ClubExpense"("submittedById");

-- CreateIndex
CREATE INDEX "ClubExpense_status_idx" ON "ClubExpense"("status");

-- CreateIndex
CREATE INDEX "MemberAvailability_memberId_idx" ON "MemberAvailability"("memberId");

-- AddForeignKey
ALTER TABLE "EventOrganizerAssignment" ADD CONSTRAINT "EventOrganizerAssignment_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventOrganizerAssignment" ADD CONSTRAINT "EventOrganizerAssignment_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "ClubMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubMember" ADD CONSTRAINT "ClubMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubMember" ADD CONSTRAINT "ClubMember_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "ClubMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectMember" ADD CONSTRAINT "ProjectMember_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectMember" ADD CONSTRAINT "ProjectMember_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "ClubMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "ClubMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "ClubMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskComment" ADD CONSTRAINT "TaskComment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskComment" ADD CONSTRAINT "TaskComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "ClubMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubMeeting" ADD CONSTRAINT "ClubMeeting_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubMeeting" ADD CONSTRAINT "ClubMeeting_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubMeeting" ADD CONSTRAINT "ClubMeeting_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "ClubMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetingAttendance" ADD CONSTRAINT "MeetingAttendance_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "ClubMeeting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetingAttendance" ADD CONSTRAINT "MeetingAttendance_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "ClubMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternalAnnouncement" ADD CONSTRAINT "InternalAnnouncement_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternalAnnouncement" ADD CONSTRAINT "InternalAnnouncement_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternalAnnouncement" ADD CONSTRAINT "InternalAnnouncement_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "ClubMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubResource" ADD CONSTRAINT "ClubResource_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubResource" ADD CONSTRAINT "ClubResource_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubResource" ADD CONSTRAINT "ClubResource_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "ClubMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecruitmentReview" ADD CONSTRAINT "RecruitmentReview_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "RecruitmentApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecruitmentReview" ADD CONSTRAINT "RecruitmentReview_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "ClubMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewSession" ADD CONSTRAINT "InterviewSession_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "RecruitmentApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewSession" ADD CONSTRAINT "InterviewSession_interviewerId_fkey" FOREIGN KEY ("interviewerId") REFERENCES "ClubMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Approval" ADD CONSTRAINT "Approval_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "ClubMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Approval" ADD CONSTRAINT "Approval_deciderId_fkey" FOREIGN KEY ("deciderId") REFERENCES "ClubMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "ClubMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubExpense" ADD CONSTRAINT "ClubExpense_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubExpense" ADD CONSTRAINT "ClubExpense_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubExpense" ADD CONSTRAINT "ClubExpense_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "ClubMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubExpense" ADD CONSTRAINT "ClubExpense_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "ClubMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberAvailability" ADD CONSTRAINT "MemberAvailability_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "ClubMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;
