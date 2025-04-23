"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Bell, ArrowRight, RefreshCw } from "lucide-react"
import type { Job } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

export function RealTimeJobFeed() {
  const [latestJobs, setLatestJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()

  const fetchLatestJobs = async (showToast = false) => {
    try {
      setIsRefreshing(true)
      const response = await fetch("/api/jobs?latest=true")
      if (!response.ok) {
        throw new Error("Failed to fetch latest jobs")
      }
      const data = await response.json()

      // Check if there are new jobs
      const hasNewJobs =
        latestJobs.length > 0 && data.some((newJob) => !latestJobs.some((oldJob) => oldJob.id === newJob.id))

      setLatestJobs(data)
      setLastUpdated(new Date())
      setError(null)

      if (showToast && hasNewJobs) {
        toast({
          title: "New jobs available!",
          description: "Check out the latest job postings.",
        })
      }
    } catch (err) {
      console.error("Error fetching latest jobs:", err)
      setError("Failed to load latest jobs")
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchLatestJobs()

    // Set up polling for real-time updates (every 15 seconds)
    const interval = setInterval(() => {
      fetchLatestJobs(true) // Show toast notification for new jobs
    }, 15000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Latest Job Postings</CardTitle>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Updated {lastUpdated.toLocaleTimeString()}</span>
          <Button variant="ghost" size="icon" onClick={() => fetchLatestJobs(true)} disabled={isRefreshing}>
            {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            <span className="sr-only">Refresh</span>
          </Button>
          <Bell className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-2">{error}</p>
            <Button variant="outline" size="sm" onClick={() => fetchLatestJobs()}>
              Try Again
            </Button>
          </div>
        ) : latestJobs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No new jobs in the last 24 hours</p>
          </div>
        ) : (
          <div className="space-y-4">
            {latestJobs.map((job) => (
              <div key={job.id} className="border rounded-lg p-4 hover:border-primary transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{job.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {job.company} • {job.location}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {job.tags &&
                        job.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                    </div>
                    <p className="text-xs text-muted-foreground">Posted {job.postedAt}</p>
                  </div>
                  <Link href={`/jobs/${job.id}`}>
                    <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
            <div className="text-center pt-2">
              <Link href="/jobs">
                <Button variant="outline" size="sm">
                  View All Jobs
                </Button>
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
