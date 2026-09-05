import { ArrowUpRight, Check, ChevronRight, Clock3, Compass, FolderKanban, Sparkles, Target } from 'lucide-react';
import { Link } from 'wouter';
import { getListProjectsQueryKey, useListProjects } from '@workspace/api-client-react';
import { demoSummaries } from '@/lib/project-data';

export default function Home() {
  const projects = useListProjects({ query: { queryKey: getListProjectsQueryKey(), staleTime: 30_000 } });
  const recent = (projects.data?.length ? projects.data : demoSummaries).slice(0, 2);
  return <div className="page-enter">
    <section className="relative overflow-hidden border-b border-border px-6 pb-20 pt-12 md:px-12 md:pb-28 md:pt-16 lg:px-16">
      <div className="pointer-events-none absolute -right-20 -top-32 h-[500px] w-[500px] rounded-full border-[70px] border-accent/20" />
      <div className="pointer-events-none absolute right-20 top-20 h-4 w-4 rounded-full bg-destructive" />
      <div className="relative mx-auto max-w-6xl">
        <div className="mb-16 flex items-center justify-between"><div className="mono text-[10px] uppercase tracking-[.22em] text-muted-foreground">Student project studio / 01</div><div className="hidden items-center gap-2 text-xs text-muted-foreground md:flex"><span className="h-2 w-2 rounded-full bg-accent" /> Built for the final stretch</div></div>
        <div className="max-w-4xl">
          <p className="rise mono mb-5 text-xs font-bold uppercase tracking-[.18em] text-destructive">From “I have an idea” to “here’s the proof.”</p>
          <h1 className="display rise delay-1 max-w-4xl text-[clamp(3.5rem,9vw,8.7rem)] font-semibold leading-[.88]">Make your next project <span className="relative whitespace-nowrap">impossible <span className="absolute -bottom-2 left-1/4 right-0 h-3 -rotate-2 bg-accent/80 md:h-5" /></span> to ignore.</h1>
          <p className="rise delay-2 mt-8 max-w-xl text-lg leading-8 text-muted-foreground">ProjectPilot turns your interests, skills, and constraints into a credible project blueprint — scoped enough to build, sharp enough to defend.</p>
          <div className="rise delay-3 mt-9 flex flex-wrap items-center gap-4"><Link href="/generate" className="group inline-flex items-center gap-3 rounded-full bg-primary px-6 py-4 text-sm font-bold text-primary-foreground shadow-[5px_5px_0_hsl(var(--accent))] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_hsl(var(--accent))]" data-testid="link-start-generating">Find your direction <ArrowUpRight size={17} className="transition group-hover:translate-x-1 group-hover:-translate-y-1" /></Link><Link href="/projects" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-4 text-sm font-semibold transition hover:border-foreground" data-testid="link-view-library">Browse project library <ChevronRight size={16} /></Link></div>
        </div>
        <div className="rise delay-4 mt-20 grid max-w-3xl grid-cols-3 border-y border-border py-5"><div><span className="display text-3xl font-semibold">4</span><p className="mt-1 text-xs text-muted-foreground">inputs, one clear route</p></div><div className="border-l border-border pl-5"><span className="display text-3xl font-semibold">12m</span><p className="mt-1 text-xs text-muted-foreground">to your first blueprint</p></div><div className="border-l border-border pl-5"><span className="display text-3xl font-semibold">1</span><p className="mt-1 text-xs text-muted-foreground">story worth showing</p></div></div>
      </div>
    </section>
    <section className="mx-auto max-w-6xl px-6 py-16 md:px-12 md:py-24 lg:px-16">
      <div className="mb-9 flex items-end justify-between"><div><p className="mono text-[10px] uppercase tracking-[.2em] text-muted-foreground">A better starting line</p><h2 className="display mt-3 text-4xl font-semibold md:text-5xl">Less fog. More signal.</h2></div><span className="hidden text-sm text-muted-foreground md:block">The studio is opinionated on purpose.</span></div>
      <div className="grid gap-4 md:grid-cols-3">
        {[{icon: Compass, label: '01 / Orient', title: 'Find the overlap', body: 'Connect what you care about with what you can actually build this semester.'}, {icon: Target, label: '02 / Focus', title: 'Choose the proof', body: 'Turn a big ambition into a tight set of features an evaluator can experience.'}, {icon: Check, label: '03 / Show', title: 'Tell the story', body: 'Walk in with a demo sequence, technology rationale, and your next smart improvement.'}].map(({ icon: Icon, label, title, body }, i) => <article key={label} className={`card-lift rounded-2xl border border-border bg-card p-6 ${i === 1 ? 'md:translate-y-6' : ''}`}><div className="mb-12 flex items-center justify-between"><span className="mono text-[10px] text-muted-foreground">{label}</span><Icon size={20} className="text-destructive" /></div><h3 className="display text-2xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p></article>)}
      </div>
    </section>
    <section className="border-t border-border bg-secondary/45 px-6 py-16 md:px-12 lg:px-16">
      <div className="mx-auto max-w-6xl"><div className="mb-8 flex items-end justify-between"><div><p className="mono text-[10px] uppercase tracking-[.2em] text-muted-foreground">Your runway</p><h2 className="display mt-3 text-3xl font-semibold">Pick up where you left off.</h2></div><Link href="/projects" className="hidden text-sm font-bold underline decoration-accent decoration-4 underline-offset-4 md:block" data-testid="link-home-library">See all projects</Link></div>
        <div className="grid gap-4 md:grid-cols-2">{recent.map((project, i) => <Link href={`/projects/${project.id}`} key={project.id} className="card-lift group flex items-center justify-between rounded-2xl border border-border bg-card p-5" data-testid={`card-recent-project-${project.id}`}><div className="flex items-center gap-4"><div className={`grid h-12 w-12 place-items-center rounded-xl ${i === 0 ? 'bg-accent' : 'bg-destructive/15'}`}><FolderKanban size={20} /></div><div><p className="mono text-[9px] uppercase tracking-[.16em] text-muted-foreground">{project.domain}</p><h3 className="mt-1 font-bold">{project.title}</h3><p className="mt-1 max-w-[300px] truncate text-xs text-muted-foreground">{project.tagline}</p></div></div><div className="text-right"><span className="mono text-sm font-bold">{project.readiness}%</span><p className="mt-1 text-[10px] text-muted-foreground">ready</p></div></Link>)}</div>
      </div>
    </section>
    <footer className="mx-auto flex max-w-6xl items-center justify-between px-6 py-9 text-xs text-muted-foreground md:px-12 lg:px-16"><span className="display text-base font-semibold text-foreground">ProjectPilot AI</span><span className="flex items-center gap-2"><Clock3 size={13} /> A clearer project starts here.</span></footer>
  </div>;
}