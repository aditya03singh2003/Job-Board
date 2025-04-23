"use client"
import { Building, MapPin, Clock, Tag, ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import type { Job } from "@/lib/types"

interface JobCardProps {
  job: Job
  featured?: boolean
  delay?: number
}

export function JobCard({ job, featured = false, delay = 0 }: JobCardProps) {
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card
        className={`overflow-hidden transition-all duration-300 hover:border-primary/50 h-full ${
          featured ? "ring-1 ring-primary/50" : ""
        }`}
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
                <motion.div whileHover={{ scale: 1.1 }} className="flex items-center">
                  <Building className="mr-1 h-4 w-4 icon-pulse" />
                  <span>{job.company}</span>
                </motion.div>
              </div>
            </div>
            {featured && (
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
                <Badge className="bg-gradient-to-r from-cyan-400 to-violet-500 text-black">Featured</Badge>
              </motion.div>
            )}
          </div>

          <div className="mb-4 flex flex-wrap gap-2 text-sm text-muted-foreground">
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center">
              <MapPin className="mr-1 h-4 w-4 icon-bounce" />
              <span>{job.location}</span>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center">
              <Clock className="mr-1 h-4 w-4 icon-pulse" />
              <span>{job.type}</span>
            </motion.div>
            {job.salary && (
              <motion.div whileHover={{ scale: 1.05 }} className="flex items-center">
                <Tag className="mr-1 h-4 w-4 icon-bounce" />
                <span>{job.salary}</span>
              </motion.div>
            )}
          </div>

          <p className="mb-4 line-clamp-2 text-sm text-foreground/80">{job.description}</p>

          <div className="flex flex-wrap gap-2">
            {job.tags &&
              job.tags.slice(0, 3).map((tag, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Badge variant="outline">{tag}</Badge>
                </motion.div>
              ))}
            {job.tags && job.tags.length > 3 && (
              <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                <Badge variant="outline">+{job.tags.length - 3} more</Badge>
              </motion.div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t border-border bg-muted/10 p-4">
          <div className="text-sm text-muted-foreground">
            <Clock className="mr-1 inline-block h-4 w-4" />
            {formatRelativeTime(job.postedAt)}
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button asChild variant="ghost" className="text-primary hover:bg-primary/10 hover:text-primary">
              <Link href={`/jobs/${job.id}`}>
                View Details
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
