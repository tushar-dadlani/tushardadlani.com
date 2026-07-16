import Link from 'next/link';

export const EMAIL = 'tushar@valuebridge.ai';
export const MAILTO = `mailto:${EMAIL}?subject=Consulting%20inquiry%20via%20tushardadlani.com`;
export const CAL_URL = 'https://cal.com/tushar-dadlani/consulting';
export const LINKEDIN = 'https://www.linkedin.com/in/tushardadlani/';

export function SiteNav() {
  return (
    <nav className="fixed w-full bg-clay-50/90 backdrop-blur-md z-50 border-b border-clay-200">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="font-mono text-sm text-clay-900">
            tushardadlani<span className="text-signal">.</span>com
          </Link>
          <div className="flex items-center gap-7 text-sm">
            <Link href="/#multimodal" className="hidden md:inline text-clay-600 hover:text-signal transition-colors">Multimodal AI</Link>
            <Link href="/readiness" className="hidden md:inline text-clay-600 hover:text-signal transition-colors">Readiness check</Link>
            <a
              href={MAILTO}
              className="bg-signal text-clay-50 hover:bg-signal-dim px-4 py-2 rounded-sm transition-colors text-sm font-medium"
            >
              Get in touch
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="py-8 border-t border-clay-200">
      <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-clay-500">
        <p>© {new Date().getFullYear()} Tushar Dadlani</p>
        <div className="flex items-center gap-6">
          <a href={MAILTO} className="hover:text-signal transition-colors">Email</a>
          <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="hover:text-signal transition-colors">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}
