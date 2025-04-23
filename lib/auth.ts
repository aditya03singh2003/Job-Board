"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { sql } from "./db"
import bcrypt from "bcryptjs"

// Session management
const SESSION_COOKIE_NAME = "job_board_session"

type UserSession = {
  id: string
  name: string
  email: string
  role: "jobseeker" | "employer" | "admin"
  image?: string
}

// Register a new user
export async function registerUser(formData: FormData, userType: string) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  // Validate passwords match
  if (password !== confirmPassword) {
    return { success: false, error: "Passwords do not match" }
  }

  try {
    // Check if user already exists
    const existingUser = await sql`SELECT id FROM users WHERE email = ${email}`
    if (existingUser.length > 0) {
      return { success: false, error: "Email already in use" }
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10)

    let userId: string
    let userName: string

    if (userType === "jobseeker") {
      const firstName = formData.get("firstName") as string
      const lastName = formData.get("lastName") as string
      userName = `${firstName} ${lastName}`

      const result = await sql`
        INSERT INTO users (name, email, password_hash, role) 
        VALUES (${userName}, ${email}, ${passwordHash}, 'jobseeker')
        RETURNING id
      `
      userId = result[0].id
    } else if (userType === "employer") {
      const companyName = formData.get("companyName") as string
      const website = (formData.get("website") as string) || null
      userName = companyName

      // Create user
      const userResult = await sql`
        INSERT INTO users (name, email, password_hash, role) 
        VALUES (${companyName}, ${email}, ${passwordHash}, 'employer')
        RETURNING id
      `

      userId = userResult[0].id

      // Create company
      await sql`
        INSERT INTO companies (name, user_id, website) 
        VALUES (${companyName}, ${userId}, ${website})
      `
    } else {
      return { success: false, error: "Invalid user type" }
    }

    // Create session
    await createSession({
      id: userId,
      name: userName,
      email,
      role: userType as "jobseeker" | "employer" | "admin",
    })

    return { success: true, userId }
  } catch (error) {
    console.error("Registration error:", error)
    return { success: false, error: "Registration failed. Please try again." }
  }
}

// Login user
export async function loginUser(email: string, password: string, userType: string) {
  try {
    // Get user from database
    const result = await sql`
      SELECT id, name, email, password_hash, role FROM users 
      WHERE email = ${email}
    `

    if (result.length === 0) {
      return { success: false, error: "Invalid email or password" }
    }

    const user = result[0]

    // Check if user role matches requested role
    if (user.role !== userType) {
      return {
        success: false,
        error: `This account is registered as a ${user.role}. Please use the ${user.role} login option.`,
      }
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(password, user.password_hash)

    if (!passwordMatch) {
      return { success: false, error: "Invalid email or password" }
    }

    // Create session
    await createSession({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    })

    return { success: true, userId: user.id }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, error: "Login failed. Please try again." }
  }
}

// Logout user
export async function logoutUser() {
  const cookieStore = cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
  redirect("/")
}

// Create a new session
async function createSession(user: UserSession) {
  // In a real app, you would use a more secure method like JWT
  // For simplicity, we'll just store the user info in a cookie
  const session = JSON.stringify(user)
  const cookieStore = cookies()
  cookieStore.set({
    name: SESSION_COOKIE_NAME,
    value: session,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })
}

// Get current session
export async function getSession(): Promise<UserSession | null> {
  const cookieStore = cookies()
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)

  if (!sessionCookie) {
    return null
  }

  try {
    return JSON.parse(sessionCookie.value) as UserSession
  } catch {
    return null
  }
}

// Check if user is authenticated
export async function isAuthenticated() {
  const session = await getSession()
  return session !== null
}

// Get current user
export async function getCurrentUser() {
  const session = await getSession()

  if (!session) {
    return null
  }

  try {
    const result = await sql`
      SELECT id, name, email, role FROM users WHERE id = ${session.id}
    `

    if (result.length === 0) {
      return null
    }

    return result[0]
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

// Check if user has specific role
export async function hasRole(role: string | string[]) {
  const session = await getSession()

  if (!session) {
    return false
  }

  if (Array.isArray(role)) {
    return role.includes(session.role)
  }

  return session.role === role
}
