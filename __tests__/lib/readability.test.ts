import { describe, it, expect } from "vitest";

import {
  countSyllables,
  splitSentences,
  extractTextStats,
  computeReadabilityScores,
  interpretFleschScore,
  extractReadableText,
  analyzeReadability,
  TextStats,
} from "@/lib/readability";

describe("countSyllables", () => {
  it("counts unambiguous monosyllabic words as 1", () => {
    expect(countSyllables("cat")).toBe(1);
    expect(countSyllables("dog")).toBe(1);
    expect(countSyllables("sat")).toBe(1);
    expect(countSyllables("the")).toBe(1);
  });

  it("handles silent trailing e", () => {
    expect(countSyllables("cake")).toBe(1);
    expect(countSyllables("time")).toBe(1);
  });

  it("keeps the syllable in a consonant + -le ending", () => {
    expect(countSyllables("table")).toBe(2);
    expect(countSyllables("simple")).toBe(2);
  });

  it("counts common 2 and 3 syllable words correctly", () => {
    expect(countSyllables("happy")).toBe(2);
    expect(countSyllables("elephant")).toBe(3);
  });

  it("returns 0 for a token with no letters", () => {
    expect(countSyllables("123")).toBe(0);
  });
});

describe("splitSentences", () => {
  it("splits on sentence-ending punctuation followed by a capital letter", () => {
    const sentences = splitSentences("The cat sat on the mat. It was happy.");

    expect(sentences).toEqual(["The cat sat on the mat.", "It was happy."]);
  });

  it("does not split on an abbreviation's period", () => {
    const sentences = splitSentences("Dr. Smith arrived early. She reviewed the chart.");

    expect(sentences).toHaveLength(2);
    expect(sentences[0]).toContain("Dr. Smith");
  });

  it("does not split on a decimal number", () => {
    const sentences = splitSentences("The price is 3.14 dollars. That seems fair.");

    expect(sentences).toHaveLength(2);
    expect(sentences[0]).toContain("3.14");
  });

  it("handles question marks and exclamation points", () => {
    const sentences = splitSentences("Is this working? Yes! It is.");

    expect(sentences).toHaveLength(3);
  });

  it("returns an empty array for empty input", () => {
    expect(splitSentences("")).toEqual([]);
    expect(splitSentences("   ")).toEqual([]);
  });
});

describe("extractTextStats", () => {
  it("counts words and sentences on a simple two-sentence example", () => {
    const stats = extractTextStats("The cat sat on the mat. It was happy.");

    expect(stats.wordCount).toBe(9);
    expect(stats.sentenceCount).toBe(2);
  });

  it("counts letters only from alphabetic characters", () => {
    const stats = extractTextStats("Cat 123 dog.");

    expect(stats.wordCount).toBe(2); // "Cat", "dog" - "123" has no letters
    expect(stats.letterCount).toBe(6); // C-a-t-d-o-g
  });

  it("flags multi-syllable words as complex when they have 3+ syllables", () => {
    const stats = extractTextStats("The elephant walked slowly through the forest.");

    expect(stats.complexWordCount).toBeGreaterThanOrEqual(1);
  });
});

// ── Pure formula math, verified against hand-calculated textbook values ────

function statsWith(overrides: Partial<TextStats>): TextStats {
  return {
    wordCount: 100,
    sentenceCount: 5,
    syllableCount: 150,
    complexWordCount: 20,
    letterCount: 500,
    ...overrides,
  };
}

