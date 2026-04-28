import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import * as bcrypt from "bcryptjs"

// Demo data for seeding
export async function POST() {
  try {
    // Create demo user
    const hashedPassword = await bcrypt.hash("demo123", 10)
    
    const user = await db.user.upsert({
      where: { email: "demo@hiresense.ai" },
      update: {},
      create: {
        email: "demo@hiresense.ai",
        name: "Demo User",
        password: hashedPassword,
        role: "ADMIN",
      },
    })

    // Create demo job roles
    const jobRole1 = await db.jobRole.upsert({
      where: { id: "demo-role-1" },
      update: {},
      create: {
        id: "demo-role-1",
        ownerId: user.id,
        title: "Senior Software Engineer",
        department: "Engineering",
        seniority: "Senior",
        location: "San Francisco",
        remoteType: "Remote",
        jdText: `We are looking for a Senior Software Engineer to join our growing team. You will be responsible for designing, developing, and maintaining scalable web applications.

Key Responsibilities:
- Design and implement high-quality software solutions
- Lead technical discussions and mentor junior developers
- Collaborate with cross-functional teams
- Write clean, maintainable, and well-documented code

Requirements:
- 5+ years of experience in software development
- Strong proficiency in React, TypeScript, and Node.js
- Experience with cloud services (AWS, GCP)
- Excellent problem-solving skills
- Strong communication abilities`,
        requiredSkills: JSON.stringify(["React", "TypeScript", "Node.js", "AWS", "PostgreSQL"]),
        niceToHaveSkills: JSON.stringify(["GraphQL", "Docker", "Kubernetes", "Redis"]),
        responsibilities: JSON.stringify(["Design software solutions", "Mentor developers", "Code reviews"]),
        yearsExperience: "5+ years",
        salaryMin: 150000,
        salaryMax: 200000,
        mustHaveKeywords: JSON.stringify(["React", "TypeScript", "Node.js"]),
      },
    })

    const jobRole2 = await db.jobRole.upsert({
      where: { id: "demo-role-2" },
      update: {},
      create: {
        id: "demo-role-2",
        ownerId: user.id,
        title: "Product Manager",
        department: "Product",
        seniority: "Mid",
        location: "New York",
        remoteType: "Hybrid",
        jdText: `We are seeking a Product Manager to drive product strategy and execution. You will work closely with engineering, design, and business teams.

Key Responsibilities:
- Define product roadmap and priorities
- Gather and analyze customer feedback
- Work with engineering to deliver features
- Measure and optimize product performance

Requirements:
- 3+ years of product management experience
- Strong analytical and problem-solving skills
- Excellent communication and leadership
- Experience with agile methodologies
- Technical background is a plus`,
        requiredSkills: JSON.stringify(["Product Strategy", "Agile", "Data Analysis", "User Research"]),
        niceToHaveSkills: JSON.stringify(["SQL", "A/B Testing", "Technical Background"]),
        responsibilities: JSON.stringify(["Define roadmap", "Customer research", "Feature prioritization"]),
        yearsExperience: "3-5 years",
        salaryMin: 120000,
        salaryMax: 160000,
        mustHaveKeywords: JSON.stringify(["Product Management", "Agile"]),
      },
    })

    // Create demo candidates
    const candidate1 = await db.candidate.upsert({
      where: { id: "demo-candidate-1" },
      update: {},
      create: {
        id: "demo-candidate-1",
        ownerId: user.id,
        name: "John Doe",
        email: "john.doe@email.com",
        phone: "+1-555-123-4567",
        location: "San Francisco, CA",
        linkedin: "linkedin.com/in/johndoe",
        github: "github.com/johndoe",
        summary: "Senior Software Engineer with 7+ years of experience building scalable web applications. Passionate about clean code, mentorship, and delivering impactful products.",
        skills: JSON.stringify(["JavaScript", "TypeScript", "React", "Node.js", "Python", "AWS", "PostgreSQL", "GraphQL", "Docker"]),
        experience: JSON.stringify([
          {
            title: "Senior Software Engineer",
            company: "TechCorp Inc.",
            startDate: "2020-03",
            endDate: null,
            description: "Lead a team of 5 engineers building microservices architecture. Reduced API response time by 40%. Mentored 3 junior developers."
          },
          {
            title: "Software Engineer",
            company: "StartupXYZ",
            startDate: "2017-06",
            endDate: "2020-02",
            description: "Built React frontend and Node.js backend for SaaS platform. Implemented CI/CD pipelines and automated testing."
          }
        ]),
        education: JSON.stringify([
          {
            degree: "B.S. Computer Science",
            institution: "University of California, Berkeley",
            year: "2017"
          }
        ]),
        certifications: JSON.stringify(["AWS Solutions Architect", "Google Cloud Professional"]),
        languages: JSON.stringify(["English (Native)", "Spanish (Conversational)"]),
        projects: JSON.stringify([
          {
            name: "Open Source CLI Tool",
            description: "Built a popular CLI tool with 500+ GitHub stars",
            technologies: ["Go", "Cobra"]
          }
        ]),
        status: "NEW",
        cvText: "Senior Software Engineer with 7+ years of experience...",
        extractedJson: JSON.stringify({
          name: "John Doe",
          email: "john.doe@email.com",
          skills: ["JavaScript", "TypeScript", "React", "Node.js", "AWS"]
        }),
      },
    })

    const candidate2 = await db.candidate.upsert({
      where: { id: "demo-candidate-2" },
      update: {},
      create: {
        id: "demo-candidate-2",
        ownerId: user.id,
        name: "Sarah Chen",
        email: "sarah.chen@email.com",
        phone: "+1-555-987-6543",
        location: "Seattle, WA",
        linkedin: "linkedin.com/in/sarahchen",
        summary: "Product Manager with 4 years of experience in B2B SaaS. Strong background in user research and data-driven decision making.",
        skills: JSON.stringify(["Product Strategy", "Agile", "Scrum", "Data Analysis", "SQL", "User Research", "Figma"]),
        experience: JSON.stringify([
          {
            title: "Product Manager",
            company: "EnterpriseSoft",
            startDate: "2021-01",
            endDate: null,
            description: "Led product strategy for B2B analytics platform. Increased user engagement by 35%. Managed roadmap for team of 8 engineers."
          },
          {
            title: "Associate Product Manager",
            company: "DataDriven Co.",
            startDate: "2019-06",
            endDate: "2020-12",
            description: "Conducted user interviews and analyzed product metrics. Launched 3 major features that drove $2M in revenue."
          }
        ]),
        education: JSON.stringify([
          {
            degree: "B.A. Economics",
            institution: "Stanford University",
            year: "2019"
          }
        ]),
        certifications: JSON.stringify(["CSM - Certified Scrum Master"]),
        languages: JSON.stringify(["English (Native)", "Mandarin (Fluent)"]),
        projects: JSON.stringify([]),
        status: "SCREENING",
        cvText: "Product Manager with 4 years of experience...",
        extractedJson: JSON.stringify({
          name: "Sarah Chen",
          email: "sarah.chen@email.com",
          skills: ["Product Strategy", "Agile", "Data Analysis"]
        }),
      },
    })

    // Create demo evaluations
    const evaluation1 = await db.evaluation.upsert({
      where: { id: "demo-eval-1" },
      update: {},
      create: {
        id: "demo-eval-1",
        ownerId: user.id,
        jobRoleId: jobRole1.id,
        candidateId: candidate1.id,
        fitScore: 85,
        categoryScores: JSON.stringify({
          skillsMatch: 90,
          experienceRelevance: 85,
          seniorityFit: 88,
          domainFit: 82,
          communication: 80,
          cultureSignals: 85
        }),
        whyThisScore: JSON.stringify([
          "Strong technical skills match with React, TypeScript, and Node.js requirements",
          "7+ years of experience exceeds the 5-year requirement",
          "AWS certification demonstrates cloud expertise",
          "Leadership experience aligns with senior role expectations",
          "Gap in PostgreSQL experience, but has transferable database skills"
        ]),
        matchedKeywords: JSON.stringify(["React", "TypeScript", "Node.js", "AWS", "Mentorship", "Leadership"]),
        gaps: JSON.stringify(["Limited PostgreSQL experience mentioned", "No Kubernetes experience"]),
        riskFlags: JSON.stringify(["Current role is 4 years - may be comfortable", "Salary expectations may exceed range"]),
        interviewKitJson: JSON.stringify({
          technical: [
            {
              question: "Describe a complex React performance issue you solved. What tools did you use?",
              tests: "React expertise and problem-solving",
              strongAnswerSignals: "Mentions profiling tools, identifies bottlenecks, discusses optimization strategies"
            },
            {
              question: "How would you design a microservices architecture for a high-traffic e-commerce platform?",
              tests: "System design and scalability knowledge",
              strongAnswerSignals: "Discusses service boundaries, data consistency, caching, monitoring"
            },
            {
              question: "Tell me about a time you had to make a technical decision with incomplete information.",
              tests: "Decision-making and risk assessment",
              strongAnswerSignals: "Structured approach, considers tradeoffs, validates assumptions"
            }
          ],
          behavioral: [
            {
              question: "Describe a situation where you had to mentor a struggling team member.",
              tests: "Leadership and empathy",
              strongAnswerSignals: "Specific examples, tailored approach, positive outcome"
            },
            {
              question: "Tell me about a time you disagreed with a technical decision. How did you handle it?",
              tests: "Communication and conflict resolution",
              strongAnswerSignals: "Data-driven argument, open to feedback, team-first approach"
            }
          ],
          culture: [
            {
              question: "What does ideal collaboration look like to you?",
              tests: "Team fit and communication style",
              strongAnswerSignals: "Values transparency, diverse perspectives, constructive feedback"
            }
          ],
          redFlagClarification: [
            {
              question: "You've been at your current company for 4 years. What's motivating your move now?",
              tests: "Career motivation and commitment",
              strongAnswerSignals: "Growth seeking, new challenges, aligned with role"
            }
          ]
        }),
        summaryText: "John Doe is a strong candidate for the Senior Software Engineer role, demonstrating excellent technical skills in React, TypeScript, and Node.js. With 7+ years of experience and leadership background, he meets the seniority requirements well. Minor gaps in PostgreSQL can be addressed through onboarding. Recommended for technical interview.",
        strengths: JSON.stringify([
          "Excellent technical skill alignment with role requirements",
          "Strong leadership and mentorship experience",
          "AWS certification shows commitment to cloud expertise",
          "Good tenure at previous companies",
          "Open source contributions demonstrate passion"
        ]),
        concerns: JSON.stringify([
          "Limited PostgreSQL experience may require training",
          "Salary expectations should be clarified early",
          "No Kubernetes experience for containerization needs",
          "4 years at current role - verify motivation for change",
          "Remote work experience should be confirmed"
        ]),
        recommendation: "PROCEED",
        confidence: 88,
        modelUsed: "gpt-4o",
      },
    })

    const evaluation2 = await db.evaluation.upsert({
      where: { id: "demo-eval-2" },
      update: {},
      create: {
        id: "demo-eval-2",
        ownerId: user.id,
        jobRoleId: jobRole2.id,
        candidateId: candidate2.id,
        fitScore: 68,
        categoryScores: JSON.stringify({
          skillsMatch: 75,
          experienceRelevance: 70,
          seniorityFit: 60,
          domainFit: 72,
          communication: 80,
          cultureSignals: 55
        }),
        whyThisScore: JSON.stringify([
          "Product management skills align well with requirements",
          "4 years experience is below the 5+ year preference",
          "Strong data analysis and user research background",
          "B2B SaaS experience is valuable",
          "Missing some technical depth for engineering collaboration"
        ]),
        matchedKeywords: JSON.stringify(["Product Strategy", "Agile", "User Research", "Data Analysis"]),
        gaps: JSON.stringify(["Years of experience below preference", "Limited technical background", "No A/B testing experience mentioned"]),
        riskFlags: JSON.stringify(["Experience below preferred level", "Career progression slower than typical"]),
        interviewKitJson: JSON.stringify({
          technical: [
            {
              question: "How do you prioritize features when you have limited engineering resources?",
              tests: "Prioritization and stakeholder management",
              strongAnswerSignals: "Data-driven approach, stakeholder alignment, clear framework"
            }
          ],
          behavioral: [
            {
              question: "Tell me about a product launch that didn't meet expectations. What did you learn?",
              tests: "Self-awareness and growth mindset",
              strongAnswerSignals: "Takes ownership, identifies specific learnings, applied to future work"
            }
          ],
          culture: [
            {
              question: "How do you build trust with engineering teams?",
              tests: "Cross-functional collaboration",
              strongAnswerSignals: "Values technical input, clear communication, shared ownership"
            }
          ],
          redFlagClarification: [
            {
              question: "Your experience is on the lower end for this role. How would you ramp up quickly?",
              tests: "Self-awareness and growth potential",
              strongAnswerSignals: "Specific learning plan, proactive approach, leverages existing strengths"
            }
          ]
        }),
        summaryText: "Sarah Chen shows good product management fundamentals with relevant B2B SaaS experience. While her 4 years of experience is below the preferred level, she demonstrates strong analytical skills and user research capabilities. Consider for interview if open to developing candidates.",
        strengths: JSON.stringify([
          "Strong product management fundamentals",
          "Relevant B2B SaaS experience",
          "Good data analysis skills",
          "User research background",
          "Clear career progression"
        ]),
        concerns: JSON.stringify([
          "Experience below preferred level",
          "Limited technical background for engineering collaboration",
          "No A/B testing experience",
          "May need more mentorship than typical",
          "Salary expectations unknown"
        ]),
        recommendation: "MAYBE",
        confidence: 72,
        modelUsed: "gpt-4o",
      },
    })

    return NextResponse.json({
      success: true,
      message: "Demo data seeded successfully",
      data: {
        user: { email: user.email, name: user.name },
        jobRoles: [jobRole1.title, jobRole2.title],
        candidates: [candidate1.name, candidate2.name],
        evaluations: [evaluation1.id, evaluation2.id]
      }
    })
  } catch (error) {
    console.error("Seed error:", error)
    return NextResponse.json(
      { error: "Failed to seed demo data" },
      { status: 500 }
    )
  }
}
