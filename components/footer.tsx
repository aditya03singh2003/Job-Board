import Link from "next/link"
import { Briefcase, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background/50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center space-x-2 font-bold">
              <Briefcase className="h-6 w-6 text-primary" />
              <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
                JobConnect
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Connecting talented professionals with their dream careers and helping businesses find the perfect
              candidates.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">For Job Seekers</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/jobs" className="text-muted-foreground hover:text-primary">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link href="/jobs?type=remote" className="text-muted-foreground hover:text-primary">
                  Remote Jobs
                </Link>
              </li>
              <li>
                <Link href="/career-advice" className="text-muted-foreground hover:text-primary">
                  Career Advice
                </Link>
              </li>
              <li>
                <Link href="/resume-tips" className="text-muted-foreground hover:text-primary">
                  Resume Tips
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">For Employers</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/employers/post-job" className="text-muted-foreground hover:text-primary">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link href="/employers/pricing" className="text-muted-foreground hover:text-primary">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/employers/resources" className="text-muted-foreground hover:text-primary">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/employers/testimonials" className="text-muted-foreground hover:text-primary">
                  Testimonials
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} JobConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
