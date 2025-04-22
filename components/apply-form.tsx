"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { applyForJob } from "@/lib/actions"

interface ApplyFormProps {
  jobId: string
}

export function ApplyForm({ jobId }: ApplyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)

    try {
      await applyForJob(jobId, formData)

      toast({
        title: "Application submitted",
        description: "Your application has been successfully submitted.",
      })

      router.push("/dashboard/applications")
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem submitting your application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" name="name" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input id="phone" name="phone" type="tel" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="resume">Resume/CV</Label>
        <Input id="resume" name="resume" type="file" accept=".pdf,.doc,.docx" required />
        <p className="text-xs text-muted-foreground">Accepted formats: PDF, DOC, DOCX (Max 5MB)</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="coverLetter">Cover Letter (Optional)</Label>
        <Textarea id="coverLetter" name="coverLetter" rows={4} />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Application"}
      </Button>
    </form>
  )
}
