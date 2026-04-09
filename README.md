# ReplyPilot AI

> AI-powered email reply generator with tone control, sentiment detection, and instant copy.

## What It Does

Paste any email, select your tone and use case, and get AI-generated replies instantly.

- **Best Reply** — primary recommended response
- **2 Alternative Replies** — different angles and approaches
- **Short Reply** — mobile-friendly 1-2 sentence version
- **Suggested Subject Line** — auto-generated reply subject
- **Sentiment Detection** — detects the incoming email's emotion
- **Intent Detection** — identifies what the sender wants
- **Risk Indicator** — flags sensitive or high-stakes emails
- **One-click Copy** on every output

## Controls

| Control  | Options                                             |
|----------|-----------------------------------------------------|
| Tone     | Professional, Friendly, Firm, Empathetic            |
| Use Case | General Work, Customer Support, Recruiter, Client   |
| Length   | Short, Medium, Detailed                             |

## Tech Stack

| Layer      | Tool                                    |
|------------|-----------------------------------------|
| Monorepo   | pnpm workspaces                         |
| Framework  | React + Vite (frontend)                 |
| Backend    | Express 5 (Node.js)                     |
| Styling    | Tailwind CSS + shadcn/ui                |
| AI         | Anthropic Claude (claude-sonnet-4-6)    |
| API Codegen| Orval (OpenAPI-first)                   |
| Database   | PostgreSQL + Drizzle ORM                |
| Language   | TypeScript                              |

## Project Structure

```
artifacts/
├── api-server/              ← Express API server
│   └── src/routes/
│       ├── health.ts        ← GET /api/healthz
│       └── email.ts         ← POST /api/email/generate
└── replypilot/              ← React + Vite frontend
    └── src/
        ├── pages/home.tsx   ← Main UI
        ├── App.tsx
        └── index.css

lib/
├── api-spec/openapi.yaml              ← OpenAPI spec (source of truth)
├── api-client-react/                  ← Generated React Query hooks
├── api-zod/                           ← Generated Zod validation schemas
├── db/                                ← PostgreSQL + Drizzle ORM
└── integrations-anthropic-ai/         ← Anthropic Claude client
```

## Getting Started

### Prerequisites
- Node.js 20+
- pnpm 10+
- PostgreSQL database
- Anthropic API key (or Replit AI Integrations)

### Installation

```bash
git clone https://github.com/RiteshRagav/PROMPT_PROJECT.git
cd PROMPT_PROJECT
pnpm install
```

### Environment Variables

Create a `.env` file (or set in Replit Secrets):

```env
DATABASE_URL=your_postgres_connection_string
AI_INTEGRATIONS_ANTHROPIC_BASE_URL=https://api.anthropic.com
AI_INTEGRATIONS_ANTHROPIC_API_KEY=your_anthropic_api_key
```

### Run Development Servers

```bash
# Run the API server
pnpm --filter @workspace/api-server run dev

# Run the frontend (in another terminal)
pnpm --filter @workspace/replypilot run dev
```

### Build for Production

```bash
# Build all packages
pnpm run build

# Or build individually
pnpm --filter @workspace/api-server run build
pnpm --filter @workspace/replypilot run build
```

## API Endpoint

### POST /api/email/generate

**Request:**
```json
{
  "emailContent": "string",
  "tone": "professional" | "friendly" | "firm" | "empathetic",
  "useCase": "general-work" | "customer-support" | "recruiter" | "client",
  "length": "short" | "medium" | "detailed"
}
```

**Response:**
```json
{
  "bestReply": "string",
  "alternativeReplies": ["string", "string"],
  "shortReply": "string",
  "suggestedSubject": "string",
  "sentiment": "string",
  "intent": "string",
  "riskLevel": "low" | "medium" | "high",
  "riskReason": "string"
}
```

## Roadmap

- Gmail OAuth integration for one-click draft creation
- Save and favorite replies
- Email templates library
- Dark/light mode toggle
- Bulk inbox classification
- Groq API integration for faster responses

## Author

**Jv Valdez** — [@b1polarbear1437](https://github.com/b1polarbear1437)

## License

MIT License
