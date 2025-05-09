import { marked } from 'marked';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

// Configure marked to use GitHub Flavored Markdown (GFM) and enable line breaks
marked.setOptions({
  gfm: true,
  breaks: true,
});

// Set the renderer to use highlight.js for code blocks
marked.use({
  renderer: {
    code(this, token) {
      const lang = token.lang;
      const code = token.text;

      const valid = lang && hljs.getLanguage(lang);
      const highlighted = valid
        ? hljs.highlight(code, { language: lang }).value
        : hljs.highlightAuto(code).value;

      return `<pre><code class="hljs language-${lang}">${highlighted}</code></pre>`;
    },
  },
});

// Add a hook to sanitize the attributes of the <a> tag
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A') {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer');
  }
});

/**
 * A component to render markdown safety and styled
 * @param markdown - The markdown string to be rendered
 * @param className - Optional additional class names to be applied to the component
 * @returns A React component that renders the markdown string
 */
const SafeStyledMarkdown = ({ markdown, className }: { markdown: string; className?: string }) => {
  const [html, setHtml] = useState('');

  useEffect(() => {
    const render = async () => {
      const raw = await marked.parse(markdown);
      const clean = DOMPurify.sanitize(raw);
      setHtml(clean);
    };
    render();
  }, [markdown]);

  return (
    <div
      className={cn('prose dark:prose-invert w-full max-w-none', className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default SafeStyledMarkdown;
