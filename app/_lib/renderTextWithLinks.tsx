import React from 'react';

interface RenderTextWithLinksProps {
  text: string;
  className?: string;
}

/**
 * Utility component that renders plain text and automatically converts:
 * - Markdown-style links [text](url) to clickable links
 * - Email addresses to mailto links
 * - URLs to external links
 * - Preserves line breaks
 */
export function RenderTextWithLinks({ text, className = '' }: RenderTextWithLinksProps) {
  // Markdown link regex [text](url)
  const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  
  // Email regex
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
  
  // URL regex (http/https)
  const urlRegex = /(https?:\/\/[^\s]+)/gi;

  let parts: (string | React.ReactElement)[] = [text];

  // Process markdown-style links first
  parts = parts.flatMap((part) => {
    if (typeof part !== 'string') return part;
    
    const segments: (string | React.ReactElement)[] = [];
    let lastIndex = 0;
    let match;
    
    markdownLinkRegex.lastIndex = 0;
    while ((match = markdownLinkRegex.exec(part)) !== null) {
      // Add text before match
      if (match.index > lastIndex) {
        segments.push(part.substring(lastIndex, match.index));
      }
      
      // Add link
      const linkText = match[1];
      const linkUrl = match[2];
      const isExternal = linkUrl.startsWith('http');
      
      segments.push(
        <a
          key={`markdown-${match.index}`}
          href={linkUrl}
          {...(isExternal && {
            target: "_blank",
            rel: "noopener noreferrer"
          })}
          className="text-violet-blue! hover:text-scampi! underline font-medium transition-colors"
        >
          {linkText}
        </a>
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < part.length) {
      segments.push(part.substring(lastIndex));
    }
    
    return segments.length > 0 ? segments : part;
  });

  // Process emails
  parts = parts.flatMap((part) => {
    if (typeof part !== 'string') return part;
    
    const segments = part.split(emailRegex);
    return segments.map((segment, i) => {
      if (emailRegex.test(segment)) {
        emailRegex.lastIndex = 0; // Reset regex
        return (
          <a
            key={`email-${i}`}
            href={`mailto:${segment}`}
            className="text-violet-blue! hover:text-scampi! underline font-medium transition-colors"
          >
            {segment}
          </a>
        );
      }
      return segment;
    });
  });

  // Process URLs (standalone, not already processed as markdown)
  parts = parts.flatMap((part) => {
    if (typeof part !== 'string') return part;
    
    const segments = part.split(urlRegex);
    return segments.map((segment, i) => {
      if (urlRegex.test(segment)) {
        urlRegex.lastIndex = 0; // Reset regex
        return (
          <a
            key={`url-${i}`}
            href={segment}
            target="_blank"
            rel="noopener noreferrer"
            className="text-violet-blue! hover:text-scampi! underline font-medium transition-colors"
          >
            {segment}
          </a>
        );
      }
      return segment;
    });
  });

  return <span className={className}>{parts}</span>;
}
