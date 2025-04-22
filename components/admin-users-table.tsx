"use client"

import { useState } from "react"
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
import { MoreHorizontal, Ban, CheckCircle } from "lucide-react"
import { updateUserStatus } from "@/lib/actions"

interface User {
  id: string
  name: string
  email: string
  role: string
  status: string
  createdAt: string
}

interface AdminUsersTableProps {
  users: User[]
}

export function AdminUsersTable({ users }: AdminUsersTableProps) {
  const [actionDialogOpen, setActionDialogOpen] = useState(false)
  const [userToUpdate, setUserToUpdate] = useState<{ id: string; action: "activate" | "deactivate" } | null>(null)

  const handleActionClick = (userId: string, action: "activate" | "deactivate") => {
    setUserToUpdate({ id: userId, action })
    setActionDialogOpen(true)
  }

  const handleConfirmAction = async () => {
    if (userToUpdate) {
      try {
        // In a real application, you would get the admin ID from the session
        const adminId = "admin-user-id"
        await updateUserStatus(userToUpdate.id, userToUpdate.action === "activate", adminId)
      } catch (error) {
        console.error("Failed to update user status:", error)
      }
    }
    setActionDialogOpen(false)
    setUserToUpdate(null)
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === "admin" ? "default" : "outline"}>
                    {user.role === "jobseeker" ? "Job Seeker" : user.role === "employer" ? "Employer" : "Admin"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={user.status === "active" ? "default" : "secondary"}
                    className={user.status === "inactive" ? "bg-red-100 text-red-800" : ""}
                  >
                    {user.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>{user.createdAt}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {user.status === "active" ? (
                        <DropdownMenuItem
                          onClick={() => handleActionClick(user.id, "deactivate")}
                          className="text-red-600"
                        >
                          <Ban className="mr-2 h-4 w-4" />
                          Deactivate
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() => handleActionClick(user.id, "activate")}
                          className="text-green-600"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Activate
                        </DropdownMenuItem>
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
            <AlertDialogTitle>
              {userToUpdate?.action === "deactivate" ? "Deactivate User?" : "Activate User?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {userToUpdate?.action === "deactivate"
                ? "This will prevent the user from logging in and using the platform."
                : "This will allow the user to log in and use the platform again."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAction}
              className={userToUpdate?.action === "deactivate" ? "bg-red-600 hover:bg-red-700" : ""}
            >
              {userToUpdate?.action === "deactivate" ? "Deactivate" : "Activate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
