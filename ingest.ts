import { pipeline } from "@rtm/ingest";

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
  passes: [],
});
