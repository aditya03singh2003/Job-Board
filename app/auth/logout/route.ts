import { logoutUser } from "@/lib/auth"

export async function GET() {
  await logoutUser()
  return new Response(null, {
    status: 302,
    headers: {
      Location: "/",
    },
  })
}
