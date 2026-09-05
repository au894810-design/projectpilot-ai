# ProjectPilot AI

    ProjectPilot turns a final-year student's interests, skills, constraints, and ambition into a practical project blueprint they can actually build and defend.

    ## What is included

    - Guided four-step project direction flow
    - AI-ready generation endpoint with a safe deterministic fallback
    - Saved project library with local persistence for reliable demos
    - Blueprint workspace covering problem, audience, features, technologies, milestones, improvements, and demo script
    - Improvement prompts that turn a rough idea into a stronger final-year project
    - Responsive product UI with evaluator-ready storytelling

    ## Run locally

    Requires Node.js 24 and pnpm.

    ```bash
    pnpm install
    pnpm --filter @workspace/api-server run dev
    # in a second terminal, use the managed frontend workflow or:
    PORT=5173 BASE_PATH=/ pnpm --filter @workspace/projectpilot-ai run dev
    ```

    For live AI generation, set OPENAI_API_KEY in your environment. Without it, the app uses its built-in project mentor so the demo remains usable.

    ## Product structure

    - `artifacts/projectpilot-ai` — React + Vite frontend
    - `artifacts/api-server` — Express API routes
    - `lib/api-spec/openapi.yaml` — API contract source of truth
    - `lib/api-client-react` and `lib/api-zod` — generated client and validation helpers
    