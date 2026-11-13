import {
  pipeline,
  layoutPageJoins,
  quoteListRunOns,
  furnitureFaces,
  geometry,
  romanFolios,
  layoutMarkers,
  numberedParagraphs,
  numberedOpenings,
  hangingIndents,
  typographicHeadings,
  numberedHeadings,
  sequencedNoteOpenings,
  layoutEndnotes,
  allCapsHeadings,
} from "@rtm/ingest";
import type { BodyPass, SourcePass } from "@rtm/ingest";

/**
 * The report's one footnote is an asterisk, not a number (PDF p.44, printed 39): "as 'Beverly Allitt'.*" in 3.67 and
 * "*      Beverly Allitt was a nurse convicted of ..." at the page foot. The note passes read numbered notes only, so
 * the note stood in the body as a paragraph opening "*" and the marker stayed bare (reportsthatmatter-b1za). On that
 * page alone, the asterisk is read as note 1: the marker after the closing quote and the note's own opening. The site
 * numbers its notes, so it serves as note 1; the words are untouched.
 */
const asteriskNote: SourcePass = {
  name: "asteriskNote",
  stage: "source",
  run(lines, at) {
    if (at.volume !== 1 || at.pdfIndex !== 44) return lines;
    return lines.map((line) =>
      line.replace(/(Beverly Allitt\u2019\.)\*(?= )/, "$1[^1]").replace(/^\*(\s+Beverly Allitt was a nurse)/, "1$1")
    );
  },
};

/**
 * A cross-reference that a line opens on is no division heading: "Appendix 1 (Ms Powell’s neonatal mortality table),
 * which showed ..." wraps to the start of a line inside 6.104 (Volume I, PDF p.123), and the text reading took it for
 * the heading of an appendix, cutting the paragraph in two with a top-level section between. The line is put back
 * at the end of the line before it, as the sentence runs; no word changes.
 */
