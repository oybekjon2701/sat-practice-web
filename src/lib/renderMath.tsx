const SUPERSCRIPTS: Record<string, string> = {
  "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
  "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
  "+": "⁺", "-": "⁻", "(": "⁽", ")": "⁾", "n": "ⁿ",
};

function toSuperscript(s: string): string {
  return s.split("").map(c => SUPERSCRIPTS[c] || c).join("");
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

  const parts: React.ReactNode[] = [];

  const regex = /sqrt\(([^)]*)\)|nth_root\(([^)]*)\)\^\(([^)]*)\)|nth_root\(([^)]*)\)\^([0-9]+(?:\/[0-9]+)?)|nth_root\(([^)]*)\)|([0-9]+(?:\.[0-9]+)?)\s*\^\(([^)]*)\)|([a-zA-Z0-9]+)\^([0-9]+(?:\/[0-9]+)?)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  const re = new RegExp(regex.source, "g");

  while ((match = re.exec(text)) !== null) {
    const fullMatch = match[0];
    const idx = match.index;
    if (idx > lastIndex) {
      parts.push(text.slice(lastIndex, idx));
    }

    if (match[1] !== undefined) {
      parts.push(<span key={idx} style={{ whiteSpace: "nowrap" }}>√<span style={{ textDecoration: "overline" }}>{match[1]}</span></span>);
    } else if (match[2] !== undefined) {
      const base = match[2];
      const exp = match[3];
      parts.push(<span key={idx} style={{ whiteSpace: "nowrap" }}><sup>{exp}</sup>√<span style={{ textDecoration: "overline" }}>{base}</span></span>);
    } else if (match[4] !== undefined) {
      const base = match[4];
      const exp = match[5];
      parts.push(<span key={idx} style={{ whiteSpace: "nowrap" }}><sup>{exp}</sup>√<span style={{ textDecoration: "overline" }}>{base}</span></span>);
    } else if (match[6] !== undefined) {
      const base = match[6];
      parts.push(<span key={idx} style={{ whiteSpace: "nowrap" }}><sup>{toSuperscript(base)}</sup>√<span style={{ textDecoration: "overline" }}>{match[7]}</span></span>);
    } else if (match[8] !== undefined) {
      const base = match[8];
      const exp = match[9];
      parts.push(<span key={idx}>{base}<sup>{exp}</sup></span>);
    } else {
      parts.push(fullMatch);
    }

    lastIndex = re.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  if (parts.length === 0) return text;

  return <>{parts}</>;
}
