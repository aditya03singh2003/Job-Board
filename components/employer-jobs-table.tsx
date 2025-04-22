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
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react"
import { deleteJob } from "@/lib/actions"

interface Job {
  id: string
  title: string
  location: string
  type: string
  applications: number
  views: number
  status: string
  postedAt: string
}

interface EmployerJobsTableProps {
  jobs: Job[]
}

export function EmployerJobsTable({ jobs }: EmployerJobsTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [jobToDelete, setJobToDelete] = useState<string | null>(null)

  const handleDeleteClick = (jobId: string) => {
    setJobToDelete(jobId)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (jobToDelete) {
      try {
        // In a real application, you would get the user ID from the session
        const userId = "current-user-id"
        await deleteJob(jobToDelete, userId)
      } catch (error) {
        console.error("Failed to delete job:", error)
      }
    }
    setDeleteDialogOpen(false)
    setJobToDelete(null)
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Title</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-center">Applications</TableHead>
              <TableHead className="text-center">Views</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Posted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell className="font-medium">{job.title}</TableCell>
                <TableCell>{job.location}</TableCell>
                <TableCell>{job.type}</TableCell>
                <TableCell className="text-center">{job.applications}</TableCell>
                <TableCell className="text-center">{job.views}</TableCell>
                <TableCell>
                  <Badge variant={job.status === "active" ? "default" : "secondary"}>
                    {job.status === "active" ? "Active" : "Closed"}
                  </Badge>
                </TableCell>
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
                      <Link href={`/dashboard/employer/edit-job/${job.id}`}>
                        <DropdownMenuItem>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem onClick={() => handleDeleteClick(job.id)} className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this job listing and all associated applications. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
