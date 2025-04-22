import { NextResponse } from "next/server"
import { initializeDatabase, sql } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    // Initialize database tables
    await initializeDatabase()

    // Check if we already have sample data
    const jobsCount = await sql`SELECT COUNT(*) FROM jobs`

    if (Number.parseInt(jobsCount[0].count) === 0) {
      // Create admin user
      const adminPasswordHash = await bcrypt.hash("admin123", 10)
      const adminResult = await sql`
        INSERT INTO users (name, email, password_hash, role)
        VALUES ('Admin User', 'admin@example.com', ${adminPasswordHash}, 'admin')
        RETURNING id
      `

      // Create a demo employer
      const employerPasswordHash = await bcrypt.hash("employer123", 10)
      const employerResult = await sql`
        INSERT INTO users (name, email, password_hash, role)
        VALUES ('Demo Company', 'employer@example.com', ${employerPasswordHash}, 'employer')
        RETURNING id
      `

      const employerId = employerResult[0].id

      // Create company for the employer
      const companyResult = await sql`
        INSERT INTO companies (
          name, 
          user_id, 
          website, 
          location, 
          industry, 
          size, 
          description,
          logo_url
        )
        VALUES (
          'Demo Company', 
          ${employerId}, 
          'https://demo-company.com', 
          'Mumbai, India', 
          'Technology', 
          '50-100', 
          'A leading technology company specializing in web applications.',
          '/placeholder.svg?height=100&width=100'
        )
        RETURNING id
      `

      const companyId = companyResult[0].id

      // Create a job seeker
      const jobseekerPasswordHash = await bcrypt.hash("jobseeker123", 10)
      await sql`
        INSERT INTO users (name, email, password_hash, role)
        VALUES ('John Doe', 'jobseeker@example.com', ${jobseekerPasswordHash}, 'jobseeker')
      `

      // Insert sample jobs
      await sql`
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
          tags
        ) VALUES (
          'Senior Frontend Developer', 
          ${companyId}, 
          'Demo Company', 
          'Mumbai, India', 
          'Full-time', 
          '₹15,00,000 - ₹25,00,000', 
          '<p>We are looking for a Senior Frontend Developer to join our team and help us build amazing user experiences.</p><p>As a Senior Frontend Developer, you will be responsible for implementing visual elements that users see and interact with in a web application. You will work closely with our design and backend teams to ensure a seamless user experience.</p>', 
          ARRAY['5+ years of experience with React', 'Strong TypeScript skills', 'Experience with state management libraries', 'Understanding of web accessibility standards'], 
          ARRAY['Develop new user-facing features', 'Build reusable components and libraries', 'Optimize applications for maximum speed and scalability', 'Collaborate with backend developers and designers'], 
          ARRAY['React', 'TypeScript', 'Frontend', 'Senior']
        )
      `

      await sql`
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
          tags
        ) VALUES (
          'Backend Engineer', 
          ${companyId}, 
          'Demo Company', 
          'Remote', 
          'Full-time', 
          '₹12,00,000 - ₹20,00,000', 
          '<p>Join our backend team to build scalable APIs and services that power our applications.</p><p>As a Backend Engineer, you will design and implement server-side logic, maintain databases, and ensure high performance and responsiveness to requests from the front-end.</p>', 
          ARRAY['3+ years of experience with Node.js', 'Experience with PostgreSQL or similar databases', 'Knowledge of RESTful API design', 'Understanding of microservices architecture'], 
          ARRAY['Design and implement APIs', 'Optimize database queries', 'Implement security and data protection measures', 'Write unit and integration tests'], 
          ARRAY['Node.js', 'PostgreSQL', 'API', 'Backend']
        )
      `

      await sql`
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
          tags
        ) VALUES (
          'UX/UI Designer', 
          ${companyId}, 
          'Demo Company', 
          'Bangalore, India', 
          'Full-time', 
          '₹10,00,000 - ₹18,00,000', 
          '<p>We are seeking a talented UX/UI Designer to create amazing user experiences for our products.</p><p>As a UX/UI Designer, you will be responsible for the user experience of our applications, including usability, interaction design, and visual design.</p>', 
          ARRAY['3+ years of experience in UX/UI design', 'Proficiency with design tools like Figma', 'Portfolio demonstrating UI design skills', 'Experience with user research and testing'], 
          ARRAY['Create wireframes, prototypes, and user flows', 'Conduct user research and usability testing', 'Collaborate with developers to implement designs', 'Maintain design system and documentation'], 
          ARRAY['UX', 'UI', 'Figma', 'Design']
        )
      `
    }

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully",
    })
  } catch (error) {
    console.error("Error initializing database:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to initialize database: " + (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 },
    )
  }
}
