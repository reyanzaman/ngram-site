/**
 * Arabic Stemmer Utility
 *
 * Ported from the `arabic-stemmer` npm package (ISC licence) by Amr Noman.
 * Rewritten as plain CommonJS/ESM-compatible code so it works in both
 * Next.js API routes (Node) and browser bundles without build issues.
 *
 * Usage:
 *   import { stemArabic, normalizeArabic } from '@/app/utils/arabicStemmer';
 *
 *   stemArabic('الرحمن')   // → array of root stems, e.g. ['رحم']
 *   normalizeArabic('الرحمن') // → stripped/normalised form, e.g. 'رحمن'
 */

// ─── Constants ────────────────────────────────────────────────────────────────

const RE_SHORT_VOWELS = /[\u064B-\u0652]/g; // tashkeel / diacritics
const RE_HAMZA        = /[\u0621\u0623\u0624\u0625\u0626]/g; // all hamza forms → ا

const STOP_WORDS = new Set([
  'يكون','وليس','وكان','كذلك','التي','وبين','عليها','مساء','الذي',
  'وكانت','ولكن','والتي','تكون','اليوم','اللذين','عليه','كانت',
  'لذلك','أمام','هناك','منها','مازال','لازال','لايزال','مايزال',
  'اصبح','أصبح','أمسى','امسى','أضحى','اضحى','مابرح','مافتئ',
  'ماانفك','لاسيما','ولايزال','الحالي','اليها','الذين','فانه',
  'والذي','وهذا','لهذا','فكان','ستكون','اليه','يمكن','بهذا','الذى',
]);

const PREFIXES = {
  4: ['وكال','وبال','فبال'],
  3: ['وال','فال','كال','بال','ولل','فلل'],
  2: ['ال','لل','لي','لت','لن','لا','فل','فس','في','فت','فن','فا',
      'سي','ست','سن','سا','ول','وس','وي','وت','ون','وا'],
  1: ['ل','ب','ف','س','و','ي','ت','ن','ا'],
};

const SUFFIXES = {
  4: [],
  3: ['تمل','همل','تان','تين','كمل'],
  2: ['ون','ات','ان','ين','تن','كم','هن','نا','يا','ها','تم','كن','ني','وا','ما','هم'],
  1: ['ة','ه','ي','ك','ت','ا','ن','و'],
};

// Root patterns keyed by expected token length
const PATTERNS = {
  8: [],
  7: [/\u0627\u0633\u062a(.)(.)(\u0627)(.)/],                          // استفعال
  6: [
    /\u0627\u0633\u062a(.)(.)(.)/, /\u0645\u0633\u062a(.)(.)(.)/, /\u0645(.)\u0627(.)(.)ه/,
    /\u0627(.)\u062a(.)\u0627(.)/, /\u0627(.)\u0639\u0648(.)(.)/,
    /\u062a(.)\u0627(.)\u064a(.)/, /\u0645(.)\u0627(.)\u064a(.)/,
    /\u0627(.)(.)(ي)\u0627\u0627/, /(.)(.)(.)ياء/, /(.)وا(.)\u064a(.)/,
    /\u0645\u062a(.)\u0627(.)(.)/,/\u0627\u0646(.)(.)ا(.)/,
    /\u0627(.)(.)(.)ا(.)/, /\u0645\u062a(.)(.)(.)(.)/, /(.)(.)(.)(.)اا/,
  ],
  5: [
    /\u0627(.)\u062a(.)(.)/,  /\u0627(.)\u0627(.)(.)/, /\u0645(.)(.)و(.)/,
    /\u0645(.)(.)ا(.)/,       /\u0645(.)(.)ي(.)/,      /\u0645(.)(.)(.)ه/,
    /\u062a(.)(.)(.)ه/,       /\u0627(.)(.)(.)ه/,      /\u0645(.)\u062a(.)(.)/, 
    /\u064a(.)\u062a(.)(.)/, /\u062a(.)\u062a(.)(.)/, /\u0645(.)\u0627(.)(.)/, 
    /\u062a(.)\u0627(.)(.)/, /(.)(.)و(.)ه/,           /(.)(.)ا(.)ه/,
    /\u0627\u0646(.)(.)(.)/, /\u0645\u0646(.)(.)(.)/,  /\u0627(.)(.)ا(.)/,
    /(.)(.)(.)ان/,           /\u062a(.)(.)ي(.)/,       /(.)ا(.)و(.)/,
    /(.)وا(.)(.)/, /(.)(.)ائ(.)/,                      /(.)ا(.)(.)ه/,
    /(.)(.)ا(.)ي/,           /(.)(.)(.)اء/,
    /\u062a\u0645(.)(.)(.)/,
    /\u0645(.)(.)(.)(.)/, /\u062a(.)(.)(.)(.)/, /\u0627(.)(.)(.)(.)/, /(.)(.)(.)(.)ه/,
    /(.)(.)ا(.)(.)/, /(.)(.)(.)و(.)/,
  ],
  4: [
    /\u0645(.)(.)(.)/, /(.)ا(.)(.)/, /(.)(.)و(.)/, /(.)(.)ي(.)/,
    /(.)(.)ا(.)/, /(.)(.)(.)ه/,
    /\u0627(.)(.)(.)/, /\u062a(.)(.)(.)/, /(.)و(.)(.)/, /(.)ي(.)(.)/, /(.)(.)(.)ن/,
  ],
  3: [/(.)(.)(.)/ ],
};

// ─── AffixCleaner ─────────────────────────────────────────────────────────────

class AffixCleaner {
  constructor(token) {
    this.originalToken = token;
    this.currentToken  = token;
    this.prefix        = '';
    this.suffix        = '';
  }

