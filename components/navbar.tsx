"use client"

import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  Menu,
  X,
  Briefcase,
  ChevronDown,
  LogIn,
  UserPlus,
  LayoutDashboard,
  User,
  LogOut,
  Settings,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { SearchForm } from "@/components/search-form"

type NavbarProps = {
  session: any | null
}

export function Navbar({ session }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Store login status in localStorage for client-side checks
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("isLoggedIn", session ? "true" : "false")
    }
  }, [session])

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Jobs", href: "/jobs" },
    { name: "Employers", href: "/employers" },
    { name: "About", href: "/about" },
  ]

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
        return "/dashboard/jobseeker"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled || isOpen ? "border-b border-border bg-background/80 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 font-bold">
            <Briefcase className="h-6 w-6 text-primary" />
            <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
              JobConnect
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex md:flex-1 md:max-w-md mx-4">
            <SearchForm variant="minimal" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm transition-colors hover:text-primary ${
                  pathname === link.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 text-sm hover:bg-accent">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.image || ""} alt={session.name} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(session.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline">{session.name}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={getDashboardLink()} className="cursor-pointer flex items-center">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/auth/logout" className="cursor-pointer flex items-center text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/login"
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Link>
                <Button
                  asChild
                  className="flex items-center gap-1 bg-gradient-to-r from-cyan-400 to-violet-500 text-black hover:from-cyan-500 hover:to-violet-600"
                >
                  <Link href="/auth/register">
                    <UserPlus className="h-4 w-4" />
                    <span>Sign Up</span>
                  </Link>
                </Button>
              </div>
            )}

            <ThemeToggle />
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Search Icon - Mobile */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-foreground">
                  <Search className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="pt-16">
                <SearchForm variant="minimal" />
              </SheetContent>
            </Sheet>

            {session && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.image || ""} alt={session.name} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(session.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={getDashboardLink()} className="cursor-pointer flex items-center">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/auth/logout" className="cursor-pointer flex items-center text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="text-foreground"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-border bg-background/90 md:hidden"
        >
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm transition-colors hover:text-primary ${
                    pathname === link.href ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              {!session ? (
                <>
                  <Link
                    href="/auth/login"
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Login</span>
                  </Link>
                  <Button
                    asChild
                    className="flex items-center gap-1 bg-gradient-to-r from-cyan-400 to-violet-500 text-black hover:from-cyan-500 hover:to-violet-600"
                  >
                    <Link href="/auth/register">
                      <UserPlus className="h-4 w-4" />
                      <span>Sign Up</span>
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    href={getDashboardLink()}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                  <Link
                    href="/auth/logout"
                    className="flex items-center gap-1 text-sm text-destructive hover:text-destructive/80"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Link>
                </>
              )}
            </nav>
          </div>
        </motion.div>
      )}
    </header>
  )
}
