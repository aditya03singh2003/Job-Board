"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Briefcase, User, Settings, Loader2, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function JobSeekerProfilePage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 pt-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">Manage your personal information</p>
        </div>
      </div>

      {/* Dashboard Navigation */}
      <div className="mb-8">
        <div className="flex space-x-4 border-b">
          <Link href="/dashboard/jobseeker">
            <Button variant="link">
              <Briefcase className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </Link>
          <Link href="/dashboard/jobseeker/profile">
            <Button variant="link" className="text-primary">
              <User className="h-4 w-4 mr-2" />
              My Profile
            </Button>
          </Link>
          <Link href="/dashboard/jobseeker/settings">
            <Button variant="link">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Profile Photo</CardTitle>
              <CardDescription>Upload your profile picture</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center mb-4">
                  <img
                    src="/placeholder.svg?height=128&width=128"
                    alt="Profile Photo"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <Button variant="outline" size="sm">
                  Upload New Photo
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Resume</CardTitle>
              <CardDescription>Upload your resume</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="w-full p-6 border-2 border-dashed rounded-lg flex flex-col items-center justify-center mb-4">
                  <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Drag and drop your resume here</p>
                  <p className="text-xs text-muted-foreground">PDF, DOCX (Max 5MB)</p>
                </div>
                <Button variant="outline" size="sm">
                  Browse Files
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Doe" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="jobseeker@example.com" disabled />
                  <p className="text-xs text-muted-foreground">To change your email, please go to Settings</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue="+91 9876543210" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" defaultValue="Mumbai, India" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="headline">Professional Headline</Label>
                  <Input id="headline" defaultValue="Senior Frontend Developer with 5+ years of experience" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="summary">Professional Summary</Label>
                  <Textarea
                    id="summary"
                    rows={5}
                    defaultValue="Experienced frontend developer with a passion for creating responsive and user-friendly web applications. Proficient in React, TypeScript, and modern frontend frameworks."
                  />
                </div>

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Skills & Experience</CardTitle>
              <CardDescription>Add your skills and work experience</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="skills">Skills (comma separated)</Label>
                  <Input id="skills" defaultValue="React, TypeScript, JavaScript, HTML, CSS, Node.js, Git" />
                </div>

                <div>
                  <Label className="block mb-2">Work Experience</Label>
                  <div className="border rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <Label htmlFor="jobTitle">Job Title</Label>
                        <Input id="jobTitle" defaultValue="Senior Frontend Developer" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input id="company" defaultValue="Tech Solutions Inc." />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input id="startDate" type="date" defaultValue="2020-01-01" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate">End Date</Label>
                        <Input id="endDate" type="date" defaultValue="2023-01-01" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        rows={3}
                        defaultValue="Led frontend development for multiple web applications. Implemented responsive designs and improved performance."
                      />
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Add Another Experience
                  </Button>
                </div>

                <div>
                  <Label className="block mb-2">Education</Label>
                  <div className="border rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <Label htmlFor="degree">Degree</Label>
                        <Input id="degree" defaultValue="Bachelor of Technology" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="institution">Institution</Label>
                        <Input id="institution" defaultValue="Indian Institute of Technology" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="graduationYear">Graduation Year</Label>
                        <Input id="graduationYear" type="number" defaultValue="2018" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="field">Field of Study</Label>
                        <Input id="field" defaultValue="Computer Science" />
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Add Another Education
                  </Button>
                </div>
              </div>

              <Button type="submit" className="mt-6" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save All Changes"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
