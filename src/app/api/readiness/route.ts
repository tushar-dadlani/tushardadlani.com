import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export const runtime = 'nodejs';

const TO = 'tushar@valuebridge.ai';
// Must be an address on a Resend-verified domain (see setup notes).
const FROM = 'Readiness check <readiness@valuebridge.ai>';

interface BreakdownItem {
  question: string;
  answer: string;
  status: string;
}

interface Payload {
  email: string;
  score: number;
  tier: string;
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
  const tier = typeof body.tier === 'string' ? body.tier : '';
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

  const rows = breakdown
    .map(
      (b) =>
        `<tr><td style="padding:4px 12px 4px 0;vertical-align:top">${esc(b.question)}</td>` +
        `<td style="padding:4px 12px 4px 0;vertical-align:top">${esc(b.answer)}</td>` +
        `<td style="padding:4px 0;vertical-align:top"><strong>${esc(b.status)}</strong></td></tr>`
    )
    .join('');

  const html =
    `<h2>New readiness check submission</h2>` +
    `<p><strong>Email:</strong> ${esc(email)}<br/>` +
    `<strong>Score:</strong> ${score}/100<br/>` +
    `<strong>Tier:</strong> ${esc(tier)}</p>` +
    `<table style="border-collapse:collapse;font-size:14px">${rows}</table>`;

  const text =
    `New readiness check submission\n\n` +
    `Email: ${email}\nScore: ${score}/100\nTier: ${tier}\n\n` +
    breakdown.map((b) => `- ${b.question}\n  ${b.answer} [${b.status}]`).join('\n');

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: `Readiness check: ${score}/100 — ${tier} (${email})`,
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
