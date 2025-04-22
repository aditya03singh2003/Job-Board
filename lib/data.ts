import { sql } from "./db"
import type { Job } from "./types"

// Mock data for when the database is not yet initialized
const mockJobs: Job[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "TechCorp",
    companyId: "1",
    location: "Mumbai, India",
    type: "Full-time",
    salary: "₹15,00,000 - ₹25,00,000",
    description: "<p>We are looking for a Senior Frontend Developer to join our team...</p>",
    requirements: [
      "5+ years of experience with React",
      "Strong TypeScript skills",
      "Experience with state management libraries",
      "Understanding of web accessibility standards",
    ],
    responsibilities: [
      "Develop new user-facing features",
      "Build reusable components and libraries",
      "Optimize applications for maximum speed and scalability",
      "Collaborate with backend developers and designers",
    ],
    tags: ["React", "TypeScript", "Frontend", "Senior"],
    postedAt: "2 days ago",
    companyDescription: "TechCorp is a leading technology company specializing in web applications.",
  },
  {
    id: "2",
    title: "Backend Engineer",
    company: "DataSystems",
    companyId: "2",
    location: "Remote",
    type: "Full-time",
    salary: "₹12,00,000 - ₹20,00,000",
    description: "<p>Join our backend team to build scalable APIs and services...</p>",
    requirements: [
      "3+ years of experience with Node.js",
      "Experience with PostgreSQL or similar databases",
      "Knowledge of RESTful API design",
      "Understanding of microservices architecture",
    ],
    responsibilities: [
      "Design and implement APIs",
      "Optimize database queries",
      "Implement security and data protection measures",
      "Write unit and integration tests",
    ],
    tags: ["Node.js", "PostgreSQL", "API", "Backend"],
    postedAt: "1 week ago",
    companyDescription: "DataSystems provides data management solutions for enterprise clients.",
  },
  {
    id: "3",
    title: "UX/UI Designer",
    company: "CreativeMinds",
    companyId: "3",
    location: "Bangalore, India",
    type: "Full-time",
    salary: "₹10,00,000 - ₹18,00,000",
    description: "<p>We're seeking a talented UX/UI Designer to create amazing user experiences...</p>",
    requirements: [
      "3+ years of experience in UX/UI design",
      "Proficiency with design tools like Figma",
      "Portfolio demonstrating UI design skills",
      "Experience with user research and testing",
    ],
    responsibilities: [
      "Create wireframes, prototypes, and user flows",
      "Conduct user research and usability testing",
      "Collaborate with developers to implement designs",
      "Maintain design system and documentation",
    ],
    tags: ["UX", "UI", "Figma", "Design"],
    postedAt: "3 days ago",
    companyDescription: "CreativeMinds is a design agency focused on creating beautiful digital experiences.",
  },
]

