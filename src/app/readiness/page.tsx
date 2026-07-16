'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import posthog from 'posthog-js';
import { SiteNav, SiteFooter, CAL_URL } from '../components/Chrome';

/* ── Quiz definition ───────────────────────────────────────────── */

interface Option {
  label: string;
  points: number;
}

interface Question {
  key: string;
  text: string;
  options: Option[];
}

const QUESTIONS: Question[] = [
  {
    key: 'data',
    text: 'What visual or unstructured data does your business generate?',
    options: [
      { label: 'Multiple kinds — documents, images, video, or camera feeds', points: 3 },
      { label: 'Mostly documents and scans', points: 2 },
      { label: 'Some, but scattered or on paper', points: 1 },
      { label: 'Honestly not sure', points: 0 },
    ],
  },
  {
    key: 'access',
    text: 'Where does that data live today?',
    options: [
      { label: 'Centralized and queryable (one system or lake)', points: 3 },
      { label: 'A few known systems, some export effort', points: 2 },
      { label: 'Scattered across teams, drives, and vendors', points: 1 },
      { label: 'Physical/paper or vendor-locked', points: 0 },
    ],
  },
  {
    key: 'attempts',
    text: 'How far has AI on this data actually gotten?',
    options: [
      { label: 'Something runs in production today', points: 3 },
      { label: 'A pilot with real users', points: 2 },
      { label: 'A demo or notebook prototype', points: 1 },
      { label: 'Nothing yet', points: 0 },
    ],
  },
  {
    key: 'usecase',
    text: 'Is there a defined use case with a number attached?',
    options: [
      { label: 'Yes — a use case with an ROI estimate leadership has seen', points: 3 },
      { label: 'A shortlist of candidates, no numbers yet', points: 2 },
      { label: 'General excitement, no specific use case', points: 1 },
      { label: 'We were told "we should be using AI"', points: 0 },
    ],
  },
  {
    key: 'owner',
    text: 'Who owns AI initiatives?',
    options: [
      { label: 'A dedicated team or accountable leader', points: 3 },
      { label: 'IT or data team, as one project among many', points: 2 },
      { label: 'An enthusiastic individual, unofficially', points: 1 },
      { label: 'Nobody', points: 0 },
    ],
  },
  {
    key: 'eval',
    text: 'If a vendor demoed 95% accuracy tomorrow, could you check that claim?',
    options: [
      { label: 'Yes — we have labeled examples / ground truth', points: 3 },
      { label: 'We could build a test set fairly quickly', points: 2 },
      { label: 'We would rely on the vendor’s numbers', points: 1 },
      { label: 'We wouldn’t know where to start', points: 0 },
    ],
  },
  {
    key: 'production',
    text: 'Has anyone scoped what production actually requires — latency, cost per call, monitoring, failure handling?',
    options: [
      { label: 'Yes, budgets and monitoring are defined', points: 3 },
      { label: 'Partially — some numbers exist', points: 2 },
      { label: 'Not yet, but we know we need to', points: 1 },
      { label: 'The demo is the plan', points: 0 },
    ],
  },
  {
    key: 'sponsor',
    text: 'How committed is leadership?',
    options: [
      { label: 'Budget approved, executive sponsor named', points: 3 },
      { label: 'Strong interest, budget in discussion', points: 2 },
      { label: 'Curious but uncommitted', points: 1 },
      { label: 'Skeptical or absent', points: 0 },
    ],
  },
];

const MAX_POINTS = QUESTIONS.length * 3;

interface Tier {
  min: number;
  name: string;
  headline: string;
  body: string;
}

const TIERS: Tier[] = [
  {
    min: 75,
    name: 'Ready to build',
    headline: 'Your gap is architecture, not appetite.',
    body: 'You have the data, the ownership, and the mandate. The risk now is building the wrong thing well — locking into a vendor or architecture before the use-case economics are proven. A readiness assessment at this stage is cheap insurance on a build you’re about to fund anyway.',
  },
  {
    min: 45,
    name: 'Pilot-ready, with gaps',
    headline: 'You can start — but two or three gaps will stall you at the demo stage.',
    body: 'Most companies at this stage get a working prototype and then spend two quarters discovering evaluation, monitoring, and cost problems one at a time. Closing the gaps in sequence — usually evaluation first — is the difference between a pilot and a production system.',
  },
  {
    min: 0,
    name: 'Foundation first',
    headline: 'Don’t buy anything yet.',
    body: 'The honest move is 4–6 weeks of groundwork: locate and centralize the highest-value data, pick one use case with a number attached, and name an owner. Doing this before engaging vendors typically halves the cost of everything that follows.',
  },
];

