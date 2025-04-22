export interface Job {
  id: string
  title: string
  company: string
  companyId: string
  location: string
  type: string
  salary: string
  description: string
  requirements: string[]
  responsibilities: string[]
  tags: string[]
  postedAt: string
  companyDescription: string
}

export interface User {
  id: string
  name: string
  email: string
  role: "jobseeker" | "employer" | "admin"
  createdAt: string
}

export interface Application {
  id: string
  jobId: string
  userId: string
  jobTitle: string
  company: string
  status: "pending" | "reviewing" | "interview" | "rejected" | "accepted"
  appliedAt: string
}

export interface Company {
  id: string
  name: string
  website: string
  location: string
  industry: string
  size: string
  createdAt: string
}

export interface SavedJob {
  id: string
  jobId: string
  job: Job
  savedAt: string
}
