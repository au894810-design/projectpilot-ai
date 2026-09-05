import type { ProjectBlueprint, ProjectSummary } from '@workspace/api-client-react';

export const demoBlueprints: ProjectBlueprint[] = [
  {
    id: 'demo-quiet-campus',
    title: 'Quiet Campus',
    tagline: 'A live, student-led map for finding focused study spaces.',
    problem: 'Students lose time walking between crowded rooms and rarely know when a space will actually be calm.',
    audience: 'Final-year students, library teams, and campus societies.',
    domain: 'Campus life',
    readiness: 82,
    skills: ['React', 'Maps', 'User research'],
    features: [
      { name: 'Live focus map', description: 'Crowd-sourced room status with a confidence signal.', tier: 'core' },
      { name: 'Space profiles', description: 'Noise, sockets, light, and opening hours in one glance.', tier: 'core' },
      { name: 'Focus streaks', description: 'A light-weight ritual that rewards reporting back.', tier: 'differentiator' },
      { name: 'Predictive quiet hours', description: 'Use check-ins to suggest the best time to visit.', tier: 'stretch' },
    ],
    technologies: [
      { name: 'React + Vite', reason: 'Fast, familiar interface iteration for a polished demo.', category: 'Frontend' },
      { name: 'Supabase Realtime', reason: 'Makes room status feel alive without a heavy backend.', category: 'Data' },
      { name: 'MapLibre', reason: 'A flexible map layer for a campus-first experience.', category: 'Experience' },
    ],
    steps: [
      { number: 1, title: 'Observe the friction', detail: 'Interview eight students and audit three campus buildings.', duration: '2 days' },
      { number: 2, title: 'Map the smallest loop', detail: 'Prototype reporting, browsing, and one useful filter.', duration: '3 days' },
      { number: 3, title: 'Make presence visible', detail: 'Connect live updates and add confidence language.', duration: '4 days' },
      { number: 4, title: 'Prove the moment', detail: 'Test with classmates and capture a before/after story.', duration: '2 days' },
    ],
    improvements: [
      { title: 'Add accessibility cues', detail: 'Include low-sensory and step-free filters.', impact: 'High' },
      { title: 'Show the trust layer', detail: 'Explain how recent reports shape confidence.', impact: 'Medium' },
    ],
    demoScript: ['Open on a busy afternoon and show the problem.', 'Filter for low-noise rooms with sockets.', 'Report a change and watch the map update.', 'Close with the measurable time saved.'],
  },
  {
    id: 'demo-field-notes',
    title: 'Field Notes',
    tagline: 'Turn messy placement observations into evidence you can defend.',
    problem: 'Students on placements collect useful notes in scattered documents, then struggle to turn them into a clear final-year insight.',
    audience: 'Placement students, supervisors, and project advisors.',
    domain: 'Education',
    readiness: 68,
    skills: ['Information architecture', 'Python', 'Writing'],
    features: [
      { name: 'Prompted capture', description: 'Small prompts make each observation specific and useful.', tier: 'core' },
      { name: 'Evidence threads', description: 'Link notes to themes, people, and outcomes.', tier: 'core' },
      { name: 'Supervisor view', description: 'Invite a supervisor to comment without editing.', tier: 'differentiator' },
    ],
    technologies: [
      { name: 'Next.js', reason: 'A credible path from prototype to a shareable web app.', category: 'Frontend' },
      { name: 'SQLite', reason: 'Keeps local-first capture simple for a focused MVP.', category: 'Data' },
      { name: 'Python', reason: 'Useful for clustering themes in a later iteration.', category: 'Intelligence' },
    ],
    steps: [
      { number: 1, title: 'Collect real fragments', detail: 'Gather anonymised notes from three placement contexts.', duration: '2 days' },
      { number: 2, title: 'Design the evidence loop', detail: 'Make a note, tag it, and see the theme strengthen.', duration: '3 days' },
      { number: 3, title: 'Add synthesis', detail: 'Create a simple theme summary with source links.', duration: '4 days' },
    ],
    improvements: [
      { title: 'Make privacy explicit', detail: 'Add a clear redaction pass before sharing.', impact: 'High' },
      { title: 'Support exports', detail: 'Let students export an evidence appendix.', impact: 'Medium' },
    ],
    demoScript: ['Show the messy source material.', 'Capture one note with a guided prompt.', 'Follow it into a theme.', 'Export a defensible evidence thread.'],
  },
];

export const demoSummaries: ProjectSummary[] = demoBlueprints.map((project, index) => ({
  id: project.id,
  title: project.title,
  tagline: project.tagline,
  domain: project.domain,
  readiness: project.readiness,
  updatedAt: index === 0 ? 'Today, 10:42' : 'Yesterday, 16:20',
}));

export function readLocalBlueprints(): ProjectBlueprint[] {
  try { return JSON.parse(localStorage.getItem('projectpilot-blueprints') || '[]') as ProjectBlueprint[]; } catch { return []; }
}

export function saveLocalBlueprint(project: ProjectBlueprint) {
  const projects = readLocalBlueprints().filter((item) => item.id !== project.id);
  localStorage.setItem('projectpilot-blueprints', JSON.stringify([project, ...projects]));
}

export function getProjectFallback(id: string) {
  return [...readLocalBlueprints(), ...demoBlueprints].find((project) => project.id === id);
}