function tierFor(score: number): Tier {
  return TIERS.find((t) => score >= t.min) ?? TIERS[TIERS.length - 1];
}

/* ── Component ─────────────────────────────────────────────────── */

export default function ReadinessQuiz() {
  const [step, setStep] = useState(0); // 0..QUESTIONS.length-1, then email, then results
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const answered = Object.keys(answers).length;
  const score = Math.round(
    (Object.values(answers).reduce((a, b) => a + b, 0) / MAX_POINTS) * 100
  );

  // Drop-off funnel (temporary — see note in providers/PostHogProvider.tsx).
  useEffect(() => {
    try {
      posthog.capture('readiness_quiz_started');
    } catch {
      /* analytics must never block the user */
    }
  }, []);

  const choose = (key: string, points: number) => {
    try {
      posthog.capture('readiness_question_answered', {
        step: step + 1, // 1-based number of the question just answered
        total: QUESTIONS.length,
        question: key,
        points,
      });
    } catch {
      /* analytics must never block the user */
    }
    setAnswers((prev) => ({ ...prev, [key]: points }));
    setStep((s) => s + 1);
  };

  const submitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailError('Please enter a valid work email.');
      return;
    }
    setEmailError('');
    setSendError('');

    const t = tierFor(score);

    try {
      posthog.identify(trimmed, { email: trimmed });
      posthog.capture('readiness_quiz_completed', {
        score,
        tier: t.name,
        ...answers,
      });
    } catch {
      /* analytics must never block the user */
    }

    // Readable per-question breakdown for the lead notification email.
    const breakdown = QUESTIONS.map((question) => {
      const pts = answers[question.key] ?? 0;
      const chosen = question.options.find((o) => o.points === pts);
      const status = pts >= 3 ? 'Strong' : pts === 2 ? 'Workable' : pts === 1 ? 'Gap' : 'Blocker';
      return { question: question.text, answer: chosen?.label ?? '—', status };
    });

    setSending(true);
    try {
      const res = await fetch('/api/readiness/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: trimmed,
          score,
          tier: { name: t.name, headline: t.headline, body: t.body },
          breakdown,
        }),
      });
      if (!res.ok) throw new Error('send failed');
    } catch {
      setSending(false);
      setSendError(
        'We saved your answers but hit a snag delivering them. Your results are below — feel free to book a call directly.'
      );
      setSubmitted(true);
      return;
    }

    setSending(false);
    setSubmitted(true);
  };

  const tier = tierFor(score);
  const atEmail = step >= QUESTIONS.length && !submitted;
  const q = QUESTIONS[step];

  // Funnel step: user answered all questions and hit the email gate.
  useEffect(() => {
    if (atEmail) {
      try {
        posthog.capture('readiness_email_gate_reached', { score });
      } catch {
        /* analytics must never block the user */
      }
    }
  }, [atEmail, score]);

  return (
    <div className="min-h-screen bg-clay-50 text-clay-600 font-sans text-[17px] leading-relaxed flex flex-col">
      <SiteNav />

      <main className="flex-grow max-w-2xl w-full mx-auto px-6 pt-28 md:pt-36 pb-20">
        <p className="font-mono text-xs tracking-[0.15em] uppercase text-signal mb-4">
          Multimodal AI readiness check
        </p>

        {!atEmail && !submitted && (
          <>
            <h1 className="font-display text-3xl md:text-4xl text-clay-900 mb-3">
              Is your company ready to ship multimodal AI?
            </h1>
            <p className="text-clay-600 mb-10">
              Eight questions, two minutes. Scored the same way I score real assessments.
            </p>

            {/* Progress */}
            <div className="flex items-center gap-3 mb-8">
              <div className="flex-1 h-1 bg-clay-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-signal transition-all duration-300"
                  style={{ width: `${(answered / QUESTIONS.length) * 100}%` }}
                ></div>
              </div>
              <span className="font-mono text-xs text-clay-500">
                {Math.min(answered + 1, QUESTIONS.length)}/{QUESTIONS.length}
              </span>
            </div>

            <h2 className="font-display text-xl md:text-2xl text-clay-900 mb-6">{q.text}</h2>
            <div className="space-y-3">
              {q.options.map((o) => (
                <button
                  key={o.label}
                  onClick={() => choose(q.key, o.points)}
                  className="w-full text-left border border-clay-200 bg-cream hover:border-signal hover:bg-clay-50 rounded-sm px-5 py-4 text-base text-clay-900 transition-colors"
                >
                  {o.label}
                </button>
              ))}
            </div>
            {step > 0 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="mt-6 text-sm text-clay-500 hover:text-signal transition-colors"
              >
                ← Back
              </button>
            )}
          </>
        )}

        {atEmail && (
          <>
            <h1 className="font-display text-3xl md:text-4xl text-clay-900 mb-3">
              Your score is ready.
            </h1>
            <p className="text-clay-600 mb-8">
              Enter your work email to see your readiness tier, where you stand on
              each dimension, and the one thing to fix first.
            </p>
            <form onSubmit={submitEmail} className="flex flex-col sm:flex-row gap-3 mb-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="flex-1 border border-clay-200 bg-cream rounded-sm px-4 py-3 text-base text-clay-900 placeholder:text-clay-400 focus:outline-none focus:border-signal"
                autoFocus
              />
              <button
                type="submit"
                disabled={sending}
                className="bg-signal text-clay-50 font-medium py-3 px-7 rounded-sm hover:bg-signal-dim transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {sending ? 'Sending…' : 'Show my results'}
              </button>
            </form>
            {emailError && <p className="text-sm text-signal mb-3">{emailError}</p>}
            <p className="text-sm text-clay-500">
              Your results show instantly. I&apos;ll only use your email to follow up about
              your readiness — no spam, unsubscribe anytime.
            </p>
          </>
        )}

        {submitted && (
          <>
            {sendError && (
              <p className="text-sm text-signal border border-signal/30 bg-signal/5 rounded-sm px-4 py-3 mb-6">
                {sendError}
              </p>
            )}
            <div className="flex items-baseline gap-6 mb-6">
              <p className="font-display text-6xl text-signal">{score}</p>
              <div>
                <p className="font-mono text-xs tracking-[0.15em] uppercase text-clay-500">Readiness score</p>
                <p className="font-display text-2xl text-clay-900">{tier.name}</p>
              </div>
            </div>
            <p className="text-xl text-clay-900 mb-4">{tier.headline}</p>
            <p className="mb-10">{tier.body}</p>

            <h2 className="font-display text-xl text-clay-900 mb-4">Where you stand</h2>
            <ul className="space-y-2 mb-10">
              {QUESTIONS.map((question) => {
                const pts = answers[question.key] ?? 0;
                const status = pts >= 3 ? 'Strong' : pts === 2 ? 'Workable' : pts === 1 ? 'Gap' : 'Blocker';
                const color = pts >= 2 ? 'text-clay-900' : 'text-signal';
                return (
                  <li key={question.key} className="flex justify-between gap-6 border-b border-clay-200 pb-2 text-base">
                    <span>{question.text}</span>
                    <span className={`font-mono text-sm whitespace-nowrap ${color}`}>{status}</span>
                  </li>
                );
              })}
            </ul>

            <div className="border border-clay-200 bg-cream rounded-sm p-6">
              <p className="font-display text-xl text-clay-900 mb-2">
                Want the plan, not just the score?
              </p>
              <p className="text-base mb-5">
                The full assessment maps your use cases to ROI, designs the architecture, and
                sequences the roadmap — see a{' '}
                <Link href="/samples/meridian-grocers" className="text-signal underline underline-offset-4">sample for retail</Link>{' '}
                or{' '}
                <Link href="/samples/atlas-specialty" className="text-signal underline underline-offset-4">insurance</Link>.
              </p>
              <a
                href={CAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-signal text-clay-50 font-medium py-3 px-7 rounded-sm hover:bg-signal-dim transition-colors"
              >
                Book a 30-minute fit call
              </a>
            </div>
          </>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
