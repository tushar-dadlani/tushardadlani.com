import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteNav, SiteFooter } from '../components/Chrome';
import { getAllPosts, formatDate } from '../../lib/posts';

export const metadata: Metadata = {
  title: 'Writing — Tushar Dadlani',
  description:
    'Practical notes on shipping multimodal AI in production — architecture, readiness, and what actually works.',
};

export default function WritingIndex() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-clay-50 text-clay-600 font-sans text-[17px] leading-relaxed flex flex-col">
      <SiteNav />

      <main className="flex-grow max-w-2xl w-full mx-auto px-6 pt-28 md:pt-36 pb-20">
        <p className="font-mono text-xs tracking-[0.15em] uppercase text-signal mb-4">
          Writing
        </p>
        <h1 className="font-display text-3xl md:text-4xl text-clay-900 mb-3">
          Notes on shipping multimodal AI
        </h1>
        <p className="text-clay-600 mb-12">
          Practical, production-first writing on multimodal AI — architecture,
          readiness, and the parts most teams underestimate.
        </p>

        {posts.length === 0 ? (
          <p className="text-clay-500">No posts yet.</p>
        ) : (
          <ul className="space-y-10">
            {posts.map((post) => (
              <li key={post.slug} className="border-b border-clay-200 pb-10 last:border-0">
                <p className="font-mono text-xs text-clay-500 mb-2">
                  {formatDate(post.date)} · {post.readingMinutes} min read
                </p>
                <h2 className="font-display text-2xl text-clay-900 mb-2">
                  <Link href={`/writing/${post.slug}`} className="hover:text-signal transition-colors">
                    {post.title}
                  </Link>
                </h2>
                <p className="text-clay-600 mb-3">{post.description}</p>
                <Link
                  href={`/writing/${post.slug}`}
                  className="text-signal hover:text-signal-dim transition-colors font-medium"
                >
                  Read →
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
