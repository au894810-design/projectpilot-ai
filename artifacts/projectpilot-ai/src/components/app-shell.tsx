import { BrainCircuit, ChevronRight, CircleHelp, FolderKanban, LayoutGrid, Settings2, Sparkles, Wifi } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { useHealthCheck } from '@workspace/api-client-react';

export function AppShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const health = useHealthCheck({ query: { queryKey: ['/api/healthz'], staleTime: 30_000 } });
  const nav = [
    { href: '/', label: 'Overview', icon: LayoutGrid },
    { href: '/generate', label: 'Generate ideas', icon: Sparkles },
    { href: '/projects', label: 'Project library', icon: FolderKanban },
    { href: '/settings', label: 'Preferences', icon: Settings2 },
  ];
  return (
    <div className="grain min-h-[100dvh] bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[254px] flex-col border-r border-sidebar-border bg-sidebar px-5 py-6 text-sidebar-foreground md:flex">
        <Link href="/" className="mb-12 flex items-center gap-3" data-testid="link-brand">
          <span className="grid h-10 w-10 place-items-center rounded-[13px] bg-sidebar-primary text-sidebar-primary-foreground shadow-[4px_4px_0_hsl(var(--accent))]"><BrainCircuit size={22} /></span>
          <span><span className="display block text-[19px] font-semibold leading-none">ProjectPilot</span><span className="mono mt-1 block text-[9px] uppercase tracking-[.2em] text-sidebar-foreground/55">AI studio</span></span>
        </Link>
        <p className="mono mb-3 px-3 text-[9px] uppercase tracking-[.2em] text-sidebar-foreground/40">Workspace</p>
        <nav className="space-y-1">
          {nav.map(({ href, label, icon: Icon }) => <Link key={href} href={href} data-testid={`link-nav-${label.toLowerCase().replaceAll(' ', '-')}`} className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${location === href ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground/65 hover:bg-sidebar-accent/70 hover:text-sidebar-foreground'}`}><Icon size={17} strokeWidth={1.8} /><span>{label}</span>{location === href && <ChevronRight size={14} className="ml-auto text-sidebar-primary" />}</Link>)}
        </nav>
        <div className="mt-auto rounded-2xl border border-sidebar-border bg-sidebar-accent/60 p-4">
          <div className="mb-3 flex items-center gap-2 text-sidebar-foreground/70"><CircleHelp size={15} /><span className="text-xs font-semibold">Make it evaluator-ready</span></div>
          <p className="text-xs leading-5 text-sidebar-foreground/50">Every blueprint includes the story, scope, and next proof point.</p>
          <Link href="/generate" className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-sidebar-primary" data-testid="link-sidebar-cta">Start a direction <ChevronRight size={13} /></Link>
        </div>
        <div className="mt-5 flex items-center gap-2 px-2 text-[11px] text-sidebar-foreground/45"><span className={`h-2 w-2 rounded-full ${health.isError ? 'bg-destructive' : 'bg-sidebar-primary'}`} /><Wifi size={13} /> {health.isError ? 'Demo mode' : 'Pilot systems ready'}</div>
      </aside>
      <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between border-b border-border/70 bg-background/90 px-5 backdrop-blur md:hidden">
        <Link href="/" className="flex items-center gap-2" data-testid="link-mobile-brand"><span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground"><BrainCircuit size={17} /></span><span className="display text-lg font-semibold">ProjectPilot</span></Link>
        <Link href="/generate" className="rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground" data-testid="link-mobile-generate">Generate</Link>
      </header>
      <main className="min-h-[100dvh] md:ml-[254px]">{children}</main>
    </div>
  );
}