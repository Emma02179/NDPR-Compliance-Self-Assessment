# NDPR Compliance Self-Assessment Tool

A lightweight, browser-based tool that helps organisations evaluate their compliance posture against the **Nigeria Data Protection Regulation (NDPR), 2019** — built to bridge the gap between regulatory text and practical, auditable controls.

[Live demo](#) · *(replace with your GitHub Pages link once deployed)*

## Problem

Many small and mid-sized Nigerian organisations lack dedicated compliance staff, leaving them exposed to NDPR violations — regulatory action from NITDA, fines, and reputational damage from data breaches they weren't prepared to handle.

## Approach

I broke NDPR's core obligations down into **18 assessable controls** across 6 articles:

| Article | Focus |
|---|---|
| Art. 2.2 | Lawful Basis & Consent |
| Art. 3.1 | Data Subject Rights |
| Art. 2.1 | Security Measures |
| Art. 2.10 | Breach Notification |
| Art. 2.12 | Third-Party & Data Sharing |
| Art. 4.1 | Governance & Accountability |

Each control is scored **Compliant / Partial / Non-compliant**. The tool generates a weighted overall score, a per-article breakdown, and a prioritised remediation list for every gap — similar in structure to a junior analyst's gap-analysis worksheet, just self-serve.

## Tech stack

Vanilla HTML, CSS, and JavaScript — no build step, no dependencies, deployable directly to GitHub Pages.

## Running it locally

```bash
git clone https://github.com/<your-username>/ndpr-assessment.git
cd ndpr-assessment
```

Then just open `index.html` in a browser, or serve it locally:

```bash
npx serve .
```

## Key learning

Translating regulatory language into measurable, auditable controls — the same exercise GRC analysts run daily when mapping frameworks like ISO 27001, NIST CSF, or NDPR to an organisation's actual environment. Writing the remediation text for each gap also forced me to think about *practical* fixes (e.g. tying the "security measures" gaps back to real endpoint protection work like ESET deployment) rather than just citing the regulation.

## What I'd do next

- Add multi-framework mapping (NDPR ↔ ISO 27001) so one assessment surfaces overlapping controls
- Persist results (localStorage or a small backend) so an organisation can re-run the assessment quarterly and track improvement over time
- Export the report as a PDF for sharing with leadership/auditors

## Disclaimer

This tool supports informal self-review only. It is not legal advice and does not constitute a NITDA-recognised compliance audit.
