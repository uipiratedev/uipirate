// Website readability & clarity engine.
//
// Two independent layers, deliberately kept separate so each can be verified
// on its own terms:
//   1. Text extraction (extractTextStats) - heuristic by nature. Syllable
//      counting via vowel-group heuristics (no dictionary lookup) and
//      sentence splitting via punctuation + capitalization cues both have
//      known edge cases (documented below and in the UI) - this is the same
//      trade-off every lightweight readability tool makes.
//   2. Score computation (computeReadabilityScores) - pure textbook formula
//      math over word/sentence/syllable counts. Given the same counts, this
//      always produces the same, independently-verifiable numbers.

import * as cheerio from "cheerio";

export interface TextStats {
  wordCount: number;
  sentenceCount: number;
  syllableCount: number;
  complexWordCount: number;
  letterCount: number;
}

export interface ReadabilityScores {
  fleschReadingEase: number;
  fleschKincaidGrade: number;
  gunningFog: number;
  smogIndex: number;
  colemanLiauIndex: number;
  automatedReadabilityIndex: number;
  averageGradeLevel: number;
}

export interface SentenceInfo {
  text: string;
  wordCount: number;
}

export interface ReadabilityReport {
  stats: TextStats;
  scores: ReadabilityScores;
  interpretation: { label: string; description: string };
  longSentences: SentenceInfo[];
  lowContent: boolean;
}

// ── Syllable counting (vowel-group heuristic) ───────────────────────────────

export function countSyllables(rawWord: string): number {
  const word = rawWord.toLowerCase().replace(/[^a-z]/g, "");

  if (word.length === 0) return 0;
  if (word.length <= 3) return 1;

  const trimmed = word
    .replace(/(?:[^laeiouy]es|ed)$/, "")
    .replace(/[^laeiouy]e$/, "")
    .replace(/^y/, "");

  const matches = trimmed.match(/[aeiouy]{1,2}/g);

  return matches ? Math.max(1, matches.length) : 1;
}

// Simplified Gunning Fog "complex word" rule: 3+ syllables, and not merely
// a common inflection of a simpler word (checked by re-testing the syllable
// count with -ed/-es/-ing stripped).
function isComplexWord(word: string): boolean {
  const syllables = countSyllables(word);

  if (syllables < 3) return false;

  const stripped = word.toLowerCase().replace(/(ing|es|ed)$/, "");

  if (stripped !== word.toLowerCase() && stripped.length > 2) {
    return countSyllables(stripped) >= 3;
  }

  return true;
}

// ── Sentence splitting ──────────────────────────────────────────────────────

const ABBREVIATIONS = [
  "mr", "mrs", "ms", "dr", "prof", "sr", "jr", "st", "vs",
  "etc", "eg", "ie", "inc", "ltd", "co", "corp", "no",
];

