export interface OverviewData {
  lead: string;
  highlights: string[];
  bestFor: string;
  duration: string;
  vibe: string;
}

export function parseOverview(content: string): OverviewData {
  const lines = content.split('\n').filter(Boolean);
  const lead = lines[0] || content.slice(0, 100);
  const remaining = lines.slice(1).join('\n');

  const highlights = (remaining.match(/(?:\*\*)?Destination highlights(?:\*\*)?[:\s–-]*(.+?)(?=\*\*Best for|\*\*Ideal duration|\*\*Vibe|$)/is));
  const highlightsList = highlights
    ? highlights[1].split(',').map((h: string) => h.replace(/^\s*[-•]\s*/, '').replace(/\*\*/g, '').trim()).filter(Boolean)
    : [];

  const bestFor = remaining.match(/(?:\*\*)?Best for(?:\*\*)?[:\s–-]*(.+?)(?=\*\*Ideal duration|\*\*Vibe|$)/i)?.[1]?.replace(/\*\*/g, '').trim() || '';
  const duration = remaining.match(/(?:\*\*)?Ideal duration(?:\*\*)?[:\s–-]*(.+?)(?=\*\*Vibe|$)/i)?.[1]?.replace(/\*\*/g, '').trim() || '';
  const vibe = remaining.match(/(?:\*\*)?Vibe(?:\*\*)?[:\s–-]*(.+)/i)?.[1]?.replace(/\*\*/g, '').trim() || '';

  return { lead, highlights: highlightsList, bestFor, duration, vibe };
}
