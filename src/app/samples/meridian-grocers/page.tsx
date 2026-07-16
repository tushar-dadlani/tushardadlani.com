import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteNav, SiteFooter, CAL_URL } from '../../components/Chrome';

export const metadata: Metadata = {
  title: 'Sample assessment: regional grocery chain — Tushar Dadlani',
  description:
    'Illustrative excerpt of a Multimodal AI Readiness & Architecture assessment for a fictional regional grocery chain.',
};

const useCases = [
  {
    name: 'Receiving-dock document extraction',
    modality: 'Scanned invoices, bills of lading',
    roi: '$1.1M/yr',
    verdict: 'Do first',
    note: 'Highest certainty, lowest risk. Off-the-shelf document AI covers 90% of formats; 6-week payback.',
  },
  {
    name: 'Self-checkout loss detection',
    modality: 'Existing camera feeds',
    roi: '$2.8M/yr',
    verdict: 'Pilot in 5 stores',
    note: 'Biggest prize — shrink at self-checkout is 3.5× staffed lanes. Needs an eval set before any vendor bake-off.',
  },
  {
    name: 'Shelf-gap & planogram compliance',
    modality: 'Existing camera feeds',
    roi: '$900K/yr',
    verdict: 'Phase 2',
    note: 'Same camera infrastructure as loss detection; sequence it second to reuse the eval and edge stack.',
  },
  {
    name: 'Customer journey heat-mapping',
    modality: 'Camera feeds',
    roi: 'Unclear',
    verdict: 'Defer',
    note: 'No owner for the output and no decision it would change today. Revisit after Phase 2.',
  },
  {
    name: 'Supplier email triage',
    modality: 'Text only',
    roi: '$120K/yr',
    verdict: 'Not multimodal',
    note: 'Real value, but a text-only workflow tool — do not burden the multimodal program with it.',
  },
];

const gaps = [
  ['No evaluation set', 'No labeled examples of shrink events or extraction ground truth. Every vendor demo is unfalsifiable until this exists. Build a 500-example golden set in weeks 1–2.'],
  ['Store network constraints', '6,800 cameras stream to in-store NVRs on 100Mbps links. Cloud-only inference is a non-starter for video; plan edge inference, cloud for documents.'],
  ['No monitoring or drift plan', 'Store lighting, seasonal displays, and camera bumps will degrade accuracy silently. Production plan includes per-store accuracy dashboards and drift alerts.'],
  ['Single-person data team', 'One data engineer supports BI today. The roadmap assumes buy-over-build until a second hire lands.'],
];

const phases = [
  ['Weeks 1–6', 'Ship document extraction at the receiving dock (buy: hosted document AI + thin validation UI). Build the shrink golden set in parallel.'],
  ['Weeks 7–16', 'Self-checkout loss detection pilot in 5 stores against the golden set. Vendor bake-off, edge deployment pattern, human-review loop.'],
  ['Quarter 3+', 'Scale winner to all 85 stores; add shelf-gap detection on the same stack. Hire the second data engineer before this phase.'],
];

export default function MeridianSample() {
  return (
    <div className="min-h-screen bg-clay-50 text-clay-600 font-sans text-[17px] leading-relaxed">
      <SiteNav />

      <main className="max-w-4xl mx-auto px-6 pt-28 md:pt-36 pb-20">
        <p className="font-mono text-xs tracking-[0.15em] uppercase text-signal mb-4">
          Sample assessment · Retail / grocery
        </p>
        <h1 className="font-display text-3xl md:text-4xl text-clay-900 mb-4">
          Meridian Grocers — Multimodal AI Readiness &amp; Architecture
        </h1>
        <p className="text-sm text-clay-500 border border-clay-200 bg-cream rounded-sm px-4 py-3 mb-10">
          <strong className="text-clay-600">Illustrative sample.</strong> Meridian Grocers is a
          fictional 85-store regional grocery chain; figures are representative, not client data.
          This excerpt shows the shape and depth of the real deliverable.
        </p>

        <h2 className="font-display text-2xl text-clay-900 mb-3">Executive summary</h2>
        <p className="mb-4">
          Meridian generates multimodal data everywhere it loses money: 6,800 security cameras
          watching self-checkout shrink happen, and a paper-driven receiving dock leaking vendor
          overbilling. Neither is used by a single automated system. The AI program to date — a
          chatbot pilot on the intranet — touches none of this value.
        </p>
        <p className="mb-10">
          Recommendation: <strong className="text-clay-900">start with documents, prove with
          video.</strong> Document extraction pays for the program in one quarter with almost no
          risk, while the self-checkout golden set is built. Do not sign a video-AI vendor
          before the eval set exists.
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
        <p className="mb-3">
          Two pipelines, one evaluation backbone:
        </p>
        <ul className="space-y-2 mb-10">
          <li><span className="font-medium text-clay-900">Documents (cloud):</span> receiving-dock scans → hosted document AI → validation UI for exceptions → ERP. Buy the extraction; build only the thin validation and routing layer.</li>
          <li><span className="font-medium text-clay-900">Video (edge):</span> camera feeds → edge inference boxes per store (existing NVR closets have rack space and power) → event clips + metadata to cloud for review and retraining. Store bandwidth makes cloud-first video unworkable.</li>
          <li><span className="font-medium text-clay-900">Eval backbone (shared):</span> golden sets, per-store accuracy dashboards, drift alerts. Every model — bought or built — is measured on the same harness before and after deployment.</li>
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
          <Link href="/samples/atlas-specialty" className="text-signal hover:text-signal-dim underline underline-offset-4">
            See the insurance sample →
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
