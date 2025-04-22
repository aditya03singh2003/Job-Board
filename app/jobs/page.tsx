"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { JobCard } from "@/components/job-card"
import { Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import type { Job } from "@/lib/types"

// List of Indian cities for location filter
const indianCities = [
  "Anywhere",
  "Remote",
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
  "Kochi",
  "Chandigarh",
  "Coimbatore",
  "Indore",
  "Nagpur",
  "Surat",
  "Visakhapatnam",
  "Bhubaneswar",
  "Gurgaon",
  "Noida",
]

// Job types for filtering
const jobTypes = ["Full-time", "Part-time", "Contract", "Internship", "Freelance"]

// Experience levels for filtering
const experienceLevels = ["Entry Level", "Mid Level", "Senior Level"]

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  // Filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("Anywhere")
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([])
  const [selectedExperienceLevels, setSelectedExperienceLevels] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("newest")

  // Fetch jobs
  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await fetch("/api/jobs")
        if (!response.ok) {
          throw new Error("Failed to fetch jobs")
        }
        const data = await response.json()
        setJobs(data)
        setFilteredJobs(data)
      } catch (error) {
        console.error("Error fetching jobs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  // Handle job type checkbox change
  const handleJobTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setSelectedJobTypes([...selectedJobTypes, type])
    } else {
      setSelectedJobTypes(selectedJobTypes.filter((t) => t !== type))
    }
  }

  // Handle experience level checkbox change
  const handleExperienceLevelChange = (level: string, checked: boolean) => {
    if (checked) {
      setSelectedExperienceLevels([...selectedExperienceLevels, level])
    } else {
      setSelectedExperienceLevels(selectedExperienceLevels.filter((l) => l !== level))
    }
  }

  // Apply filters
  const applyFilters = () => {
    let result = [...jobs]

    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(query) ||
          job.company.toLowerCase().includes(query) ||
          job.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
    }

    // Apply location filter
    if (selectedLocation && selectedLocation !== "Anywhere") {
      result = result.filter(
        (job) =>
          job.location === selectedLocation ||
          (selectedLocation === "Remote" && job.location.toLowerCase().includes("remote")),
      )
    }

    // Apply job type filter
    if (selectedJobTypes.length > 0) {
      result = result.filter((job) => selectedJobTypes.some((type) => job.type === type))
    }

    // Apply experience level filter
    if (selectedExperienceLevels.length > 0) {
      result = result.filter((job) => {
        // This is a simplified example. In a real app, you'd have an experience field
        const jobLevel = job.title.toLowerCase().includes("senior")
          ? "Senior Level"
          : job.title.toLowerCase().includes("junior")
            ? "Entry Level"
            : "Mid Level"

        return selectedExperienceLevels.includes(jobLevel)
      })
    }

    // Apply sorting
    if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime())
    } else if (sortBy === "oldest") {
      result.sort((a, b) => new Date(a.postedAt).getTime() - new Date(b.postedAt).getTime())
    }

    setFilteredJobs(result)
  }

  // Apply filters whenever filter states change
  useEffect(() => {
    applyFilters()
  }, [searchQuery, selectedLocation, selectedJobTypes, selectedExperienceLevels, sortBy, jobs])

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.h1
        className="text-3xl font-bold mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Browse Jobs
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-card rounded-lg border p-4 sticky top-20">
            <h2 className="font-semibold mb-4">Filters</h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Search</label>
                <Input
                  placeholder="Job title or keyword"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Location</label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any location" />
                  </SelectTrigger>
                  <SelectContent>
                    {indianCities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Job Type</label>
                <div className="space-y-2">
                  {jobTypes.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`type-${type}`}
                        checked={selectedJobTypes.includes(type)}
                        onCheckedChange={(checked) => handleJobTypeChange(type, checked as boolean)}
                      />
                      <label htmlFor={`type-${type}`} className="text-sm">
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Experience Level</label>
                <div className="space-y-2">
                  {experienceLevels.map((level) => (
                    <div key={level} className="flex items-center space-x-2">
                      <Checkbox
                        id={`level-${level}`}
                        checked={selectedExperienceLevels.includes(level)}
                        onCheckedChange={(checked) => handleExperienceLevelChange(level, checked as boolean)}
                      />
                      <label htmlFor={`level-${level}`} className="text-sm">
                        {level}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Button className="w-full" onClick={applyFilters}>
                Apply Filters
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="lg:col-span-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="mb-6 flex justify-between items-center">
            <p className="text-muted-foreground">{filteredJobs.length} jobs found</p>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="oldest">Oldest first</SelectItem>
                <SelectItem value="relevant">Most relevant</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-12 bg-muted/50 rounded-lg">
              <h3 className="text-lg font-medium mb-2">No jobs found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search criteria</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
              {filteredJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <JobCard job={job} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
