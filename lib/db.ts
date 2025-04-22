import { neon } from "@neondatabase/serverless"

// Create a SQL query executor using the connection string from environment variables
// with proper error handling and fallback
const createSqlClient = () => {
  // Use the environment variable or fallback to a default value for development
  const connectionString =
    process.env.DATABASE_URL || process.env.POSTGRES_URL || "postgresql://postgres:postgres@localhost:5432/jobboard"

  try {
    return neon(connectionString)
  } catch (error) {
    console.error("Failed to create database client:", error)
    throw error
  }
}

// Initialize the SQL client
const sql = createSqlClient()

// Helper function to execute SQL queries with conventional placeholders
export async function query(text: string, params?: any[]) {
  const start = Date.now()
  try {
    let result
    if (params) {
      // Use sql.query for parameterized queries
      result = await sql.query(text, params)
    } else {
      // Use tagged template for simple queries
      result = await sql(text)
    }
    const duration = Date.now() - start
    console.log("Executed query", { text, duration, rows: result.length })
    return { rows: result }
  } catch (error) {
    console.error("Query error:", error)
    throw error
  }
}

// Initialize the database with required tables
export async function initializeDatabase() {
  try {
    console.log("Initializing database...")

    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create companies table
    await sql`
      CREATE TABLE IF NOT EXISTS companies (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        user_id UUID REFERENCES users(id),
        website VARCHAR(255),
        location VARCHAR(255),
        industry VARCHAR(255),
        size VARCHAR(50),
        description TEXT,
        logo_url VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create jobs table
    await sql`
      CREATE TABLE IF NOT EXISTS jobs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        company_id UUID REFERENCES companies(id),
        company_name VARCHAR(255) NOT NULL,
        location VARCHAR(255),
        type VARCHAR(50),
        salary VARCHAR(100),
        description TEXT,
        requirements TEXT[],
        responsibilities TEXT[],
        tags TEXT[],
        is_active BOOLEAN DEFAULT TRUE,
        is_approved BOOLEAN DEFAULT TRUE,
        views_count INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create applications table
    await sql`
      CREATE TABLE IF NOT EXISTS applications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        job_id UUID REFERENCES jobs(id),
        user_id UUID REFERENCES users(id),
        resume_url VARCHAR(255),
        cover_letter TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create saved_jobs table
    await sql`
      CREATE TABLE IF NOT EXISTS saved_jobs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        job_id UUID REFERENCES jobs(id),
        user_id UUID REFERENCES users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(job_id, user_id)
      )
    `

    // Create notifications table
    await sql`
      CREATE TABLE IF NOT EXISTS notifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id),
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

    console.log("Database initialized successfully")
    return true
  } catch (error) {
    console.error("Error initializing database:", error)
    throw error
  }
}

// Check if database is initialized
export async function isDatabaseInitialized() {
  try {
    // Check if the jobs table exists
    const result = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'jobs'
      )
    `
    return result[0].exists
  } catch (error) {
    console.error("Error checking database initialization:", error)
    return false
  }
}

// Export the sql client for direct use with tagged template literals
export { sql }
