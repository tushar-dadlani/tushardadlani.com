import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export const runtime = 'nodejs';

// Leads are sent to a single fixed recipient (you). On Resend's free plan with no
// verified domain, the built-in onboarding@resend.dev sender can only deliver to your
// own Resend account email — so TO must match the address you signed up to Resend with.
const TO = 'tushar@valuebridge.ai';
const FROM = 'Readiness check <onboarding@resend.dev>';

interface BreakdownItem {
  question: string;
  answer: string;
  status: string;
}

interface TierInfo {
  name: string;
  headline?: string;
  body?: string;
}

interface Payload {
  email: string;
  score: number;
  tier: string | TierInfo;
  breakdown: BreakdownItem[];
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export async function POST(request: Request) {
  let body: Partial<Payload>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 });
  }

  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const score = typeof body.score === 'number' ? body.score : null;
  // tier may arrive as a plain name (older clients) or a full object.
  const tierRaw = body.tier;
  const tier: TierInfo =
    typeof tierRaw === 'string'
      ? { name: tierRaw }
      : { name: tierRaw?.name ?? '', headline: tierRaw?.headline, body: tierRaw?.body };
  const breakdown = Array.isArray(body.breakdown) ? body.breakdown : [];

  if (!EMAIL_RE.test(email) || score === null) {
    return NextResponse.json({ ok: false, error: 'Invalid submission.' }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Fail loud on the server, but keep the message generic to the client.
    console.error('RESEND_API_KEY is not set');
    return NextResponse.json({ ok: false, error: 'Email delivery not configured.' }, { status: 500 });
  }

  const th = 'padding:6px 12px 6px 0;text-align:left;border-bottom:2px solid #221A14;font-size:12px;text-transform:uppercase;letter-spacing:.05em;color:#8A7663';
  const td = 'padding:8px 12px 8px 0;vertical-align:top;border-bottom:1px solid #EADDCE';

  const rows = breakdown
    .map(
      (b) =>
        `<tr><td style="${td}">${esc(b.question)}</td>` +
        `<td style="${td}">${esc(b.answer)}</td>` +
        `<td style="${td};white-space:nowrap"><strong>${esc(b.status)}</strong></td></tr>`
    )
    .join('');

  const tierNarrative =
    (tier.headline ? `<p style="font-size:16px;color:#221A14;margin:0 0 8px"><strong>${esc(tier.headline)}</strong></p>` : '') +
    (tier.body ? `<p style="margin:0 0 4px">${esc(tier.body)}</p>` : '');

  const html =
    `<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#5F4F41;max-width:640px">` +
    `<h2 style="color:#221A14">New readiness check lead</h2>` +

    `<h3 style="color:#221A14;margin-bottom:4px">Lead</h3>` +
    `<p style="margin-top:0">` +
    `<strong>Email:</strong> <a href="mailto:${esc(email)}">${esc(email)}</a><br/>` +
    `<span style="color:#8A7663;font-size:13px">Hitting Reply goes straight to them.</span>` +
    `</p>` +

    `<h3 style="color:#221A14;margin-bottom:4px">Result</h3>` +
    `<p style="margin-top:0"><strong>Score:</strong> ${score}/100 &nbsp;·&nbsp; <strong>Tier:</strong> ${esc(tier.name)}</p>` +
    tierNarrative +

    `<h3 style="color:#221A14;margin-bottom:4px">Full assessment</h3>` +
    `<table style="border-collapse:collapse;font-size:14px;width:100%">` +
    `<thead><tr><th style="${th}">Question</th><th style="${th}">Their answer</th><th style="${th}">Rating</th></tr></thead>` +
    `<tbody>${rows}</tbody></table>` +
    `</div>`;

  const text =
    `New readiness check lead\n\n` +
    `LEAD\nEmail: ${email} (reply goes straight to them)\n\n` +
    `RESULT\nScore: ${score}/100\nTier: ${tier.name}\n` +
    (tier.headline ? `${tier.headline}\n` : '') +
    (tier.body ? `${tier.body}\n` : '') +
    `\nFULL ASSESSMENT\n` +
    breakdown.map((b) => `- ${b.question}\n  ${b.answer} [${b.status}]`).join('\n');

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: `Readiness check: ${score}/100 — ${tier.name} (${email})`,
      html,
      text,
    });
    if (error) {
      console.error('Resend error', error);
      return NextResponse.json({ ok: false, error: 'Could not send.' }, { status: 502 });
    }
  } catch (err) {
    console.error('Resend threw', err);
    return NextResponse.json({ ok: false, error: 'Could not send.' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