describe("computeReadabilityScores", () => {
  it("computes Flesch Reading Ease matching the textbook formula", () => {
    // 206.835 - 1.015*(100/5) - 84.6*(150/100) = 206.835 - 20.3 - 126.9 = 59.635 -> 59.6
    const scores = computeReadabilityScores(statsWith({}));

    expect(scores.fleschReadingEase).toBeCloseTo(59.6, 1);
  });

  it("computes Flesch-Kincaid Grade Level matching the textbook formula", () => {
    // 0.39*20 + 11.8*1.5 - 15.59 = 7.8 + 17.7 - 15.59 = 9.91 -> 9.9
    const scores = computeReadabilityScores(statsWith({}));

    expect(scores.fleschKincaidGrade).toBeCloseTo(9.9, 1);
  });

  it("computes Gunning Fog Index matching the textbook formula", () => {
    // 0.4 * [(100/5) + 100*(20/100)] = 0.4 * [20 + 20] = 16
    const scores = computeReadabilityScores(statsWith({}));

    expect(scores.gunningFog).toBeCloseTo(16, 1);
  });

  it("computes SMOG Index matching the textbook formula", () => {
    // 1.043*sqrt(20*(30/5)) + 3.1291 = 1.043*sqrt(120) + 3.1291 = 1.043*10.954 + 3.1291 = 14.56
    const scores = computeReadabilityScores(statsWith({ sentenceCount: 5, complexWordCount: 20 }));

    expect(scores.smogIndex).toBeCloseTo(14.56, 0);
  });

  it("computes Coleman-Liau Index matching the textbook formula", () => {
    // L = 500/100*100 = 500, S = 5/100*100 = 5
    // CLI = 0.0588*500 - 0.296*5 - 15.8 = 29.4 - 1.48 - 15.8 = 12.12
    const scores = computeReadabilityScores(statsWith({}));

    expect(scores.colemanLiauIndex).toBeCloseTo(12.1, 1);
  });

  it("computes Automated Readability Index matching the textbook formula", () => {
    // 4.71*(500/100) + 0.5*(100/5) - 21.43 = 23.55 + 10 - 21.43 = 12.12
    const scores = computeReadabilityScores(statsWith({}));

    expect(scores.automatedReadabilityIndex).toBeCloseTo(12.1, 1);
  });

  it("returns all-zero scores for empty input rather than dividing by zero", () => {
    const scores = computeReadabilityScores(
      statsWith({ wordCount: 0, sentenceCount: 0, syllableCount: 0, complexWordCount: 0, letterCount: 0 }),
    );

    expect(scores.fleschReadingEase).toBe(0);
    expect(Number.isFinite(scores.fleschKincaidGrade)).toBe(true);
  });

  it("simple, short-sentence text scores easier than long, syllable-dense text", () => {
    const simple = computeReadabilityScores(
      statsWith({ wordCount: 100, sentenceCount: 20, syllableCount: 110, complexWordCount: 2 }),
    );
    const dense = computeReadabilityScores(
      statsWith({ wordCount: 100, sentenceCount: 3, syllableCount: 220, complexWordCount: 40 }),
    );

    expect(simple.fleschReadingEase).toBeGreaterThan(dense.fleschReadingEase);
    expect(simple.fleschKincaidGrade).toBeLessThan(dense.fleschKincaidGrade);
  });
});

describe("interpretFleschScore", () => {
  it("maps the standard Flesch bands correctly", () => {
    expect(interpretFleschScore(95).label).toBe("Very Easy");
    expect(interpretFleschScore(85).label).toBe("Easy");
    expect(interpretFleschScore(65).label).toBe("Standard");
    expect(interpretFleschScore(40).label).toBe("Difficult");
    expect(interpretFleschScore(10).label).toBe("Very Confusing");
  });
});

describe("extractReadableText", () => {
  it("strips script, style, nav, and footer content", () => {
    const html = `
      <html><body>
        <nav>Home About Contact</nav>
        <script>console.log("hi")</script>
        <style>.a { color: red; }</style>
        <main><p>This is the real content of the page.</p></main>
        <footer>Copyright 2026</footer>
      </body></html>`;

    const text = extractReadableText(html);

    expect(text).toContain("This is the real content");
    expect(text).not.toContain("Home About Contact");
    expect(text).not.toContain("console.log");
    expect(text).not.toContain("Copyright");
  });

  it("excludes non-<p> boilerplate (nav templates, reference lists) even without semantic tags", () => {
    // Mirrors real-world markup (e.g. Wikipedia navboxes/reflists) that
    // isn't wrapped in <nav>/<footer> but also isn't real prose.
    const html = `
      <html><body>
        <div class="navbox"><table><tr><td>
          <a href="/a">Topic A</a> <a href="/b">Topic B</a> <a href="/c">Topic C</a>
        </td></tr></table></div>
        <p>This is a real paragraph that a reader would actually read.</p>
        <ol class="references"><li>Citation one.</li><li>Citation two.</li></ol>
      </body></html>`;

    const text = extractReadableText(html);

    expect(text).toContain("This is a real paragraph");
    expect(text).not.toContain("Topic A");
    expect(text).not.toContain("Citation one");
  });
});

describe("analyzeReadability", () => {
  it("flags very short text as low content", () => {
    const report = analyzeReadability("Just a few words here.");

    expect(report.lowContent).toBe(true);
  });

  it("finds long sentences (25+ words) and sorts them longest-first", () => {
    const short = "This is short.";
    const long1 = `${"Word ".repeat(26)}Done.`;
    const long2 = `${"Word ".repeat(30)}Done.`;
    const report = analyzeReadability(`${short} ${long1} ${long2}`);

    expect(report.longSentences.length).toBeGreaterThanOrEqual(2);
    expect(report.longSentences[0].wordCount).toBeGreaterThanOrEqual(
      report.longSentences[1].wordCount,
    );
  });

  it("returns a coherent report shape end-to-end", () => {
    const report = analyzeReadability(
      "The cat sat on the mat. It was happy and content with its life.",
    );

    expect(report.stats.wordCount).toBeGreaterThan(0);
    expect(report.scores.fleschReadingEase).toBeGreaterThan(0);
    expect(report.interpretation.label).toBeTruthy();
  });
});
