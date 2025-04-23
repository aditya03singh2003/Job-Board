import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: Request) {
  try {
    // Get the current user session
    const session = await getSession()

    if (!session || session.role !== "employer") {
      return NextResponse.json({ error: "Unauthorized: Only employers can post jobs" }, { status: 401 })
    }

    const userId = session.id
    const formData = await request.formData()

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

    return NextResponse.json({ success: true, jobId })
  } catch (error) {
    console.error("Error posting job:", error)
    return NextResponse.json({ error: "Failed to post job" }, { status: 500 })
  }
}
