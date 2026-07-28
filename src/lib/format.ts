const LOWERCASE_WORDS = new Set(['a','an','the','and','but','or','for','nor','on','at','to','by','in','of','up','as','is','it','its']);

export function toTitleCase(str: string): string {
  if (!str) return str;
  if (str !== str.toUpperCase()) return str;
  return str.toLowerCase().split(' ').map((word, i) =>
    i === 0 || !LOWERCASE_WORDS.has(word) ? word.charAt(0).toUpperCase() + word.slice(1) : word
  ).join(' ');
}

export function cleanQuote(str: string | undefined): string {
  if (!str) return '';
  let cleaned = str.replace(/^\\?"/, '').replace(/\\?"$/, '').replace(/^"/, '').replace(/"$/, '');
  return toTitleCase(cleaned).trim();
}

export function cleanHeadline(str: string | undefined): string {
  if (!str) return '';
  return cleanQuote(str);
}

export function hasValue(str?: string | null): boolean {
  if (!str) return false;
  const t = str.trim();
  return t !== '' && t !== 'N/A' && t !== 'N/A (Diocesan)' && t !== 'n/a' && t !== '-';
}
