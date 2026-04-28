/**
 * AI Service for HireSense
 * Supports Cloud LLM, Local LLM, and Mock modes
 */

interface AIConfig {
  mode: "cloud" | "local" | "mock"
  apiKey?: string
  baseUrl?: string
  model?: string
}

interface ChatMessage {
  role: "system" | "user" | "assistant"
  content: string
}

interface AIResponse {
  content: string
  model: string
  tokensUsed?: number
}

const getAIConfig = (): AIConfig => {
  const mode = (process.env.AI_MODE || "mock") as "cloud" | "local" | "mock"
  
  if (mode === "mock") {
    return { mode: "mock" }
  }
  
  if (mode === "local") {
    return {
      mode: "local",
      baseUrl: process.env.LOCAL_LLM_BASE_URL || "http://localhost:1234/v1",
      model: process.env.LOCAL_LLM_MODEL || "local-model",
    }
  }
  
  return {
    mode: "cloud",
    apiKey: process.env.OPENAI_API_KEY || "",
    baseUrl: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
    model: process.env.OPENAI_MODEL || "gpt-4o",
  }
}

export function isAIConfigured(): boolean {
  const config = getAIConfig()
  if (config.mode === "mock") return false
  if (config.mode === "cloud") return !!config.apiKey
  return true // local mode just needs URL
}

export async function callAI(
  messages: ChatMessage[],
  options?: {
    temperature?: number
    maxTokens?: number
    jsonMode?: boolean
  }
): Promise<AIResponse> {
  const config = getAIConfig()
  
  if (config.mode === "mock") {
    throw new Error("AI is not configured. Please set AI_MODE=cloud or AI_MODE=local in .env and provide the required API keys.")
  }
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }
  
  if (config.mode === "cloud" && config.apiKey) {
    headers["Authorization"] = `Bearer ${config.apiKey}`
  }
  
  const body: Record<string, unknown> = {
    model: config.model,
    messages,
    temperature: options?.temperature ?? 0.7,
    max_tokens: options?.maxTokens ?? 4096,
  }
  
  if (options?.jsonMode) {
    body.response_format = { type: "json_object" }
  }
  
  try {
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })
    
    if (!response.ok) {
      const error = await response.text()
      throw new Error(`AI API error: ${response.status} - ${error}`)
    }
    
    const data = await response.json()
    
    return {
      content: data.choices[0].message.content,
      model: config.model || "unknown",
      tokensUsed: data.usage?.total_tokens,
    }
  } catch (error) {
    console.error("AI call failed:", error)
    throw error
  }
}

// Mock data for CV parsing when AI is not available
function getMockCVParsing(): {
  name: string | null
  email: string | null
  phone: string | null
  location: string | null
  linkedin: string | null
  website: string | null
  github: string | null
  summary: string | null
  skills: string[]
  experience: Array<{
    title: string
    company: string
    startDate: string
    endDate: string | null
    description: string
  }>
  education: Array<{
    degree: string
    institution: string
    year: string
    field?: string
  }>
  certifications: string[]
  languages: string[]
  projects: Array<{
    name: string
    description: string
    technologies?: string[]
  }>
} {
  return {
    name: "Extracted from CV",
    email: null,
    phone: null,
    location: null,
    linkedin: null,
    website: null,
    github: null,
    summary: "This candidate's CV was uploaded. Enable AI by configuring OPENAI_API_KEY in .env to enable automatic CV parsing.",
    skills: ["Enable AI for skill extraction"],
    experience: [],
    education: [],
    certifications: [],
    languages: [],
    projects: [],
  }
}

