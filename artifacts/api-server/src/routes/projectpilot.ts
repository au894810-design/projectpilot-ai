import { Router, type IRouter, type Request } from "express";
import OpenAI from "openai";
import {
  CreateProjectBody,
  GenerateProjectIdeasBody,
  GenerateProjectIdeasResponse,
  GetProjectParams,
  GetProjectResponse,
  ImproveProjectBody,
  ImproveProjectParams,
  ImproveProjectResponse,
  ListProjectsResponse,
} from "@workspace/api-zod";
import type { ProjectBlueprint } from "@workspace/api-zod";

const openai = process.env.OPENAI_API_KEY?.startsWith("sk-")
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const router: IRouter = Router();

const projects = new Map<string, ProjectBlueprint>();

const slugify = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function blueprintFromInput(
  input: { interests: string; skills: string; domain?: string; constraints?: string; ambition: string },
  variant: number,
): ProjectBlueprint {
  const interests = input.interests.split(",").map((item) => item.trim()).filter(Boolean);
  const skills = input.skills.split(",").map((item) => item.trim()).filter(Boolean);
  const domain = input.domain?.trim() || "Student life";
  const anchor = interests[variant % Math.max(interests.length, 1)] || "real-world problems";
  const skill = skills[variant % Math.max(skills.length, 1)] || "product design";
  const titleIdeas = [
    `Signal ${anchor.replace(/\b\w/g, (char) => char.toUpperCase())}`,
    `${anchor.replace(/\b\w/g, (char) => char.toUpperCase())} Lab`,
    `Open ${anchor.replace(/\b\w/g, (char) => char.toUpperCase())}`,
  ];
  const title = titleIdeas[variant] ?? `Studio ${anchor}`;
  const id = `${slugify(title)}-${Date.now()}-${variant}`;
  const ambition = input.ambition === "ambitious" ? "confident, portfolio-ready" : "focused, shippable";

  return {
    id,
    title,
    tagline: `A ${ambition} way to make ${anchor} more useful for the people who rely on it.`,
    problem: `People interested in ${anchor} still make decisions with scattered information and no clear next action. This project turns the friction into a small, testable experience.`,
    audience: `Students, mentors, and everyday users who care about ${anchor}.`,
    domain,
    readiness: Math.min(91, 64 + skills.length * 4 + (input.constraints ? 5 : 0) + (input.ambition === "focused" ? 8 : 0)),
    skills: [...skills.slice(0, 4), skill].filter((item, index, list) => list.indexOf(item) === index),
    features: [
      { name: "Guided signal capture", description: `Collect the right context about ${anchor} in under two minutes.`, tier: "core" },
      { name: "Actionable recommendations", description: "Turn a response into one clear next step instead of another dashboard.", tier: "core" },
      { name: "Evidence trail", description: "Make the project defensible with lightweight feedback and outcome tracking.", tier: "differentiator" },
      { name: "Adaptive insights", description: "Use usage patterns to suggest what should improve next.", tier: "stretch" },
    ],
    technologies: [
      { name: "React + Vite", reason: "Fast iteration for a polished, demonstrable interface.", category: "Frontend" },
      { name: "TypeScript", reason: "Keeps the idea's data model reliable as the scope grows.", category: "Foundation" },
      { name: skill || "Python", reason: "A direct way to turn the strongest existing skill into project value.", category: "Intelligence" },
      { name: "PostgreSQL", reason: "Stores feedback and outcomes so the project can learn from real use.", category: "Data" },
    ],
    steps: [
      { number: 1, title: "Frame one sharp question", detail: `Interview five people affected by ${anchor} and write down the repeated friction.`, duration: "2 days" },
      { number: 2, title: "Prototype the smallest loop", detail: "Build one input, one transformation, and one useful result before adding accounts or polish.", duration: "3 days" },
      { number: 3, title: "Add the evidence layer", detail: "Capture feedback, show confidence, and make the outcome visible to an evaluator.", duration: "4 days" },
      { number: 4, title: "Demo the before and after", detail: "Record the old workflow, the new workflow, and one measurable improvement.", duration: "2 days" },
    ],
    improvements: [
      { title: "Add a trust explanation", detail: "Explain what the recommendation is based on and when it may be wrong.", impact: "High" },
      { title: "Design for accessibility", detail: "Test keyboard navigation, contrast, and low-bandwidth behavior before the final demo.", impact: "High" },
      { title: "Plan the next dataset", detail: "Name the next real data source that would make the experience more useful.", impact: "Medium" },
    ],
    demoScript: [
      "Open with the familiar, messy version of the problem.",
      `Show how a student enters one ${anchor} situation.`,
      "Reveal the focused result and the evidence behind it.",
      "Close with the measurable improvement and the next iteration.",
    ],
  };
}

