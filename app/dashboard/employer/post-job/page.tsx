"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { motion } from "framer-motion"

const indianCities = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
  "Kochi",
  "Chandigarh",
  "Coimbatore",
  "Indore",
  "Nagpur",
  "Surat",
  "Visakhapatnam",
  "Bhubaneswar",
  "Gurgaon",
  "Noida",
  "Remote",
]

const jobTypes = ["Full-time", "Part-time", "Contract", "Internship", "Freelance"]

export default function PostJobPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)

    try {
      const response = await fetch("/api/jobs/create", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to post job")
      }

      const data = await response.json()

      toast({
        title: "Job posted successfully",
        description: "Your job listing has been created and is now visible to job seekers.",
      })

      // Redirect to the job details page
      router.push(`/jobs/${data.jobId}`)
    } catch (error) {
      console.error("Error posting job:", error)
      toast({
        title: "Error",
        description: "There was a problem posting your job. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.h1
        className="text-3xl font-bold mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Post a New Job
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
            <CardDescription>Provide information about the position you're hiring for</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Job Title</Label>
                  <Input id="title" name="title" required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Select name="location">
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {indianCities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="type">Job Type</Label>
                    <Select name="type">
                      <SelectTrigger>
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                      <SelectContent>
                        {jobTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="salary">Salary Range (₹)</Label>
                  <Input id="salary" name="salary" placeholder="e.g., ₹10,00,000 - ₹15,00,000 per year" />
                </div>

                <div>
                  <Label htmlFor="description">Job Description</Label>
                  <Textarea id="description" name="description" rows={6} required />
                </div>

                <div>
                  <Label htmlFor="requirements">Requirements (one per line)</Label>
                  <Textarea
                    id="requirements"
                    name="requirements"
                    rows={4}
                    placeholder="Bachelor's degree in Computer Science or related field
5+ years of experience in web development
Strong knowledge of JavaScript and React
Excellent communication skills"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="responsibilities">Responsibilities (one per line)</Label>
                  <Textarea
                    id="responsibilities"
                    name="responsibilities"
                    rows={4}
                    placeholder="Develop and maintain web applications
Collaborate with cross-functional teams
Write clean, maintainable code
Participate in code reviews"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input id="tags" name="tags" placeholder="e.g., React, JavaScript, Frontend, Remote" required />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  "Post Job"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
