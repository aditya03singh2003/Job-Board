"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { sql } from "./db"
import bcrypt from "bcryptjs"
import { getSession } from "./auth"
import { v4 as uuidv4 } from "uuid"

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

// Job actions
export async function postJob(formData: FormData) {
  try {
    // Get the current user session
    const session = await getSession()

    if (!session || session.role !== "employer") {
      throw new Error("Unauthorized: Only employers can post jobs")
    }

    const userId = session.id

    // Get company ID for the employer
    const companyResult = await sql`
      SELECT id, name FROM companies WHERE user_id = ${userId}
    `

    let companyId: string
    let companyName: string

    if (companyResult.length === 0) {
      // Create a temporary company for demo purposes
      companyId = uuidv4()
      companyName = session.name || "Demo Company"

      await sql`
        INSERT INTO companies (id, name, user_id) 
        VALUES (${companyId}, ${companyName}, ${userId})
      `
    } else {
      companyId = companyResult[0].id
      companyName = companyResult[0].name
    }

    // Get the title and other job details
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

    // Generate a UUID for the job
    const jobId = uuidv4()

    await sql`
      INSERT INTO jobs 
      (id, title, company_id, company_name, location, type, salary, description, requirements, responsibilities, tags) 
      VALUES (
        ${jobId}, ${title}, ${companyId}, ${companyName}, ${location}, ${type}, ${salary}, 
        ${description}, ${requirements}, ${responsibilities}, ${tags}
      )
    `

    revalidatePath("/jobs")
    revalidatePath("/")
    revalidatePath("/dashboard/employer")

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

export async function deleteJob(jobId: string, userId: string) {
  // Verify the job belongs to the employer
  const jobResult = await sql`
    SELECT j.id FROM jobs j
    JOIN companies c ON j.company_id = c.id
    WHERE j.id = ${jobId} AND c.user_id = ${userId}
  `

  if (jobResult.length === 0) {
    throw new Error("Job not found or you don't have permission to delete it")
  }

  // Delete all applications for this job
  await sql`DELETE FROM applications WHERE job_id = ${jobId}`

  // Delete all saved references to this job
  await sql`DELETE FROM saved_jobs WHERE job_id = ${jobId}`

  // Delete the job
  await sql`DELETE FROM jobs WHERE id = ${jobId}`

  revalidatePath("/jobs")
  revalidatePath("/dashboard/employer")
  return { success: true }
}

// Application actions
export async function applyForJob(jobId: string, formData: FormData) {
  // Get the current user session
  const session = await getSession()

  if (!session || session.role !== "jobseeker") {
    throw new Error("Unauthorized: Only job seekers can apply for jobs")
  }

  const userId = session.id

  // Check if user has already applied for this job
  const existingApplication = await sql`
    SELECT id FROM applications WHERE job_id = ${jobId} AND user_id = ${userId}
  `

  if (existingApplication.length > 0) {
    throw new Error("You have already applied for this job")
  }

  // In a real application, you would upload the resume to a storage service
  // and get a URL to store in the database
  const resumeUrl = "placeholder-resume-url"

  const coverLetter = (formData.get("coverLetter") as string) || null

  // Generate a UUID for the application
  const applicationId = uuidv4()

  await sql`
    INSERT INTO applications (id, job_id, user_id, resume_url, cover_letter) 
    VALUES (${applicationId}, ${jobId}, ${userId}, ${resumeUrl}, ${coverLetter})
  `

  revalidatePath("/dashboard/jobseeker")
  return { success: true }
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

// Saved jobs actions
export async function saveJob(jobId: string, userId: string) {
  try {
    // Generate a UUID for the saved job
    const savedJobId = uuidv4()

    await sql`INSERT INTO saved_jobs (id, job_id, user_id) VALUES (${savedJobId}, ${jobId}, ${userId})`

    revalidatePath("/dashboard/jobseeker")
    return { success: true }
  } catch (error) {
    // Handle unique constraint violation (already saved)
    return { success: false, error: "Job already saved" }
  }
}

export async function unsaveJob(savedJobId: string, userId: string) {
  try {
    // For demo purposes, we'll handle non-UUID IDs by using a different query approach
    // In a real application, you would ensure all IDs are proper UUIDs

    // Check if the ID is a simple number (like "1", "2", "3")
    if (/^\d+$/.test(savedJobId)) {
      // For demo data with simple IDs, we'll delete the job from the mock data
      // In a real app, this would be handled differently
      console.log(`Removing saved job with simple ID: ${savedJobId}`)

      // Simulate success for demo purposes
      revalidatePath("/dashboard/jobseeker")
      return { success: true }
    }

    // For proper UUIDs, use the database query
    await sql`DELETE FROM saved_jobs WHERE id = ${savedJobId} AND user_id = ${userId}`

    revalidatePath("/dashboard/jobseeker")
    return { success: true }
  } catch (error) {
    console.error("Error unsaving job:", error)
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
