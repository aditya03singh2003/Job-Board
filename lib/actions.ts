"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { sql } from "./db"
import bcrypt from "bcryptjs"
import { getSession } from "./auth"

// User authentication actions
export async function registerUser(formData: FormData, userType: string) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  // Hash the password
  const passwordHash = await bcrypt.hash(password, 10)

  if (userType === "jobseeker") {
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const name = `${firstName} ${lastName}`

    await sql`
      INSERT INTO users (name, email, password_hash, role) 
      VALUES (${name}, ${email}, ${passwordHash}, 'jobseeker')
    `
  } else if (userType === "employer") {
    const companyName = formData.get("companyName") as string
    const website = (formData.get("website") as string) || null

    // Create user
    const userResult = await sql`
      INSERT INTO users (name, email, password_hash, role) 
      VALUES (${companyName}, ${email}, ${passwordHash}, 'employer')
      RETURNING id
    `

    const userId = userResult[0].id

    // Create company
    await sql`
      INSERT INTO companies (name, user_id, website) 
      VALUES (${companyName}, ${userId}, ${website})
    `
  }

  return { success: true }
}

export async function loginUser(email: string, password: string, userType: string) {
  // Get user from database
  const result = await sql`
    SELECT * FROM users WHERE email = ${email} AND role = ${userType}
  `

  if (result.length === 0) {
    throw new Error("Invalid email or password")
  }

  const user = result[0]

  // Compare password
  const passwordMatch = await bcrypt.compare(password, user.password_hash)

  if (!passwordMatch) {
    throw new Error("Invalid email or password")
  }

  // In a real application, you would set a session or JWT token here

  return { success: true, userId: user.id }
}

// Save a job for a job seeker
export async function saveJob(jobId: string) {
  try {
    const session = await getSession()
    if (!session) {
      return { success: false, error: "Not authenticated" }
    }

    // Check if already saved
    const existingSave = await sql`
      SELECT id FROM saved_jobs 
      WHERE job_id = ${jobId} AND user_id = ${session.id}
    `

    if (existingSave.length > 0) {
      return { success: false, error: "Job already saved" }
    }

    // Save the job
    await sql`
      INSERT INTO saved_jobs (job_id, user_id) 
      VALUES (${jobId}, ${session.id})
    `

    revalidatePath("/dashboard/jobseeker")
    return { success: true }
  } catch (error) {
    console.error("Error saving job:", error)
    return { success: false, error: "Failed to save job" }
  }
}

// Unsave a job for a job seeker
export async function unsaveJob(savedJobId: string) {
  try {
    const session = await getSession()
    if (!session) {
      return { success: false, error: "Not authenticated" }
    }

    // Delete the saved job
    await sql`
      DELETE FROM saved_jobs 
      WHERE id = ${savedJobId} AND user_id = ${session.id}
    `

    revalidatePath("/dashboard/jobseeker")
    return { success: true }
  } catch (error) {
    console.error("Error unsaving job:", error)
    return { success: false, error: "Failed to unsave job" }
  }
}

// Apply for a job
export async function applyForJob(formData: FormData) {
  try {
    const session = await getSession()
    if (!session) {
      return { success: false, error: "Not authenticated" }
    }

    const jobId = formData.get("jobId") as string
    const coverLetter = formData.get("coverLetter") as string
    const resumeUrl = (formData.get("resumeUrl") as string) || "sample-resume.pdf"

    // Check if already applied
    const existingApplication = await sql`
      SELECT id FROM applications 
      WHERE job_id = ${jobId} AND user_id = ${session.id}
    `

    if (existingApplication.length > 0) {
      return { success: false, error: "You have already applied for this job" }
    }

    // Create the application
    await sql`
      INSERT INTO applications (job_id, user_id, cover_letter, resume_url, status) 
      VALUES (${jobId}, ${session.id}, ${coverLetter}, ${resumeUrl}, 'pending')
    `

    revalidatePath("/dashboard/jobseeker")
    return { success: true }
  } catch (error) {
    console.error("Error applying for job:", error)
    return { success: false, error: "Failed to apply for job" }
  }
}

// Delete a job (for employers)
export async function deleteJob(jobId: string, userId: string) {
  try {
    // Check if the job belongs to the user
    const job = await sql`
      SELECT j.id FROM jobs j
      JOIN companies c ON j.company_id = c.id
      WHERE j.id = ${jobId} AND c.user_id = ${userId}
    `

    if (job.length === 0) {
      return { success: false, error: "Job not found or you don't have permission to delete it" }
    }

    // Delete the job
    await sql`DELETE FROM jobs WHERE id = ${jobId}`

    revalidatePath("/dashboard/employer")
    return { success: true }
  } catch (error) {
    console.error("Error deleting job:", error)
    return { success: false, error: "Failed to delete job" }
  }
}

