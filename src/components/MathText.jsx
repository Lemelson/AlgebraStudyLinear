import { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);
}

function renderMath(tex, displayMode) {
  try {
    return katex.renderToString(tex.trim(), {
      displayMode,
      throwOnError: false,
    });
  } catch {
    return `<code class="katex-error">${escapeHtml(tex)}</code>`;
  }
}

function renderMarkup(source) {
  let html = String(source ?? '');
  const placeholders = [];

  function stash(rendered) {
    const token = `\x00MATH${placeholders.length}\x00`;
    placeholders.push(rendered);
    return token;
  }

  // Preserve escaped dollar signs before looking for $...$ delimiters.
  html = html.replace(/\\\$/g, () => stash('$'));

  // Display math: both Markdown-style $$...$$ and LaTeX-style \[...\].
  // KaTeX already emits the .katex-display wrapper in display mode.
  html = html.replace(/\$\$([\s\S]*?)\$\$/g, (_, tex) => stash(renderMath(tex, true)));
  html = html.replace(/\\\[([\s\S]*?)\\\]/g, (_, tex) => stash(renderMath(tex, true)));

  // Inline math: both $...$ and \(...\). A single-dollar expression may not
  // span a newline, which prevents accidental capture of prose paragraphs.
  html = html.replace(/\\\(([\s\S]*?)\\\)/g, (_, tex) => stash(renderMath(tex, false)));
  html = html.replace(/\$([^$\n]+?)\$/g, (_, tex) => stash(renderMath(tex, false)));

  // Only KaTeX output is restored as HTML. All source prose is escaped first.
  html = escapeHtml(html);

  // Basic Markdown used by the study materials.
  html = html.replace(/^[ \t]*###[ \t]+(.*?)\s*$/gm, '<h3 style="margin-top: 1.5rem; margin-bottom: 0.5rem; font-weight: 600; font-size: 1.25rem;">$1</h3>');
  html = html.replace(/^[ \t]*##[ \t]+(.*?)\s*$/gm, '<h2 style="margin-top: 2rem; margin-bottom: 1rem; font-weight: 700; font-size: 1.5rem;">$1</h2>');
  html = html.replace(/^[ \t]*#[ \t]+(.*?)\s*$/gm, '<h1 style="margin-top: 2.5rem; margin-bottom: 1rem; font-weight: 800; font-size: 2rem;">$1</h1>');
  html = html.replace(/^[ \t]*---+[ \t]*$/gm, '<hr style="margin: 2rem 0; border: none; border-top: 1px solid var(--border);" />');
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  html = html.replace(/\n\n/g, '</p><p>');
  html = html.replace(/\n/g, '<br/>');
  html = html.replace(/(<br\/>|<\/p><p>)(\d+)\.\s/g,
    '$1<span style="margin-right: 4px; color: var(--text-accent); font-weight: 600;">$2.</span> ');
  html = html.replace(/(<br\/>|<\/p><p>)- /g,
    '$1<span style="margin-right: 4px; color: var(--text-accent);">•</span> ');

  html = `<p>${html}</p>`;
  html = html.replace(/<p>\s*(<h[1-6].*?>.*?<\/h[1-6]>)\s*<\/p>/g, '$1');
  html = html.replace(/<p>\s*(<hr.*?>)\s*<\/p>/g, '$1');
  html = html.replace(/<p>\s*<\/p>/g, '');
  html = html.replace(/✓/g, '<span style="color: var(--success); font-weight: 700;">✓</span>');
  html = html.replace(/✗/g, '<span style="color: var(--danger); font-weight: 700;">✗</span>');

  placeholders.forEach((rendered, index) => {
    html = html.replace(`\x00MATH${index}\x00`, rendered);
  });

  return html;
}

// Renders mixed Russian prose and inline/display LaTeX, plus the small Markdown
// subset used in the study materials.
export default function MathText({ text, className = '' }) {
  const html = useMemo(() => renderMarkup(text), [text]);

  return (
    <div
      className={`math-text ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
