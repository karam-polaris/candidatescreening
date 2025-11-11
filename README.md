# Candidate Screening - Agentic Recruitment Platform

An AI-powered candidate screening application that uses **structured data only** (CSV/JSON) to rank, compare, and explain candidate fit for job positions. Built with Next.js, NestJS, and Azure OpenAI.

## ✨ Features

### 🎯 Core Functionality
- **Structured Data Ingestion**: Import candidates, applications, profiles, and assessments via CSV/JSONL
- **Deterministic Scoring**: Transparent, explainable scoring based on competencies, skills, recency, and depth
- **Job Management**: Create jobs with weighted competencies and hard filters
- **Smart Ranking**: Rank candidates by fit score with filtering and sorting
- **Comparison Matrix**: Side-by-side candidate comparison with visual heatmaps
- **Calibration Panel**: Adjust competency weights and requirements in real-time
- **AI Copilot**: Chat interface with function calling for candidate insights (Azure OpenAI)
- **Export**: Generate shortlists with rationale in CSV/PDF format

### 🔧 Technical Features
- **Monorepo Architecture**: pnpm workspaces with shared packages
- **Type Safety**: End-to-end TypeScript with Zod validation
- **Deterministic Scoring**: Pure functions with evidence tracking
- **Search & Retrieval**: Azure Cognitive Search ready (with in-memory fallback)
- **Real-time Updates**: React state management with instant feedback
- **Responsive UI**: Tailwind CSS with shadcn/ui components

## 📁 Project Structure

```
candidate-screening/
├── apps/
│   ├── web/                 # Next.js 15 frontend
│   │   ├── src/app/         # App router pages
│   │   │   ├── page.tsx     # Dashboard
│   │   │   └── jobs/[id]/   # Job detail with screening list
│   │   └── ...
│   └── api/                 # NestJS backend
│       ├── src/
│       │   ├── ingest/      # CSV/JSONL ingestion
│       │   ├── jobs/        # Job CRUD + templates
│       │   ├── candidates/  # Candidate management
│       │   ├── scoring/     # Scoring engine
│       │   ├── agents/      # AI copilot with function calling
│       │   └── prisma/      # Database client
│       └── prisma/
│           └── schema.prisma
├── packages/
│   ├── domain/              # Zod schemas & TypeScript types
│   ├── scoring/             # Pure scoring functions
│   └── ui/                  # Shared React components
├── scripts/
│   └── seed/                # Data generator (1000+ candidates)
└── infra/
    └── docker-compose.yml   # Local development setup
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and **pnpm** 8+
- **Docker** (optional, for containerized setup)
- **PostgreSQL** 15+ (or use Docker)
- **Azure OpenAI** (optional, for chat copilot)

### Option 1: Docker Setup (Recommended)

1. **Clone and setup**:
   ```bash
   git clone <repo-url>
   cd candidatescreening
   cp .env.example .env
   ```

2. **Configure environment** (`.env`):
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/candidate_screening?schema=public"
   AZURE_OPENAI_API_KEY="your-key-here"          # Optional
   AZURE_OPENAI_ENDPOINT="https://your-resource.openai.azure.com"  # Optional
   AZURE_OPENAI_DEPLOYMENT_NAME="gpt-4o-mini"   # Optional
   ```

3. **Start services**:
   ```bash
   docker-compose up -d
   ```

4. **Run migrations**:
   ```bash
   docker exec candidate-screening-api npx prisma migrate deploy
   ```

5. **Seed data**:
   ```bash
   pnpm install
   pnpm seed
   ```

6. **Access the app**:
   - Frontend: http://localhost:3000
   - API: http://localhost:4000

### Option 2: Local Development

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Setup database**:
   ```bash
   # Start PostgreSQL (or use Docker)
   docker run -d \
     --name postgres \
     -e POSTGRES_PASSWORD=postgres \
     -e POSTGRES_DB=candidate_screening \
     -p 5432:5432 \
     postgres:15-alpine
   ```

3. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your database URL and Azure OpenAI credentials
   ```

4. **Run migrations**:
   ```bash
   pnpm db:push
   ```

5. **Generate Prisma client**:
   ```bash
   cd apps/api
   pnpm db:generate
   ```

6. **Build packages**:
   ```bash
   pnpm build
   ```

7. **Start development servers**:
   ```bash
   pnpm dev
   ```
   This starts both the API (port 4000) and web (port 3000) in parallel.

8. **Seed data**:
   ```bash
   pnpm seed
   ```
   This generates and imports 1000+ candidates, 5 jobs, applications, and assessments.

## 📊 Data Schemas

### Job
```json
{
  "job_id": "uuid",
  "title": "Senior Full Stack Engineer",
  "location": "San Francisco, CA",
  "competencies": [
    { "name": "React", "weight": 0.25, "mustHave": true },
    { "name": "Node.js", "weight": 0.2, "mustHave": true }
  ],
  "hardFilters": {
    "min_total_exp_years": 5,
    "work_auth": ["US Citizen", "Green Card"],
    "locations": ["San Francisco", "Remote"]
  }
}
```

### Candidate
```json
{
  "candidate_id": "uuid",
  "full_name": "Jane Smith",
  "emails": ["jane@example.com"],
  "location": "San Francisco, CA",
  "work_auth": "US Citizen",
  "total_experience_years": 7,
  "skills": [
    {
      "name": "React",
      "level": "advanced",
      "years": 5,
      "last_used": 2024
    }
  ],
  "seniority": "senior"
}
```

### FitSnapshot (Scoring Result)
```json
{
  "snapshot_id": "uuid",
  "job_id": "uuid",
  "candidate_id": "uuid",
  "overall": 0.85,
  "byCompetency": [
    {
      "name": "React",
      "score": 0.92,
      "evidence": [
        "skills.React(level=advanced,last_used=2024,years=5)",
        "assessment:coding.score=88"
      ]
    }
  ],
  "redFlags": [],
  "explainAtoms": [
    "Overall fit: excellent (85%)",
    "Strong in: React, Node.js, TypeScript",
    "7 years total experience"
  ],
  "calibrationVersion": "v1"
}
```

## 🧮 Scoring Algorithm

The scoring engine uses **deterministic, structured-only** calculations:

### Per-Competency Score
```
coverage    = has(skill) ? 1 : 0
recency     = clamp(1 - (currentYear - skill.last_used) / 5, 0, 1)
depth       = min(1, skill.years / 5) * levelFactor(skill.level)
assessment  = normalized weighted mean of mapped assessment scores
comp_score  = coverage * ((0.5 * recency) + (0.5 * depth)) * assessment
```

### Overall Score
```
overall = Σ(weight_c * comp_score_c) / Σ(weight_c)
```

### Hard Filters
- Missing must-have competency → exclude or cap at 0.3
- Failed work_auth/location/experience filters → exclude or flag

### Evidence Tracking
Every score includes structured evidence:
```
skills.Python(level=advanced,last_used=2024,years=8)
assessment:coding.score=92
```

## 🔌 API Endpoints

### Ingest
- `POST /api/ingest/candidates` - Import candidates (JSONL)
- `POST /api/ingest/applications` - Import applications (CSV)
- `POST /api/ingest/profiles` - Import profiles (CSV/JSONL)
- `POST /api/ingest/assessments` - Import assessments (CSV/JSONL)

### Jobs
- `GET /api/jobs` - List all jobs
- `POST /api/jobs` - Create job
- `GET /api/jobs/:id` - Get job details
- `PUT /api/jobs/:id` - Update job
- `GET /api/jobs/:id/stats` - Get job statistics

### Scoring
- `POST /api/score/:jobId/batch` - Score all candidates for a job
- `GET /api/jobs/:jobId/candidates` - Get scored candidates with filters

### AI Agents
- `POST /api/agents/compare` - Compare candidates
- `POST /api/agents/explain` - Explain score
- `POST /api/agents/whatif` - What-if calibration simulation
- `POST /api/agents/filter` - Filter candidates with AI insights
- `POST /api/agents/chat` - Chat with copilot (requires Azure OpenAI)

## 🎨 UI Components

### Dashboard (`/`)
- Job cards with statistics (candidate count, avg fit, last ingest)
- Quick navigation to job detail pages

### Job Detail (`/jobs/:id`)
- **Filters Panel**: Skills, experience, location, work auth, min fit score
- **Candidate List**: Sortable, filterable list with fit scores
- **Candidate Drawer**: Detailed view with competency breakdown, evidence, red flags
- **Comparison Matrix**: Side-by-side comparison with heatmaps
- **Re-score Button**: Trigger batch scoring
- **Chat Copilot**: AI assistant (when Azure OpenAI is configured)

### Calibration (Modal)
- Sliders for competency weights
- Toggles for must-have requirements
- Hard filter configuration
- Save as template / Apply template

## 🤖 AI Copilot

The chat copilot uses Azure OpenAI with **function calling** to:

1. **Compare Candidates**: Analyzes strengths/weaknesses across multiple candidates
2. **Explain Scores**: Provides detailed reasoning for fit scores
3. **What-If Analysis**: Simulates impact of changing job requirements
4. **Filter & Search**: Intelligent candidate filtering with natural language

All responses **cite structured evidence** - no hallucinations!

### Example Queries
```
"Compare the top 3 candidates for this role"
"Why did Jane get a lower score than John?"
"What if we increase the Python weight to 0.3?"
"Find candidates with 5+ years of React and AWS experience"
```

## 🔍 Search & Retrieval

### Azure Cognitive Search (Optional)
Configure in `.env`:
```env
AZURE_SEARCH_ENDPOINT="https://your-search.search.windows.net"
AZURE_SEARCH_API_KEY="your-key"
AZURE_SEARCH_INDEX_NAME="candidates"
```

### In-Memory Fallback
If Azure Search is not configured, the system uses PostgreSQL queries with JSON field filtering.

## 🧪 Testing & Development

### Run Tests
```bash
pnpm test
```

### Database Management
```bash
pnpm db:studio    # Open Prisma Studio
pnpm db:migrate   # Create new migration
pnpm db:push      # Push schema changes (dev only)
```

### Regenerate Seed Data
```bash
pnpm seed
```

### Clean Build
```bash
pnpm clean
pnpm build
```

## 📦 Deployment

### Build for Production
```bash
pnpm build
```

### Run Production Build
```bash
# API
cd apps/api
pnpm start:prod

