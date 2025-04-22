"use client"

import { motion } from "framer-motion"
import { ArrowRight, Building, CheckCircle2, FileText, Users } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function EmployersPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 pt-32">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-violet-500/10" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Find the{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
                  Perfect Talent
                </span>{" "}
                for Your Team
              </h1>
              <p className="mb-8 text-lg text-gray-300">
                Connect with qualified candidates who match your requirements and help your business grow.
              </p>
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <Button
                  asChild
                  className="bg-gradient-to-r from-cyan-400 to-violet-500 text-black hover:from-cyan-500 hover:to-violet-600"
                >
                  <Link href="/employers/post-job">
                    Post a Job
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-white/20 hover:bg-white/10">
                  <Link href="/auth/login?userType=employer">Employer Login</Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative rounded-xl border border-white/10 bg-white/5 p-1"
            >
              <div className="absolute inset-0 overflow-hidden rounded-xl">
                <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-cyan-500/30 blur-3xl" />
                <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-violet-500/30 blur-3xl" />
              </div>
              <div className="relative aspect-video rounded-lg bg-gray-900/80 p-6 backdrop-blur">
                <div className="flex h-full flex-col items-center justify-center space-y-4">
                  <Building className="h-16 w-16 text-cyan-400" />
                  <h3 className="text-xl font-bold">Employer Dashboard</h3>
                  <p className="text-center text-gray-400">
                    Manage your job postings, review applications, and connect with candidates all in one place.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold">Why Choose JobConnect?</h2>
            <p className="mx-auto max-w-2xl text-gray-400">
              Our platform offers powerful tools and features to help you find the right candidates efficiently.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: <Users className="h-10 w-10 text-cyan-400" />,
                title: "Access to Quality Candidates",
                description:
                  "Connect with thousands of qualified professionals actively looking for new opportunities.",
              },
              {
                icon: <FileText className="h-10 w-10 text-violet-400" />,
                title: "Easy Job Posting",
                description: "Create and publish job listings in minutes with our user-friendly interface.",
              },
              {
                icon: <Building className="h-10 w-10 text-cyan-400" />,
                title: "Company Branding",
                description: "Showcase your company culture and values to attract the right talent.",
              },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
              >
                <div className="mb-4 rounded-full bg-gray-800 p-3 inline-flex">{benefit.icon}</div>
                <h3 className="mb-2 text-xl font-bold">{benefit.title}</h3>
                <p className="text-gray-400">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="border-t border-white/10 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold">How It Works</h2>
            <p className="mx-auto max-w-2xl text-gray-400">
              Our simple process helps you find the right candidates quickly and efficiently.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-4">
            {[
              {
                number: "01",
                title: "Create an Account",
                description: "Sign up as an employer and complete your company profile.",
              },
              {
                number: "02",
                title: "Post a Job",
                description: "Create a detailed job listing with all requirements and benefits.",
              },
              {
                number: "03",
                title: "Review Applications",
                description: "Receive applications and review candidate profiles.",
              },
              {
                number: "04",
                title: "Connect with Candidates",
                description: "Contact promising candidates and schedule interviews.",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
              >
                <div className="absolute -top-4 -right-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 text-black font-bold">
                  {step.number}
                </div>
                <h3 className="mb-2 text-xl font-bold">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="border-t border-white/10 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold">Simple, Transparent Pricing</h2>
            <p className="mx-auto max-w-2xl text-gray-400">Choose the plan that works best for your hiring needs.</p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                name: "Basic",
                price: "₹4,999",
                period: "per month",
                description: "Perfect for small businesses with occasional hiring needs.",
                features: [
                  "Up to 3 active job postings",
                  "Basic candidate filtering",
                  "Email support",
                  "30-day job listing",
                ],
                cta: "Get Started",
                popular: false,
              },
              {
                name: "Professional",
                price: "₹9,999",
                period: "per month",
                description: "Ideal for growing companies with regular hiring requirements.",
                features: [
                  "Up to 10 active job postings",
                  "Advanced candidate filtering",
                  "Priority email support",
                  "45-day job listing",
                  "Featured job listings",
                ],
                cta: "Get Started",
                popular: true,
              },
              {
                name: "Enterprise",
                price: "₹19,999",
                period: "per month",
                description: "For large organizations with extensive recruitment needs.",
                features: [
                  "Unlimited job postings",
                  "Premium candidate filtering",
                  "24/7 phone & email support",
                  "60-day job listing",
                  "Featured job listings",
                  "Dedicated account manager",
                ],
                cta: "Contact Sales",
                popular: false,
              },
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative rounded-xl border backdrop-blur-sm ${
                  plan.popular
                    ? "border-cyan-400/50 bg-gradient-to-b from-cyan-950/30 to-violet-950/30"
                    : "border-white/10 bg-white/5"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 py-1 text-center text-sm font-medium text-black">
                    Most Popular
                  </div>
                )}
                <Card className="border-0 bg-transparent">
                  <CardContent className="p-6">
                    <div className="mb-4 text-center">
                      <h3 className="text-xl font-bold">{plan.name}</h3>
                      <div className="mt-4 flex items-baseline justify-center">
                        <span className="text-4xl font-bold">{plan.price}</span>
                        <span className="ml-1 text-sm text-gray-400">{plan.period}</span>
                      </div>
                      <p className="mt-2 text-sm text-gray-400">{plan.description}</p>
                    </div>

                    <div className="mt-6 space-y-4">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start">
                          <CheckCircle2 className="mr-3 h-5 w-5 text-cyan-400" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      className={`mt-8 w-full ${
                        plan.popular
                          ? "bg-gradient-to-r from-cyan-400 to-violet-500 text-black hover:from-cyan-500 hover:to-violet-600"
                          : "bg-white/10 hover:bg-white/20"
                      }`}
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="border-t border-white/10 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold">What Our Clients Say</h2>
            <p className="mx-auto max-w-2xl text-gray-400">
              Hear from employers who have found success with JobConnect.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                quote:
                  "JobConnect has transformed our hiring process. We've found exceptional talent quickly and efficiently.",
                author: "Priya Sharma",
                position: "HR Director",
                company: "TechSolutions India",
              },
              {
                quote:
                  "The quality of candidates we've connected with through JobConnect has been outstanding. Highly recommended!",
                author: "Rajiv Mehta",
                position: "CEO",
                company: "Innovate Labs",
              },
              {
                quote:
                  "As a startup, finding the right talent is crucial. JobConnect made it easy to find candidates who align with our vision.",
                author: "Ananya Patel",
                position: "Founder",
                company: "GrowthWorks",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
              >
                <div className="mb-4 text-lg italic text-gray-300">"{testimonial.quote}"</div>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-gray-400">
                    {testimonial.position}, {testimonial.company}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-white/10 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-gradient-to-r from-cyan-950/50 to-violet-950/50 p-8 text-center backdrop-blur-sm md:p-12"
          >
            <h2 className="mb-4 text-3xl font-bold">Ready to Find Your Next Great Hire?</h2>
            <p className="mx-auto mb-8 max-w-xl text-gray-400">
              Join thousands of companies that trust JobConnect for their hiring needs.
            </p>
            <Button
              asChild
              className="bg-gradient-to-r from-cyan-400 to-violet-500 text-black hover:from-cyan-500 hover:to-violet-600"
            >
              <Link href="/employers/post-job">
                Post a Job Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
