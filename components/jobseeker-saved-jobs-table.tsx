"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Bookmark } from "lucide-react"
import { unsaveJob } from "@/lib/actions"
import type { SavedJob } from "@/lib/types"

interface JobSeekerSavedJobsTableProps {
  savedJobs: SavedJob[]
}

export function JobSeekerSavedJobsTable({ savedJobs }: JobSeekerSavedJobsTableProps) {
  const [unsaveDialogOpen, setUnsaveDialogOpen] = useState(false)
  const [jobToUnsave, setJobToUnsave] = useState<string | null>(null)
  const [isUnsaving, setIsUnsaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUnsaveClick = (savedJobId: string) => {
    setJobToUnsave(savedJobId)
    setUnsaveDialogOpen(true)
    setError(null)
  }

  const handleConfirmUnsave = async () => {
    if (jobToUnsave) {
      try {
        setIsUnsaving(true)
        setError(null)

        // In a real application, you would get the user ID from the session
        const userId = "current-user-id"

        // For demo purposes, we'll use a mock UUID if the ID is not in UUID format
        // This is a workaround for the demo data
        await unsaveJob(jobToUnsave, userId)

        // Remove the job from the local state to update the UI immediately
        // In a real app, you would use React Query or SWR to refetch the data

        setIsUnsaving(false)
        setUnsaveDialogOpen(false)
        setJobToUnsave(null)

        // Refresh the page to show updated data
        window.location.reload()
      } catch (error) {
        console.error("Failed to unsave job:", error)
        setError("Failed to unsave job. Please try again.")
        setIsUnsaving(false)
      }
    }
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Saved</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {savedJobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No saved jobs found.
                </TableCell>
              </TableRow>
            ) : (
              savedJobs.map((savedJob) => (
                <TableRow key={savedJob.id}>
                  <TableCell className="font-medium">
                    <Link href={`/jobs/${savedJob.job.id}`} className="hover:underline">
                      {savedJob.job.title}
                    </Link>
                  </TableCell>
                  <TableCell>{savedJob.job.company}</TableCell>
                  <TableCell>{savedJob.job.location}</TableCell>
                  <TableCell>{savedJob.job.type}</TableCell>
                  <TableCell>{savedJob.savedAt}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/jobs/${savedJob.job.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleUnsaveClick(savedJob.id)}
                        disabled={isUnsaving}
                      >
                        <Bookmark className="h-4 w-4 fill-current" />
                        <span className="sr-only">Unsave</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={unsaveDialogOpen} onOpenChange={setUnsaveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove saved job?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the job from your saved jobs list. You can always save it again later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUnsaving}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmUnsave} disabled={isUnsaving}>
              {isUnsaving ? "Removing..." : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
