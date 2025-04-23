"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getSession } from "@/lib/auth"

export function SearchForm({ className }: { className?: string }) {
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!query.trim()) return

    setIsLoading(true)

    try {
      // Check if user is logged in
      const session = await getSession()

      if (!session) {
        // If not logged in, redirect to login page with return URL
        toast({
          title: "Login required",
          description: "Please log in to search for jobs",
        })
        router.push(`/auth/login?returnUrl=${encodeURIComponent(`/jobs?q=${query}`)}`)
        return
      }

      // If logged in, redirect to jobs page with query
      router.push(`/jobs?q=${encodeURIComponent(query)}`)
    } catch (error) {
      console.error("Error checking authentication:", error)
      // If error, still redirect to jobs page
      router.push(`/jobs?q=${encodeURIComponent(query)}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSearch} className={`relative ${className}`}>
      <Input
        type="text"
        placeholder="Search for jobs..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pr-10"
      />
      <Button type="submit" size="icon" variant="ghost" className="absolute right-0 top-0 h-full" disabled={isLoading}>
        <Search className="h-4 w-4" />
      </Button>
    </form>
  )
}
