# Thirlwall Inquiry: Report of the Public Inquiry into events at the Countess of Chester Hospital, 2015 to 2018

HC 601, presented to Parliament pursuant to section 26 of the Inquiries Act 2005, ordered by the House of Commons to be printed on 15 September 2026. The report of the Thirlwall Inquiry, chaired by the Rt Hon. Lady Justice Thirlwall DBE, into events at the Countess of Chester Hospital between 2015 and 2018. Three volumes and a summary report. The report names some people by a letter only (Baby A, Mother A, Dr U and so on); the text here keeps every one exactly as printed.

## Scope

The **Summary report** only, so far (76 PDF pages, 4 chapters: Introduction; The babies; Concerns, reviews, errors; Part Two), as the report id `uk-thirlwall-inquiry`. It is the Chair's own introduction to the main themes and findings, with 433 numbered paragraphs, and it is the part most readers will cite. Volume I (248 PDF pages), Volume II and Volume III are the next units of this same id, to be added as further volumes in `ingest.ts`. The Welsh summary, the large-print editions and the Easy Read editions are separate publications and out of scope.

The report concerns the deaths and harm of babies and the experience of their families, a living affected community; see decision 0026 in the site repo. The inquiry's words are served as printed. Lucy Letby's convictions are the subject of a review by the Criminal Cases Review Commission; the report is the Inquiry's, and nothing here is ours to qualify.

## Source

`archive/thirlwall-inquiry-summary-report-hc601.pdf`: the Inquiry's accessible PDF of the Summary report, from https://thirlwall.public-inquiry.uk/wp-content/uploads/2026/09/Thirlwall-Inquiry_Summary-Report_Accessible.pdf (554,328 bytes, SHA-256 `a1e1a50e403a18d823c0c5ade1667d5dc1d6f95996032a3e1a96806a429c2db2`, Last-Modified 15 September 2026). Crown copyright 2026, licensed under the Open Government Licence v3.0 (stated on the imprint, PDF p.3). See `datapackage.json`.

## Materials

Checked 2026-10-25 (stage 1 of the preparation pipeline, reportsthatmatter-gqsy.16).

| Need | Source | Role |
| --- | --- | --- |
| Words | The accessible PDF's text layer, SHA-256 `a1e1a50e…c2db2` | canonical, citation target |
| Blocks and headings | The same PDF's layout (faces and sizes); it is also tagged (472 P, 50 H3, 15 H4, 5 H2, 2 H1, 9 LI) | the PDF pipeline reads the layout; the tag census is the answer key (`reference/blocks.jsonl`) |
| Paragraph numbers | The PDF ("1.1", "3.67"), hanging in the margin | PDF |
| Notes | The PDF's one asterisk footnote (printed p.39) | PDF |
| Page anchors | The printed folios: roman on the contents (iii at PDF p.4), arabic from the Introduction (1 at PDF p.6), printed page = PDF page − 5 | PDF |
| Provenance | HC 601, ISBN 978-1-5286-6790-6, E03297534 09/2026 | datapackage |
| Reference | The PDF's own tag tree, `reference/blocks.jsonl` (built by the site's `scripts/score/reference.py`) | headings and paragraph census |
| Rejected | The Inquiry's HTML edition (https://thirlwall.public-inquiry.uk/summary-chapter/summary-report/): about 60 words are broken by stray spaces inside them ("w as", "indeli ble"), it has no paragraph numbers or page anchors, and it prints the footnote at the end of a chapter | structure reference only; not cached |

Sourcing checklist:

1. How the PDF was made: Adobe InDesign 21.5 (Macintosh), Adobe PDF Library 18.0, created 4 September 2026. Source Sans 3 and Merriweather. Born-digital; A4, single column, no bleed. Tagged (census above).
2. Other renditions: the Inquiry lists only this English summary PDF (the Welsh summary is a separate document; large print exists for the volumes only). GOV.UK's page for the report links back to the Inquiry's site and holds no copy of its own. The Wayback Machine's copy of 21 September 2026 is byte-identical.
3. Official HTML: yes (above), rejected for words.
4. EPUB: none.
5. Wikisource: none (published five weeks before the check).
6. Court documents: not applicable.
7. US congressional: not applicable.
8. Originals: the Inquiry (contact@thirlwallinquiry.co.uk, printed on the imprint, PDF p.3).

Versions: one PDF version. A word 6-gram comparison of the PDF text (36,946 HTML words, 37,170 PDF) found no wording differences beyond the HTML's broken words and the PDF's running heads and list labels.

Layout notes: running heads at the top of each page (the report title on even printed pages, the chapter title on odd ones, SemiBold 10pt blue); chapter titles on a navy banner (Merriweather 25pt, white); sub-headings in Source Sans 3 Medium 16pt navy (one face for both of the tags' heading levels); numbered paragraphs ("3.67") with the number in the margin and the text hanging; a few italic, slightly inset quotations; the folio at the foot.

## Licence

Text of the report: Crown copyright 2026, Open Government Licence v3.0. Our markup, processing and editorial additions: CC BY 4.0. Code: MIT. Evidence, caveats and the full statement are in [LICENSE](LICENSE); the MIT text is in [LICENSE-MIT](LICENSE-MIT).

## Build

`ingest.ts` declares how the report is turned into Markdown, with the layout passes it composes (each with the page that needed it). Rebuild from the site repo with `pnpm ingest run uk-thirlwall-inquiry`. `golden.yaml` holds eight pages read off the page images; five are known failures, each with a bead (see PROCESSING.md). Needs `@rtm/ingest` v0.33.0.
