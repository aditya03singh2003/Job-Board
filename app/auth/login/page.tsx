"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { loginUser } from "@/lib/auth"
import { motion } from "framer-motion"
import { Loader2, LogIn, Briefcase, User } from "lucide-react"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>, userType: string) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const result = await loginUser(email, password, userType)

      if (result.success) {
        toast({
          title: "Login successful",
          description: "You have been logged in successfully.",
        })

        if (userType === "employer") {
          router.push("/dashboard/employer")
        } else {
          router.push("/dashboard/jobseeker")
        }
      } else {
        toast({
          title: "Login failed",
          description: result.error || "Invalid email or password. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-12 md:px-6 pt-24">
      <motion.div
        className="w-full max-w-md space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground">Enter your credentials to access your account</p>
        </div>

        <Tabs defaultValue="jobseeker" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="jobseeker" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Job Seeker</span>
            </TabsTrigger>
            <TabsTrigger value="employer" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span>Employer</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="jobseeker">
            <form onSubmit={(e) => handleSubmit(e, "jobseeker")} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-jobseeker">Email</Label>
                <Input id="email-jobseeker" name="email" type="email" placeholder="m@example.com" required />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password-jobseeker">Password</Label>
                  <Link href="/auth/reset-password" className="text-sm underline text-primary">
                    Forgot password?
                  </Link>
                </div>
                <Input id="password-jobseeker" name="password" type="password" required />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </>
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="employer">
            <form onSubmit={(e) => handleSubmit(e, "employer")} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-employer">Email</Label>
                <Input id="email-employer" name="email" type="email" placeholder="company@example.com" required />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password-employer">Password</Label>
                  <Link href="/auth/reset-password" className="text-sm underline text-primary">
                    Forgot password?
                  </Link>
                </div>
                <Input id="password-employer" name="password" type="password" required />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </>
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
