// ---------------------------------------------------------------
// NDPR Compliance Self-Assessment — question bank & scoring logic
// Each answer level: 1 = compliant, 0.5 = partial, 0 = non-compliant
// ---------------------------------------------------------------

const SECTIONS = [
  {
    name: "Lawful Basis & Consent",
    ref: "NDPR Art. 2.2",
    questions: [
      {
        text: "Does your organisation identify and document a lawful basis (consent, contract, legal obligation, etc.) before collecting personal data?",
        ref: "Art. 2.2(a)"
      },
      {
        text: "When consent is the basis for processing, is it obtained through a clear, specific, opt-in action — not pre-ticked boxes or bundled terms?",
        ref: "Art. 2.2(b)"
      },
      {
        text: "Can data subjects easily withdraw consent, and does your process actually stop the related processing when they do?",
        ref: "Art. 2.2(c)"
      }
    ]
  },
  {
    name: "Data Subject Rights",
    ref: "NDPR Art. 3.1",
    questions: [
      {
        text: "Is there a defined process for handling data subject access requests (DSARs) within a reasonable timeframe?",
        ref: "Art. 3.1(7)"
      },
      {
        text: "Can your organisation correct or erase a data subject's personal data on request, where no legal basis requires retention?",
        ref: "Art. 3.1(9)"
      },
      {
        text: "Is your privacy notice/policy written in plain language and easily accessible to the people whose data you collect?",
        ref: "Art. 2.5"
      }
    ]
  },
  {
    name: "Security Measures",
    ref: "NDPR Art. 2.1",
    questions: [
      {
        text: "Are technical controls (encryption, access controls, endpoint protection) applied to systems storing or processing personal data?",
        ref: "Art. 2.1(2)"
      },
      {
        text: "Is access to personal data restricted on a need-to-know basis, with logging of who accessed what and when?",
        ref: "Art. 2.1(2)(d)"
      },
      {
        text: "Are staff who handle personal data trained on data protection obligations at least annually?",
        ref: "Art. 4.1(2)"
      }
    ]
  },
  {
    name: "Breach Notification",
    ref: "NDPR Art. 2.10",
    questions: [
      {
        text: "Does your organisation have a documented incident response plan specifically covering personal data breaches?",
        ref: "Art. 2.10"
      },
      {
        text: "Is there a process to notify NITDA within 72 hours of becoming aware of a breach with risk to data subjects?",
        ref: "Art. 2.10(a)"
      },
      {
        text: "Are affected data subjects notified directly when a breach poses a high risk to their rights and freedoms?",
        ref: "Art. 2.10(b)"
      }
    ]
  },
  {
    name: "Third-Party & Data Sharing",
    ref: "NDPR Art. 2.12",
    questions: [
      {
        text: "Are written data processing agreements in place with all third parties (vendors, cloud providers) that process personal data on your behalf?",
        ref: "Art. 2.12"
      },
      {
        text: "Before transferring personal data outside Nigeria, do you verify the receiving country/organisation has adequate data protection safeguards?",
        ref: "Art. 2.11"
      },
      {
        text: "Do you maintain a current inventory of which third parties hold or process your data subjects' personal data?",
        ref: "Art. 2.12(1)"
      }
    ]
  },
  {
    name: "Governance & Accountability",
    ref: "NDPR Art. 4.1",
    questions: [
      {
        text: "Has your organisation designated a Data Protection Officer (DPO) or formally assigned someone equivalent responsibility?",
        ref: "Art. 4.1(2)"
      },
      {
        text: "Has a NDPR audit/compliance filing been submitted to NITDA in the last 12 months, where your data volume requires one?",
        ref: "Art. 4.1(8)"
      },
      {
        text: "Do you conduct a Data Protection Impact Assessment (DPIA) before launching new systems or projects that process personal data at scale?",
        ref: "Art. 2.1(3)"
      }
    ]
  }
];

const OPTIONS = [
  { label: "Compliant", level: 1 },
  { label: "Partial", level: 0.5 },
  { label: "Non-compliant", level: 0 }
];

