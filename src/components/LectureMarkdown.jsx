import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

export default function LectureMarkdown({ source }) {
  if (!source) {
    return (
      <section className="lecture-notes lecture-notes-empty">
        <h2>Конспект ещё не подключён</h2>
        <p>Официальная программа и запись доступны выше.</p>
      </section>
    );
  }

  return (
    <article className="lecture-notes">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          h1: ({ children }) => <h2 className="lecture-notes-title">{children}</h2>,
          a: ({ href, children }) => (
            <a href={href} target={href?.startsWith('http') ? '_blank' : undefined} rel={href?.startsWith('http') ? 'noreferrer' : undefined}>
              {children}
            </a>
          ),
          table: ({ children }) => <div className="lecture-table-wrap"><table>{children}</table></div>,
        }}
      >
        {source}
      </ReactMarkdown>
    </article>
  );
}
