"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye } from "lucide-react"
import Link from "next/link"

interface Company {
  id: string
  name: string
  email: string
  jobs: number
  status: string
  createdAt: string
}

interface AdminCompaniesTableProps {
  companies: Company[]
}

export function AdminCompaniesTable({ companies }: AdminCompaniesTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-center">Jobs</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((company) => (
            <TableRow key={company.id}>
              <TableCell className="font-medium">
                <Link href={`/companies/${company.id}`} className="hover:underline">
                  {company.name}
                </Link>
              </TableCell>
              <TableCell>{company.email}</TableCell>
              <TableCell className="text-center">{company.jobs}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    company.status === "active" ? "default" : company.status === "pending" ? "outline" : "secondary"
                  }
                >
                  {company.status === "active" ? "Active" : company.status === "pending" ? "Pending" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>{company.createdAt}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <Link href={`/companies/${company.id}`}>
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                    </Link>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
