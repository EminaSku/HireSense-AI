import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// Generate PDF report for an evaluation
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const evaluation = await db.evaluation.findFirst({
      where: { id, ownerId: session.user.id },
      include: {
        candidate: true,
        jobRole: true,
      },
    })

    if (!evaluation) {
      return NextResponse.json({ error: "Evaluation not found" }, { status: 404 })
    }

    // Generate HTML for PDF
    const parseJsonSafe = (json: string | null) => {
      if (!json) return []
      try {
        return JSON.parse(json)
      } catch {
        return []
      }
    }

    const categoryScores = parseJsonSafe(evaluation.categoryScores)
    const whyThisScore = parseJsonSafe(evaluation.whyThisScore)
    const strengths = parseJsonSafe(evaluation.strengths)
    const concerns = parseJsonSafe(evaluation.concerns)
    const gaps = parseJsonSafe(evaluation.gaps)
    const matchedKeywords = parseJsonSafe(evaluation.matchedKeywords)

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Evaluation Report - ${evaluation.candidate.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; padding: 40px; }
    .header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #22c55e; padding-bottom: 20px; }
    .logo { font-size: 24px; font-weight: bold; color: #22c55e; }
    .title { font-size: 32px; margin-top: 10px; }
    .subtitle { color: #666; margin-top: 5px; }
    
    .score-section { display: flex; align-items: center; justify-content: center; gap: 40px; margin: 40px 0; padding: 30px; background: #f8fafc; border-radius: 12px; }
    .score-circle { width: 150px; height: 150px; border-radius: 50%; border: 8px solid #22c55e; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .score-value { font-size: 48px; font-weight: bold; color: #22c55e; }
    .score-label { font-size: 14px; color: #666; }
    
    .section { margin: 30px 0; }
    .section-title { font-size: 20px; font-weight: 600; margin-bottom: 15px; color: #1a1a1a; border-left: 4px solid #22c55e; padding-left: 12px; }
    
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .card { padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; }
    .card-title { font-weight: 600; margin-bottom: 10px; }
    
    .list { list-style: none; }
    .list li { padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
    .list li:last-child { border-bottom: none; }
    
    .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; }
    .badge-success { background: #dcfce7; color: #166534; }
    .badge-warning { background: #fef3c7; color: #92400e; }
    .badge-danger { background: #fee2e2; color: #991b1b; }
    
    .category-bar { margin: 10px 0; }
    .category-label { display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 5px; }
    .bar { height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden; }
    .bar-fill { height: 100%; background: #22c55e; border-radius: 4px; }
    
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #666; font-size: 12px; }
    .disclaimer { background: #fffbeb; padding: 15px; border-radius: 8px; margin-top: 20px; font-size: 12px; color: #92400e; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">HireSense AI</div>
    <h1 class="title">Candidate Evaluation Report</h1>
    <p class="subtitle">Generated on ${new Date(evaluation.createdAt).toLocaleString()}</p>
  </div>

  <div class="score-section">
    <div class="score-circle">
      <span class="score-value">${evaluation.fitScore}%</span>
      <span class="score-label">Fit Score</span>
    </div>
    <div>
      <h2>${evaluation.candidate.name || 'Unknown Candidate'}</h2>
      <p style="color: #666;">for ${evaluation.jobRole.title}</p>
      <p style="margin-top: 10px;">
        <span class="badge ${evaluation.recommendation === 'PROCEED' ? 'badge-success' : evaluation.recommendation === 'MAYBE' ? 'badge-warning' : 'badge-danger'}">
          ${evaluation.recommendation}
        </span>
      </p>
    </div>
  </div>

  ${evaluation.summaryText ? `
  <div class="section">
    <h3 class="section-title">Summary</h3>
    <p>${evaluation.summaryText}</p>
  </div>
  ` : ''}

  <div class="section">
    <h3 class="section-title">Category Scores</h3>
    <div class="card">
      <div class="category-bar">
        <div class="category-label"><span>Skills Match</span><span>${categoryScores.skillsMatch || 0}%</span></div>
        <div class="bar"><div class="bar-fill" style="width: ${categoryScores.skillsMatch || 0}%"></div></div>
      </div>
      <div class="category-bar">
        <div class="category-label"><span>Experience Relevance</span><span>${categoryScores.experienceRelevance || 0}%</span></div>
        <div class="bar"><div class="bar-fill" style="width: ${categoryScores.experienceRelevance || 0}%"></div></div>
      </div>
      <div class="category-bar">
        <div class="category-label"><span>Seniority Fit</span><span>${categoryScores.seniorityFit || 0}%</span></div>
        <div class="bar"><div class="bar-fill" style="width: ${categoryScores.seniorityFit || 0}%"></div></div>
      </div>
      <div class="category-bar">
        <div class="category-label"><span>Domain Fit</span><span>${categoryScores.domainFit || 0}%</span></div>
        <div class="bar"><div class="bar-fill" style="width: ${categoryScores.domainFit || 0}%"></div></div>
      </div>
      <div class="category-bar">
        <div class="category-label"><span>Communication</span><span><span>${categoryScores.communication || 0}%</span></div>
        <div class="bar"><div class="bar-fill" style="width: ${categoryScores.communication || 0}%"></div></div>
      </div>
      <div class="category-bar">
        <div class="category-label"><span>Culture Signals</span><span>${categoryScores.cultureSignals || 0}%</span></div>
        <div class="bar"><div class="bar-fill" style="width: ${categoryScores.cultureSignals || 0}%"></div></div>
      </div>
    </div>
  </div>

  <div class="section">
    <h3 class="section-title">Why This Score</h3>
    <ul class="list">
      ${whyThisScore.map((reason: string) => `<li>• ${reason}</li>`).join('')}
    </ul>
  </div>

  <div class="grid">
    <div class="section">
      <h3 class="section-title" style="color: #22c55e;">Strengths</h3>
      <ul class="list">
        ${strengths.map((s: string) => `<li>• ${s}</li>`).join('')}
      </ul>
    </div>
    <div class="section">
      <h3 class="section-title" style="color: #f59e0b;">Concerns</h3>
      <ul class="list">
        ${concerns.map((c: string) => `<li>• ${c}</li>`).join('')}
      </ul>
    </div>
  </div>

  <div class="grid">
    <div class="section">
      <h3 class="section-title">Matched Keywords</h3>
      <div style="display: flex; flex-wrap: wrap; gap: 8px;">
        ${matchedKeywords.map((k: string) => `<span class="badge badge-success">${k}</span>`).join('')}
      </div>
    </div>
    <div class="section">
      <h3 class="section-title">Gaps</h3>
      <div style="display: flex; flex-wrap: wrap; gap: 8px;">
        ${gaps.map((g: string) => `<span class="badge badge-warning">${g}</span>`).join('')}
      </div>
    </div>
  </div>

  <div class="disclaimer">
    <strong>Disclaimer:</strong> This evaluation is AI-generated and intended to assist recruiters, not replace human judgment. 
    Always verify information and conduct proper interviews before making hiring decisions. 
    The AI does not infer protected characteristics such as age, gender, race, or disability.
  </div>

  <div class="footer">
    <p>Generated by HireSense AI | Model: ${evaluation.modelUsed || 'AI'}</p>
    <p>Confidence: ${evaluation.confidence || 'N/A'}%</p>
  </div>
</body>
</html>
`

    // Return HTML response (can be printed to PDF by the client)
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="evaluation-${evaluation.candidate.name || 'candidate'}-${evaluation.id}.html"`,
      },
    })
  } catch (error) {
    console.error("Error generating PDF:", error)
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    )
  }
}