const REMEDIATION = {
  // keyed by [sectionIndex, questionIndex]
  "0-0": "Document a lawful basis register mapping each data flow to a specific NDPR Art. 2.2 basis before collection starts.",
  "0-1": "Redesign consent capture as an explicit opt-in action, separate from general terms of service.",
  "0-2": "Build a simple consent-withdrawal workflow (form + backend flag) that immediately halts related processing.",
  "1-0": "Set a DSAR intake channel (email/form) with a tracked SLA — most NDPR-aligned orgs target 30 days or less.",
  "1-1": "Add a data correction/erasure workflow and confirm it propagates to all systems and backups holding that record.",
  "1-2": "Rewrite the privacy notice in plain language; publish it where it's actually visible before data is collected.",
  "2-0": "Prioritise encryption at rest/in transit and endpoint protection (e.g. your ESET rollout) on any system touching personal data.",
  "2-1": "Introduce role-based access control and basic access logging on data stores holding personal information.",
  "2-2": "Stand up a short annual data protection training module for staff handling personal data.",
  "3-0": "Draft an incident response plan with a personal-data-breach branch: detection, containment, assessment, notification steps.",
  "3-1": "Add a 72-hour NITDA notification step to the incident response plan, with a named owner responsible for filing.",
  "3-2": "Define the threshold for 'high risk to data subjects' and a direct-notification template ready to send if it's met.",
  "4-0": "Inventory current vendors/processors and put data processing agreements in place starting with the highest-risk ones.",
  "4-1": "Before any cross-border transfer, check the receiving party's safeguards (contractual clauses, adequacy) and document the check.",
  "4-2": "Build and maintain a living third-party data-sharing register, reviewed at least twice a year.",
  "5-0": "Formally designate a DPO (even part-time/dual-role at small orgs) and document the appointment.",
  "5-1": "Determine your NDPR filing threshold and prepare/submit the compliance audit return to NITDA if required.",
  "5-2": "Introduce a lightweight DPIA template to run before any new system or project processing personal data at scale."
};

// ---------------------------------------------------------------
// State
// ---------------------------------------------------------------

let currentSection = 0;
const answers = {}; // key: "sectionIndex-questionIndex" -> level

// ---------------------------------------------------------------
// DOM refs
// ---------------------------------------------------------------

const screens = {
  cover: document.getElementById("cover"),
  assessment: document.getElementById("assessment"),
  report: document.getElementById("report")
};

function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove("screen--active"));
  screens[name].classList.add("screen--active");
}

document.getElementById("startBtn").addEventListener("click", () => {
  currentSection = 0;
  renderSection();
  showScreen("assessment");
});

document.getElementById("backBtn").addEventListener("click", () => {
  if (currentSection > 0) {
    currentSection--;
    renderSection();
  } else {
    showScreen("cover");
  }
});

document.getElementById("nextBtn").addEventListener("click", () => {
  const section = SECTIONS[currentSection];
  const unanswered = section.questions.some((_, qi) => answers[`${currentSection}-${qi}`] === undefined);
  if (unanswered) {
    alert("Please answer every control in this article before continuing.");
    return;
  }
  if (currentSection < SECTIONS.length - 1) {
    currentSection++;
    renderSection();
  } else {
    buildReport();
    showScreen("report");
  }
});

document.getElementById("restartBtn").addEventListener("click", () => {
  Object.keys(answers).forEach(k => delete answers[k]);
  currentSection = 0;
  showScreen("cover");
});

document.getElementById("printBtn").addEventListener("click", () => window.print());

// ---------------------------------------------------------------
// Render assessment screen
// ---------------------------------------------------------------

