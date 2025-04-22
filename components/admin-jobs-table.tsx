"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
import { MoreHorizontal, Eye, CheckCircle, XCircle } from "lucide-react"
import { approveJob } from "@/lib/actions"

interface Job {
  id: string
  title: string
  company: string
  status: string
  applications: number
  postedAt: string
}

interface AdminJobsTableProps {
  jobs: Job[]
}

export function AdminJobsTable({ jobs }: AdminJobsTableProps) {
  const [actionDialogOpen, setActionDialogOpen] = useState(false)
  const [jobToUpdate, setJobToUpdate] = useState<{ id: string; action: "approve" | "reject" } | null>(null)

  const handleActionClick = (jobId: string, action: "approve" | "reject") => {
    setJobToUpdate({ id: jobId, action })
    setActionDialogOpen(true)
  }

  const handleConfirmAction = async () => {
    if (jobToUpdate) {
      try {
        // In a real application, you would get the admin ID from the session
        const adminId = "admin-user-id"

        if (jobToUpdate.action === "approve") {
          await approveJob(jobToUpdate.id, adminId)
        } else {
          // Implement reject job action
          console.log("Rejecting job:", jobToUpdate.id)
        }
      } catch (error) {
        console.error("Failed to update job status:", error)
      }
    }
    setActionDialogOpen(false)
    setJobToUpdate(null)
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Title</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Applications</TableHead>
              <TableHead>Posted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell className="font-medium">
                  <Link href={`/jobs/${job.id}`} className="hover:underline">
                    {job.title}
                  </Link>
                </TableCell>
                <TableCell>{job.company}</TableCell>
                <TableCell>
                  <Badge
                    variant={job.status === "active" ? "default" : job.status === "pending" ? "outline" : "secondary"}
                  >
                    {job.status === "active" ? "Active" : job.status === "pending" ? "Pending" : "Closed"}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">{job.applications}</TableCell>
                <TableCell>{job.postedAt}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <Link href={`/jobs/${job.id}`}>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                      </Link>
                      {job.status === "pending" && (
                        <>
                          <DropdownMenuItem
                            onClick={() => handleActionClick(job.id, "approve")}
                            className="text-green-600"
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleActionClick(job.id, "reject")}
                            className="text-red-600"
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Reject
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{jobToUpdate?.action === "approve" ? "Approve Job?" : "Reject Job?"}</AlertDialogTitle>
            <AlertDialogDescription>
              {jobToUpdate?.action === "approve"
                ? "This will make the job listing visible to all users."
                : "This will reject the job listing and notify the employer."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAction}
              className={jobToUpdate?.action === "reject" ? "bg-red-600 hover:bg-red-700" : ""}
            >
              {jobToUpdate?.action === "approve" ? "Approve" : "Reject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