function seedProjects() {
  if (projects.size) return;
  const seed = blueprintFromInput({
    interests: "campus spaces, wellbeing",
    skills: "React, maps, user research",
    domain: "Campus life",
    ambition: "ambitious",
  }, 0);
  seed.id = "quiet-campus";
  seed.title = "Quiet Campus";
  seed.tagline = "A live, student-led map for finding focused study spaces.";
  seed.readiness = 82;
  projects.set(seed.id, seed);
}

seedProjects();

router.post("/projectpilot/generate", (req, res) => {
  const parsed = GenerateProjectIdeasBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Tell us a little more about your interests and skills." });
  return generateWithAi(parsed.data).then((response) => res.json(response)).catch((error: unknown) => {
    const ideas = [0, 1, 2].map((variant) => blueprintFromInput(parsed.data, variant));
    req.log.warn({ error }, "AI generation unavailable; using deterministic project directions");
    return res.json(GenerateProjectIdeasResponse.parse({
      ideas,
      rationale: `These directions connect ${parsed.data.interests} with ${parsed.data.skills}. Each one is scoped to become a credible first version before the final-year deadline.`,
    }));
  });
});

async function generateWithAi(input: {
  interests: string;
  skills: string;
  domain?: string;
  constraints?: string;
  ambition: string;
}) {
  if (!openai) throw new Error("A valid OpenAI key is not configured");
  const completion = await openai.chat.completions.create({
    model: "gpt-5.4-mini",
    max_completion_tokens: 8192,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are ProjectPilot, a practical project mentor for final-year students.
Return JSON only with this exact shape: {"ideas":[three project blueprints],"rationale":"string"}.
Each blueprint must include id, title, tagline, problem, audience, domain, readiness (0-100 number), skills (string[]), features (four items with name, description, tier where tier is core/differentiator/stretch), technologies (four items with name, reason, category), steps (four items with number, title, detail, duration), improvements (three items with title, detail, impact), demoScript (four strings).
Keep ideas buildable by a student, specific enough to defend in a viva, and grounded in the provided skills. Avoid generic to-do lists, social networks, or impossible research projects.`,
      },
      {
        role: "user",
        content: JSON.stringify(input),
      },
    ],
  });
  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error("The AI returned an empty response");
  return GenerateProjectIdeasResponse.parse(JSON.parse(content));
}

router.get("/projectpilot/projects", (_req, res) => {
  const response = ListProjectsResponse.parse(Array.from(projects.values()).map((project) => ({
    id: project.id,
    title: project.title,
    tagline: project.tagline,
    domain: project.domain,
    readiness: project.readiness,
    updatedAt: "Today, 10:42",
  })));
  return res.json(response);
});

router.post("/projectpilot/projects", (req, res) => {
  const parsed = CreateProjectBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "That project blueprint is incomplete." });
  projects.set(parsed.data.blueprint.id, parsed.data.blueprint);
  return res.status(201).json({
    id: parsed.data.blueprint.id,
    title: parsed.data.blueprint.title,
    tagline: parsed.data.blueprint.tagline,
    domain: parsed.data.blueprint.domain,
    readiness: parsed.data.blueprint.readiness,
    updatedAt: "Just now",
  });
});

router.get("/projectpilot/projects/:projectId", (req: Request, res) => {
  const params = GetProjectParams.parse(req.params);
  const project = projects.get(params.projectId);
  if (!project) return res.status(404).json({ error: "Project not found." });
  return res.json(GetProjectResponse.parse(project));
});

router.post("/projectpilot/projects/:projectId", (req: Request, res) => {
  const params = ImproveProjectParams.parse(req.params);
  const body = ImproveProjectBody.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: "Choose an improvement focus." });
  if (!projects.has(params.projectId)) return res.status(404).json({ error: "Project not found." });
  const focus = body.data.focus.trim();
  const suggestions = ImproveProjectResponse.parse({
    projectId: params.projectId,
    suggestions: [
      { title: `Make ${focus} visible`, detail: `Add one small interaction that lets an evaluator see how ${focus} changes the user's outcome.`, impact: "High" },
      { title: `Validate the ${focus} assumption`, detail: "Run three short tests with the intended audience and record what changed after each one.", impact: "Medium" },
      { title: "Turn the learning into proof", detail: "Add one before-and-after metric to the demo script so the improvement is easy to remember.", impact: "Medium" },
    ],
  });
  return res.json(suggestions);
});

export default router;