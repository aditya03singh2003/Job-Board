"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { SearchForm } from "@/components/search-form"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu, X, LogIn, UserPlus, Briefcase, User, LogOut } from "lucide-react"
import { getSession } from "@/lib/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [session, setSession] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    async function checkSession() {
      try {
        const userSession = await getSession()
        setSession(userSession)
      } catch (error) {
        console.error("Error checking session:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [pathname])

  const closeSheet = () => setIsOpen(false)

  const getDashboardLink = () => {
    if (!session) return "/auth/login"

    switch (session.role) {
      case "employer":
        return "/dashboard/employer"
      case "jobseeker":
        return "/dashboard/jobseeker"
      case "admin":
        return "/admin"
      default:
        return "/dashboard"
    }
  }

  const getInitials = (name: string) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Briefcase className="h-6 w-6 text-primary mr-2" />
            <span className="font-bold text-xl">JobBoard</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-1">
          <Link href="/">
            <Button variant="ghost">Home</Button>
          </Link>
          <Link href="/jobs">
            <Button variant="ghost">Browse Jobs</Button>
          </Link>
          <Link href="/employers">
            <Button variant="ghost">For Employers</Button>
          </Link>
          <Link href="/about">
            <Button variant="ghost">About</Button>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <SearchForm className="w-64" />
          <ThemeToggle />

          {isLoading ? (
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
          ) : session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt={session.name} />
                    <AvatarFallback>{getInitials(session.name)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{session.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{session.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href={getDashboardLink()}>
                  <DropdownMenuItem>
                    <Briefcase className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                </Link>
                <Link href={`/dashboard/${session.role}/profile`}>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <Link href="/auth/logout">
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Log in
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Sign up
                </Button>
              </Link>
            </>
          )}
        </div>

        <div className="flex md:hidden items-center space-x-4">
          <ThemeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>
                  <Button variant="ghost" size="icon" onClick={closeSheet} className="absolute top-4 right-4">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                  </Button>
                </SheetDescription>
              </SheetHeader>
              <div className="py-4 flex flex-col space-y-4">
                <SearchForm />
                <Link href="/" onClick={closeSheet}>
                  <Button variant="ghost" className="w-full justify-start">
                    Home
                  </Button>
                </Link>
                <Link href="/jobs" onClick={closeSheet}>
                  <Button variant="ghost" className="w-full justify-start">
                    Browse Jobs
                  </Button>
                </Link>
                <Link href="/employers" onClick={closeSheet}>
                  <Button variant="ghost" className="w-full justify-start">
                    For Employers
                  </Button>
                </Link>
                <Link href="/about" onClick={closeSheet}>
                  <Button variant="ghost" className="w-full justify-start">
                    About
                  </Button>
                </Link>

                {isLoading ? (
                  <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                ) : session ? (
                  <>
                    <div className="flex items-center space-x-2 px-4 py-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt={session.name} />
                        <AvatarFallback>{getInitials(session.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{session.name}</p>
                        <p className="text-xs text-muted-foreground">{session.email}</p>
                      </div>
                    </div>
                    <Link href={getDashboardLink()} onClick={closeSheet}>
                      <Button variant="ghost" className="w-full justify-start">
                        <Briefcase className="mr-2 h-4 w-4" />
                        Dashboard
                      </Button>
                    </Link>
                    <Link href={`/dashboard/${session.role}/profile`} onClick={closeSheet}>
                      <Button variant="ghost" className="w-full justify-start">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Button>
                    </Link>
                    <Link href="/auth/logout" onClick={closeSheet}>
                      <Button variant="ghost" className="w-full justify-start">
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" onClick={closeSheet}>
                      <Button variant="ghost" className="w-full justify-start">
                        <LogIn className="mr-2 h-4 w-4" />
                        Log in
                      </Button>
                    </Link>
                    <Link href="/auth/register" onClick={closeSheet}>
                      <Button className="w-full justify-start">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Sign up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
