"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Briefcase, MapPin, Clock, Tag, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { Job } from "@/lib/types"

export function FeaturedJobs() {
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchFeaturedJobs() {
      try {
        const response = await fetch("/api/jobs?featured=true")
        if (!response.ok) {
          throw new Error("Failed to fetch featured jobs")
        }
        const data = await response.json()
        setFeaturedJobs(data)
      } catch (error) {
        console.error("Error fetching featured jobs:", error)
        setError("Failed to load featured jobs")
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedJobs()
  }, [])

  // Format date to relative time (e.g., "2 days ago")
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) {
      return "Today"
    } else if (diffInDays === 1) {
      return "Yesterday"
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7)
      return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`
    } else {
      const months = Math.floor(diffInDays / 30)
      return `${months} ${months === 1 ? "month" : "months"} ago`
    }
  }

  return (
    <section className="relative z-10 border-t border-border py-24">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Featured Job Opportunities</h2>
          <p className="mt-4 text-muted-foreground">Discover top positions from leading companies</p>
        </motion.div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex gap-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-16 rounded-full" />
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t p-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="ml-auto h-9 w-28" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:border-primary/50 hover:shadow-md">
                  <CardContent className="p-6 flex-1">
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold">
                          <Link href={`/jobs/${job.id}`} className="hover:text-primary transition-colors">
                            {job.title}
                          </Link>
                        </h3>
                        <div className="mt-1 flex items-center text-sm text-muted-foreground">
                          <Building className="mr-1 h-4 w-4" />
                          <span>{job.company}</span>
                        </div>
                      </div>
                      <Badge className="bg-gradient-to-r from-cyan-400 to-violet-500 text-black">Featured</Badge>
                    </div>

                    <div className="mb-4 flex flex-wrap gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <MapPin className="mr-1 h-4 w-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Briefcase className="mr-1 h-4 w-4" />
                        <span>{job.type}</span>
                      </div>
                      {job.salary && (
                        <div className="flex items-center">
                          <Tag className="mr-1 h-4 w-4" />
                          <span>{job.salary}</span>
                        </div>
                      )}
                    </div>

                    <p className="mb-4 line-clamp-3 text-sm text-foreground/80">
                      {job.description ? job.description.replace(/<[^>]*>/g, "") : "No description available"}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-auto">
                      {job.tags &&
                        job.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      {job.tags && job.tags.length > 3 && <Badge variant="outline">+{job.tags.length - 3} more</Badge>}
                    </div>
                  </CardContent>

                  <CardFooter className="flex items-center justify-between border-t border-border bg-muted/10 p-4">
                    <div className="text-sm text-muted-foreground">
                      <Clock className="mr-1 inline-block h-4 w-4" />
                      {formatRelativeTime(job.postedAt)}
                    </div>
                    <Button asChild variant="ghost" className="text-primary hover:bg-primary/10 hover:text-primary">
                      <Link href={`/jobs/${job.id}`}>
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Button
            asChild
            className="bg-gradient-to-r from-cyan-400 to-violet-500 text-black hover:from-cyan-500 hover:to-violet-600"
          >
            <Link href="/jobs">
              View All Jobs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