// Get featured jobs from the database
export async function getFeaturedJobs(): Promise<Job[]> {
  try {
    // Check if the jobs table exists
    try {
      const result = await sql`
        SELECT 
          j.id, 
          j.title, 
          j.company_name as company, 
          j.company_id as "companyId", 
          j.location, 
          j.type, 
          j.salary, 
          j.description, 
          j.requirements, 
          j.responsibilities, 
          j.tags,
          j.created_at
        FROM jobs j
        WHERE j.is_active = true
        ORDER BY j.created_at DESC
        LIMIT 3
      `

      return result.map((job) => ({
        ...job,
        postedAt: formatDate(job.created_at),
        companyDescription: "A leading company in its industry.", // Default description
      }))
    } catch (error: any) {
      // If the table doesn't exist, initialize the database
      if (error.message && error.message.includes('relation "jobs" does not exist')) {
        console.log("Jobs table doesn't exist, initializing database...")
        try {
          // Call the init-db API route to set up the database
          const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ""}/api/init-db`, {
            method: "GET",
            cache: "no-store",
          })

          if (!response.ok) {
            throw new Error("Failed to initialize database")
          }

          // Try again after initialization
          const retryResult = await sql`
            SELECT 
              j.id, 
              j.title, 
              j.company_name as company, 
              j.company_id as "companyId", 
              j.location, 
              j.type, 
              j.salary, 
              j.description, 
              j.requirements, 
              j.responsibilities, 
              j.tags,
              j.created_at
            FROM jobs j
            WHERE j.is_active = true
            ORDER BY j.created_at DESC
            LIMIT 3
          `

          if (retryResult.length > 0) {
            return retryResult.map((job) => ({
              ...job,
              postedAt: formatDate(job.created_at),
              companyDescription: "A leading company in its industry.", // Default description
            }))
          }
        } catch (initError) {
          console.error("Error initializing database:", initError)
        }

        // If all else fails, return mock data
        return mockJobs.slice(0, 3)
      }

      // For other errors, throw them
      throw error
    }
  } catch (error) {
    console.error("Error fetching featured jobs:", error)
    return mockJobs.slice(0, 3)
  }
}

// Get all jobs from the database
export async function getAllJobs(): Promise<Job[]> {
  try {
    const result = await sql`
      SELECT 
        j.id, 
        j.title, 
        j.company_name as company, 
        j.company_id as "companyId", 
        j.location, 
        j.type, 
        j.salary, 
        j.description, 
        j.requirements, 
        j.responsibilities, 
        j.tags,
        j.created_at
      FROM jobs j
      WHERE j.is_active = true
      ORDER BY j.created_at DESC
    `

    return result.map((job) => ({
      ...job,
      postedAt: formatDate(job.created_at),
      companyDescription: "A leading company in its industry.", // Default description
    }))
  } catch (error: any) {
    console.error("Error fetching all jobs:", error)

    // If the table doesn't exist, return mock data
    if (error.message && error.message.includes('relation "jobs" does not exist')) {
      return mockJobs
    }

    return []
  }
}

// Get a job by ID
export async function getJobById(id: string): Promise<Job | null> {
  try {
    const result = await sql`
      SELECT 
        j.id, 
        j.title, 
        j.company_name as company, 
        j.company_id as "companyId", 
        j.location, 
        j.type, 
        j.salary, 
        j.description, 
        j.requirements, 
        j.responsibilities, 
        j.tags,
        j.created_at
      FROM jobs j
      WHERE j.id = ${id} AND j.is_active = true
    `

    if (result.length === 0) {
      return null
    }

    const job = result[0]
    return {
      ...job,
      postedAt: formatDate(job.created_at),
      companyDescription: "A leading company in its industry.", // Default description
    }
  } catch (error: any) {
    console.error(`Error fetching job with ID ${id}:`, error)

    // If the table doesn't exist, return mock data
    if (error.message && error.message.includes('relation "jobs" does not exist')) {
      return mockJobs.find((job) => job.id === id) || null
    }

    return null
  }
}

// Helper function to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return "Today"
  } else if (diffDays === 1) {
    return "Yesterday"
  } else if (diffDays < 7) {
    return `${diffDays} days ago`
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`
  } else {
    const months = Math.floor(diffDays / 30)
    return `${months} ${months === 1 ? "month" : "months"} ago`
  }
}

// Mock data for employer dashboard
export async function getEmployerDashboardData(employerId: string) {
  try {
    // In a real application, you would fetch this data from your database
    // For this example, we'll use mock data

    // Mock jobs data
    const jobs = [
      {
        id: "job-1",
        title: "Frontend Developer",
        location: "Remote",
        type: "Full-time",
        postedAt: "2023-05-15",
        applicationsCount: 12,
        viewsCount: 245,
        isActive: true,
      },
      {
        id: "job-2",
        title: "Backend Engineer",
        location: "New York, NY",
        type: "Full-time",
        postedAt: "2023-05-10",
        applicationsCount: 8,
        viewsCount: 180,
        isActive: true,
      },
      {
        id: "job-3",
        title: "UX Designer",
        location: "San Francisco, CA",
        type: "Contract",
        postedAt: "2023-05-05",
        applicationsCount: 5,
        viewsCount: 120,
        isActive: false,
      },
    ]

    // Mock applications data
    const applications = [
      {
        id: "app-1",
        jobId: "job-1",
        jobTitle: "Frontend Developer",
        applicantName: "John Doe",
        applicantEmail: "john.doe@example.com",
        status: "pending",
        appliedAt: "2023-05-16",
      },
      {
        id: "app-2",
        jobId: "job-1",
        jobTitle: "Frontend Developer",
        applicantName: "Jane Smith",
        applicantEmail: "jane.smith@example.com",
        status: "reviewing",
        appliedAt: "2023-05-17",
      },
      {
        id: "app-3",
        jobId: "job-2",
        jobTitle: "Backend Engineer",
        applicantName: "Bob Johnson",
        applicantEmail: "bob.johnson@example.com",
        status: "interview",
        appliedAt: "2023-05-12",
      },
    ]

    // Calculate stats
    const stats = {
      activeJobs: jobs.filter((job) => job.isActive).length,
      totalApplications: applications.length,
      totalViews: jobs.reduce((sum, job) => sum + job.viewsCount, 0),
    }

    return { jobs, applications, stats }
  } catch (error) {
    console.error("Error fetching employer dashboard data:", error)
    return { jobs: [], applications: [], stats: { activeJobs: 0, totalApplications: 0, totalViews: 0 } }
  }
}

// Mock data for job seeker dashboard
export async function getJobSeekerDashboardData() {
  return {
    totalApplications: 8,
    savedJobs: 12,
    profileViews: 45,
    profileViewsChange: 15,
    interviews: 2,
    pendingApplications: 4,
    inReviewApplications: 2,
    interviewApplications: 2,
    rejectedApplications: 0,
    recommendedJobs: [
      {
        id: "7",
        title: "Frontend Developer",
        company: "WebTech",
        location: "Remote",
      },
      {
        id: "8",
        title: "React Developer",
        company: "AppWorks",
        location: "Pune, India",
      },
      {
        id: "9",
        title: "JavaScript Engineer",
        company: "CodeCraft",
        location: "Remote",
      },
    ],
    applications: [
      {
        id: "1",
        jobId: "1",
        jobTitle: "Senior Frontend Developer",
        company: "TechCorp",
        status: "interview",
        appliedAt: "2023-04-10",
      },
      {
        id: "2",
        jobId: "2",
        jobTitle: "Backend Engineer",
        company: "DataSystems",
        status: "reviewing",
        appliedAt: "2023-04-12",
      },
      {
        id: "3",
        jobId: "4",
        jobTitle: "DevOps Engineer",
        company: "CloudTech",
        status: "pending",
        appliedAt: "2023-04-15",
      },
      {
        id: "4",
        jobId: "6",
        jobTitle: "Product Manager",
        company: "InnovateCo",
        status: "interview",
        appliedAt: "2023-04-08",
      },
      {
        id: "5",
        jobId: "10",
        jobTitle: "Full Stack Developer",
        company: "TechStart",
        status: "pending",
        appliedAt: "2023-04-18",
      },
    ],
    savedJobsList: [
      {
        id: "1",
        jobId: "3",
        job: {
          id: "3",
          title: "UX/UI Designer",
          company: "CreativeMinds",
          location: "Bangalore, India",
          type: "Full-time",
          salary: "₹12,00,000 - ₹18,00,000",
          tags: ["UX", "UI", "Figma", "Design"],
          postedAt: "3 days ago",
        },
        savedAt: "2023-04-16",
      },
      {
        id: "2",
        jobId: "5",
        job: {
          id: "5",
          title: "Data Scientist",
          company: "AnalyticsPro",
          location: "Remote",
          type: "Full-time",
          salary: "₹15,00,000 - ₹22,00,000",
          tags: ["Data Science", "Python", "Machine Learning", "Analytics"],
          postedAt: "1 week ago",
        },
        savedAt: "2023-04-17",
      },
      {
        id: "3",
        jobId: "11",
        job: {
          id: "11",
          title: "Mobile Developer",
          company: "AppInnovate",
          location: "Chennai, India",
          type: "Full-time",
          salary: "₹10,00,000 - ₹16,00,000",
          tags: ["React Native", "Mobile", "JavaScript"],
          postedAt: "5 days ago",
        },
        savedAt: "2023-04-18",
      },
    ],
  }
}

// Mock data for admin dashboard
export async function getAdminDashboardData() {
  return {
    totalUsers: 1245,
    newUsers: 87,
    activeJobs: 342,
    newJobs: 56,
    totalCompanies: 128,
    newCompanies: 12,
    totalApplications: 2876,
    newApplications: 198,
    users: [
      {
        id: "1",
        name: "John Smith",
        email: "john@example.com",
        role: "jobseeker",
        status: "active",
        createdAt: "2023-03-15",
      },
      {
        id: "2",
        name: "Sarah Johnson",
        email: "sarah@example.com",
        role: "jobseeker",
        status: "active",
        createdAt: "2023-03-18",
      },
      {
        id: "3",
        name: "TechCorp",
        email: "hr@techcorp.com",
        role: "employer",
        status: "active",
        createdAt: "2023-02-10",
      },
      {
        id: "4",
        name: "DataSystems",
        email: "careers@datasystems.com",
        role: "employer",
        status: "active",
        createdAt: "2023-02-15",
      },
      {
        id: "5",
        name: "Michael Brown",
        email: "michael@example.com",
        role: "jobseeker",
        status: "inactive",
        createdAt: "2023-04-01",
      },
    ],
    jobs: [
      {
        id: "1",
        title: "Senior Frontend Developer",
        company: "TechCorp",
        status: "active",
        applications: 18,
        postedAt: "2023-04-15",
      },
      {
        id: "2",
        title: "Backend Engineer",
        company: "DataSystems",
        status: "active",
        applications: 14,
        postedAt: "2023-04-10",
      },
      {
        id: "3",
        title: "UX/UI Designer",
        company: "CreativeMinds",
        status: "active",
        applications: 9,
        postedAt: "2023-04-12",
      },
      {
        id: "4",
        title: "DevOps Engineer",
        company: "CloudTech",
        status: "active",
        applications: 7,
        postedAt: "2023-04-08",
      },
      {
        id: "5",
        title: "Data Scientist",
        company: "AnalyticsPro",
        status: "pending",
        applications: 0,
        postedAt: "2023-04-19",
      },
    ],
    companies: [
      {
        id: "1",
        name: "TechCorp",
        email: "hr@techcorp.com",
        jobs: 8,
        status: "active",
        createdAt: "2023-02-10",
      },
      {
        id: "2",
        name: "DataSystems",
        email: "careers@datasystems.com",
        jobs: 5,
        status: "active",
        createdAt: "2023-02-15",
      },
      {
        id: "3",
        name: "CreativeMinds",
        email: "jobs@creativeminds.com",
        jobs: 3,
        status: "active",
        createdAt: "2023-03-01",
      },
      {
        id: "4",
        name: "CloudTech",
        email: "recruiting@cloudtech.com",
        jobs: 6,
        status: "active",
        createdAt: "2023-03-10",
      },
      {
        id: "5",
        name: "AnalyticsPro",
        email: "careers@analyticspro.com",
        jobs: 2,
        status: "pending",
        createdAt: "2023-04-05",
      },
    ],
  }
}
