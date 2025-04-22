"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Application {
  id: string
  jobId: string
  jobTitle: string
  company: string
  status: string
  appliedAt: string
}

interface JobSeekerApplicationsTableProps {
  applications: Application[]
}

export function JobSeekerApplicationsTable({ applications }: JobSeekerApplicationsTableProps) {
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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Job</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Applied</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application) => (
            <TableRow key={application.id}>
              <TableCell className="font-medium">
                <Link href={`/jobs/${application.jobId}`} className="hover:underline">
                  {application.jobTitle}
                </Link>
              </TableCell>
              <TableCell>{application.company}</TableCell>
              <TableCell>{application.appliedAt}</TableCell>
              <TableCell>{getStatusBadge(application.status)}</TableCell>
              <TableCell className="text-right">
                <Link href={`/dashboard/jobseeker/applications/${application.id}`}>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
