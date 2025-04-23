"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { postJob } from "@/lib/actions"

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
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [formSuccess, setFormSuccess] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Form validation
  const validateForm = (formData: FormData) => {
    const errors: Record<string, string> = {}

    const title = formData.get("title") as string
    const location = formData.get("location") as string
    const type = formData.get("type") as string
    const description = formData.get("description") as string
    const requirements = formData.get("requirements") as string
    const responsibilities = formData.get("responsibilities") as string
    const tags = formData.get("tags") as string

    if (!title || title.trim().length < 3) {
      errors.title = "Job title must be at least 3 characters"
    }

    if (!location) {
      errors.location = "Please select a location"
    }

    if (!type) {
      errors.type = "Please select a job type"
    }

    if (!description || description.trim().length < 50) {
      errors.description = "Job description must be at least 50 characters"
    }

    if (!requirements || requirements.trim().length < 10) {
      errors.requirements = "Please add at least one requirement"
    }

    if (!responsibilities || responsibilities.trim().length < 10) {
      errors.responsibilities = "Please add at least one responsibility"
    }

    if (!tags || tags.trim().length < 3) {
      errors.tags = "Please add at least one tag"
    }

    return errors
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setFormErrors({})

    const formData = new FormData(event.currentTarget)

    // Validate form
    const errors = validateForm(formData)
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      setIsSubmitting(false)
      return
    }

    try {
      await postJob(formData)

      setFormSuccess(true)

      toast({
        title: "Job posted successfully",
        description: "Your job listing has been created and is now visible to job seekers.",
        variant: "default",
      })

      // Redirect to the employer dashboard after 2 seconds
      setTimeout(() => {
        router.push("/dashboard/employer")
      }, 2000)
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  return (
    <div className="container mx-auto py-8 px-4 pt-header">
      <motion.h1
        className="text-3xl font-bold mb-8 gradient-text"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Post a New Job
      </motion.h1>

      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        <Card className="border-2 border-primary/10 shadow-lg hover:shadow-primary/5 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center">
              <motion.span className="mr-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                Job Details
              </motion.span>
            </CardTitle>
            <CardDescription>Provide information about the position you're hiring for</CardDescription>
          </CardHeader>
          <CardContent>
            {formSuccess ? (
              <motion.div
                className="flex flex-col items-center justify-center py-10 text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 100 }}
              >
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Job Posted Successfully!</h2>
                <p className="text-muted-foreground mb-6">
                  Your job listing has been created and is now visible to job seekers.
                </p>
                <Button onClick={() => router.push("/dashboard/employer")}>Return to Dashboard</Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div variants={itemVariants} className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="flex items-center">
                      Job Title
                      {formErrors.title && (
                        <span className="ml-2 text-xs text-destructive flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {formErrors.title}
                        </span>
                      )}
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      required
                      className={`${formErrors.title ? "border-destructive" : ""} transition-all duration-300 focus:ring-2 focus:ring-primary/30`}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location" className="flex items-center">
                        Location
                        {formErrors.location && (
                          <span className="ml-2 text-xs text-destructive flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {formErrors.location}
                          </span>
                        )}
                      </Label>
                      <Select name="location">
                        <SelectTrigger
                          className={`${formErrors.location ? "border-destructive" : ""} transition-all duration-300 focus:ring-2 focus:ring-primary/30`}
                        >
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
                      <Label htmlFor="type" className="flex items-center">
                        Job Type
                        {formErrors.type && (
                          <span className="ml-2 text-xs text-destructive flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {formErrors.type}
                          </span>
                        )}
                      </Label>
                      <Select name="type">
                        <SelectTrigger
                          className={`${formErrors.type ? "border-destructive" : ""} transition-all duration-300 focus:ring-2 focus:ring-primary/30`}
                        >
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

                  <motion.div variants={itemVariants}>
                    <Label htmlFor="salary">Salary Range (₹)</Label>
                    <Input
                      id="salary"
                      name="salary"
                      placeholder="e.g., ₹10,00,000 - ₹15,00,000 per year"
                      className="transition-all duration-300 focus:ring-2 focus:ring-primary/30"
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Label htmlFor="description" className="flex items-center">
                      Job Description
                      {formErrors.description && (
                        <span className="ml-2 text-xs text-destructive flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {formErrors.description}
                        </span>
                      )}
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      rows={6}
                      required
                      className={`${formErrors.description ? "border-destructive" : ""} transition-all duration-300 focus:ring-2 focus:ring-primary/30`}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Label htmlFor="requirements" className="flex items-center">
                      Requirements (one per line)
                      {formErrors.requirements && (
                        <span className="ml-2 text-xs text-destructive flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {formErrors.requirements}
                        </span>
                      )}
                    </Label>
                    <Textarea
                      id="requirements"
                      name="requirements"
                      rows={4}
                      placeholder="Bachelor's degree in Computer Science or related field
5+ years of experience in web development
Strong knowledge of JavaScript and React
Excellent communication skills"
                      required
                      className={`${formErrors.requirements ? "border-destructive" : ""} transition-all duration-300 focus:ring-2 focus:ring-primary/30`}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Label htmlFor="responsibilities" className="flex items-center">
                      Responsibilities (one per line)
                      {formErrors.responsibilities && (
                        <span className="ml-2 text-xs text-destructive flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {formErrors.responsibilities}
                        </span>
                      )}
                    </Label>
                    <Textarea
                      id="responsibilities"
                      name="responsibilities"
                      rows={4}
                      placeholder="Develop and maintain web applications
Collaborate with cross-functional teams
Write clean, maintainable code
Participate in code reviews"
                      required
                      className={`${formErrors.responsibilities ? "border-destructive" : ""} transition-all duration-300 focus:ring-2 focus:ring-primary/30`}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Label htmlFor="tags" className="flex items-center">
                      Tags (comma separated)
                      {formErrors.tags && (
                        <span className="ml-2 text-xs text-destructive flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {formErrors.tags}
                        </span>
                      )}
                    </Label>
                    <Input
                      id="tags"
                      name="tags"
                      placeholder="e.g., React, JavaScript, Frontend, Remote"
                      required
                      className={`${formErrors.tags ? "border-destructive" : ""} transition-all duration-300 focus:ring-2 focus:ring-primary/30`}
                    />
                  </motion.div>
                </motion.div>

                <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 transition-all duration-300"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      "Post Job"
                    )}
                  </Button>
                </motion.div>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
