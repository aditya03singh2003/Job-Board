"use client"

import { motion } from "framer-motion"
import { Building, Users, Briefcase, Award, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Hero Section */}
      <section className="relative py-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-violet-500/10" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              About{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
                JobConnect
              </span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-300">
              Connecting talented professionals with their dream careers and helping businesses find the perfect
              candidates.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="flex flex-col justify-center"
            >
              <h2 className="mb-6 text-3xl font-bold">Our Mission</h2>
              <p className="mb-4 text-gray-300">
                At JobConnect, we believe that finding the right job or the right candidate shouldn't be a struggle. Our
                mission is to create a seamless connection between employers and job seekers, making the hiring process
                efficient, transparent, and rewarding for everyone involved.
              </p>
              <p className="text-gray-300">
                We're committed to leveraging technology to transform the recruitment landscape, providing innovative
                tools and resources that empower both businesses and professionals to achieve their goals.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="relative rounded-xl border border-white/10 bg-white/5 p-1"
            >
              <div className="absolute inset-0 overflow-hidden rounded-xl">
                <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-cyan-500/30 blur-3xl" />
                <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-violet-500/30 blur-3xl" />
              </div>
              <div className="relative aspect-video rounded-lg bg-gray-900/80 p-6 backdrop-blur">
                <div className="flex h-full flex-col items-center justify-center space-y-4">
                  <div className="rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 p-3">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">Connecting People & Opportunities</h3>
                  <p className="text-center text-gray-300">
                    We've helped over 10,000 job seekers find their perfect role and 1,000+ companies build their dream
                    teams.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-t border-white/10 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Our Impact</h2>
            <p className="mx-auto max-w-2xl text-gray-300">
              We're proud of the difference we've made in the job market and the lives of professionals.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: <Users className="h-8 w-8 text-cyan-400" />, stat: "50,000+", label: "Registered Users" },
              { icon: <Briefcase className="h-8 w-8 text-violet-400" />, stat: "25,000+", label: "Jobs Posted" },
              { icon: <Building className="h-8 w-8 text-cyan-400" />, stat: "5,000+", label: "Companies" },
              { icon: <Award className="h-8 w-8 text-violet-400" />, stat: "95%", label: "Satisfaction Rate" },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="rounded-xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-800">
                  {item.icon}
                </div>
                <h3 className="mb-1 text-3xl font-bold">{item.stat}</h3>
                <p className="text-gray-400">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="border-t border-white/10 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Our Team</h2>
            <p className="mx-auto max-w-2xl text-gray-300">
              Meet the passionate professionals behind JobConnect who are dedicated to transforming the recruitment
              industry.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Alex Johnson", role: "CEO & Founder", image: "/placeholder-user.jpg" },
              { name: "Sarah Chen", role: "CTO", image: "/placeholder-user.jpg" },
              { name: "Michael Rodriguez", role: "Head of Operations", image: "/placeholder-user.jpg" },
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm"
              >
                <div className="aspect-[4/3] w-full">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <div className="p-6">
                  <h3 className="mb-1 text-xl font-bold">{member.name}</h3>
                  <p className="text-gray-400">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-white/10 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-gradient-to-r from-cyan-950/50 to-violet-950/50 p-8 text-center backdrop-blur-sm md:p-12">
            <h2 className="mb-4 text-3xl font-bold">Join Our Community</h2>
            <p className="mx-auto mb-8 max-w-xl text-gray-300">
              Whether you're looking for your next career move or searching for top talent, JobConnect is here to help
              you succeed.
            </p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 md:justify-center">
              <Button className="bg-gradient-to-r from-cyan-400 to-violet-500 text-black hover:from-cyan-500 hover:to-violet-600">
                Find Jobs
              </Button>
              <Button variant="outline" className="border-white/20 hover:bg-white/10">
                For Employers
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="border-t border-white/10 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Our Values</h2>
            <p className="mx-auto max-w-2xl text-gray-300">The principles that guide everything we do at JobConnect.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Innovation",
                description: "We constantly evolve our platform to meet the changing needs of the job market.",
              },
              { title: "Integrity", description: "We believe in transparency and honesty in all our interactions." },
              { title: "Inclusion", description: "We're committed to creating equal opportunities for everyone." },
              { title: "Excellence", description: "We strive for the highest quality in everything we do." },
              {
                title: "Empowerment",
                description: "We provide tools and resources that help people achieve their goals.",
              },
              { title: "Community", description: "We foster connections that go beyond just transactions." },
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-violet-500">
                  <CheckCircle2 className="h-5 w-5 text-black" />
                </div>
                <h3 className="mb-2 text-xl font-bold">{value.title}</h3>
                <p className="text-gray-300">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
