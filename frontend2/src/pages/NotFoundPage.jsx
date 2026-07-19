import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-3 bg-bg text-center">
      <p className="font-mono text-4xl text-text-lo">404</p>
      <p className="text-sm text-text-lo">This page doesn't exist.</p>
      <Link to="/cases" className="font-mono text-xs text-accent hover:underline">
        Back to cases
      </Link>
    </div>
  );
}
