import React from "react";
import katex from "katex";

const SUPERSCRIPTS: Record<string, string> = {
  "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
  "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
  "+": "⁺", "-": "⁻", "(": "⁽", ")": "⁾", "n": "ⁿ",
};

function toSuperscript(s: string): string {
  return s.split("").map(c => SUPERSCRIPTS[c] || c).join("");
}

function renderInlineLatex(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /\$(.+?)\$/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    try {
      const html = katex.renderToString(match[1], {
        throwOnError: false,
        displayMode: false,
      });
      parts.push(<span key={match.index} dangerouslySetInnerHTML={{ __html: html }} />);
    } catch {
      parts.push(match[0]);
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

export function renderMath(text: React.ReactNode): React.ReactNode {
  if (Array.isArray(text)) {
    return text.flatMap((t) => {
      const r = renderMath(t);
      if (Array.isArray(r)) return r;
      return [r];
    });
  }
  if (!text || typeof text !== "string") return text;

  const segments = text.split(/(\$(?:[^$]|\\.)+?\$)/g);

  const parts: React.ReactNode[] = [];

  for (const seg of segments) {
    if (seg.startsWith("$") && seg.endsWith("$") && seg.length > 1) {
      const latex = seg.slice(1, -1);
      try {
        const html = katex.renderToString(latex, {
          throwOnError: false,
          displayMode: false,
        });
        parts.push(<span key={parts.length} dangerouslySetInnerHTML={{ __html: html }} />);
      } catch {
        parts.push(seg);
      }
    } else {
      const localParts: React.ReactNode[] = [];
      const regex = /sqrt\(([^)]*)\)|nth_root\(([^)]*)\)\^\(([^)]*)\)|nth_root\(([^)]*)\)\^([0-9]+(?:\/[0-9]+)?)|nth_root\(([^)]*)\)|([0-9]+(?:\.[0-9]+)?)\s*\^\(([^)]*)\)|([a-zA-Z0-9]+)\^([0-9]+(?:\/[0-9]+)?)/g;
      let lastIndex = 0;
      let match: RegExpExecArray | null;

      const re = new RegExp(regex.source, "g");

      while ((match = re.exec(seg)) !== null) {
        const fullMatch = match[0];
        const idx = match.index;
        if (idx > lastIndex) {
          localParts.push(seg.slice(lastIndex, idx));
        }

        if (match[1] !== undefined) {
          localParts.push(<span key={`${parts.length}-${idx}`} style={{ whiteSpace: "nowrap" }}>√<span style={{ textDecoration: "overline" }}>{match[1]}</span></span>);
        } else if (match[2] !== undefined) {
          const base = match[2];
          const exp = match[3];
          localParts.push(<span key={`${parts.length}-${idx}`} style={{ whiteSpace: "nowrap" }}><sup>{exp}</sup>√<span style={{ textDecoration: "overline" }}>{base}</span></span>);
        } else if (match[4] !== undefined) {
          const base = match[4];
          const exp = match[5];
          localParts.push(<span key={`${parts.length}-${idx}`} style={{ whiteSpace: "nowrap" }}><sup>{exp}</sup>√<span style={{ textDecoration: "overline" }}>{base}</span></span>);
        } else if (match[6] !== undefined) {
          const base = match[6];
          localParts.push(<span key={`${parts.length}-${idx}`} style={{ whiteSpace: "nowrap" }}><sup>{toSuperscript(base)}</sup>√<span style={{ textDecoration: "overline" }}>{match[7]}</span></span>);
        } else if (match[8] !== undefined) {
          const base = match[8];
          const exp = match[9];
          localParts.push(<span key={`${parts.length}-${idx}`}>{base}<sup>{exp}</sup></span>);
        } else {
          localParts.push(fullMatch);
        }

        lastIndex = re.lastIndex;
      }

      if (lastIndex < seg.length) {
        localParts.push(seg.slice(lastIndex));
      }

      if (localParts.length > 0) {
        parts.push(<React.Fragment key={`text-${parts.length}`}>{localParts}</React.Fragment>);
      }
    }
  }

  if (parts.length === 0) return text;

  return <>{parts}</>;
}
