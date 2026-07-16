import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteNav, SiteFooter, CAL_URL } from '../../components/Chrome';

export const metadata: Metadata = {
  title: 'Sample assessment: specialty insurer — Tushar Dadlani',
  description:
    'Illustrative excerpt of a Multimodal AI Readiness & Architecture assessment for a fictional specialty property insurer.',
};

const useCases = [
  {
    name: 'FNOL document intake extraction',
    modality: 'PDFs, ACORD forms, emails',
    roi: '2.1 days off cycle time',
    verdict: 'Do first',
    note: 'Adjusters retype the same fields three times today. Hosted document AI plus a review UI removes the worst of it in six weeks.',
  },
  {
    name: 'Damage-photo triage & severity scoring',
    modality: 'Adjuster & policyholder photos',
    roi: '31% of claims fast-tracked',
    verdict: 'Phase 2',
    note: 'Vision-language models score severity well enough to route, not to settle. Human-in-the-loop by design; needs the golden claims set first.',
  },
  {
    name: 'Multimodal claims copilot (RAG)',
    modality: 'Full claim file: docs + photos + notes',
    roi: 'Adjuster leverage',
    verdict: 'Phase 3',
    note: 'High value but it inherits every data-quality problem upstream. Sequence after intake extraction cleans the inputs.',
  },
  {
    name: 'Cross-modal fraud detection',
    modality: 'Photos vs. estimates vs. history',
    roi: 'Unproven',
    verdict: 'Defer',
    note: 'Promising research direction, but Atlas lacks labeled fraud outcomes at the volume needed. Revisit with 18 months of structured claim data.',
  },
];

const gaps = [
  ['PII and carrier compliance', 'Claim files are dense with PII. Architecture keeps all inference inside the existing cloud tenancy; no training on customer data; full audit log of every model read.'],
  ['No golden claims set', 'No labeled ground truth for extraction accuracy or severity. Weeks 1–2 build a 300-claim golden set with the two most senior adjusters.'],
  ['Latency budget undefined', 'Intake extraction can run in batch (minutes are fine); the copilot cannot (seconds). Two different serving paths, costed separately.'],
  ['Shadow-IT model use', 'Adjusters already paste claim text into public chatbots. The program includes a sanctioned, logged alternative — the fastest way to end the practice.'],
];

const phases = [
  ['Weeks 1–6', 'Golden claims set + FNOL intake extraction in production for two claim types (buy: hosted document AI; build: review UI and audit logging).'],
  ['Weeks 7–14', 'Damage-photo triage pilot on fast-track candidates, human-in-the-loop, measured against the golden set.'],
  ['Quarter 3+', 'Claims copilot over the now-clean claim files; expand extraction to all claim types.'],
];

export default function AtlasSample() {
  return (
    <div className="min-h-screen bg-clay-50 text-clay-600 font-sans text-[17px] leading-relaxed">
      <SiteNav />

      <main className="max-w-4xl mx-auto px-6 pt-28 md:pt-36 pb-20">
        <p className="font-mono text-xs tracking-[0.15em] uppercase text-signal mb-4">
          Sample assessment · Specialty insurance
        </p>
        <h1 className="font-display text-3xl md:text-4xl text-clay-900 mb-4">
          Atlas Specialty Insurance — Multimodal AI Readiness &amp; Architecture
        </h1>
        <p className="text-sm text-clay-500 border border-clay-200 bg-cream rounded-sm px-4 py-3 mb-10">
          <strong className="text-clay-600">Illustrative sample.</strong> Atlas Specialty is a
          fictional commercial-property insurer (~$400M GWP); figures are representative, not
          client data. This excerpt shows the shape and depth of the real deliverable.
        </p>

        <h2 className="font-display text-2xl text-clay-900 mb-3">Executive summary</h2>
        <p className="mb-4">
          Every Atlas claim is already a multimodal document: adjuster photos, ACORD forms,
          contractor estimates, and email threads. Cycle time averages 11.4 days, and roughly
          a third of that is humans re-keying and hunting through files. The data needed to fix
          this is already in the claims system — unlabeled, unindexed, and untouched by the
          current AI initiative (a policy-language chatbot).
        </p>
        <p className="mb-10">
          Recommendation: <strong className="text-clay-900">clean the intake, then compound.</strong>{' '}
          Document extraction is the wedge — it pays back immediately and produces the structured
          data every later phase (photo triage, claims copilot) depends on. Fraud detection is
          the shiny object to explicitly not chase this year.
        </p>

        <h2 className="font-display text-2xl text-clay-900 mb-5">1 · Use-case &amp; value map</h2>
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left border-b border-clay-200 font-mono text-xs uppercase tracking-wider text-clay-500">
                <th className="py-2 pr-4">Use case</th>
                <th className="py-2 pr-4">Data</th>
                <th className="py-2 pr-4">Est. value</th>
                <th className="py-2">Verdict</th>
              </tr>
            </thead>
            <tbody>
              {useCases.map((u) => (
                <tr key={u.name} className="border-b border-clay-200 align-top">
                  <td className="py-3 pr-4 text-clay-900 font-medium">{u.name}</td>
                  <td className="py-3 pr-4">{u.modality}</td>
                  <td className="py-3 pr-4 font-mono text-signal whitespace-nowrap">{u.roi}</td>
                  <td className="py-3 text-clay-900">{u.verdict}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul className="space-y-2 mb-10">
          {useCases.map((u) => (
            <li key={u.name} className="text-sm text-clay-600">
              <span className="font-medium text-clay-900">{u.name}:</span> {u.note}
            </li>
          ))}
        </ul>

        <h2 className="font-display text-2xl text-clay-900 mb-5">2 · Reference architecture</h2>
        <ul className="space-y-2 mb-10">
          <li><span className="font-medium text-clay-900">Intake pipeline:</span> FNOL documents → hosted document AI (inside existing cloud tenancy) → adjuster review UI for low-confidence fields → claims system of record. Confidence thresholds tuned per claim type.</li>
          <li><span className="font-medium text-clay-900">Photo triage:</span> policyholder and adjuster photos → vision-language scoring → route to fast-track or full adjustment. Model recommends; adjusters decide. Every decision logged for the eval loop.</li>
          <li><span className="font-medium text-clay-900">Eval &amp; audit backbone:</span> 300-claim golden set, per-claim-type accuracy dashboards, and a full audit trail of every model read and suggestion — built once, reused by every phase, and written for regulator questions.</li>
        </ul>

        <h2 className="font-display text-2xl text-clay-900 mb-5">3 · Production &amp; reliability gaps</h2>
        <ul className="space-y-3 mb-10">
          {gaps.map(([title, body]) => (
            <li key={title}>
              <span className="font-medium text-clay-900">{title}.</span> {body}
            </li>
          ))}
        </ul>

        <h2 className="font-display text-2xl text-clay-900 mb-5">4 · Roadmap</h2>
        <ul className="space-y-3 mb-12">
          {phases.map(([when, what]) => (
            <li key={when} className="flex gap-4">
              <span className="font-mono text-xs text-signal whitespace-nowrap mt-1.5">{when}</span>
              <span>{what}</span>
            </li>
          ))}
        </ul>

        <div className="border-t border-clay-200 pt-8 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <a
            href={CAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-signal text-clay-50 font-medium py-3 px-7 rounded-sm hover:bg-signal-dim transition-colors"
          >
            Get an assessment like this
          </a>
          <Link href="/samples/meridian-grocers" className="text-signal hover:text-signal-dim underline underline-offset-4">
            See the grocery sample →
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
