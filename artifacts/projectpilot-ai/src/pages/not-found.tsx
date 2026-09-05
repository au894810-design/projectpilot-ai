import { AlertCircle } from 'lucide-react';
import { Link } from 'wouter';

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] bg-background px-6 py-20 text-foreground">
      <div className="mx-auto max-w-xl">
        <AlertCircle className="mb-7 h-9 w-9 text-destructive" />
        <p className="mono text-[10px] uppercase tracking-[.2em] text-muted-foreground">404 / wrong turn</p>
        <h1 className="display mt-3 text-6xl font-semibold leading-none">That page took a different route.</h1>
        <p className="mt-5 max-w-md leading-7 text-muted-foreground">The project studio is still here. Head back to the overview and find a clearer direction.</p>
        <Link href="/" className="mt-8 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground" data-testid="link-not-found-home">Return to overview</Link>
      </div>
    </div>
  );
}
