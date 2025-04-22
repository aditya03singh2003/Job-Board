import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const session = await getSession()

    if (!session || session.role !== "employer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.id
    const formData = await request.formData()

    // Get company ID for the employer
    const companyResult = await sql`
      SELECT id, name FROM companies WHERE user_id = ${userId}
    `

    if (companyResult.length === 0) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 })
    }

    const companyId = companyResult[0].id
    const companyName = companyResult[0].name

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

    const result = await sql`
      INSERT INTO jobs 
      (title, company_id, company_name, location, type, salary, description, requirements, responsibilities, tags) 
      VALUES (
        ${title}, ${companyId}, ${companyName}, ${location}, ${type}, ${salary}, 
        ${description}, ${requirements}, ${responsibilities}, ${tags}
      )
      RETURNING id
    `

    const jobId = result[0].id

    return NextResponse.json({ success: true, jobId })
  } catch (error) {
    console.error("Error creating job:", error)
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 })
  }
}
