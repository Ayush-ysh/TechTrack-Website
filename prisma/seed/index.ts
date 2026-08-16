import { PrismaClient, UserRole, EventStatus, EventCategory, Division, RegistrationStatus, TeamRegistrationStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL || 'postgresql://techtrack:techtrack@localhost:5432/techtrack?schema=public' })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Starting database seed...')

  // Create Club Settings
  const clubSettings = await prisma.clubSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      clubName: 'TECHTRACK',
      collegeName: 'College of Engineering',
      description: 'TechTrack is a student-driven technology community focused on experimentation, innovation, collaboration and learning beyond the classroom.',
      mission: 'Create an environment where students can explore technology, build meaningful projects, collaborate across disciplines and transform ideas into experiences.',
      vision: 'Build one of the most active and innovative student technology communities on campus.',
      foundedYear: 2024,
      email: 'hello@techtrack.college.edu',
      instagram: '@TECHTRACK',
      linkedin: 'TechTrack Community',
      github: 'techtrack',
      location: 'Tech Innovation Block, Campus Location, City, India',
      recruitmentOpen: true,
    },
  })
  console.log('✅ Club settings created')

  // Create admin user (first admin)
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@techtrack.college.edu' },
    update: {},
    create: {
      name: 'TechTrack Admin',
      email: 'admin@techtrack.college.edu',
      passwordHash: adminPassword,
      role: UserRole.SUPER_ADMIN,
      college: 'College of Engineering',
      course: 'Computer Science',
      branch: 'CSE',
      year: '2024',
    },
  })
  console.log('✅ Admin user created:', admin.email)

  // Create Leadership Team Members
  const leadershipMembers = [
    {
      name: 'PRATYUSH RANJAN BEHERA',
      slug: 'pratyush-ranjan-behera',
      role: 'Lead — TechTrack',
      division: Division.LEADERSHIP,
      bio: 'Founder and Lead of TechTrack. Passionate about building student technology communities.',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop',
      linkedin: '#',
      instagram: '#',
      github: '#',
      displayOrder: 1,
      featured: true,
      startYear: 2024,
    },
    {
      name: 'ASHUTOSH PRUSTI',
      slug: 'ashutosh-prusti',
      role: 'Co-Lead — TechTrack',
      division: Division.LEADERSHIP,
      bio: 'Co-Lead of TechTrack. Driving innovation and collaboration across all divisions.',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop',
      linkedin: '#',
      instagram: '#',
      github: '#',
      displayOrder: 2,
      featured: true,
      startYear: 2024,
    },
  ]

  for (const member of leadershipMembers) {
    await prisma.teamMember.upsert({
      where: { slug: member.slug },
      update: member,
      create: member,
    })
  }
  console.log('✅ Leadership team members created')

  // Create Design Team Members
  const designMembers = [
    {
      name: 'Elena Rodriguez',
      slug: 'elena-rodriguez',
      role: 'UI/UX Designer',
      division: Division.DESIGN,
      bio: 'Passionate about creating intuitive and beautiful user experiences.',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop',
      linkedin: '#',
      instagram: '#',
      displayOrder: 1,
      startYear: 2025,
    },
    {
      name: 'Michael Chen',
      slug: 'michael-chen',
      role: 'Graphic Designer',
      division: Division.DESIGN,
      bio: 'Visual storyteller specializing in brand identity and digital design.',
      photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000&auto=format&fit=crop',
      linkedin: '#',
      instagram: '#',
      displayOrder: 2,
      startYear: 2025,
    },
    {
      name: 'Sarah Kim',
      slug: 'sarah-kim',
      role: 'Creative Designer',
      division: Division.DESIGN,
      bio: 'Creative designer with a focus on motion graphics and interactive media.',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop',
      linkedin: '#',
      instagram: '#',
      displayOrder: 3,
      startYear: 2025,
    },
  ]

  for (const member of designMembers) {
    await prisma.teamMember.upsert({
      where: { slug: member.slug },
      update: member,
      create: member,
    })
  }
  console.log('✅ Design team members created')

  // Create Tech Team Members
  const techMembers = [
    {
      name: 'David Smith',
      slug: 'david-smith',
      role: 'Frontend Developer',
      division: Division.TECH,
      bio: 'Frontend specialist building performant and accessible web applications.',
      photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1000&auto=format&fit=crop',
      linkedin: '#',
      github: '#',
      displayOrder: 1,
      startYear: 2025,
    },
    {
      name: 'Aisha Patel',
      slug: 'aisha-patel',
      role: 'Backend Developer',
      division: Division.TECH,
      bio: 'Backend engineer designing scalable APIs and database architectures.',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop',
      linkedin: '#',
      github: '#',
      displayOrder: 2,
      startYear: 2025,
    },
    {
      name: 'James Wilson',
      slug: 'james-wilson',
      role: 'App Developer',
      division: Division.TECH,
      bio: 'Mobile developer creating cross-platform applications with React Native.',
      photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop',
      linkedin: '#',
      github: '#',
      displayOrder: 3,
      startYear: 2025,
    },
    {
      name: 'Priya Sharma',
      slug: 'priya-sharma',
      role: 'Technical Coordinator',
      division: Division.TECH,
      bio: 'Coordinating technical initiatives and mentoring junior developers.',
      photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1000&auto=format&fit=crop',
      linkedin: '#',
      github: '#',
      displayOrder: 4,
      startYear: 2025,
    },
  ]

  for (const member of techMembers) {
    await prisma.teamMember.upsert({
      where: { slug: member.slug },
      update: member,
      create: member,
    })
  }
  console.log('✅ Tech team members created')

  // Create Multimedia Team Members
  const multimediaMembers = [
    {
      name: 'Chris Evans',
      slug: 'chris-evans',
      role: 'Photographer',
      division: Division.MULTIMEDIA,
      bio: 'Capturing moments through the lens with an eye for detail.',
      photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=1000&auto=format&fit=crop',
      instagram: '#',
      displayOrder: 1,
      startYear: 2025,
    },
    {
      name: 'Emma Davis',
      slug: 'emma-davis',
      role: 'Videographer',
      division: Division.MULTIMEDIA,
      bio: 'Creating compelling video content for events and social media.',
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop',
      instagram: '#',
      displayOrder: 2,
      startYear: 2025,
    },
    {
      name: 'Tom Harris',
      slug: 'tom-harris',
      role: 'Video Editor',
      division: Division.MULTIMEDIA,
      bio: 'Editing and post-production specialist for event aftermovies.',
      photo: 'https://images.unsplash.com/photo-1552058544-e2bfd430fc48?q=80&w=1000&auto=format&fit=crop',
      instagram: '#',
      displayOrder: 3,
      startYear: 2025,
    },
  ]

  for (const member of multimediaMembers) {
    await prisma.teamMember.upsert({
      where: { slug: member.slug },
      update: member,
      create: member,
    })
  }
  console.log('✅ Multimedia team members created')

  // Create Social Media Team Members
  const socialMediaMembers = [
    {
      name: 'Lisa Wong',
      slug: 'lisa-wong',
      role: 'Social Media Manager',
      division: Division.SOCIAL_MEDIA,
      bio: 'Managing TechTrack\'s online presence and community engagement.',
      photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1000&auto=format&fit=crop',
      linkedin: '#',
      instagram: '#',
      displayOrder: 1,
      startYear: 2025,
    },
    {
      name: 'Marcus Johnson',
      slug: 'marcus-johnson',
      role: 'Content Strategist',
      division: Division.SOCIAL_MEDIA,
      bio: 'Developing content strategy and managing digital campaigns.',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop',
      linkedin: '#',
      displayOrder: 2,
      startYear: 2025,
    },
  ]

  for (const member of socialMediaMembers) {
    await prisma.teamMember.upsert({
      where: { slug: member.slug },
      update: member,
      create: member,
    })
  }
  console.log('✅ Social Media team members created')

  // Create Management Team Members
  const managementMembers = [
    {
      name: 'Rachel Green',
      slug: 'rachel-green',
      role: 'Event Coordinator',
      division: Division.MANAGEMENT,
      bio: 'Coordinating events and ensuring smooth execution.',
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1000&auto=format&fit=crop',
      linkedin: '#',
      displayOrder: 1,
      startYear: 2025,
    },
    {
      name: 'Omar Farooq',
      slug: 'omar-farooq',
      role: 'Operations',
      division: Division.MANAGEMENT,
      bio: 'Managing operations and logistics for all TechTrack activities.',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1000&auto=format&fit=crop',
      linkedin: '#',
      displayOrder: 2,
      startYear: 2025,
    },
    {
      name: 'Sophia Martinez',
      slug: 'sophia-martinez',
      role: 'Logistics',
      division: Division.MANAGEMENT,
      bio: 'Handling logistics and venue management for events.',
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop',
      linkedin: '#',
      displayOrder: 3,
      startYear: 2025,
    },
  ]

  for (const member of managementMembers) {
    await prisma.teamMember.upsert({
      where: { slug: member.slug },
      update: member,
      create: member,
    })
  }
  console.log('✅ Management team members created')

  // Create Semi Colon Ideathon Event
  const semiColonEvent = await prisma.event.upsert({
    where: { slug: 'semi-colon' },
    update: {},
    create: {
      slug: 'semi-colon',
      title: 'SEMI COLON ;',
      subtitle: 'A 24-Hour Ideathon',
      tagline: 'Where others put a full stop, we choose to continue.',
      shortDescription: 'Pause. Think. Create. Continue.',
      description: 'A 24-hour ideathon focused on solving real-world challenges through creative technology solutions. Pitch your ideas to industry leaders and turn concepts into reality.',
      category: EventCategory.IDEATHON,
      status: EventStatus.UPCOMING,
      poster: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=2070&auto=format&fit=crop',
      banner: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=2070&auto=format&fit=crop',
      startDate: new Date('2026-10-15T10:00:00'),
      endDate: new Date('2026-10-16T10:00:00'),
      registrationOpenDate: new Date('2026-09-01T00:00:00'),
      registrationDeadline: new Date('2026-10-10T23:59:59'),
      registrationUrl: '#',
      internalRegistrationEnabled: true,
      venue: 'Main Auditorium',
      room: 'Auditorium Hall',
      teamMinSize: 2,
      teamMaxSize: 4,
      participantLimit: 200,
      allowWaitlist: true,
      prize: '1st Prize: ₹50,000 | 2nd Prize: ₹25,000 | 3rd Prize: ₹10,000',
      rules: [
        'Ideas must be original and not previously submitted to other competitions.',
        'Teams must be present on campus for the entire duration.',
        'Use of open-source frameworks is allowed and encouraged.',
        'All team members must be currently enrolled students.',
        'Plagiarism will result in immediate disqualification.',
      ],
      eligibility: 'Open to all undergraduate and postgraduate students from any discipline.',
      schedule: 'Day 1: Registration, Opening Ceremony, Idea Pitching, Team Formation\nDay 2: Prototype Development, Mentoring Sessions, Final Presentations, Closing Ceremony',
      rounds: [
        { name: 'Round 01', description: 'Initial Idea Pitch (3 minutes)' },
        { name: 'Round 02', description: 'Prototype Development and Mentoring' },
        { name: 'Final Presentation', description: 'Final Demo (5 minutes + Q&A)' },
      ],
      organizer: 'TechTrack',
      contactInformation: 'For queries, contact: Alice Johnson (+91 98765 43210) or Bob Smith (+91 98765 43211)',
      featured: true,
      published: true,
      coordinators: {
        create: [
          { name: 'Alice Johnson', contact: '+91 98765 43210', role: 'Event Coordinator', order: 1 },
          { name: 'Bob Smith', contact: '+91 98765 43211', role: 'Technical Coordinator', order: 2 },
        ],
      },
      scheduleItems: {
        create: [
          { title: 'Registration & Check-in', description: 'Team registration and kit distribution', startTime: new Date('2026-10-15T09:00:00'), endTime: new Date('2026-10-15T10:00:00'), location: 'Main Auditorium Lobby', order: 1 },
          { title: 'Opening Ceremony', description: 'Welcome address and event overview', startTime: new Date('2026-10-15T10:00:00'), endTime: new Date('2026-10-15T10:30:00'), location: 'Main Auditorium', order: 2 },
          { title: 'Idea Pitching Round 1', description: 'Teams pitch their initial ideas', startTime: new Date('2026-10-15T11:00:00'), endTime: new Date('2026-10-15T13:00:00'), location: 'Main Auditorium', order: 3 },
          { title: 'Lunch Break', description: 'Networking and lunch', startTime: new Date('2026-10-15T13:00:00'), endTime: new Date('2026-10-15T14:00:00'), location: 'Cafeteria', order: 4 },
          { title: 'Prototype Development', description: 'Teams build their prototypes with mentor support', startTime: new Date('2026-10-15T14:00:00'), endTime: new Date('2026-10-16T08:00:00'), location: 'Lab 402, 403, 404', order: 5 },
          { title: 'Final Presentations', description: 'Teams present their final prototypes', startTime: new Date('2026-10-16T09:00:00'), endTime: new Date('2026-10-16T12:00:00'), location: 'Main Auditorium', order: 6 },
          { title: 'Closing Ceremony & Results', description: 'Winner announcement and prize distribution', startTime: new Date('2026-10-16T12:30:00'), endTime: new Date('2026-10-16T13:30:00'), location: 'Main Auditorium', order: 7 },
        ],
      },
    },
  })
  console.log('✅ Semi Colon event created')

  // Create Build the Web Workshop (ongoing)
  await prisma.event.upsert({
    where: { slug: 'build-the-web' },
    update: {},
    create: {
      slug: 'build-the-web',
      title: 'BUILD THE WEB',
      subtitle: 'Modern Web Development Bootcamp',
      tagline: 'Master modern web development.',
      shortDescription: 'An intensive weekend bootcamp covering Next.js, Tailwind CSS, and Framer Motion.',
      description: 'An intensive weekend bootcamp covering Next.js, Tailwind CSS, and Framer Motion. Learn to build production-ready applications.',
      category: EventCategory.WORKSHOP,
      status: EventStatus.ONGOING,
      poster: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070&auto=format&fit=crop',
      banner: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070&auto=format&fit=crop',
      startDate: new Date('2026-08-15T09:00:00'),
      endDate: new Date('2026-08-16T17:00:00'),
      registrationOpenDate: new Date('2026-08-01T00:00:00'),
      registrationDeadline: new Date('2026-08-14T23:59:59'),
      registrationUrl: '#',
      internalRegistrationEnabled: true,
      venue: 'Lab 402',
      teamMinSize: 1,
      teamMaxSize: 1,
      participantLimit: 50,
      allowWaitlist: false,
      prize: 'Certificate of Completion',
      rules: [
        'Participants must bring their own laptops.',
        'Basic knowledge of React is recommended.',
        'Attendance on both days is mandatory for certification.',
      ],
      eligibility: 'Open to all students with basic programming knowledge.',
      organizer: 'TechTrack Tech Division',
      contactInformation: 'Contact: Tech Division Coordinator',
      featured: false,
      published: true,
    },
  })
  console.log('✅ Build the Web workshop created')

  // Create Hack the Future 2025 (past)
  await prisma.event.upsert({
    where: { slug: 'hack-the-future-2025' },
    update: {},
    create: {
      slug: 'hack-the-future-2025',
      title: 'HACK THE FUTURE',
      subtitle: 'Annual Hackathon 2025',
      tagline: 'Build solutions for tomorrow.',
      shortDescription: 'Our flagship annual hackathon with 500+ participants.',
      description: 'Our flagship annual hackathon that saw over 500 participants building solutions in Web3, AI, and Sustainable Tech.',
      category: EventCategory.HACKATHON,
      status: EventStatus.COMPLETED,
      poster: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop',
      banner: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop',
      startDate: new Date('2025-02-20T09:00:00'),
      endDate: new Date('2025-02-22T18:00:00'),
      registrationOpenDate: new Date('2025-01-15T00:00:00'),
      registrationDeadline: new Date('2025-02-15T23:59:59'),
      registrationUrl: '#',
      internalRegistrationEnabled: false,
      venue: 'Campus',
      teamMinSize: 2,
      teamMaxSize: 4,
      participantLimit: 500,
      allowWaitlist: true,
      prize: '1st Prize: ₹1,00,000 | 2nd Prize: ₹50,000 | 3rd Prize: ₹25,000',
      rules: [
        'Teams of 2-4 members.',
        'Projects must be built during the hackathon.',
        'Open-source libraries allowed.',
      ],
      eligibility: 'Open to all undergraduate students.',
      organizer: 'TechTrack',
      contactInformation: 'Contact: events@techtrack.college.edu',
      featured: false,
      published: true,
    },
  })
  console.log('✅ Hack the Future 2025 created')

  // Create Design Systems Workshop (past)
  await prisma.event.upsert({
    where: { slug: 'design-systems-workshop' },
    update: {},
    create: {
      slug: 'design-systems-workshop',
      title: 'DESIGN SYSTEMS',
      subtitle: 'Bridging Design and Code',
      tagline: 'Bridging the gap between design and code.',
      shortDescription: 'Hands-on workshop on creating scalable design systems.',
      description: 'A hands-on workshop on creating scalable design systems using Figma and React.',
      category: EventCategory.WORKSHOP,
      status: EventStatus.COMPLETED,
      poster: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000&auto=format&fit=crop',
      banner: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000&auto=format&fit=crop',
      startDate: new Date('2025-11-10T10:00:00'),
      endDate: new Date('2025-11-10T14:00:00'),
      registrationOpenDate: new Date('2025-10-20T00:00:00'),
      registrationDeadline: new Date('2025-11-08T23:59:59'),
      registrationUrl: '#',
      internalRegistrationEnabled: false,
      venue: 'Design Studio',
      teamMinSize: 1,
      teamMaxSize: 1,
      participantLimit: 150,
      allowWaitlist: false,
      prize: 'Certificate of Participation',
      rules: [
        'Basic Figma knowledge required.',
        'Bring laptop with Figma installed.',
      ],
      eligibility: 'Open to all design and development students.',
      organizer: 'TechTrack Design Division',
      contactInformation: 'Contact: design@techtrack.college.edu',
      featured: false,
      published: true,
    },
  })
  console.log('✅ Design Systems workshop created')

  // Create Code Clash (past)
  await prisma.event.upsert({
    where: { slug: 'code-clash' },
    update: {},
    create: {
      slug: 'code-clash',
      title: 'CODE CLASH',
      subtitle: 'Competitive Programming Contest',
      tagline: 'Competitive programming at its finest.',
      shortDescription: 'Algorithmic programming contest with tough problems.',
      description: 'An algorithmic programming contest with tough problems and a fierce leaderboard.',
      category: EventCategory.COMPETITION,
      status: EventStatus.COMPLETED,
      poster: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop',
      banner: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop',
      startDate: new Date('2025-09-05T14:00:00'),
      endDate: new Date('2025-09-05T17:00:00'),
      registrationOpenDate: new Date('2025-08-20T00:00:00'),
      registrationDeadline: new Date('2025-09-04T23:59:59'),
      registrationUrl: '#',
      internalRegistrationEnabled: false,
      venue: 'Computer Center',
      teamMinSize: 1,
      teamMaxSize: 1,
      participantLimit: 300,
      allowWaitlist: false,
      prize: '1st Prize: ₹15,000 | 2nd Prize: ₹10,000 | 3rd Prize: ₹5,000',
      rules: [
        'Individual participation only.',
        'Standard competitive programming rules apply.',
        'Languages: C++, Java, Python.',
      ],
      eligibility: 'Open to all students.',
      organizer: 'TechTrack Tech Division',
      contactInformation: 'Contact: tech@techtrack.college.edu',
      featured: false,
      published: true,
    },
  })
  console.log('✅ Code Clash created')

  // Create Achievements
  const achievements = [
    {
      title: 'TechTrack Established',
      slug: 'techtrack-established',
      description: 'The vision began with 10 students who believed in building a technology community beyond the classroom.',
      year: 2024,
      date: new Date('2024-01-15'),
      category: 'Foundation',
      featured: true,
      published: true,
      displayOrder: 1,
    },
    {
      title: 'Conducted 20+ Events',
      slug: 'conducted-20-plus-events',
      description: 'Expanded across multiple technical domains including hackathons, workshops, ideathons, and competitions.',
      year: 2025,
      date: new Date('2025-12-31'),
      category: 'Milestone',
      featured: true,
      published: true,
      displayOrder: 2,
    },
    {
      title: '1000+ Student Participation',
      slug: '1000-plus-student-participation',
      description: 'Became the largest student club on campus with participation across all years and departments.',
      year: 2025,
      date: new Date('2025-11-15'),
      category: 'Community',
      featured: true,
      published: true,
      displayOrder: 3,
    },
    {
      title: 'Won National Hackathon',
      slug: 'won-national-hackathon',
      description: 'Our tech team secured 1st place at the National Inter-College Hackathon 2026.',
      year: 2026,
      date: new Date('2026-03-10'),
      category: 'Competition',
      featured: true,
      published: true,
      displayOrder: 4,
    },
    {
      title: 'Hosted SEMI COLON ;',
      slug: 'hosted-semi-colon',
      description: 'Organized our first ever mega-ideathon with 200+ participants and industry mentors.',
      year: 2026,
      date: new Date('2026-10-16'),
      category: 'Event',
      featured: true,
      published: true,
      displayOrder: 5,
    },
  ]

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { slug: achievement.slug },
      update: achievement,
      create: achievement,
    })
  }
  console.log('✅ Achievements created')

  // Create Gallery Albums
  const hackathonAlbum = await prisma.galleryAlbum.upsert({
    where: { slug: 'hack-the-future-2025' },
    update: {},
    create: {
      slug: 'hack-the-future-2025',
      title: 'Hack the Future 2025',
      description: 'Photos from our flagship annual hackathon with 500+ participants.',
      coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop',
      date: new Date('2025-02-20'),
      published: true,
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop', caption: 'Opening ceremony', photographer: 'Chris Evans', displayOrder: 1 },
          { imageUrl: 'https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?q=80&w=2000&auto=format&fit=crop', caption: 'Teams coding', photographer: 'Chris Evans', displayOrder: 2 },
          { imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2000&auto=format&fit=crop', caption: 'Mentor session', photographer: 'Emma Davis', displayOrder: 3 },
        ],
      },
    },
  })
  console.log('✅ Hack the Future gallery album created')

  const workshopAlbum = await prisma.galleryAlbum.upsert({
    where: { slug: 'design-systems-workshop' },
    update: {},
    create: {
      slug: 'design-systems-workshop',
      title: 'Design Systems Workshop',
      description: 'Highlights from the hands-on design systems workshop.',
      coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000&auto=format&fit=crop',
      date: new Date('2025-11-10'),
      published: true,
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000&auto=format&fit=crop', caption: 'Figma session', photographer: 'Chris Evans', displayOrder: 1 },
          { imageUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop', caption: 'Code implementation', photographer: 'Tom Harris', displayOrder: 2 },
        ],
      },
    },
  })
  console.log('✅ Design Systems gallery album created')

  const cultureAlbum = await prisma.galleryAlbum.upsert({
    where: { slug: 'techtrack-culture' },
    update: {},
    create: {
      slug: 'techtrack-culture',
      title: 'TechTrack Culture',
      description: 'Behind the scenes moments from our community.',
      coverImage: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=2070&auto=format&fit=crop',
      date: new Date('2026-01-15'),
      published: true,
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=2070&auto=format&fit=crop', caption: 'Team meeting', photographer: 'Chris Evans', displayOrder: 1 },
          { imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop', caption: 'Late night coding', photographer: 'Emma Davis', displayOrder: 2 },
          { imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070&auto=format&fit=crop', caption: 'Workshop fun', photographer: 'Tom Harris', displayOrder: 3 },
        ],
      },
    },
  })
  console.log('✅ TechTrack Culture gallery album created')

  // Create Recruitment Drive
  await prisma.recruitmentDrive.upsert({
    where: { id: 'current-recruitment' },
    update: {},
    create: {
      id: 'current-recruitment',
      title: 'TechTrack Recruitment 2026',
      description: 'Join the most active tech community on campus. We\'re looking for passionate students across all divisions.',
      open: true,
      startDate: new Date('2026-01-15'),
      deadline: new Date('2026-02-28'),
      eligibleYears: ['2027', '2028', '2029', '2030'],
      availableDivisions: [Division.DESIGN, Division.TECH, Division.MULTIMEDIA, Division.SOCIAL_MEDIA, Division.MANAGEMENT],
    },
  })
  console.log('✅ Recruitment drive created')

  // Create sample announcement
  await prisma.announcement.upsert({
    where: { id: 'announcement-1' },
    update: {},
    create: {
      id: 'announcement-1',
      title: 'SEMI COLON ; REGISTRATIONS NOW OPEN',
      message: 'Registrations for our flagship ideathon SEMI COLON ; are now open! Form your teams and register before October 10th.',
      type: 'EVENT',
      url: '/events/semi-colon/register',
      active: true,
      startDate: new Date('2026-09-01'),
      endDate: new Date('2026-10-10'),
    },
  })
  console.log('✅ Announcement created')

  console.log('🎉 Database seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })