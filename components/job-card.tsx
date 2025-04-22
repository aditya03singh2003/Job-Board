"use client"
import { Building, MapPin, Clock, Tag, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import type { Job } from "@/lib/types"

interface JobCardProps {
  job: Job
  featured?: boolean
}

export function JobCard({ job, featured = false }: JobCardProps) {
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
    <Card
      className={`overflow-hidden transition-all duration-300 hover:border-primary/50 ${featured ? "ring-1 ring-primary/50" : ""}`}
    >
      <CardContent className="p-6">
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
          {featured && <Badge className="bg-gradient-to-r from-cyan-400 to-violet-500 text-black">Featured</Badge>}
        </div>

        <div className="mb-4 flex flex-wrap gap-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <MapPin className="mr-1 h-4 w-4" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-1 h-4 w-4" />
            <span>{job.type}</span>
          </div>
          {job.salary && (
            <div className="flex items-center">
              <Tag className="mr-1 h-4 w-4" />
              <span>{job.salary}</span>
            </div>
          )}
        </div>

        <p className="mb-4 line-clamp-2 text-sm text-foreground/80">{job.description}</p>

        <div className="flex flex-wrap gap-2">
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
  )
}
