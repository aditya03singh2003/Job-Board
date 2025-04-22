import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, MapPin, Building, Calendar, DollarSign } from "lucide-react"
import { getJobById } from "@/lib/data"
import { ApplyForm } from "@/components/apply-form"

interface JobPageProps {
  params: {
    id: string
  }
}

export default async function JobPage({ params }: JobPageProps) {
  const job = await getJobById(params.id)

  if (!job) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Job not found</h1>
        <p className="mb-6">The job listing you're looking for doesn't exist or has been removed.</p>
        <Link href="/jobs">
          <Button>Browse All Jobs</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Link href="/jobs" className="flex items-center text-sm mb-6 hover:underline">
        ← Back to all jobs
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
            <div className="flex items-center gap-2 mb-4">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{job.company}</span>
            </div>

            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span>{job.type}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span>{job.salary}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Posted {job.postedAt}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-6">
              {job.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: job.description }} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                {job.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Responsibilities</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                {job.responsibilities.map((resp, index) => (
                  <li key={index}>{resp}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Apply for this position</CardTitle>
                <CardDescription>
                  Submit your application for {job.title} at {job.company}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ApplyForm jobId={job.id} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>About {job.company}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{job.companyDescription}</p>
                <Link href={`/companies/${job.companyId}`}>
                  <Button variant="outline" className="w-full">
                    View Company Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
