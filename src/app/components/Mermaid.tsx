'use client';

import { useEffect } from 'react';

// Opens a full-screen, enlarged view of a rendered diagram. The SVG is vector,
// so scaling it up to the viewport stays crisp at any size.
function openLightbox(svg: SVGElement) {
  const overlay = document.createElement('div');
  overlay.className = 'mermaid-lightbox';

  const inner = document.createElement('div');
  inner.className = 'mermaid-lightbox-inner';

  const clone = svg.cloneNode(true) as SVGElement;
  clone.removeAttribute('width');
  clone.removeAttribute('height');
  // Explicit large width (not 100%, which collapses against the shrink-to-fit
  // container) and clear Mermaid's inline max-width so it scales up crisply.
  clone.style.width = 'min(88vw, 1400px)';
  clone.style.maxWidth = 'none';
  clone.style.height = 'auto';
  inner.appendChild(clone);
  overlay.appendChild(inner);
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  const close = () => {
    overlay.remove();
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKey);
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') close();
  };
  overlay.addEventListener('click', close);
  document.addEventListener('keydown', onKey);
}

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
        suppressErrorRendering: true, // never inject the error-bomb graphic
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
          fontSize: '16px',
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
        // Errors are suppressed above; failed nodes are hidden just below.
      }

      nodes.forEach((n) => {
        const svg = n.querySelector('svg');
        if (!svg) {
          // Failed to render — show nothing rather than raw source.
          n.style.display = 'none';
          return;
        }
        // Render crisply at the container width, and make it click-to-enlarge.
        svg.removeAttribute('height');
        svg.style.width = '100%';
        svg.style.maxWidth = '100%';
        svg.style.height = 'auto';

        n.dataset.zoomable = 'true';
        n.setAttribute('role', 'button');
        n.setAttribute('tabindex', '0');
        n.setAttribute('aria-label', 'Enlarge diagram');
        const open = () => openLightbox(svg);
        n.addEventListener('click', open);
        n.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            open();
          }
        });
      });
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