// CV Parsing - Extract structured data from CV text
export async function parseCV(cvText: string): Promise<{
  name: string | null
  email: string | null
  phone: string | null
  location: string | null
  linkedin: string | null
  website: string | null
  github: string | null
  summary: string | null
  skills: string[]
  experience: Array<{
    title: string
    company: string
    startDate: string
    endDate: string | null
    description: string
  }>
  education: Array<{
    degree: string
    institution: string
    year: string
    field?: string
  }>
  certifications: string[]
  languages: string[]
  projects: Array<{
    name: string
    description: string
    technologies?: string[]
  }>
}> {
  const config = getAIConfig()
  
  // Return mock data if AI is not configured
  if (config.mode === "mock") {
    // Try to extract basic info using regex without AI
    const emailMatch = cvText.match(/[\w.-]+@[\w.-]+\.\w+/)
    const phoneMatch = cvText.match(/[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/)
    
    return {
      name: "CV Uploaded (AI parsing disabled)",
      email: emailMatch ? emailMatch[0] : null,
      phone: phoneMatch ? phoneMatch[0] : null,
      location: null,
      linkedin: null,
      website: null,
      github: null,
      summary: "Configure OPENAI_API_KEY in .env file to enable AI-powered CV parsing. The CV text has been saved and can be viewed in the candidate details.",
      skills: [],
      experience: [],
      education: [],
      certifications: [],
      languages: [],
      projects: [],
    }
  }

  const systemPrompt = `You are an expert CV parser. Extract structured data from the CV text provided.
Return ONLY valid JSON with the following structure. Use null for missing fields, empty arrays for missing lists.
Be accurate and only extract information that is clearly present in the CV.
Do NOT infer or hallucinate any information.

Important guidelines:
- For dates, use YYYY-MM format when possible, or original format if unclear
- Extract skills as a simple array of strings (normalize common variations like "JS" to "JavaScript")
- For experience descriptions, summarize key responsibilities briefly
- Do NOT infer gender, age, or other protected characteristics`;

  const userPrompt = `Parse this CV and return structured JSON:\n\n${cvText}`

  try {
    const response = await callAI(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      { temperature: 0.3, jsonMode: true }
    )

    return JSON.parse(response.content)
  } catch (error) {
    console.error("CV parsing error:", error)
    // Return basic extraction on error
    const emailMatch = cvText.match(/[\w.-]+@[\w.-]+\.\w+/)
    const phoneMatch = cvText.match(/[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/)
    
    return {
      name: null,
      email: emailMatch ? emailMatch[0] : null,
      phone: phoneMatch ? phoneMatch[0] : null,
      location: null,
      linkedin: null,
      website: null,
      github: null,
      summary: "CV uploaded but AI parsing failed. Please try again or manually edit the candidate information.",
      skills: [],
      experience: [],
      education: [],
      certifications: [],
      languages: [],
      projects: [],
    }
  }
}

// Mock evaluation data
function getMockEvaluation(candidateName: string | null, jobTitle: string) {
  return {
    fitScore: 50,
    categoryScores: {
      skillsMatch: 50,
      experienceRelevance: 50,
      seniorityFit: 50,
      domainFit: 50,
      communication: 50,
      cultureSignals: 50,
    },
    whyThisScore: [
      "AI evaluation is not configured. Enable AI by setting OPENAI_API_KEY in .env file.",
      "This is a placeholder evaluation score.",
      "Configure AI to get accurate candidate evaluations.",
      "The evaluation will include skills matching, experience analysis, and more.",
      "Interview questions will also be generated automatically.",
    ],
    matchedKeywords: [],
    gaps: ["AI not configured - cannot determine gaps"],
    riskFlags: [],
    strengths: ["Configure AI for accurate strength analysis"],
    concerns: ["AI evaluation disabled"],
    recommendation: "MAYBE" as const,
    confidence: 20,
  }
}

// Evaluation scoring
export async function evaluateCandidate(
  candidateData: {
    name: string | null
    summary: string | null
    skills: string[]
    experience: Array<{
      title: string
      company: string
      startDate: string
      endDate: string | null
      description: string
    }>
    education: Array<{
      degree: string
      institution: string
      year: string
    }>
  },
  jobRole: {
    title: string
    seniority: string | null
    requiredSkills: string[]
    niceToHaveSkills: string[]
    yearsExperience: string | null
    responsibilities: string[]
    mustHaveKeywords: string[]
  }
): Promise<{
  fitScore: number
  categoryScores: {
    skillsMatch: number
    experienceRelevance: number
    seniorityFit: number
    domainFit: number
    communication: number
    cultureSignals: number
  }
  whyThisScore: string[]
  matchedKeywords: string[]
  gaps: string[]
  riskFlags: string[]
  strengths: string[]
  concerns: string[]
  recommendation: "PROCEED" | "MAYBE" | "NO"
  confidence: number
}> {
  const config = getAIConfig()
  
  // Return mock evaluation if AI is not configured
  if (config.mode === "mock") {
    return getMockEvaluation(candidateData.name, jobRole.title)
  }

  const systemPrompt = `You are an expert technical recruiter and hiring consultant. Evaluate candidates against job requirements objectively.
Return ONLY valid JSON. Be fair, objective, and avoid any bias based on protected characteristics.
Focus on skills, experience, and qualifications only.
Provide actionable insights for recruiters.

Scoring guidelines:
- 0-30: Poor fit, significant gaps
- 31-50: Below average fit, notable concerns
- 51-70: Moderate fit, some gaps but potential
- 71-85: Good fit, minor gaps
- 86-100: Excellent fit, highly qualified`;

  const userPrompt = `Evaluate this candidate for the job role:

CANDIDATE:
Name: ${candidateData.name || "Unknown"}
Summary: ${candidateData.summary || "Not provided"}
Skills: ${candidateData.skills.join(", ")}
Experience (${candidateData.experience.length} roles):
${candidateData.experience.map(e => `- ${e.title} at ${e.company} (${e.startDate} - ${e.endDate || "Present"}): ${e.description}`).join("\n")}
Education: ${candidateData.education.map(e => `${e.degree} from ${e.institution}`).join(", ")}

JOB REQUIREMENTS:
Title: ${jobRole.title}
Seniority: ${jobRole.seniority || "Not specified"}
Required Skills: ${jobRole.requiredSkills.join(", ")}
Nice-to-Have: ${jobRole.niceToHaveSkills.join(", ")}
Years Experience: ${jobRole.yearsExperience || "Not specified"}
Key Responsibilities: ${jobRole.responsibilities.join("; ")}
Must-Have Keywords: ${jobRole.mustHaveKeywords.join(", ")}

Return JSON with: fitScore (0-100), categoryScores (0-100 each for skillsMatch, experienceRelevance, seniorityFit, domainFit, communication, cultureSignals), whyThisScore (array of 5-8 explanation bullets), matchedKeywords (array), gaps (array of missing requirements), riskFlags (array of potential concerns like job hopping, gaps in timeline - be fair and not harsh), strengths (array of 5), concerns (array of 5), recommendation ("PROCEED", "MAYBE", or "NO"), confidence (0-100).`;

  try {
    const response = await callAI(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      { temperature: 0.4, jsonMode: true }
    )

    return JSON.parse(response.content)
  } catch (error) {
    console.error("Evaluation error:", error)
    return getMockEvaluation(candidateData.name, jobRole.title)
  }
}

// Generate Interview Questions
export async function generateInterviewKit(
  candidateData: {
    name: string | null
    skills: string[]
    experience: Array<{
      title: string
      company: string
      description: string
    }>
  },
  jobRole: {
    title: string
    requiredSkills: string[]
    responsibilities: string[]
    seniority: string | null
  },
  evaluationGaps: string[]
): Promise<{
  technical: Array<{
    question: string
    tests: string
    strongAnswerSignals: string
  }>
  systemDesign: Array<{
    question: string
    tests: string
    strongAnswerSignals: string
  }>
  behavioral: Array<{
    question: string
    tests: string
    strongAnswerSignals: string
  }>
  culture: Array<{
    question: string
    tests: string
    strongAnswerSignals: string
  }>
  redFlagClarification: Array<{
    question: string
    tests: string
    strongAnswerSignals: string
  }>
}> {
  const config = getAIConfig()
  
  // Return mock questions if AI is not configured
  if (config.mode === "mock") {
    return {
      technical: [
        { question: "Configure AI to generate tailored technical questions based on the job requirements.", tests: "N/A", strongAnswerSignals: "N/A" },
        { question: "Tell me about your experience with the technologies listed in your CV.", tests: "Experience depth", strongAnswerSignals: "Specific examples, metrics, outcomes" },
        { question: "Describe a challenging technical problem you solved recently.", tests: "Problem-solving ability", strongAnswerSignals: "Clear problem definition, approach, solution, learnings" },
      ],
      systemDesign: [],
      behavioral: [
        { question: "Tell me about a time you had to work with a difficult team member.", tests: "Conflict resolution", strongAnswerSignals: "Constructive approach, positive outcome" },
        { question: "Describe a project where you had to learn something new quickly.", tests: "Learning ability", strongAnswerSignals: "Quick adaptation, resourcefulness" },
        { question: "How do you handle tight deadlines and pressure?", tests: "Stress management", strongAnswerSignals: "Prioritization, communication, delivery" },
      ],
      culture: [
        { question: "What kind of work environment do you thrive in?", tests: "Culture fit", strongAnswerSignals: "Alignment with company values" },
        { question: "How do you approach collaboration with other teams?", tests: "Cross-functional skills", strongAnswerSignals: "Communication, empathy, results" },
      ],
      redFlagClarification: [
        { question: "Is there anything in your career history you'd like to explain?", tests: "Transparency", strongAnswerSignals: "Honest, self-aware response" },
        { question: "What are your salary expectations?", tests: "Alignment", strongAnswerSignals: "Realistic expectations, flexibility" },
      ],
    }
  }

  const systemPrompt = `You are an expert interviewer. Generate tailored interview questions based on the candidate's background and the job requirements.
Return ONLY valid JSON. Questions should be specific, relevant, and help assess the candidate fairly.
Each question should have clear evaluation criteria.`;

  const userPrompt = `Generate 12 interview questions for:

CANDIDATE:
Skills: ${candidateData.skills.join(", ")}
Experience: ${candidateData.experience.map(e => `${e.title} at ${e.company}`).join(", ")}

JOB:
Title: ${jobRole.title}
Required Skills: ${jobRole.requiredSkills.join(", ")}
Key Responsibilities: ${jobRole.responsibilities.slice(0, 5).join("; ")}
Seniority: ${jobRole.seniority || "Not specified"}

GAPS TO PROBE:
${evaluationGaps.join("\n")}

Return JSON with 5 categories:
- technical: 3 questions (role-specific technical skills)
- systemDesign: 2 questions (architecture and design thinking, skip if junior role)
- behavioral: 3 questions (STAR format, soft skills)
- culture: 2 questions (team fit, values)
- redFlagClarification: 2 questions (address gaps/concerns diplomatically)

Each question object has: question (string), tests (what this question evaluates), strongAnswerSignals (what a good answer looks like).`;

  try {
    const response = await callAI(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      { temperature: 0.6, jsonMode: true }
    )

    return JSON.parse(response.content)
  } catch (error) {
    console.error("Interview kit generation error:", error)
    return {
      technical: [],
      systemDesign: [],
      behavioral: [],
      culture: [],
      redFlagClarification: [],
    }
  }
}

// Generate Recruiter Summary
export async function generateRecruiterSummary(
  candidateName: string | null,
  jobTitle: string,
  evaluation: {
    fitScore: number
    strengths: string[]
    concerns: string[]
    recommendation: string
  }
): Promise<string> {
  const config = getAIConfig()
  
  if (config.mode === "mock") {
    return `${candidateName || "This candidate"} has been evaluated for the ${jobTitle} position. 
The evaluation shows a fit score of ${evaluation.fitScore}%. 
Configure AI by setting OPENAI_API_KEY in your .env file to get detailed summaries, 
accurate fit scores, and tailored interview questions.`
  }

  const systemPrompt = `You are an expert recruiter writing concise candidate summaries. Write clear, professional summaries that help hiring managers make decisions.`;

  const userPrompt = `Write a 1-paragraph recruiter summary for:
Candidate: ${candidateName || "The candidate"}
Role: ${jobTitle}
Fit Score: ${evaluation.fitScore}/100
Strengths: ${evaluation.strengths.join("; ")}
Concerns: ${evaluation.concerns.join("; ")}
Recommendation: ${evaluation.recommendation}

Write 2-3 professional sentences summarizing the candidate's fit for this role.`;

  try {
    const response = await callAI(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      { temperature: 0.5 }
    )

    return response.content
  } catch (error) {
    console.error("Summary generation error:", error)
    return `Evaluation completed for ${candidateName || "candidate"}. Fit score: ${evaluation.fitScore}%. Recommendation: ${evaluation.recommendation}.`
  }
}
