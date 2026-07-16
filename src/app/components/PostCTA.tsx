import Link from 'next/link';
import { CAL_URL } from './Chrome';

// The two core conversion actions, shown at the foot of every post.
export function PostCTA() {
  return (
    <aside className="mt-16 border-t border-clay-200 pt-10">
      <p className="font-mono text-xs tracking-[0.15em] uppercase text-signal mb-3">
        Where to next
      </p>
      <h2 className="font-display text-2xl text-clay-900 mb-3">
        Figure out where your team actually stands.
      </h2>
      <p className="text-clay-600 mb-6 max-w-xl">
        Take the 2-minute readiness check for a scored snapshot, or book a
        30-minute fit call to talk through your situation directly.
      </p>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Link
          href="/readiness"
          className="bg-signal text-clay-50 font-medium py-3 px-7 rounded-sm hover:bg-signal-dim transition-colors"
        >
          Take the 2-min readiness check
        </Link>
        <a
          href={CAL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="border border-clay-300 text-clay-900 font-medium py-3 px-7 rounded-sm hover:border-signal hover:text-signal transition-colors"
        >
          Book a 30-minute fit call
        </a>
      </div>
    </aside>
  );
}
