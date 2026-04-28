# HireSense AI

**AI-Powered Hiring Assistant for Modern Recruiters**

HireSense AI helps recruiters and small agencies screen candidates efficiently using AI-powered CV analysis, intelligent scoring, and tailored interview question generation.

## Features

- 📄 **Smart CV Parsing** - Extract structured data from PDF/DOCX resumes automatically
- 🎯 **Intelligent Scoring** - Get comprehensive fit scores with detailed breakdowns
- 💡 **Interview Kit Generator** - Generate tailored questions based on candidate and role
- 📊 **Analytics Dashboard** - Track your hiring pipeline performance
- 🔗 **Shareable Evaluations** - Create tokenized links for stakeholder sharing
- 🌓 **Dark/Light Mode** - Premium UI with smooth animations

## Quick Start

### 1. Install Dependencies

```bash
bun install
```

### 2. Configure Environment

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and add your configuration:

```env
# Database (SQLite by default)
DATABASE_URL="file:./db/custom.db"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"

# AI Configuration
AI_MODE="cloud"  # or "local"
OPENAI_API_KEY="your-openai-api-key"
```

### 3. Initialize Database

```bash
bun run db:push
```

### 4. Seed Demo Data (Optional)

```bash
curl -X POST http://localhost:3000/api/seed
```

Or use the demo credentials:
- Email: `demo@hiresense.ai`
- Password: `demo123`

### 5. Start Development Server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## AI Configuration

### Cloud LLM (OpenAI)

Set the following environment variables:

```env
AI_MODE="cloud"
OPENAI_API_KEY="sk-..."
OPENAI_MODEL="gpt-4o"  # or gpt-4, gpt-3.5-turbo
```

### Local LLM (LM Studio / Ollama)

1. Start your local LLM server (e.g., LM Studio on port 1234)
2. Configure:

```env
AI_MODE="local"
LOCAL_LLM_BASE_URL="http://localhost:1234/v1"
LOCAL_LLM_MODEL="your-model-name"
```

## Project Structure

```
src/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── candidates/   # Candidate CRUD
│   │   ├── evaluations/  # Evaluation CRUD
│   │   ├── job-roles/    # Job role CRUD
│   │   └── share/        # Shareable links
│   ├── auth/             # Auth pages (signin, signup)
│   ├── dashboard/        # Dashboard pages
│   └── share/            # Shared evaluation view
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── dashboard/        # Dashboard components
│   └── landing/          # Landing page components
└── lib/
    ├── ai-service.ts     # AI integration
    ├── auth.ts           # NextAuth configuration
    ├── db.ts             # Prisma client
    └── file-parser.ts    # PDF/DOCX parsing
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Database**: SQLite (Prisma ORM)
- **Auth**: NextAuth.js v4
- **AI**: OpenAI API (or compatible local LLM)
- **Charts**: Recharts
- **Animations**: Framer Motion

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `GET/POST /api/auth/[...nextauth]` - NextAuth endpoints

### Candidates
- `GET /api/candidates` - List all candidates
- `POST /api/candidates` - Create candidate (with CV upload)
- `GET /api/candidates/:id` - Get candidate details
- `PUT /api/candidates/:id` - Update candidate
- `DELETE /api/candidates/:id` - Delete candidate

### Job Roles
- `GET /api/job-roles` - List all job roles
- `POST /api/job-roles` - Create job role
- `GET /api/job-roles/:id` - Get job role details
- `PUT /api/job-roles/:id` - Update job role
- `DELETE /api/job-roles/:id` - Delete job role

### Evaluations
- `GET /api/evaluations` - List all evaluations
- `POST /api/evaluations` - Create new evaluation
- `GET /api/evaluations/:id` - Get evaluation details
- `DELETE /api/evaluations/:id` - Delete evaluation

### Sharing
- `GET /api/share/:token` - Get shared evaluation

## Deployment

### Production Build

```bash
bun run build
bun run start
```

### Environment Variables for Production

Make sure to set these in your production environment:
- `DATABASE_URL` - Production database URL
- `NEXTAUTH_URL` - Your production domain
- `NEXTAUTH_SECRET` - Secure random string
- `OPENAI_API_KEY` - Your API key

## Disclaimer

This tool is designed to **assist** recruiters, not replace human judgment. All AI-generated evaluations should be reviewed by qualified professionals before making hiring decisions. The system does not infer or consider protected characteristics such as age, gender, race, or disability.

## License

MIT License - See LICENSE file for details.
