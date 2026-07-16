'use client';

import { useEffect } from 'react';

// Renders any ```mermaid fenced blocks in the post HTML. The markdown engine
// emits them as <pre><code class="language-mermaid">…</code></pre> at build time;
// here we swap each for a themed, client-rendered SVG. Mermaid (~large) is
// dynamically imported only when a diagram is actually present on the page.
export function Mermaid() {
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const codes = Array.from(
        document.querySelectorAll<HTMLElement>('pre > code.language-mermaid')
      );
      if (codes.length === 0) return;

      const mermaid = (await import('mermaid')).default;
      if (cancelled) return;

      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'strict',
        fontFamily: 'var(--font-inter), Inter, sans-serif',
        theme: 'base',
        themeVariables: {
          background: '#FBF6F1',
          primaryColor: '#FFFCF8', // node fill (cream)
          primaryTextColor: '#221A14', // clay-900
          primaryBorderColor: '#9A3412', // signal
          lineColor: '#A89684', // clay-400
          secondaryColor: '#FBF6F1',
          tertiaryColor: '#FBF6F1',
          clusterBkg: '#F4EBE0',
          clusterBorder: '#EADDCE',
          titleColor: '#221A14',
          edgeLabelBackground: '#FBF6F1',
          fontSize: '15px',
        },
      });

      // Replace each <pre><code.language-mermaid> with a .mermaid container
      // holding the raw source (textContent decodes any HTML entities).
      const nodes = codes.map((code) => {
        const pre = code.parentElement as HTMLElement;
        const div = document.createElement('div');
        div.className = 'mermaid';
        div.textContent = code.textContent ?? '';
        pre.replaceWith(div);
        return div;
      });

      try {
        await mermaid.run({ nodes });
      } catch {
        // If a diagram fails to parse, leave its source visible rather than crash.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