const runInCrossReference: SourcePass = {
  name: "runInCrossReference",
  stage: "source",
  run(lines, at) {
    if (at.volume !== 2 || at.pdfIndex !== 123) return lines;
    const i = lines.findIndex((line) => /^\s+Appendix 1 \(Ms Powell/.test(line));
    if (i < 1) return lines;
    const out = [...lines];
    out[i - 1] = `${out[i - 1].trimEnd()} ${out[i].trim()}`;
    out.splice(i, 1);
    return out;
  },
};

/**
 * The inset quotations (the tag tree's 15 Display_Quote blocks: 4 in Chapter 2, 11 in Chapter 3, among them the
 * Thematic Review's text over PDF pp.35-36) are set in italic and inset only about 1.4 em from the body's left edge
 * (1.0 em for a first line opening on a hanging quotation mark, PDF p.20), against a 3.8 em hanging number for the
 * numbered paragraphs. In the text layer that is two or three columns, short of the five the block parser's
 * sustained-indent rule reads as a quotation, so each was served as an unnumbered paragraph (reportsthatmatter-vsd2).
 * Lowering the inset for the whole report (`quoteInset(3)`) is not enough and breaks other things: the lettered items
 * of 3.114 (PDF p.52) hang at the same inset in roman type and were quoted, and a first line one column short stayed
 * out. So the layout decides: a body-size italic line set between 0.8 and 3 em in from the page's body margin is
 * pushed four columns further in, which the parser then reads as a quotation. Italic words inside a numbered
 * paragraph sit at the margin (0 em) and are untouched; nothing else on the page moves.
 */
const italicInsetQuotes: BodyPass = {
  name: "italicInsetQuotes",
  stage: "body",
  run(lines, context, at) {
    const layout = context?.layout;
    if (!layout || !at) return lines;
    const squash = (text: string) => text.replace(/\s+/g, "");
    const inset = layout
      .lines(at.volume, at.pdfIndex)
      .filter((line) => line.italic && Math.abs(line.size - layout.bodyFont.size) < 1 && line.indentEm >= 0.8 && line.indentEm <= 3)
      .map((line) => squash(line.text))
      .filter((text) => text.length > 0);
    if (!inset.length) return lines;
    let from = 0;
    const out = [...lines];
    for (const want of inset) {
      for (let i = from; i < out.length; i++) {
        if (squash(out[i]) !== want) continue;
        out[i] = `    ${out[i]}`;
        from = i + 1;
        break;
      }
    }
    return out;
  },
};

/**
 * How this report is built. Owned by the report: every decision that shaped its text is named here.
 *
 * The sources are the Inquiry's born-digital, tagged InDesign PDFs: the Summary report (76 A4 pages, single
 * column; printed page = PDF page - 5, the contents are iii at PDF p.4), then Volumes I, II and III (248, 309 and
 * 217 pages, the same design). The volumes follow the Summary so that its paragraph ids, published first, do not
 * move. The structure trees are not read: the PDF pipeline reads the layout, and the tags are the answer key
 * (Summary 472 P, 50 H3, 15 H4; the volumes' sub-headings are tagged H4 and H5 in one face).
 */
export default pipeline({
  id: "uk-thirlwall-inquiry",
  title: "Report of the Public Inquiry into events at the Countess of Chester Hospital, 2015 to 2018",
  authors: "The Rt Hon. Lady Justice Thirlwall DBE (Chair)",
  published_at: "15 September 2026",
  source_url: "https://thirlwall.public-inquiry.uk/the-report/",
  repo: ".",
  volumes: [
    // HC 601, the Summary report: Chapters 1-4 (Introduction; The babies; Concerns, reviews, errors; Part Two).
    { path: "archive/thirlwall-inquiry-summary-report-hc601.pdf", sha256: "a1e1a50e403a18d823c0c5ade1667d5dc1d6f95996032a3e1a96806a429c2db2" },
    // HC 597-I, Volume I: Foreword; Part One, Chapters 1-13.
    { path: "archive/thirlwall-inquiry-volume-1-hc597-i.pdf", sha256: "3a8d0a694c88571759217943062e6ded6eb5289f631c74fe0a5304c6be57584b" },
    // HC 597-II, Volume II: Part One continued, Chapters 14-30.
    { path: "archive/thirlwall-inquiry-volume-2-hc597-ii.pdf", sha256: "7a8199e1d062e8933aecb885a4b3c24297346b6b652c0d84f5102080fd566934" },
    // HC 597-III, Volume III: Part Two, Chapters 31-44; Part Three, Chapter 45 (Recommendations) and Appendices 1-9.
    { path: "archive/thirlwall-inquiry-volume-3-hc597-iii.pdf", sha256: "7474e14f613a443117eebfe9c4e8924313c8e4d7f5c563f3a0567140567b0e8b" },
  ],
  passes: [
    asteriskNote,
    runInCrossReference,
    // A paragraph run over a page break joins when the layout says it runs on: 3.67 begins on PDF p.44 and
    // pages open mid-paragraph at the hanging indent ("of a referral to the police.", p.44; "police would not
    // investigate.", p.66).
    // numberedBody: every body paragraph is numbered, so a page opening on unnumbered body text continues the
    // paragraph above even after a full stop (PDF pp.8, 10, 51, 64; unnumbered-page-opening 5 -> 1).
    layoutPageJoins({ numberedBody: true }),
    // A quotation running over a page arrives as two (the quoted review document over PDF pp.35-36).
    quoteListRunOns(),
    // The running heads are SemiBold 10pt blue (#00608b): the report title on even printed pages ("Report of
    // the Public Inquiry into events ... Summary report", PDF p.7), the chapter title on odd ones
    // ("3. Concerns, reviews, errors", p.44; "4. Part Two", p.70). Without this each page's head was read as a
    // paragraph. Dropped by face at the page edge, and nothing else.
    // A few pages of Volumes II and III set the same running head in a slightly different blue (#00668d: "Chapter 16.
    // Meetings on 13 and 14 July 2016", Vol II PDF p.48, 20 pages in all), and their sub-headings in a darker navy
    // (#133459, below).
    furnitureFaces(["SourceSans3-SemiBold|15|#00608b|b", "SourceSans3-SemiBold|15|#00668d|b"]),
    // The body's left edge is read per page: a page that opens mid-paragraph has no number in the margin
    // (PDF p.44, p.66, p.71).
    geometry("per-page"),
    // The contents are folioed iii (PDF p.4); the Introduction opens at 1 (PDF p.6).
    romanFolios(),
    // Only one footnote, an asterisk note (PDF p.44), which asteriskNote (above, a source pass) reads as note 1. The
    // page's note block is found by its opening "1" and a gap (sequencedNoteOpenings: the bare reading wants a
    // narrower gap), and the marker is set by asteriskNote, so the layout pass links nothing else: there are no
    // raised digits in this report (b1za).
    sequencedNoteOpenings(),
    // Volumes I-III (volumes 2-4 here) print each chapter's notes after it, under a bare "Endnotes" sub-heading,
    // numbered from 1 in the body's own size and not raised ("1  Countess of Chester Hospital ...", Vol I PDF
    // p.17), many of them set wholly as a link in semibold blue (Vol I p.36). Read off the layout, each note
    // labelled by its chapter; the Summary report keeps its one page-foot note.
    layoutEndnotes({ volumes: [2, 3, 4], unraised: true, precedingChapter: true, anyWeight: true }),
    // The body's markers are raised digits ("The Countess.”1", Vol I p.10), linked to their own chapter's notes.
    layoutMarkers({ scope: "chapter" }),
    // "3.67" paragraphs, the number at the margin and the text hanging one tab in (p.44).
    numberedParagraphs(),
    // A numbered paragraph set wholly in italic (evidence quoted at length) opens the paragraph it is: 9 were
    // glued onto the one above ("... Baby C. 2.26 ..." at PDF p.14) before this; now all 433 are separate and
    // in sequence.
    numberedOpenings(),
    hangingIndents(),
    // The inset italic quotations, read from the layout (above; vsd2).
    italicInsetQuotes,
    // A numbered line is not a heading here: the chapter banners are read by their face below, and "4. Part Two"
    // (the banner at PDF p.68 and its contents entry at p.4) had been read as a heading "Part Two" by its number,
    // one level under the other chapters, with a stray heading in the contents (hy63).
    numberedHeadings(false),
    // No heading is set in capitals: the capitals in the volumes are a figure's labels ("SEVERITY/IMPACT RATING",
    // Vol II; "DEPARTMENT OF HEALTH" in the Chapter 36 diagram, Vol III) and a reproduced document's title
    // ("THIRLWALL INQUIRY PRELIMINARY HEARING - 16 MAY", Appendix 5), each read as a top-level section.
    allCapsHeadings(false),
    // Headings are set only by face. The chapter titles are Merriweather Black 25pt, white on a navy banner
    // (PDF p.6, "1. Introduction"); the sub-headings are Source Sans 3 Medium 16pt navy (#142f54), one face for
    // both of the tag tree's levels (50 H3, 15 H4), so they serve at one level (e9im). Layout keys read 1.5
    // times the point size. Does not read "Context"/"The Countess" stacked (p.7) as two headings (e9im) or the
    // bare year "2018" (p.66).
    // The sub-heading face is declared one level deeper than printed (h4, the empty middle level) so that the site's
    // sections follow the four chapters: at h3, each bodyless chapter banner and its short opening subsections folded
    // backward into the section before (Chapter 3's opening sat under "Baby P"), giving 32 misnamed sections
    // (reportsthatmatter-o1jj; golden pp.6, 9, 71 xfail on the level until the splitter is fixed).
    typographicHeadings({
      firstLevel: 2,
      relevel: true,
      // A chapter title wrapped after a comma on its banner ("Chapter 2. The neonatal unit," / "2015 to 2016", Vol I
      // PDF p.18) is one heading, not a sentence's end.
      commaWraps: true,
      // ... and after a colon or a semicolon ("Chapter 5. August to September 2015:" / "Baby E, Baby F, Baby G and
      // Baby H", Vol I PDF p.80; "Chapter 6. August 2015 to" / "February 2016: Baby I and Baby J;" / "concerns
      // increase; reviews", p.105).
      labelWraps: true,
      semicolonWraps: true,
      faces: [
        // (and the volumes' Part dividers, Merriweather Black 36pt white on a full-page panel: "Part One", Vol I
        // PDF p.8; "Part One continued", Vol II; "Part Two" and "Part Three", Vol III)
        ["Merriweather-Black|38|#ffffff|b", "Merriweather-Black|54|#ffffff|b"],
        [],
        ["SourceSans3-Medium|24|#142f54", "SourceSans3-Medium|24|#133459"],
      ],
    }),
  ],
});
