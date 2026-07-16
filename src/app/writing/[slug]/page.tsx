import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteNav, SiteFooter } from '../../components/Chrome';
import { PostCTA } from '../../components/PostCTA';
import { Mermaid } from '../../components/Mermaid';
import { getPost, getPostSlugs, formatDate } from '../../../lib/posts';

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPost(params.slug);
  if (!post) return { title: 'Not found — Tushar Dadlani' };
  return {
    title: `${post.title} — Tushar Dadlani`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url: `https://tushardadlani.com/writing/${post.slug}`,
    },
  };
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-clay-50 text-clay-600 font-sans text-[17px] leading-relaxed flex flex-col">
      <SiteNav />

      <main className="flex-grow max-w-2xl w-full mx-auto px-6 pt-28 md:pt-36 pb-20">
        <Link
          href="/writing"
          className="font-mono text-xs tracking-[0.15em] uppercase text-clay-500 hover:text-signal transition-colors"
        >
          ← Writing
        </Link>

        <h1 className="font-display text-3xl md:text-4xl text-clay-900 mt-6 mb-3 leading-[1.15]">
          {post.title}
        </h1>
        <p className="font-mono text-xs text-clay-500 mb-10">
          <time dateTime={post.date}>{formatDate(post.date)}</time> · {post.readingMinutes} min read
        </p>

        <article
          className="prose prose-lg prose-headings:font-display prose-headings:font-semibold prose-a:underline prose-a:underline-offset-4 hover:prose-a:text-signal-dim"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
        <Mermaid />

        <PostCTA />
      </main>

      <SiteFooter />
    </div>
  );
}
