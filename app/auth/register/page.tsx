"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { registerUser } from "@/lib/auth"
import { motion } from "framer-motion"
import { Loader2, UserPlus, Briefcase, User } from "lucide-react"

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>, userType: string) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)

    try {
      const result = await registerUser(formData, userType)

      if (result.success) {
        toast({
          title: "Registration successful",
          description: "Your account has been created successfully.",
        })

        // Redirect to home page (user is already logged in via the auth function)
        router.push("/")
      } else {
        toast({
          title: "Registration failed",
          description: result.error || "There was a problem creating your account. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "There was a problem creating your account. Please try again.",
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
          <h1 className="text-3xl font-bold">Create an account</h1>
          <p className="text-muted-foreground">Choose your account type and enter your details</p>
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" name="firstName" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" name="lastName" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email-jobseeker">Email</Label>
                <Input id="email-jobseeker" name="email" type="email" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password-jobseeker">Password</Label>
                <Input id="password-jobseeker" name="password" type="password" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword-jobseeker">Confirm Password</Label>
                <Input id="confirmPassword-jobseeker" name="confirmPassword" type="password" required />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="terms-jobseeker" name="terms" required />
                <label htmlFor="terms-jobseeker" className="text-sm">
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create Account
                  </>
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="employer">
            <form onSubmit={(e) => handleSubmit(e, "employer")} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input id="companyName" name="companyName" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email-employer">Email</Label>
                <Input id="email-employer" name="email" type="email" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password-employer">Password</Label>
                <Input id="password-employer" name="password" type="password" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword-employer">Confirm Password</Label>
                <Input id="confirmPassword-employer" name="confirmPassword" type="password" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Company Website (Optional)</Label>
                <Input id="website" name="website" type="url" />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="terms-employer" name="terms" required />
                <label htmlFor="terms-employer" className="text-sm">
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create Account
                  </>
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