# Web
cd apps/web
pnpm start
```

### Environment Variables (Production)
```env
DATABASE_URL="postgresql://user:pass@host:5432/db?schema=public"
AZURE_OPENAI_API_KEY="your-production-key"
AZURE_OPENAI_ENDPOINT="https://your-resource.openai.azure.com"
AZURE_SEARCH_ENDPOINT="https://your-search.search.windows.net"
AZURE_SEARCH_API_KEY="your-search-key"
API_URL="https://api.yourapp.com"
NEXT_PUBLIC_API_URL="https://api.yourapp.com"
```

## 🏗️ Architecture Decisions

### Why Structured Data Only?
- **Deterministic**: No parsing errors, no OCR uncertainty
- **Fast**: Direct database queries, no document processing
- **Explainable**: Every score has clear evidence
- **Scalable**: Simple indexing, no vector embeddings required

### Why Monorepo?
- **Shared Types**: Single source of truth for schemas
- **Code Reuse**: Scoring logic, UI components
- **Easy Development**: All code in one place

### Why Deterministic Scoring?
- **Trust**: Recruiters can verify every calculation
- **Compliance**: Auditable decision-making
- **Debugging**: Easy to trace score components

## 🐛 Troubleshooting

### Database connection failed
```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Verify DATABASE_URL in .env
echo $DATABASE_URL
```

### Prisma client errors
```bash
cd apps/api
pnpm db:generate
```

### Port already in use
```bash
# Change ports in .env or docker-compose.yml
API_PORT=4001
# Web: edit next.config.js or use -p flag
pnpm dev -p 3001
```

### OpenAI chat not working
- Verify Azure OpenAI credentials in `.env`
- Check deployment name matches your Azure resource
- Chat will show fallback message if not configured

## 📝 License

MIT

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/)
- [NestJS](https://nestjs.com/)
- [Prisma](https://www.prisma.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Azure OpenAI](https://azure.microsoft.com/en-us/products/ai-services/openai-service)

---

**Note**: This is a prototype for demonstration purposes. AI-assisted insights require human review before making hiring decisions.
