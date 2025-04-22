"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SearchIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SearchFormProps {
  requireAuth?: boolean
  className?: string
  variant?: "default" | "minimal"
  onSearch?: (query: string, location: string) => void
}

export function SearchForm({ requireAuth = false, className = "", variant = "default", onSearch }: SearchFormProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()

    // If onSearch prop is provided, call it directly
    if (onSearch) {
      onSearch(searchQuery, selectedLocation)
      return
    }

    // Check if authentication is required
    if (requireAuth) {
      // In a real app, you would check the session here
      // For now, we'll use localStorage as a simple way to check if user is logged in
      const isLoggedIn = typeof window !== "undefined" && localStorage.getItem("isLoggedIn") === "true"

      if (!isLoggedIn) {
        toast({
          title: "Authentication required",
          description: "Please log in to search for jobs",
          variant: "destructive",
        })

        // Redirect to login page with callback URL
        const currentPath = window.location.pathname
        router.push(`/auth/login?callbackUrl=${encodeURIComponent(currentPath)}`)
        return
      }
    }

    const params = new URLSearchParams()

    if (searchQuery.trim()) {
      params.append("query", searchQuery)
    }

    if (selectedLocation && selectedLocation !== "Anywhere") {
      params.append("location", selectedLocation)
    }

    const queryString = params.toString()
    router.push(`/jobs${queryString ? `?${queryString}` : ""}`)
  }

  if (variant === "minimal") {
    return (
      <form onSubmit={handleSearch} className={`relative w-full ${className}`}>
        <Input
          type="search"
          placeholder="Search jobs..."
          className="w-full pr-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button type="submit" size="icon" variant="ghost" className="absolute right-0 top-0 h-full">
          <SearchIcon className="h-4 w-4" />
        </Button>
      </form>
    )
  }

  return (
    <form onSubmit={handleSearch} className={`flex flex-col gap-4 md:flex-row ${className}`}>
      <div className="flex-1">
        <Input
          placeholder="Job title, keywords, or company"
          className="h-12"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="w-full md:w-48">
        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger className="h-12">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Anywhere">Anywhere</SelectItem>
            <SelectItem value="Remote">Remote</SelectItem>
            <SelectItem value="Mumbai">Mumbai</SelectItem>
            <SelectItem value="Delhi">Delhi</SelectItem>
            <SelectItem value="Bangalore">Bangalore</SelectItem>
            <SelectItem value="Hyderabad">Hyderabad</SelectItem>
            <SelectItem value="Chennai">Chennai</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button
        type="submit"
        className="h-12 bg-gradient-to-r from-cyan-400 to-violet-500 text-black hover:from-cyan-500 hover:to-violet-600"
      >
        <SearchIcon className="mr-2 h-4 w-4" />
        Search Jobs
      </Button>
    </form>
  )
}
