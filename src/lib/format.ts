/**
 * Converts ALL CAPS text to Title Case
 * "FORMATION OF THE WHOLE PERSON" → "Formation of the Whole Person"
 */
const LOWERCASE_WORDS = new Set(['a','an','the','and','but','or','for','nor','on','at','to','by','in','of','up','as','is','it','its']);

export function toTitleCase(str: string): string {
  if (!str) return str;
  // If not all caps, return as-is
  if (str !== str.toUpperCase()) return str;
  return str
    .toLowerCase()
    .split(' ')
    .map((word, i) => {
      if (i === 0 || !LOWERCASE_WORDS.has(word)) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word;
    })
    .join(' ');
}

/**
 * Cleans verbatim quote fields:
 * - Strips surrounding escaped quotes \"like this\"
 * - Strips surrounding regular quotes "like this"
 * - Converts ALL CAPS to Title Case
 */
export function cleanQuote(str: string | undefined): string {
  if (!str) return str;
  // Remove escaped quotes and regular surrounding quotes
  let cleaned = str.replace(/^\\?"/, '').replace(/\\?"$/, '');
  cleaned = cleaned.replace(/^"/, '').replace(/"$/, '');
  // Fix ALL CAPS
  cleaned = toTitleCase(cleaned);
  return cleaned.trim();
}

/**
 * Cleans a headline — same as cleanQuote but also handles
 * institutional name-only headlines
 */
export function cleanHeadline(str: string | undefined): string {
  if (!str) return str;
  return cleanQuote(str);
}

/**
 * Returns true if a field has real content (not N/A, blank, etc.)
 */
export function hasValue(str?: string | null): boolean {
  if (!str) return false;
  const trimmed = str.trim();
  return trimmed !== '' && trimmed !== 'N/A' && trimmed !== 'N/A (Diocesan)' && trimmed !== 'n/a';
}
