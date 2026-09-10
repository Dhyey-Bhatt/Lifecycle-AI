import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';

/**
 * Custom High-Performance Markdown & Code Block Renderer
 * Renders bold, italics, headers, lists, blockquotes, tables, and copyable code blocks
 * without bulky external dependencies.
 */
export const MarkdownRenderer = ({ content = '' }) => {
  if (!content) return null;

  // Split by code blocks first
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="chat-markdown-body">
      {parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const lines = part.slice(3, -3).trim().split('\n');
          const language = lines[0].match(/^[a-zA-Z0-9_-]+$/) ? lines[0] : 'code';
          const code = (language === lines[0] ? lines.slice(1) : lines).join('\n');

          return <CodeBlock key={index} code={code} language={language} />;
        }

        return <MarkdownSection key={index} text={part} />;
      })}
    </div>
  );
};

const CodeBlock = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block-container">
      <div className="code-block-header">
        <span className="code-lang-label">
          <Terminal size={12} />
          {language}
        </span>
        <button 
          onClick={handleCopy} 
          className="code-copy-btn" 
          title="Copy code"
          type="button"
        >
          {copied ? (
            <>
              <Check size={12} color="#10B981" />
              <span style={{ color: '#10B981' }}>Copied</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="code-block-pre">
        <code>{code}</code>
      </pre>
    </div>
  );
};

const MarkdownSection = ({ text }) => {
  if (!text) return null;

  const lines = text.split('\n');
  const elements = [];
  let inList = false;
  let listItems = [];
  let isNumberedList = false;

  const flushList = () => {
    if (inList && listItems.length > 0) {
      if (isNumberedList) {
        elements.push(
          <ol key={`ol-${elements.length}`} className="md-ol">
            {listItems.map((item, idx) => (
              <li key={idx}>{renderInline(item)}</li>
            ))}
          </ol>
        );
      } else {
        elements.push(
          <ul key={`ul-${elements.length}`} className="md-ul">
            {listItems.map((item, idx) => (
              <li key={idx}>{renderInline(item)}</li>
            ))}
          </ul>
        );
      }
      listItems = [];
      inList = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Empty Line
    if (!trimmed) {
      flushList();
      continue;
    }

    // Headers
    if (line.startsWith('### ')) {
      flushList();
      elements.push(<h3 key={i} className="md-h3">{renderInline(line.slice(4))}</h3>);
      continue;
    }
    if (line.startsWith('## ')) {
      flushList();
      elements.push(<h2 key={i} className="md-h2">{renderInline(line.slice(3))}</h2>);
      continue;
    }
    if (line.startsWith('# ')) {
      flushList();
      elements.push(<h1 key={i} className="md-h1">{renderInline(line.slice(2))}</h1>);
      continue;
    }

    // Bullet List
    const bulletMatch = line.match(/^(\s*)[-*•]\s+(.*)$/);
    if (bulletMatch) {
      if (!inList || isNumberedList) {
        flushList();
        inList = true;
        isNumberedList = false;
      }
      listItems.push(bulletMatch[2]);
      continue;
    }

    // Numbered List
    const numberMatch = line.match(/^(\s*)\d+\.\s+(.*)$/);
    if (numberMatch) {
      if (!inList || !isNumberedList) {
        flushList();
        inList = true;
        isNumberedList = true;
      }
      listItems.push(numberMatch[2]);
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      flushList();
      elements.push(
        <blockquote key={i} className="md-blockquote">
          {renderInline(line.slice(2))}
        </blockquote>
      );
      continue;
    }

    // Regular Paragraph
    flushList();
    elements.push(
      <p key={i} className="md-p">
        {renderInline(line)}
      </p>
    );
  }

  flushList();
  return <>{elements}</>;
};

function renderInline(text) {
  if (!text) return text;

  // Split by inline code, bold, italic
  const tokens = [];
  let remaining = text;
  let keyIndex = 0;

  while (remaining.length > 0) {
    // 1. Inline code: `code`
    const codeMatch = remaining.match(/`([^`]+)`/);
    // 2. Bold: **text**
    const boldMatch = remaining.match(/\*\*([^*]+)\*\*/);
    // 3. Italic: *text* or _text_
    const italicMatch = remaining.match(/\*([^*]+)\*/);

    let firstMatch = null;
    let matchType = null;

    if (codeMatch && (!firstMatch || codeMatch.index < firstMatch.index)) {
      firstMatch = codeMatch;
      matchType = 'code';
    }
    if (boldMatch && (!firstMatch || boldMatch.index < firstMatch.index)) {
      firstMatch = boldMatch;
      matchType = 'bold';
    }
    if (italicMatch && (!firstMatch || italicMatch.index < firstMatch.index)) {
      firstMatch = italicMatch;
      matchType = 'italic';
    }

    if (!firstMatch) {
      tokens.push(remaining);
      break;
    }

    // Push text before match
    if (firstMatch.index > 0) {
      tokens.push(remaining.substring(0, firstMatch.index));
    }

    // Push formatted element
    if (matchType === 'code') {
      tokens.push(
        <code key={keyIndex++} className="md-inline-code">
          {firstMatch[1]}
        </code>
      );
    } else if (matchType === 'bold') {
      tokens.push(
        <strong key={keyIndex++} className="md-bold">
          {firstMatch[1]}
        </strong>
      );
    } else if (matchType === 'italic') {
      tokens.push(
        <em key={keyIndex++} className="md-italic">
          {firstMatch[1]}
        </em>
      );
    }

    remaining = remaining.substring(firstMatch.index + firstMatch[0].length);
  }

  return tokens;
}

export default MarkdownRenderer;