export function splitSentences(text: string): string[] {
  let protectedText = text;

  ABBREVIATIONS.forEach((abbr) => {
    protectedText = protectedText.replace(
      new RegExp(`\\b${abbr}\\.`, "gi"),
      (match) => match.slice(0, -1) + "\u0000",
    );
  });
  // Protect decimal numbers (e.g. "3.14") from being read as sentence breaks.
  protectedText = protectedText.replace(/(\d)\.(\d)/g, "$1\u0000$2");

  const sentences = protectedText
    .split(/(?<=[.!?])\s+(?=[A-Z"'(“]|$)/)
    .map((s) => s.replace(/\u0000/g, "."))
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && /[a-zA-Z]/.test(s));

  if (sentences.length > 0) return sentences;

  const fallback = text.trim();

  return fallback ? [fallback] : [];
}

// ── Word extraction ──────────────────────────────────────────────────────

function extractWords(text: string): string[] {
  return (text.match(/[a-zA-Z][a-zA-Z'-]*/g) ?? []).filter((w) => w.length > 0);
}

// ── Text stats extraction ──────────────────────────────────────────────

export function extractTextStats(text: string): TextStats {
  const sentences = splitSentences(text);
  const words = extractWords(text);

  let syllableCount = 0;
  let complexWordCount = 0;
  let letterCount = 0;

  words.forEach((word) => {
    syllableCount += countSyllables(word);
    if (isComplexWord(word)) complexWordCount++;
    letterCount += (word.match(/[a-zA-Z]/g) ?? []).length;
  });

  return {
    wordCount: words.length,
    sentenceCount: Math.max(sentences.length, words.length > 0 ? 1 : 0),
    syllableCount,
    complexWordCount,
    letterCount,
  };
}

// ── Score computation (pure formula math) ──────────────────────────────────

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function computeReadabilityScores(stats: TextStats): ReadabilityScores {
  const { wordCount, sentenceCount, syllableCount, complexWordCount, letterCount } = stats;

  if (wordCount === 0 || sentenceCount === 0) {
    return {
      fleschReadingEase: 0,
      fleschKincaidGrade: 0,
      gunningFog: 0,
      smogIndex: 0,
      colemanLiauIndex: 0,
      automatedReadabilityIndex: 0,
      averageGradeLevel: 0,
    };
  }

  const wordsPerSentence = wordCount / sentenceCount;
  const syllablesPerWord = syllableCount / wordCount;

  const fleschReadingEase = round1(
    206.835 - 1.015 * wordsPerSentence - 84.6 * syllablesPerWord,
  );
  const fleschKincaidGrade = round1(
    0.39 * wordsPerSentence + 11.8 * syllablesPerWord - 15.59,
  );
  const gunningFog = round1(
    0.4 * (wordsPerSentence + 100 * (complexWordCount / wordCount)),
  );
  const smogIndex = round1(
    1.043 * Math.sqrt(complexWordCount * (30 / sentenceCount)) + 3.1291,
  );
  const L = (letterCount / wordCount) * 100;
  const S = (sentenceCount / wordCount) * 100;
  const colemanLiauIndex = round1(0.0588 * L - 0.296 * S - 15.8);
  const automatedReadabilityIndex = round1(
    4.71 * (letterCount / wordCount) + 0.5 * wordsPerSentence - 21.43,
  );

  const gradeLevelScores = [
    fleschKincaidGrade,
    gunningFog,
    smogIndex,
    colemanLiauIndex,
    automatedReadabilityIndex,
  ];
  const averageGradeLevel = round1(
    gradeLevelScores.reduce((a, b) => a + b, 0) / gradeLevelScores.length,
  );

  return {
    fleschReadingEase,
    fleschKincaidGrade,
    gunningFog,
    smogIndex,
    colemanLiauIndex,
    automatedReadabilityIndex,
    averageGradeLevel,
  };
}

// ── Flesch Reading Ease interpretation (Rudolf Flesch's original public scale) ──

export function interpretFleschScore(score: number): { label: string; description: string } {
  if (score >= 90) return { label: "Very Easy", description: "Easily understood by an average 11-year-old (5th grade)." };
  if (score >= 80) return { label: "Easy", description: "Conversational English for consumers (6th grade)." };
  if (score >= 70) return { label: "Fairly Easy", description: "Easily understood by 13-15 year olds (7th grade)." };
  if (score >= 60) return { label: "Standard", description: "Easily understood by 13-15 year olds (8th-9th grade)." };
  if (score >= 50) return { label: "Fairly Difficult", description: "Best suited for high school reading level (10th-12th grade)." };
  if (score >= 30) return { label: "Difficult", description: "Best understood by college graduates." };

  return { label: "Very Confusing", description: "Best understood by university graduates / specialists." };
}

// ── HTML extraction ──────────────────────────────────────────────────────

export function extractReadableText(html: string): string {
  const $ = cheerio.load(html);

  $("script, style, noscript, svg, nav, footer, header, aside").remove();

  // Genuine prose overwhelmingly lives in <p> tags; navigation templates,
  // reference/citation lists, and sidebars (which real sites - not just
  // Wikipedia - often mark up as <ul>/<table>/plain <div> rather than
  // semantic <nav>/<footer>) are not. Preferring <p> text keeps readability
  // scores and "long sentence" flags anchored to what a reader actually
  // reads, instead of link-list boilerplate that happens to lack punctuation
  // breaks and gets miscounted as one enormous "sentence".
  const paragraphText = $("p")
    .map((_, el) => $(el).text().trim())
    .get()
    .filter((t) => t.length > 0)
    .join(" ");

  const text = paragraphText || $("body").text();

  return text.replace(/\s+/g, " ").trim();
}

export function analyzeReadability(text: string): ReadabilityReport {
  const stats = extractTextStats(text);
  const scores = computeReadabilityScores(stats);
  const interpretation = interpretFleschScore(scores.fleschReadingEase);

  const longSentences = splitSentences(text)
    .map((s) => ({ text: s, wordCount: extractWords(s).length }))
    .filter((s) => s.wordCount >= 25)
    .sort((a, b) => b.wordCount - a.wordCount)
    .slice(0, 5);

  const lowContent = stats.wordCount < 50;

  return { stats, scores, interpretation, longSentences, lowContent };
}
