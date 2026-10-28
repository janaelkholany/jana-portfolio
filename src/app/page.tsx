'use client'

import { motion } from 'framer-motion'
import {
  Mail,
  GraduationCap,
  IdCard,
  Layers,
  Building2,
  BookOpen,
  Sparkles,
  FileText,
  CheckCircle2,
  ArrowDown,
} from 'lucide-react'
import { AssignmentsManager } from '@/components/portfolio/assignments-manager'

const studentInfo = [
  { label: 'Student Name', value: 'Jana Mohamed Wahba Elkholany', icon: IdCard },
  { label: 'Student ID', value: '252001142', icon: IdCard },
  { label: 'Department', value: 'Software Engineering', icon: Building2 },
  { label: 'Level', value: '2', icon: Layers },
  { label: 'Course', value: 'Web Design and Development', icon: BookOpen },
  { label: 'Email', value: 'janaelkholany00@gmail.com', icon: Mail, href: 'mailto:janaelkholany00@gmail.com' },
]

const technicalSkills = [
  {
    name: 'Microsoft Excel',
    details: 'Data Entry, Formulas, Data Filtering, VLOOKUP, XLOOKUP, and Table Formatting.',
  },
  {
    name: 'Microsoft Word',
    details: 'Document Formatting, Tables, and PDF Export.',
  },
  {
    name: 'Microsoft PowerPoint',
    details: 'Presentation Design, Slide Formatting, Images, Animations, and Transitions.',
  },
  {
    name: 'Microsoft Access',
    details: 'Basic Database Operations.',
  },
  {
    name: 'Canva',
    details: 'Basic Graphic Design.',
  },
]

const otherSkills = [
  'Attention to Detail',
  'Information Organization',
  'Document Preparation',
  'Typing and Data Entry',
]

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Information', href: '#information' },
  { label: 'Skills', href: '#skills' },
  { label: 'Assignments', href: '#assignments' },
]

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      {/* Decorative top gradient bar */}
      <div className="fixed inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-accent to-primary/60 z-50" />

      {/* Navigation */}
      <header className="sticky top-1 z-40 backdrop-blur-md bg-background/80 border-b border-border/60">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="#top" className="font-serif text-xl font-semibold text-foreground">
            Jana <span className="text-primary">Elkholany</span>
          </a>
          <ul className="hidden md:flex items-center gap-8 text-sm">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#assignments"
            className="hidden md:inline-flex items-center text-sm font-medium text-primary-foreground bg-primary px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
          >
            View Assignments
          </a>
        </nav>
      </header>

      <main id="top" className="flex-1">
        {/* Hero / About */}
        <section
          id="about"
          className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28"
        >
          {/* Decorative blobs */}
          <div className="pointer-events-none absolute -top-32 -right-32 w-96 h-96 rounded-full bg-accent/30 blur-3xl" />
          <div className="pointer-events-none absolute top-40 -left-32 w-80 h-80 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="font-serif text-[2.75rem] sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-foreground tracking-tight"
              >
                Jana Elkholany
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="mt-2 text-lg text-muted-foreground"
              >
                About Me
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="mt-8 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed"
              >
                I am a second-year Software Engineering student at Suez Canal
                University. This portfolio presents my academic information,
                technical skills, and projects related to my studies.
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="mt-10 flex flex-wrap items-center justify-center gap-3"
              >
                <a
                  href="#information"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
                >
                  <GraduationCap className="w-4 h-4" />
                  Student Information
                </a>
                <a
                  href="#assignments"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border bg-card text-foreground font-medium hover:bg-secondary transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Browse Assignments
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.6 }}
                className="mt-16"
              >
                <a href="#information" className="inline-flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                  <span className="text-xs">Scroll to explore</span>
                  <ArrowDown className="w-4 h-4 animate-bounce" />
                </a>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Student Information */}
        <section id="information" className="py-16 sm:py-24 bg-secondary/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Student Information"
              title="Academic Profile"
              description="Official academic details for my studies in the Software Engineering program."
            />

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {studentInfo.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/40 transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                      {item.label}
                    </p>
                  </div>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-foreground font-medium hover:text-primary transition-colors break-all"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-foreground font-medium break-words">
                      {item.value}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Skills */}
        <section id="skills" className="py-16 sm:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Skills"
              title="Technical & Soft Skills"
              description="A combination of hands-on technical abilities and organizational strengths that I bring to every project."
            />

            <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Technical Skills */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-2 mb-6">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  <h3 className="font-serif text-2xl font-semibold text-foreground">Technical Skills</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {technicalSkills.map((skill, i) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-50px' }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                      className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/40 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent/40 text-primary shrink-0">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground mb-1">
                            {skill.name}
                          </p>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {skill.details}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Other Skills */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="font-serif text-2xl font-semibold text-foreground">Other Skills</h3>
                </div>
                <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                  {otherSkills.map((skill, i) => (
                    <motion.div
                      key={skill}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-50px' }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                      <span className="text-foreground text-sm font-medium">{skill}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Assignments */}
        <section id="assignments" className="py-16 sm:py-24 bg-secondary/30 border-t border-b border-border/60">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <AssignmentsManager />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-foreground text-background py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span className="font-serif text-lg font-semibold">Jana Elkholany</span>
            </div>
            <p className="text-background/70">
              Software Engineering · Suez Canal University · Level 2
            </p>
            <a
              href="mailto:janaelkholany00@gmail.com"
              className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Mail className="w-4 h-4" />
              janaelkholany00@gmail.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className="text-center max-w-2xl mx-auto"
    >
      <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-3">
        {eyebrow}
      </p>
      <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground">
        {title}
      </h2>
      <p className="mt-4 text-muted-foreground leading-relaxed">
        {description}
      </p>
    </motion.div>
  )
}
