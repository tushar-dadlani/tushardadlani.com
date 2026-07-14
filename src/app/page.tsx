'use client';

import { useEffect, useRef, useState } from 'react';

const EMAIL = 'tushardadlani@gmail.com';
const MAILTO = `mailto:${EMAIL}?subject=Consulting%20inquiry%20via%20tushardadlani.com`;
const MAILTO_MULTIMODAL = `mailto:${EMAIL}?subject=Multimodal%20AI%20Readiness%20%E2%80%94%2030-minute%20fit%20call`;
const LINKEDIN = 'https://www.linkedin.com/in/tushardadlani/';

/* ── Scroll reveal ─────────────────────────────────────────────── */

function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} ${className}`}
    >
      {children}
    </div>
  );
}

function Kicker({ label }: { label: string }) {
  return (
    <p className="font-mono text-xs tracking-[0.15em] uppercase text-signal mb-4">
      {label}
    </p>
  );
}

/* ── Content ───────────────────────────────────────────────────── */

const phases = [
  { num: '1', title: 'Use-case & value mapping', body: 'Where multimodal earns its keep vs. where text-only is fine.' },
  { num: '2', title: 'Data & architecture', body: 'Your visual data, its real state, and the architecture to serve it.' },
  { num: '3', title: 'Production & reliability', body: 'Deployment, scaling, cost, monitoring, evals — the part everyone underestimates.' },
  { num: '4', title: 'Roadmap & build-vs-buy', body: 'Sequenced phases and a clear “do this first.”' },
];

const deliverables = [
  'A decision-ready architecture & roadmap document',
  'An executive readout with your leadership team',
  'A clear build-vs-buy recommendation and what to sequence first',
];

const services = [
  { title: 'Fractional CTO', line: 'Architecture, hiring, and hands-on engineering leadership, embedded part-time.' },
  { title: 'Fractional Product Leader', line: '0→1 strategy, roadmaps, and execution across large organizations.' },
  { title: 'AI & Agentic Systems', line: 'De-risking LLM initiatives; AI coding agents as a real development stack.' },
];

const stats = [
  { value: '6', label: 'US patents' },
  { value: '3,000+', label: 'Walmart stores running his IP' },
  { value: '1', label: 'startup exit via acquisition' },
  { value: '4→19', label: 'engineering team grown' },
];

const timeline = [
  {
    years: '2025 —',
    company: 'Teemyo.ai',
    role: 'Founder & CEO',
    stat: '300+ downloads, $0 paid',
    proof: 'Sole engineer shipping iOS + Android with Claude Code.',
  },
  {
    years: '2021 – 25',
    company: 'Walmart',
    role: 'Principal Lead, AI & Robotics',
    stat: '3,000+ stores',
    proof: 'Invented MultiSignal sensor fusion; IP absorbed into national loss-prevention infrastructure.',
  },
  {
    years: '2018 – 21',
    company: 'Standard AI',
    role: 'Head of Perception & Mapping',
    stat: 'weeks → hours',
    proof: 'Rebuilt camera calibration end-to-end; published at ICRA 2022; grew team 4→19.',
  },
  {
    years: '2017 – 19',
    company: 'Explorer.AI',
    role: 'Co-Founder & CTO',
    stat: 'acquired',
    proof: 'HD maps for autonomous vehicles, tested in cars at three AV companies.',
  },
  {
    years: '2015 – 17',
    company: 'Pivotal',
    role: 'SRE Tech Lead',
    stat: '100+ tenants',
    proof: 'Ran the canonical Cloud Foundry installation for the entire Foundation.',
  },
];

const principles = [
  { title: 'Go to the ground', body: 'Worked cashier shifts at Walmart to get ground truth no dashboard shows.' },
  { title: 'Kill hypotheses cleanly', body: 'Evidence retires features — not attachment.' },
  { title: 'Hold the quality line', body: 'Shipping errors into live stores costs 100× fixing them first.' },
];

/* ── Page ──────────────────────────────────────────────────────── */

export default function ConsultingLandingPage() {
  return (
    <div className="min-h-screen bg-clay-50 text-clay-600 font-sans text-[17px] leading-relaxed">
      {/* Navigation */}
      <nav className="fixed w-full bg-clay-50/90 backdrop-blur-md z-50 border-b border-clay-200">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex h-16 items-center justify-between">
            <a href="#" className="font-mono text-sm text-clay-900">
              tushardadlani<span className="text-signal">.</span>com
            </a>
            <div className="flex items-center gap-7 text-sm">
              <a href="#multimodal" className="hidden md:inline text-clay-600 hover:text-signal transition-colors">Multimodal AI</a>
              <a href="#services" className="hidden md:inline text-clay-600 hover:text-signal transition-colors">Services</a>
              <a href="#record" className="hidden md:inline text-clay-600 hover:text-signal transition-colors">Track record</a>
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

      {/* Hero — short: who I am, what I do */}
      <header className="relative pt-32 pb-14 md:pt-40 md:pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-grid bg-grid-fade" aria-hidden="true"></div>
        <div className="relative max-w-4xl mx-auto px-6">
          <Reveal>
            <p className="font-mono text-xs tracking-[0.15em] uppercase text-clay-500 mb-5">
              Tushar Dadlani · Seattle / Remote
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="font-display text-4xl md:text-5xl text-clay-900 leading-[1.15] max-w-2xl mb-6">
              Hard technology, turned into <em className="text-signal">shipped product.</em>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-lg text-clay-600 max-w-xl leading-relaxed mb-9">
              Fractional CTO and product leadership for companies building with AI —
              founder, <strong className="text-clay-900 font-semibold">6 US patents</strong>,
              platforms scaled to <strong className="text-clay-900 font-semibold">3,000+ Walmart stores</strong>.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <a
                href={MAILTO}
                className="bg-signal text-clay-50 font-medium py-3 px-7 rounded-sm hover:bg-signal-dim transition-colors"
              >
                Start a conversation
              </a>
              <a
                href={LINKEDIN}
                target="_blank"
                rel="noopener noreferrer"
                className="text-clay-600 hover:text-signal transition-colors underline underline-offset-4 decoration-clay-200"
              >
                LinkedIn
              </a>
            </div>
          </Reveal>
        </div>
      </header>

      {/* Flagship — Multimodal AI (full detail) */}
      <section id="multimodal" className="py-20 md:py-24 bg-cream border-y border-clay-200">
        <div className="max-w-4xl mx-auto px-6">
          <Reveal>
            <Kicker label="Flagship engagement" />
            <h2 className="font-display text-3xl md:text-4xl text-clay-900 mb-5">
              Multimodal AI Readiness &amp; Architecture
            </h2>
            <p className="text-lg text-clay-600 max-w-2xl leading-relaxed mb-4">
              Most multimodal AI projects die between the demo and production. This
              fixed-scope diagnostic turns &ldquo;we should be using AI&rdquo; into a
              production plan you can <em className="font-display text-signal">actually ship.</em>
            </p>
            <p className="text-base text-clay-500 max-w-2xl mb-12">
              For mid-market and enterprise teams sitting on visual data — documents,
              images, video, camera feeds, schematics.
            </p>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-8 mb-12">
            {phases.map((p, i) => (
              <Reveal key={p.num} delay={i * 80}>
                <div className="flex gap-4">
                  <span className="font-display text-2xl text-signal leading-none mt-0.5">{p.num}</span>
                  <div>
                    <h3 className="font-semibold text-clay-900 mb-1">{p.title}</h3>
                    <p className="text-base text-clay-600 leading-relaxed">{p.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-8 mb-12 pt-10 border-t border-clay-200">
              <div>
                <h3 className="font-semibold text-clay-900 mb-3">What you get</h3>
                <ul className="space-y-2">
                  {deliverables.map((d) => (
                    <li key={d} className="text-base text-clay-600 leading-relaxed flex">
                      <span className="text-signal mr-3">—</span>{d}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-clay-900 mb-3">Investment</h3>
                <p className="text-base text-clay-600 leading-relaxed">
                  Fixed fee, scoped to your environment — trivial next to the cost of a
                  stalled build. If it&apos;s a fit, you&apos;ll have a scoped proposal
                  within 48 hours of the call.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <a
                href={MAILTO_MULTIMODAL}
                className="bg-signal text-clay-50 font-medium py-3 px-7 rounded-sm hover:bg-signal-dim transition-colors"
              >
                Book a 30-minute fit call
              </a>
              <p className="text-sm text-clay-500">Fixed scope · 3–5 weeks · flat fee</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Also available — compact services strip */}
      <section id="services" className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <Reveal>
            <Kicker label="Also available for" />
            <div className="grid md:grid-cols-3 gap-x-10 gap-y-6 mb-8">
              {services.map((s) => (
                <div key={s.title}>
                  <h3 className="font-display text-lg text-clay-900 mb-1">{s.title}</h3>
                  <p className="text-base text-clay-600 leading-relaxed">{s.line}</p>
                </div>
              ))}
            </div>
            <a href={MAILTO} className="text-signal hover:text-signal-dim transition-colors font-medium">
              Get in touch about fractional work →
            </a>
          </Reveal>
        </div>
      </section>

      {/* Proof — stats + track record */}
      <section id="record" className="py-20 md:py-24 bg-cream border-y border-clay-200">
        <div className="max-w-4xl mx-auto px-6">
          <Reveal>
            <Kicker label="Track record" />
            <h2 className="font-display text-3xl md:text-4xl text-clay-900 mb-10">
              A decade proving hard tech in production
            </h2>
          </Reveal>
          <Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-10 mb-4 border-b border-clay-200">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="font-display text-3xl text-clay-900">{s.value}</p>
                  <p className="text-sm text-clay-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <div>
            {timeline.map((t, i) => (
              <Reveal key={t.company} delay={i * 80}>
                <div className="py-6 border-b border-clay-200 last:border-b-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                    <h3 className="font-display text-xl text-clay-900">
                      {t.company}
                      <span className="text-clay-500 font-sans text-base ml-3">{t.role}</span>
                    </h3>
                    <p className="font-mono text-sm text-signal">{t.stat}</p>
                  </div>
                  <p className="text-base text-clay-600 leading-relaxed">
                    <span className="font-mono text-xs text-clay-400 mr-3">{t.years}</span>
                    {t.proof}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How I work */}
      <section className="py-20 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-50" aria-hidden="true"></div>
        <div className="relative max-w-4xl mx-auto px-6">
          <Reveal>
            <Kicker label="How I work" />
            <blockquote className="font-display text-2xl md:text-3xl text-clay-900 leading-snug max-w-2xl mb-14">
              &ldquo;A C-suite presentation, an RFID signal collision, and a cashier
              shift — <em className="text-signal">all in the same week.</em>&rdquo;
            </blockquote>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-10">
            {principles.map((p, i) => (
              <Reveal key={p.title} delay={i * 100}>
                <div>
                  <h3 className="font-semibold text-clay-900 mb-2">{p.title}</h3>
                  <p className="text-base text-clay-600 leading-relaxed">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 bg-cream border-t border-clay-200">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Reveal>
            <h2 className="font-display text-3xl md:text-4xl text-clay-900 mb-5">
              Tell me where you&apos;re <em className="text-signal">stuck.</em>
            </h2>
            <p className="text-clay-600 max-w-md mx-auto mb-9">
              A short note is enough. If I&apos;m not the right fit, I&apos;ll point you
              to someone who is.
            </p>
            <a
              href={MAILTO}
              className="inline-block bg-signal text-clay-50 font-medium py-3 px-8 rounded-sm hover:bg-signal-dim transition-colors"
            >
              {EMAIL}
            </a>
            <p className="text-sm text-clay-500 mt-6">
              Here about multimodal AI?{' '}
              <a href={MAILTO_MULTIMODAL} className="text-signal hover:text-signal-dim underline underline-offset-4">
                Book the 30-minute fit call
              </a>
            </p>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-clay-200">
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-clay-500">
          <p>© {new Date().getFullYear()} Tushar Dadlani</p>
          <div className="flex items-center gap-6">
            <a href={MAILTO} className="hover:text-signal transition-colors">Email</a>
            <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="hover:text-signal transition-colors">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
