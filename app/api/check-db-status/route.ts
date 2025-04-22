import { NextResponse } from "next/server"
import { isDatabaseInitialized } from "@/lib/db"

export async function GET() {
  try {
    const initialized = await isDatabaseInitialized()
    return NextResponse.json({ initialized })
  } catch (error) {
    console.error("Error checking database status:", error)
    return NextResponse.json(
      {
        initialized: false,
        error: "Failed to check database status",
      },
      { status: 500 },
    )
  }
}