  _getPrefix(count) {
    const list = PREFIXES[count] || [];
    for (const p of list) {
      if (this.currentToken.startsWith(p) && this._isValidPrefix(p)) return p;
    }
    return '';
  }

  _isValidPrefix(p) {
    const whole = this.prefix + p;
    const list  = PREFIXES[whole.length];
    return !!(list && list.includes(whole));
  }

  _getSuffix(count) {
    const list = SUFFIXES[count] || [];
    for (const s of list) {
      if (this.currentToken.endsWith(s) && this._isValidSuffix(s)) return s;
    }
    return '';
  }

  _isValidSuffix(s) {
    const whole = s + this.suffix;
    const list  = SUFFIXES[whole.length];
    return !!(list && list.includes(whole));
  }

  _removePrefix(p)  { if (p) { this.prefix       += p; this.currentToken = this.currentToken.slice(p.length); } }
  _removeSuffix(s)  { if (s) { this.suffix         = s + this.suffix; this.currentToken = this.currentToken.slice(0, -s.length); } }

  _canRemove(count) { return this.currentToken.length - count >= 3; }

  remove(count, priority = 'suffix', bothSides = false) {
    if (!this._canRemove(count)) return this.currentToken;
    const order = priority === 'suffix'
      ? [['Suffix', count], ['Prefix', count]]
      : [['Prefix', count], ['Suffix', count]];

    let done = false;
    for (const [side, n] of order) {
      if (!done || bothSides) {
        const affix = side === 'Suffix' ? this._getSuffix(n) : this._getPrefix(n);
        if (affix) {
          side === 'Suffix' ? this._removeSuffix(affix) : this._removePrefix(affix);
          done = true;
        }
      }
    }
    return this.currentToken;
  }

  removeAll() {
    let prev;
    do {
      prev = this.currentToken;
      this.remove(1, 'suffix', true);
    } while (this.currentToken !== prev);
    return this.currentToken;
  }
}

// ─── Stemmer ──────────────────────────────────────────────────────────────────

function preNormalize(token) {
  return token
    .replace(RE_HAMZA, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة$/g, 'ه');
}

function postNormalize(token) {
  if (token.length === 3) {
    const c1 = token[0].replace(/[ي]/g, 'ا');
    const c2 = token[1].replace(/[او]/g, 'ي');
    const c3 = token[2].replace(/[اوه]/g, 'ي');
    return c1 + c2 + c3;
  }
  if (token.length === 2) return token + 'ي';
  return token;
}

function _getMatchesForPatterns(token, pats) {
  const matches = [];
  for (const pat of (pats || [])) {
    const m = pat.exec(token);
    if (m) matches.push(m.slice(1).join(''));
  }
  return matches;
}

function _getMatches(token, affixCleaner, removeFirst = 'suffix', inRecursion = false) {
  const original = token;
  let len        = token.length;
  let matches    = [];

  while (len > 3) {
    matches = matches.concat(_getMatchesForPatterns(token, PATTERNS[len]));
    token   = affixCleaner.remove(1, 'suffix', false);
    if (token.length === len) break;
    len -= 1;
  }

  if (matches.length === 0 && !inRecursion) {
    matches = matches.concat(_getMatchesForPatterns(token, PATTERNS[3]));
  }

  const finalMatches = [];
  for (const m of matches) {
    if (m.length > 3 && m !== original) {
      finalMatches.push(..._getMatches(m, affixCleaner, removeFirst, true));
    } else {
      finalMatches.push(m);
    }
  }
  return finalMatches;
}

/**
 * Stem a single Arabic word.
 * @param {string} word
 * @returns {{ stems: string[], normalized: string }}
 */
export function stemWord(word) {
  word = word.trim().replace(RE_SHORT_VOWELS, '');

  if (STOP_WORDS.has(word) || word.length < 3) {
    return { stems: [word], normalized: word };
  }

  word = preNormalize(word);

  const ac = new AffixCleaner(word);
  ac.remove(4, 'prefix', true);
  ac.remove(3, 'prefix', true);
  ac.remove(2, 'prefix', true);

  let matches = _getMatches(ac.currentToken, ac, 'suffix');
  matches     = matches.concat(_getMatches(ac.currentToken, ac, 'prefix'));
  matches     = [...new Set(matches.map(postNormalize))];

  return {
    stems:      matches.length ? matches : [ac.currentToken],
    normalized: ac.removeAll(),
  };
}

/**
 * Stem all words in an Arabic phrase and return the best single query string
 * to send to your search API.
 *
 * Strategy:
 *   • Strip diacritics & normalise hamza on the whole phrase.
 *   • For each token, take the shortest stem (closest to the root).
 *   • Join stems back with a space.
 *
 * @param {string} phrase
 * @returns {string}  stemmed query ready for the API
 */
export function stemArabicPhrase(phrase) {
  if (!phrase || !phrase.trim()) return '';

  // Strip diacritics globally first
  const clean = phrase.trim().replace(RE_SHORT_VOWELS, '');

  const tokens  = clean.split(/\s+/).filter(Boolean);
  const stemmed = tokens.map((token) => {
    const { stems, normalized } = stemWord(token);
    // Prefer the shortest stem; fall back to normalized form
    if (!stems.length) return normalized;
    return stems.reduce((a, b) => (a.length <= b.length ? a : b));
  });

  return stemmed.join(' ');
}

/**
 * Normalise an Arabic phrase without full stemming
 * (removes diacritics, unifies hamza, alef maqsura → ya, ta marbuta → ha).
 * Useful when you want lightweight normalisation only.
 *
 * @param {string} phrase
 * @returns {string}
 */
export function normalizeArabic(phrase) {
  if (!phrase) return '';
  return phrase
    .trim()
    .replace(RE_SHORT_VOWELS, '')
    .replace(RE_HAMZA, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه');
}
