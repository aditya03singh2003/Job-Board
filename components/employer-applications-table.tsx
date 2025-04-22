"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateApplicationStatus } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface Application {
  id: string
  jobId: string
  jobTitle: string
  applicantName: string
  applicantEmail: string
  status: string
  appliedAt: string
}

interface EmployerApplicationsTableProps {
  applications: Application[]
  employerId: string
}

export function EmployerApplicationsTable({ applications, employerId }: EmployerApplicationsTableProps) {
  const [updatingStatus, setUpdatingStatus] = useState<Record<string, boolean>>({})
  const { toast } = useToast()

  const handleStatusChange = async (applicationId: string, status: string) => {
    setUpdatingStatus((prev) => ({ ...prev, [applicationId]: true }))

    try {
      // Use the provided employer ID
      await updateApplicationStatus(applicationId, status, employerId)

      toast({
        title: "Status updated",
        description: "Application status has been updated successfully.",
      })
    } catch (error) {
      console.error("Failed to update application status:", error)
      toast({
        title: "Update failed",
        description: "There was a problem updating the application status.",
        variant: "destructive",
      })
    } finally {
      setUpdatingStatus((prev) => ({ ...prev, [applicationId]: false }))
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>
      case "reviewing":
        return <Badge variant="secondary">Reviewing</Badge>
      case "interview":
        return <Badge variant="default">Interview</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      case "accepted":
        return <Badge className="bg-green-500">Accepted</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="rounded-md border">
      {applications.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-muted-foreground">No applications found</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Applicant</TableHead>
              <TableHead>Job</TableHead>
              <TableHead>Applied</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((application) => (
              <TableRow key={application.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{application.applicantName}</div>
                    <div className="text-sm text-muted-foreground">{application.applicantEmail}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Link href={`/jobs/${application.jobId}`} className="hover:underline">
                    {application.jobTitle}
                  </Link>
                </TableCell>
                <TableCell>{application.appliedAt}</TableCell>
                <TableCell>{getStatusBadge(application.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Select
                      defaultValue={application.status}
                      onValueChange={(value) => handleStatusChange(application.id, value)}
                      disabled={updatingStatus[application.id]}
                    >
                      <SelectTrigger className="w-[140px]">
                        {updatingStatus[application.id] ? (
                          <div className="flex items-center">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            <span>Updating...</span>
                          </div>
                        ) : (
                          <SelectValue placeholder="Update status" />
                        )}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="reviewing">Reviewing</SelectItem>
                        <SelectItem value="interview">Interview</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="accepted">Accepted</SelectItem>
                      </SelectContent>
                    </Select>
                    <Link href={`/dashboard/employer/applications/${application.id}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
