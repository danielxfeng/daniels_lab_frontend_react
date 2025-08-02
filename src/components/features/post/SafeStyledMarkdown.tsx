import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import c from 'highlight.js/lib/languages/c';
import cpp from 'highlight.js/lib/languages/cpp';
import csharp from 'highlight.js/lib/languages/csharp';
import css from 'highlight.js/lib/languages/css';
import go from 'highlight.js/lib/languages/go';
import java from 'highlight.js/lib/languages/java';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import python from 'highlight.js/lib/languages/python';
import typescript from 'highlight.js/lib/languages/typescript';
import html from 'highlight.js/lib/languages/xml';
import { marked } from 'marked';

import { cn } from '@/lib/utils';

import 'highlight.js/styles/github-dark.css';

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

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('json', json);
hljs.registerLanguage('go', go);
hljs.registerLanguage('python', python);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('c', c);
hljs.registerLanguage('csharp', csharp);
hljs.registerLanguage('css', css);
hljs.registerLanguage('html', html);
hljs.registerLanguage('java', java);
hljs.registerLanguage('cpp', cpp);
hljs.registerLanguage('bash', bash);

// Add a hook to sanitize the attributes of the <a> tag
if (typeof window !== 'undefined') {
  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.tagName === 'A') {
      node.setAttribute('target', '_blank');
      node.setAttribute('rel', 'noopener noreferrer');
    }
  });
}

/**
 * A component to render markdown safety and styled
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
      data-role='safe-styled-markdown'
    />
  );
};

export default SafeStyledMarkdown;