function renderSection() {
  const section = SECTIONS[currentSection];
  document.getElementById("sectionIndex").textContent = `Article ${currentSection + 1}`;
  document.getElementById("sectionName").textContent = section.name;
  document.getElementById("progressFill").style.width = `${((currentSection) / SECTIONS.length) * 100}%`;

  const container = document.getElementById("questionRows");
  container.innerHTML = "";

  section.questions.forEach((q, qi) => {
    const key = `${currentSection}-${qi}`;
    const row = document.createElement("div");
    row.className = "q-row";

    const ref = document.createElement("span");
    ref.className = "q-row__ref";
    ref.textContent = `${section.ref} · ${q.ref}`;
    row.appendChild(ref);

    const text = document.createElement("p");
    text.className = "q-row__text";
    text.textContent = q.text;
    row.appendChild(text);

    const optWrap = document.createElement("div");
    optWrap.className = "q-options";

    OPTIONS.forEach(opt => {
      const btn = document.createElement("div");
      btn.className = "q-option";
      if (answers[key] === opt.level) {
        btn.classList.add("q-option--selected", `level-${opt.level}`);
      }
      btn.textContent = opt.label;
      btn.tabIndex = 0;
      btn.addEventListener("click", () => {
        answers[key] = opt.level;
        renderSection();
      });
      btn.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); btn.click(); }
      });
      optWrap.appendChild(btn);
    });

    row.appendChild(optWrap);
    container.appendChild(row);
  });

  document.getElementById("backBtn").textContent = currentSection === 0 ? "← Cover" : "← Back";
  document.getElementById("nextBtn").textContent =
    currentSection === SECTIONS.length - 1 ? "Generate Report →" : "Next Article →";
}

// ---------------------------------------------------------------
// Build report
// ---------------------------------------------------------------

function buildReport() {
  let totalScore = 0;
  let totalQuestions = 0;
  const categoryScores = [];
  const gaps = [];

  SECTIONS.forEach((section, si) => {
    let sectionScore = 0;
    section.questions.forEach((q, qi) => {
      const level = answers[`${si}-${qi}`] ?? 0;
      sectionScore += level;
      totalScore += level;
      totalQuestions++;
      if (level < 1) {
        gaps.push({
          severity: level === 0 ? "red" : "amber",
          text: q.text,
          ref: `${section.ref} · ${q.ref}`,
          remediation: REMEDIATION[`${si}-${qi}`]
        });
      }
    });
    categoryScores.push({
      name: section.name,
      pct: Math.round((sectionScore / section.questions.length) * 100)
    });
  });

  const overallPct = Math.round((totalScore / totalQuestions) * 100);

  // Stamp
  const stamp = document.getElementById("stamp");
  stamp.classList.remove("stamp--compliant", "stamp--partial", "stamp--risk");
  let verdict, stampClass;
  if (overallPct >= 80) { verdict = "ON TRACK"; stampClass = "stamp--compliant"; }
  else if (overallPct >= 50) { verdict = "NEEDS WORK"; stampClass = "stamp--partial"; }
  else { verdict = "HIGH RISK"; stampClass = "stamp--risk"; }
  stamp.classList.add(stampClass);
  document.getElementById("stampScore").textContent = `${overallPct}%`;
  document.getElementById("stampVerdict").textContent = verdict;

  document.getElementById("reportDate").textContent =
    `Assessed ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`;

  // Category breakdown
  const catWrap = document.getElementById("categoryBreakdown");
  catWrap.innerHTML = "";
  categoryScores.forEach(cat => {
    const card = document.createElement("div");
    card.className = "cat-card";
    const color = cat.pct >= 80 ? "var(--green)" : cat.pct >= 50 ? "var(--amber)" : "var(--red)";
    card.innerHTML = `
      <div class="cat-card__name">${cat.name}</div>
      <div class="cat-card__bar-track"><div class="cat-card__bar-fill" style="width:${cat.pct}%; background:${color};"></div></div>
      <div class="cat-card__pct">${cat.pct}% compliant</div>
    `;
    catWrap.appendChild(card);
  });

  // Gap list
  const gapWrap = document.getElementById("gapList");
  gapWrap.innerHTML = "";
  if (gaps.length === 0) {
    gapWrap.innerHTML = `<p class="gaps__empty">No gaps flagged — every control was marked compliant.</p>`;
  } else {
    gaps
      .sort((a, b) => (a.severity === "red" ? -1 : 1))
      .forEach(g => {
        const item = document.createElement("div");
        item.className = `gap-item${g.severity === "amber" ? " severity-amber" : ""}`;
        item.innerHTML = `
          <div class="gap-item__text">
            ${g.remediation}
            <span class="gap-item__ref">${g.ref}</span>
          </div>
        `;
        gapWrap.appendChild(item);
      });
  }
}