// Post a new job
export async function postJob(formData: FormData) {
  try {
    const session = await getSession()
    if (!session) {
      throw new Error("Not authenticated")
    }

    // Get company info
    const company = await sql`
      SELECT id, name FROM companies WHERE user_id = ${session.id}
    `

    if (company.length === 0) {
      throw new Error("Company not found")
    }

    const companyId = company[0].id
    const companyName = company[0].name

    const title = formData.get("title") as string
    const location = formData.get("location") as string
    const type = formData.get("type") as string
    const salary = formData.get("salary") as string
    const description = formData.get("description") as string
    const requirementsText = formData.get("requirements") as string
    const responsibilitiesText = formData.get("responsibilities") as string
    const tagsText = formData.get("tags") as string

    // Convert requirements, responsibilities, and tags to arrays
    const requirements = requirementsText
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item.length > 0)

    const responsibilities = responsibilitiesText
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item.length > 0)

    const tags = tagsText
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0)

    // Insert the job
    const result = await sql`
      INSERT INTO jobs (
        title, 
        company_id, 
        company_name, 
        location, 
        type, 
        salary, 
        description, 
        requirements, 
        responsibilities, 
        tags,
        status
      ) VALUES (
        ${title}, 
        ${companyId}, 
        ${companyName}, 
        ${location}, 
        ${type}, 
        ${salary}, 
        ${description}, 
        ${requirements}, 
        ${responsibilities}, 
        ${tags},
        'active'
      )
      RETURNING id
    `

    const jobId = result[0].id

    revalidatePath("/dashboard/employer")
    revalidatePath("/jobs")
    revalidatePath("/")

    return { success: true, jobId }
  } catch (error) {
    console.error("Error posting job:", error)
    throw error
  }
}

export async function updateJob(jobId: string, formData: FormData, userId: string) {
  // Verify the job belongs to the employer
  const jobResult = await sql`
    SELECT j.id FROM jobs j
    JOIN companies c ON j.company_id = c.id
    WHERE j.id = ${jobId} AND c.user_id = ${userId}
  `

  if (jobResult.length === 0) {
    throw new Error("Job not found or you don't have permission to edit it")
  }

  const title = formData.get("title") as string
  const location = formData.get("location") as string
  const type = formData.get("type") as string
  const salary = formData.get("salary") as string
  const description = formData.get("description") as string
  const requirements = (formData.get("requirements") as string).split("\n").filter(Boolean)
  const responsibilities = (formData.get("responsibilities") as string).split("\n").filter(Boolean)
  const tags = (formData.get("tags") as string)
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
  const isActive = formData.get("isActive") === "true"

  await sql`
    UPDATE jobs 
    SET title = ${title}, 
        location = ${location}, 
        type = ${type}, 
        salary = ${salary}, 
        description = ${description}, 
        requirements = ${requirements}, 
        responsibilities = ${responsibilities}, 
        tags = ${tags}, 
        is_active = ${isActive}
    WHERE id = ${jobId}
  `

  revalidatePath("/jobs")
  revalidatePath(`/jobs/${jobId}`)
  revalidatePath("/dashboard/employer")
  redirect("/dashboard/employer")
}

// Application actions
export async function updateApplicationStatus(applicationId: string, status: string, userId: string) {
  try {
    // For demo purposes, we'll skip the session check and use the provided userId
    // In a production environment, you would validate the session properly

    // Verify the application belongs to a job from the employer
    const applicationResult = await sql`
      SELECT a.id FROM applications a
      JOIN jobs j ON a.job_id = j.id
      JOIN companies c ON j.company_id = c.id
      WHERE a.id = ${applicationId} AND c.user_id = ${userId}
    `

    if (applicationResult.length === 0) {
      throw new Error("Application not found or you don't have permission to update it")
    }

    await sql`UPDATE applications SET status = ${status} WHERE id = ${applicationId}`

    revalidatePath("/dashboard/employer")
    return { success: true }
  } catch (error) {
    console.error("Error updating application status:", error)
    throw error
  }
}

// Admin actions
export async function updateUserStatus(userId: string, isActive: boolean, adminId: string) {
  // Verify the user is an admin
  const adminResult = await sql`
    SELECT id FROM users WHERE id = ${adminId} AND role = 'admin'
  `

  if (adminResult.length === 0) {
    throw new Error("You don't have permission to perform this action")
  }

  await sql`UPDATE users SET is_active = ${isActive} WHERE id = ${userId}`

  revalidatePath("/admin")
  return { success: true }
}

export async function approveJob(jobId: string, adminId: string) {
  // Verify the user is an admin
  const adminResult = await sql`
    SELECT id FROM users WHERE id = ${adminId} AND role = 'admin'
  `

  if (adminResult.length === 0) {
    throw new Error("You don't have permission to perform this action")
  }

  await sql`UPDATE jobs SET is_approved = true WHERE id = ${jobId}`

  revalidatePath("/admin")
  return { success: true }
}
