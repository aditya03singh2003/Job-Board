"use client"

import { motion } from "framer-motion"
import { ArrowRight, Briefcase, Building, CheckCircle2, Users } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FeaturedJobs } from "@/components/featured-jobs"
import { DbInitializer } from "@/components/db-initializer"
import { SearchForm } from "@/components/search-form"

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Database Initializer */}
      <DbInitializer />

      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="absolute -left-1/4 top-1/4 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 0.5 }}
            className="absolute -right-1/4 top-1/2 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl"
          />
        </div>

        {/* Content */}
        <div className="container relative z-10 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mx-auto max-w-3xl space-y-8"
          >
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Find Your{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
                Dream Job
              </span>{" "}
              Today
            </h1>
            <p className="mx-auto max-w-2xl text-muted-foreground sm:text-xl">
              Connect with top employers and discover thousands of opportunities to advance your career
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto max-w-3xl rounded-xl border border-border bg-background/5 p-4 backdrop-blur-sm"
            >
              <SearchForm requireAuth={true} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <FeaturedJobs />

      {/* Stats Section */}
      <section className="relative z-10 border-t border-border py-24 bg-gradient-to-b from-background to-background/80">
        <div className="container px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="flex flex-col items-center rounded-xl border border-border bg-card/50 p-6 text-center backdrop-blur-sm"
            >
              <div className="mb-4 rounded-full bg-primary/20 p-3">
                <Briefcase className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-2xl font-bold">10,000+</h3>
              <p className="text-muted-foreground">Active Job Listings</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center rounded-xl border border-border bg-card/50 p-6 text-center backdrop-blur-sm"
            >
              <div className="mb-4 rounded-full bg-violet-500/20 p-3">
                <Building className="h-8 w-8 text-violet-400" />
              </div>
              <h3 className="mb-2 text-2xl font-bold">5,000+</h3>
              <p className="text-muted-foreground">Companies Hiring</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col items-center rounded-xl border border-border bg-card/50 p-6 text-center backdrop-blur-sm"
            >
              <div className="mb-4 rounded-full bg-primary/20 p-3">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-2xl font-bold">50,000+</h3>
              <p className="text-muted-foreground">Successful Placements</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* For Employers Section */}
      <section className="relative z-10 border-t border-border py-24">
        <div className="container px-4">
          <div className="grid gap-12 items-center md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-6 text-3xl font-bold tracking-tighter sm:text-4xl">For Employers</h2>
              <p className="mb-6 text-muted-foreground">
                Find the perfect candidates for your open positions. Our platform connects you with qualified
                professionals who match your requirements.
              </p>

              <ul className="mb-8 space-y-4">
                {[
                  "Access to thousands of qualified candidates",
                  "Easy-to-use job posting interface",
                  "Advanced filtering and matching algorithms",
                  "Applicant tracking and management tools",
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    viewport={{ once: true }}
                    className="flex items-start"
                  >
                    <CheckCircle2 className="mr-3 h-5 w-5 text-primary" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>

              <Button
                asChild
                className="bg-gradient-to-r from-cyan-400 to-violet-500 text-black hover:from-cyan-500 hover:to-violet-600"
              >
                <Link href="/employers/post-job">
                  Post a Job
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative rounded-xl border border-border bg-card/50 p-1"
            >
              <div className="absolute inset-0 overflow-hidden rounded-xl">
                <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-cyan-500/30 blur-3xl" />
                <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-violet-500/30 blur-3xl" />
              </div>
              <div className="relative aspect-video rounded-lg bg-background/80 p-6 backdrop-blur">
                <div className="flex h-full flex-col items-center justify-center space-y-4">
                  <Building className="h-16 w-16 text-primary" />
                  <h3 className="text-xl font-bold">Employer Dashboard</h3>
                  <p className="text-center text-muted-foreground">
                    Manage your job postings, review applications, and connect with candidates all in one place.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 border-t border-border py-24">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mx-auto max-w-3xl rounded-2xl border border-border bg-gradient-to-r from-cyan-950/50 to-violet-950/50 p-8 text-center backdrop-blur-sm md:p-12"
          >
            <h2 className="mb-4 text-3xl font-bold">Ready to Take the Next Step?</h2>
            <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
              Whether you're looking for your dream job or searching for the perfect candidate, JobConnect is here to
              help.
            </p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 md:justify-center">
              <Button
                asChild
                className="bg-gradient-to-r from-cyan-400 to-violet-500 text-black hover:from-cyan-500 hover:to-violet-600"
              >
                <Link href="/jobs">Find Jobs</Link>
              </Button>
              <Button asChild variant="outline" className="border-border hover:bg-accent">
                <Link href="/employers">For Employers</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
