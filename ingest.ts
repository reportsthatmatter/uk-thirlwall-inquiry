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
} from "@rtm/ingest";

/**
 * How this report is built. Owned by the report: every decision that shaped its text is named here.
 *
 * The source is the Inquiry's born-digital, tagged InDesign PDF of the Summary report (76 A4 pages,
 * single column). Printed page = PDF page - 5 (the contents are iii at PDF p.4). Its structure tree is
 * not read: the PDF pipeline reads the layout, and the tags are the answer key (472 P, 50 H3, 15 H4).
 */
export default pipeline({
  id: "uk-thirlwall-inquiry",
  title: "Report of the Public Inquiry into events at the Countess of Chester Hospital, 2015 to 2018: Summary report",
  authors: "The Rt Hon. Lady Justice Thirlwall DBE (Chair)",
  published_at: "15 September 2026",
  source_url: "https://thirlwall.public-inquiry.uk/wp-content/uploads/2026/09/Thirlwall-Inquiry_Summary-Report_Accessible.pdf",
  repo: ".",
  volumes: [
    // HC 601, the Summary report: Chapters 1-4 (Introduction; The babies; Concerns, reviews, errors; Part Two).
    { path: "archive/thirlwall-inquiry-summary-report-hc601.pdf", sha256: "a1e1a50e403a18d823c0c5ade1667d5dc1d6f95996032a3e1a96806a429c2db2" },
  ],
  passes: [
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
    furnitureFaces(["SourceSans3-SemiBold|15|#00608b|b"]),
    // The body's left edge is read per page: a page that opens mid-paragraph has no number in the margin
    // (PDF p.44, p.66, p.71).
    geometry("per-page"),
    // The contents are folioed iii (PDF p.4); the Introduction opens at 1 (PDF p.6).
    romanFolios(),
    // Only one footnote, an asterisk note (PDF p.44), which these numbered-note passes do not read: raised
    // digits after a word (none here) are linked, and nothing is, so the asterisk stays a paragraph (b1za).
    layoutMarkers(),
    // "3.67" paragraphs, the number at the margin and the text hanging one tab in (p.44).
    numberedParagraphs(),
    // A numbered paragraph set wholly in italic (evidence quoted at length) opens the paragraph it is: 9 were
    // glued onto the one above ("... Baby C. 2.26 ..." at PDF p.14) before this; now all 433 are separate and
    // in sequence.
    numberedOpenings(),
    hangingIndents(),
    // Headings are set only by face. The chapter titles are Merriweather Black 25pt, white on a navy banner
    // (PDF p.6, "1. Introduction"); the sub-headings are Source Sans 3 Medium 16pt navy (#142f54), one face for
    // both of the tag tree's levels (50 H3, 15 H4), so they serve at one level (e9im). Layout keys read 1.5
    // times the point size. Does not read "Context"/"The Countess" stacked (p.7) as two headings (e9im) or the
    // bare year "2018" (p.66); the chapter 4 banner "4. Part Two" (p.68) does not take its face's level (hy63).
    typographicHeadings({
      firstLevel: 2,
      relevel: true,
      faces: [
        ["Merriweather-Black|38|#ffffff|b"],
        ["SourceSans3-Medium|24|#142f54"],
      ],
    }),
  ],
});
