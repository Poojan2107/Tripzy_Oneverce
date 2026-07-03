import type { ParsedSection, ParsedSectionType } from '../types';

const SECTION_PATTERNS: [RegExp, ParsedSectionType][] = [
  [/journey\s*overview|overview|trip\s*overview/i, 'overview'],
  [/itinerary|timeline|day\s*\d+|daily\s*plan|day\s*by\s*day/i, 'timeline'],
  [/hotels|accommodation|staying|where\s*to\s*stay/i, 'hotels'],
  [/budget|cost|pricing|expenses|breakdown|total\s*cost/i, 'budget'],
  [/food|cuisine|dining|eating|restaurant|what\s*to\s*eat/i, 'food'],
  [/transport|getting\s*around|travel|commute|how\s*to\s*reach/i, 'transport'],
  [/packing|what\s*to\s*pack|essentials|what\s*to\s*bring/i, 'packing'],
  [/weather|best\s*time|climate|season/i, 'weather'],
  [/map|route/i, 'map'],
  [/tips|pro\s*tips|advice|recommendations/i, 'tips'],
  [/top\s*places?\s*to\s*visit|places?\s*to\s*visit|attractions|sights/i, 'experiences'],
  [/local\s*experience|experiences|things\s*to\s*do/i, 'experiences'],
  [/hidden\s*gems?|offbeat|off\s*the\s*beaten\s*path|secret\s*spots/i, 'hidden_gems'],
  [/photography\s*spots?|photo\s*spots?|best\s*photos?|instagram|camera/i, 'photography'],
  [/etiquette|culture\s*tips?|local\s*customs?|dos?\s*and\s*don'?ts/i, 'etiquette'],
  [/things?\s*to\s*avoid|avoid|scams?|tourist\s*traps?|watch\s*out/i, 'avoid'],
  [/emergency|help|important\s*numbers|contacts?|safety\s*tips/i, 'emergency'],
  [/festivals?|events?|celebrations?|fair/i, 'festivals'],
  [/nearby\s*destinations?|day\s*trips?|nearby\s*places?|side\s*trips?/i, 'nearby'],
];

export function parseAiResponse(text: string): ParsedSection[] {
  if (!text.trim()) return [];

  const lines = text.split('\n');
  const sections: ParsedSection[] = [];
  // Buffer text that appears before any section header
  const preambleLines: string[] = [];
  let currentSection: { type: ParsedSectionType; title: string; lines: string[] } | null = null;
  let headerEncountered = false;

  for (const line of lines) {
    // Match: ## Title or ### Title, or **Title** (bold standalone, only if matches a section pattern)
    const hashHeader = line.match(/^(#{2,3})\s+(.+)$/);
    const boldHeader = !hashHeader ? line.match(/^\*\*(.+)\*\*$/) : null;
    const headerMatch = hashHeader || (boldHeader && SECTION_PATTERNS.some(([re]) => re.test(boldHeader[1])) ? boldHeader : null);
    if (headerMatch) {
      headerEncountered = true;
      // Flush preamble before first header
      if (preambleLines.length > 0) {
        const preamble = preambleLines.join('\n').trim();
        if (preamble) {
          sections.push({ type: 'unknown', title: '', content: preamble });
        }
        preambleLines.length = 0;
      }
      // Flush previous section
      if (currentSection) {
        const content = currentSection.lines.join('\n').trim();
        if (content) {
          sections.push({
            type: currentSection.type,
            title: currentSection.title,
            content,
          });
        }
      }
      const title = (hashHeader ? hashHeader[2] : boldHeader![1]).trim();
      const matched = SECTION_PATTERNS.find(([re]) => re.test(title));
      currentSection = { type: matched ? matched[1] : 'unknown', title, lines: [] };
    } else if (!headerEncountered) {
      preambleLines.push(line);
    } else if (currentSection) {
      currentSection.lines.push(line);
    }
  }

  // Flush preamble if no headers found
  if (!headerEncountered && preambleLines.length > 0) {
    const preamble = preambleLines.join('\n').trim();
    if (preamble) {
      sections.push({ type: 'unknown', title: '', content: preamble });
    }
  }

  // Flush last section
  if (currentSection) {
    const content = currentSection.lines.join('\n').trim();
    if (content) {
      sections.push({
        type: currentSection.type,
        title: currentSection.title,
        content,
      });
    }
  }

  // If no sections found, wrap as unknown
  if (sections.length === 0) {
    sections.push({ type: 'unknown', title: '', content: text.trim() });
  }

  // Merge consecutive sections of the same type
  const merged: ParsedSection[] = [];
  for (const s of sections) {
    const last = merged[merged.length - 1];
    if (last && last.type === s.type && s.type !== 'unknown') {
      last.content += '\n\n' + s.content;
    } else {
      merged.push(s);
    }
  }

  return merged;
}
