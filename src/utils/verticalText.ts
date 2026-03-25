const DIGIT_TO_KANJI: Record<string, string> = {
  '0': '〇', '1': '一', '2': '二', '3': '三', '4': '四',
  '5': '五', '6': '六', '7': '七', '8': '八', '9': '九',
};

/**
 * Convert a string for vertical (縦書き) display:
 * - Arabic digits → kanji numerals
 * - Half-width Latin letters → full-width
 * - Hyphens / en-dashes → katakana long vowel mark (ー)
 */
export function toVerticalText(str: string): string {
  return str.replace(/./g, (ch) => {
    if (DIGIT_TO_KANJI[ch]) return DIGIT_TO_KANJI[ch];
    const code = ch.charCodeAt(0);
    // hyphen-minus, hyphen, figure-dash, en-dash
    if (code === 0x2d || code === 0x2010 || code === 0x2012 || code === 0x2013) return 'ー';
    // A-Z → full-width
    if (code >= 0x41 && code <= 0x5a) return String.fromCharCode(code + 0xff21 - 0x41);
    // a-z → full-width
    if (code >= 0x61 && code <= 0x7a) return String.fromCharCode(code + 0xff41 - 0x61);
    return ch;
  });
}
