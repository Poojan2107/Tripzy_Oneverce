import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';

interface RichTextRendererProps {
  content: string;
  className?: string;
  prose?: 'sm' | 'base' | 'lg';
}

const proseSizes = {
  sm: 'text-xs leading-relaxed',
  base: 'text-sm leading-relaxed',
  lg: 'text-base leading-relaxed',
};

export default function RichTextRenderer({ content, className = '', prose = 'base' }: RichTextRendererProps) {
  if (!content) return null;
  return (
    <div className={`prose-custom ${proseSizes[prose]} ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={{
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-gold underline underline-offset-2 hover:text-gold/80 transition-colors">
              {children}
            </a>
          ),
          ul: ({ children }) => <ul className="list-disc pl-5 space-y-1 my-2">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-5 space-y-1 my-2">{children}</ol>,
          strong: ({ children }) => <strong className="font-semibold text-night">{children}</strong>,
          em: ({ children }) => <em className="italic text-stone">{children}</em>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-gold/40 pl-4 italic text-stone my-3">{children}</blockquote>
          ),
          h3: ({ children }) => <h3 className="text-sm font-bold font-mono uppercase tracking-[0.15em] text-gold mt-4 mb-2">{children}</h3>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
