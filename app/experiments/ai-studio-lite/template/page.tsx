"use client";

/**
 * Template Detail Page — AI Studio Lite
 * 
 * Shows detailed view of a template including:
 * - What it does and inputs needed
 * - Sample output preview
 * - "Start from scratch" or "Use recent data" options
 * - Estimated generation time
 */

import React, { useState, useEffect } from "react";
import { Card } from "../../../../wireframe-primitives/Card";
import { Button } from "../../../../wireframe-primitives/Button";
import { Divider } from "../../../../wireframe-primitives/Divider";

// ─────────────────────────────────────────────────────────────
// Types & Data
// ─────────────────────────────────────────────────────────────

type TemplateDetail = {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  category: string;
  icon: string;
  estimatedTime: string;
  usageCount: number;
  inputs: {
    name: string;
    type: "text" | "select" | "date" | "file" | "checkbox";
    label: string;
    placeholder?: string;
    required: boolean;
    options?: string[];
  }[];
  sampleOutput: string;
  tips: string[];
  relatedTemplates: string[];
};

const TEMPLATES: Record<string, TemplateDetail> = {
  "board-report": {
    id: "board-report",
    title: "Board Report Generator",
    description: "Generate comprehensive board reports from quarterly data.",
    longDescription: "This template analyzes your quarterly filings, meeting notes, and key metrics to produce a comprehensive board report. It structures information according to best practices for board communication and highlights key decisions, risks, and action items.",
    category: "Documents",
    icon: "📋",
    estimatedTime: "~30 seconds",
    usageCount: 234,
    inputs: [
      { name: "quarter", type: "select", label: "Reporting Quarter", required: true, options: ["Q1 2025", "Q2 2025", "Q3 2025", "Q4 2025"] },
      { name: "focus", type: "select", label: "Report Focus", required: true, options: ["Full Overview", "Financial Summary", "Risk & Compliance", "Strategic Initiatives"] },
      { name: "includeMetrics", type: "checkbox", label: "Include Key Metrics Dashboard", required: false },
      { name: "additionalNotes", type: "text", label: "Additional Context", placeholder: "Any specific topics to highlight...", required: false },
    ],
    sampleOutput: `**Q4 2025 Board Report**

**Executive Summary**
This quarter marked significant progress across strategic initiatives while maintaining strong governance standards. Revenue grew 12% YoY with particular strength in enterprise segments.

**Key Highlights**
• Completed SOX 404 assessment with no material weaknesses identified
• Successfully onboarded 3 new board members following governance committee review
• Launched AI governance framework ahead of EU AI Act compliance deadline

**Financial Overview**
| Metric | Q4 2025 | Q3 2025 | YoY Change |
|--------|---------|---------|------------|
| Revenue | $45.2M | $42.1M | +12% |
| Operating Margin | 23.4% | 21.8% | +1.6pp |
| Cash Position | $128M | $115M | +11% |

**Risk & Compliance Update**
All compliance obligations current. Key regulatory changes monitored:
- EU AI Act implementation timeline confirmed for H2 2026
- SEC climate disclosure rules finalized

**Action Items for Board**
1. Approve FY2026 budget proposal (attached)
2. Review executive compensation benchmarking
3. Ratify audit committee recommendations

**Next Meeting**
March 15, 2026 — Annual strategic planning session`,
    tips: [
      "Include recent board meeting notes for better context",
      "The 'Financial Summary' focus works best with quarterly close data",
      "Add specific topics in 'Additional Context' to customize emphasis",
    ],
    relatedTemplates: ["meeting-minutes", "compliance-summary"],
  },
  "compliance-summary": {
    id: "compliance-summary",
    title: "Compliance Summary Writer",
    description: "Transform complex regulatory requirements into clear summaries.",
    longDescription: "Converts dense regulatory text into clear, actionable summaries for stakeholders. Identifies key requirements, deadlines, and impacts while maintaining accuracy. Perfect for briefing leadership or preparing training materials.",
    category: "Compliance",
    icon: "📑",
    estimatedTime: "~20 seconds",
    usageCount: 189,
    inputs: [
      { name: "regulation", type: "select", label: "Regulation/Framework", required: true, options: ["SOX 404", "GDPR", "EU AI Act", "SEC Rules", "PCAOB Standards", "Custom"] },
      { name: "audience", type: "select", label: "Target Audience", required: true, options: ["Board of Directors", "Executive Team", "Compliance Team", "All Employees"] },
      { name: "depth", type: "select", label: "Summary Depth", required: false, options: ["High-level Overview", "Detailed Analysis", "Action-focused Brief"] },
      { name: "customText", type: "text", label: "Custom Regulation Text", placeholder: "Paste regulation text for custom analysis...", required: false },
    ],
    sampleOutput: `**SOX 404 Compliance Summary**
*For: Board of Directors | Generated: January 2026*

**What is SOX 404?**
Section 404 of the Sarbanes-Oxley Act requires management to assess and report on internal controls over financial reporting (ICFR).

**Key Requirements (Plain Language)**

1. **Annual Assessment**
   - Management must evaluate control effectiveness yearly
   - External auditor provides independent opinion
   - *Your deadline: March 15, 2026*

2. **Documentation Standards**
   - All material controls must be documented
   - Testing evidence must be retained
   - Changes require re-evaluation

3. **Disclosure Obligations**
   - Material weaknesses must be disclosed
   - Remediation plans required for deficiencies
   - Quarterly certifications by CEO/CFO

**What This Means for the Board**
• Review management's ICFR assessment before filing
• Ensure audit committee oversight is documented
• Approve any remediation plans for identified issues

**Current Status: ✅ On Track**
Assessment 68% complete, no material weaknesses identified to date.`,
    tips: [
      "Select the appropriate audience for tailored language complexity",
      "Use 'Action-focused Brief' for time-sensitive communications",
      "Custom text analysis works best with 1-3 pages of content",
    ],
    relatedTemplates: ["audit-prep", "policy-compare"],
  },
  "meeting-minutes": {
    id: "meeting-minutes",
    title: "Meeting Minutes Draft",
    description: "Create structured meeting minutes from notes and decisions.",
    longDescription: "Transforms raw meeting notes into professionally formatted minutes. Automatically identifies action items, decisions, and follow-ups. Maintains consistent structure across all board and committee meetings.",
    category: "Meetings",
    icon: "✍️",
    estimatedTime: "~15 seconds",
    usageCount: 312,
    inputs: [
      { name: "meetingType", type: "select", label: "Meeting Type", required: true, options: ["Board Meeting", "Audit Committee", "Compensation Committee", "Governance Committee", "Executive Session", "Other"] },
      { name: "date", type: "date", label: "Meeting Date", required: true },
      { name: "notes", type: "text", label: "Raw Notes", placeholder: "Paste your meeting notes here...", required: true },
      { name: "format", type: "select", label: "Output Format", required: false, options: ["Standard Minutes", "Action-focused Summary", "Detailed Transcript Style"] },
    ],
    sampleOutput: `**Board of Directors Meeting Minutes**
*December 15, 2025 | 2:00 PM EST | Conference Room A / Virtual*

**Attendance**
Present: J. Smith (Chair), R. Johnson, M. Garcia, D. Lee, S. Chen, A. Williams, K. Brown, L. Davis
Absent: None
Also Present: T. Miller (General Counsel), P. Anderson (CFO)

**Call to Order**
Meeting called to order at 2:03 PM by Chair J. Smith. Quorum confirmed.

**Approval of Prior Minutes**
RESOLVED: Minutes of November 2025 meeting approved unanimously.

**CEO Report**
J. Smith presented Q4 operational highlights:
• Revenue tracking 8% above forecast
• New enterprise customer wins in healthcare vertical
• AI governance framework implementation on schedule

**Financial Review**
P. Anderson reviewed preliminary Q4 financials:
• Discussion of margin improvement initiatives
• Board requested additional analysis on R&D allocation

**Action Items**
| # | Item | Owner | Due |
|---|------|-------|-----|
| 1 | Circulate R&D analysis | P. Anderson | Jan 5 |
| 2 | Schedule strategy session | J. Smith | Jan 10 |
| 3 | Review compensation benchmarks | Comp Committee | Jan 31 |

**Adjournment**
Meeting adjourned at 4:15 PM.

*Minutes prepared by: Corporate Secretary*
*Approved: [Pending next meeting]*`,
    tips: [
      "Include attendee names in your notes for accurate attendance tracking",
      "Mark decisions with 'RESOLVED' or 'APPROVED' for automatic extraction",
      "List action items with owners for better tracking",
    ],
    relatedTemplates: ["board-report", "director-brief"],
  },
};

const DEFAULT_TEMPLATE = TEMPLATES["board-report"];

// ─────────────────────────────────────────────────────────────
// Components
// ─────────────────────────────────────────────────────────────

function InputField({ input }: { input: TemplateDetail["inputs"][0] }) {
  const baseStyle: React.CSSProperties = {
    width: "100%",
    padding: "var(--space-3)",
    fontSize: "var(--text-base)",
    border: "1px solid var(--color-gray-300)",
    borderRadius: "var(--radius-md)",
    outline: "none",
    fontFamily: "inherit",
  };

  if (input.type === "select") {
    return (
      <select style={{ ...baseStyle, background: "var(--color-white)" }}>
        <option value="">Select {input.label.toLowerCase()}...</option>
        {input.options?.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    );
  }

  if (input.type === "checkbox") {
    return (
      <label style={styles.checkboxLabel}>
        <input type="checkbox" style={styles.checkbox} />
        {input.label}
      </label>
    );
  }

  if (input.type === "date") {
    return <input type="date" style={baseStyle} />;
  }

  return (
    <input
      type="text"
      placeholder={input.placeholder}
      style={baseStyle}
    />
  );
}

function SampleOutputViewer({ output }: { output: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={styles.sampleContainer}>
      <div style={styles.sampleHeader}>
        <span style={styles.sampleLabel}>Sample Output</span>
        <button 
          onClick={() => setExpanded(!expanded)} 
          style={styles.expandButton}
        >
          {expanded ? "Collapse" : "Expand"}
        </button>
      </div>
      <div style={{
        ...styles.sampleContent,
        maxHeight: expanded ? "none" : "200px",
        overflow: expanded ? "visible" : "hidden",
      }}>
        <pre style={styles.sampleText}>{output}</pre>
        {!expanded && <div style={styles.fadeOverlay} />}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────

export default function TemplateDetailPage() {
  const [template, setTemplate] = useState<TemplateDetail>(DEFAULT_TEMPLATE);
  const [startMode, setStartMode] = useState<"scratch" | "recent" | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState<string | null>(null);

  // In a real app, we'd get the template ID from URL params
  useEffect(() => {
    // Simulate URL param reading
    const urlParams = new URLSearchParams(window.location.search);
    const templateId = urlParams.get("id");
    if (templateId && TEMPLATES[templateId]) {
      setTemplate(TEMPLATES[templateId]);
    }
  }, []);

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate generation
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedOutput(template.sampleOutput);
    }, 2000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-gray-100)" }}>
      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navInner}>
          <a href="/experiments/ai-studio-lite" style={styles.backLink}>
            ← AI Studio
          </a>
          <span style={styles.navDivider}>/</span>
          <span style={styles.navTitle}>{template.title}</span>
        </div>
      </nav>

      <main style={styles.main}>
        {/* Template Header */}
        <header style={styles.header}>
          <div style={styles.headerIcon}>{template.icon}</div>
          <div style={styles.headerContent}>
            <h1 style={styles.headline}>{template.title}</h1>
            <p style={styles.subhead}>{template.longDescription}</p>
            <div style={styles.headerMeta}>
              <span style={styles.metaItem}>📁 {template.category}</span>
              <span style={styles.metaItem}>⏱ {template.estimatedTime}</span>
              <span style={styles.metaItem}>👥 {template.usageCount} uses</span>
            </div>
          </div>
        </header>

        <Divider />

        <div style={styles.contentGrid}>
          {/* Left: Configuration */}
          <div style={styles.configSection}>
            {/* Start Mode Selection */}
            {!startMode && !generatedOutput && (
              <Card>
                <h3 style={styles.sectionTitle}>Get Started</h3>
                <div style={styles.startOptions}>
                  <button
                    onClick={() => setStartMode("recent")}
                    style={styles.startOption}
                  >
                    <span style={styles.startIcon}>📊</span>
                    <div style={styles.startContent}>
                      <strong>Use Recent Data</strong>
                      <span style={styles.startDesc}>
                        Pre-fill with your latest Q4 data and meeting notes
                      </span>
                    </div>
                    <span style={styles.startArrow}>→</span>
                  </button>
                  <button
                    onClick={() => setStartMode("scratch")}
                    style={styles.startOption}
                  >
                    <span style={styles.startIcon}>✏️</span>
                    <div style={styles.startContent}>
                      <strong>Start from Scratch</strong>
                      <span style={styles.startDesc}>
                        Configure all inputs manually
                      </span>
                    </div>
                    <span style={styles.startArrow}>→</span>
                  </button>
                </div>
              </Card>
            )}

            {/* Input Form */}
            {startMode && !generatedOutput && (
              <Card>
                <div style={styles.formHeader}>
                  <h3 style={styles.sectionTitle}>Configure Inputs</h3>
                  <button 
                    onClick={() => setStartMode(null)} 
                    style={styles.resetButton}
                  >
                    Reset
                  </button>
                </div>
                
                {startMode === "recent" && (
                  <div style={styles.recentDataBanner}>
                    ✨ Pre-filled with Q4 2025 data from your recent activity
                  </div>
                )}

                <div style={styles.inputsGrid}>
                  {template.inputs.map((input) => (
                    <div 
                      key={input.name} 
                      style={{
                        ...styles.inputField,
                        gridColumn: input.type === "text" ? "1 / -1" : undefined,
                      }}
                    >
                      {input.type !== "checkbox" && (
                        <label style={styles.inputLabel}>
                          {input.label}
                          {input.required && <span style={styles.required}>*</span>}
                        </label>
                      )}
                      <InputField input={input} />
                    </div>
                  ))}
                </div>

                <div style={styles.generateSection}>
                  <div style={styles.estimateBox}>
                    <span style={styles.estimateLabel}>Estimated time:</span>
                    <span style={styles.estimateValue}>{template.estimatedTime}</span>
                  </div>
                  <Button 
                    data-variant="primary" 
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    style={styles.generateButton}
                  >
                    {isGenerating ? "Generating..." : "Generate"}
                  </Button>
                </div>
              </Card>
            )}

            {/* Generated Output */}
            {generatedOutput && (
              <Card>
                <div style={styles.outputHeader}>
                  <h3 style={styles.sectionTitle}>Generated Output</h3>
                  <div style={styles.outputActions}>
                    <Button onClick={() => navigator.clipboard.writeText(generatedOutput)}>
                      Copy
                    </Button>
                    <Button onClick={() => setGeneratedOutput(null)}>
                      Regenerate
                    </Button>
                  </div>
                </div>
                <div style={styles.outputContent}>
                  <pre style={styles.outputText}>{generatedOutput}</pre>
                </div>
              </Card>
            )}

            {/* Tips */}
            <Card>
              <h3 style={styles.sectionTitle}>Tips for Best Results</h3>
              <ul style={styles.tipsList}>
                {template.tips.map((tip, i) => (
                  <li key={i} style={styles.tipItem}>
                    <span style={styles.tipIcon}>💡</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Right: Sample Output */}
          <div style={styles.previewSection}>
            <Card>
              <SampleOutputViewer output={template.sampleOutput} />
            </Card>

            {/* Related Templates */}
            <Card>
              <h3 style={styles.sectionTitle}>Related Templates</h3>
              <div style={styles.relatedList}>
                {template.relatedTemplates.map((id) => {
                  const related = TEMPLATES[id];
                  if (!related) return null;
                  return (
                    <a
                      key={id}
                      href={`/experiments/ai-studio-lite/template?id=${id}`}
                      style={styles.relatedItem}
                    >
                      <span style={styles.relatedIcon}>{related.icon}</span>
                      <div>
                        <strong style={styles.relatedTitle}>{related.title}</strong>
                        <span style={styles.relatedDesc}>{related.description}</span>
                      </div>
                    </a>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>

        {/* Pattern Note */}
        <Card style={{ marginTop: "var(--space-6)" }}>
          <div style={styles.patternNote}>
            <strong>Pattern Note:</strong> This template detail view shows what the AI can do, 
            what inputs are needed, and provides sample output. The "Use Recent Data" option 
            reduces friction while "Start from Scratch" gives full control. Estimated time 
            sets expectations.
          </div>
        </Card>
      </main>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "var(--space-3) var(--space-6)",
    borderBottom: "1px solid var(--color-gray-200)",
    background: "var(--color-white)",
  },
  navInner: {
    display: "flex",
    alignItems: "center",
    gap: "var(--space-2)",
  },
  backLink: {
    fontSize: "var(--text-sm)",
    color: "var(--color-gray-600)",
    textDecoration: "none",
  },
  navDivider: {
    color: "var(--color-gray-300)",
  },
  navTitle: {
    fontSize: "var(--text-sm)",
    fontWeight: 600,
    color: "var(--color-gray-900)",
  },
  main: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "var(--space-6)",
  },
  header: {
    display: "flex",
    gap: "var(--space-5)",
    alignItems: "flex-start",
  },
  headerIcon: {
    fontSize: "56px",
    flexShrink: 0,
  },
  headerContent: {
    flex: 1,
  },
  headline: {
    fontSize: "var(--text-2xl)",
    fontWeight: 600,
    color: "var(--color-gray-900)",
    marginBottom: "var(--space-2)",
  },
  subhead: {
    fontSize: "var(--text-base)",
    color: "var(--color-gray-600)",
    lineHeight: 1.6,
    marginBottom: "var(--space-3)",
  },
  headerMeta: {
    display: "flex",
    gap: "var(--space-4)",
  },
  metaItem: {
    fontSize: "var(--text-sm)",
    color: "var(--color-gray-500)",
  },
  contentGrid: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr",
    gap: "var(--space-5)",
  },
  configSection: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--space-4)",
  },
  previewSection: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--space-4)",
  },
  sectionTitle: {
    fontSize: "var(--text-base)",
    fontWeight: 600,
    color: "var(--color-gray-900)",
    marginBottom: "var(--space-3)",
  },
  startOptions: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--space-3)",
  },
  startOption: {
    display: "flex",
    alignItems: "center",
    gap: "var(--space-3)",
    padding: "var(--space-4)",
    background: "var(--color-gray-50)",
    border: "1px solid var(--color-gray-200)",
    borderRadius: "var(--radius-lg)",
    cursor: "pointer",
    textAlign: "left",
    transition: "all 0.15s ease",
  },
  startIcon: {
    fontSize: "var(--text-2xl)",
    flexShrink: 0,
  },
  startContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  startDesc: {
    fontSize: "var(--text-sm)",
    color: "var(--color-gray-500)",
    fontWeight: 400,
  },
  startArrow: {
    fontSize: "var(--text-lg)",
    color: "var(--color-gray-400)",
  },
  formHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "var(--space-2)",
  },
  resetButton: {
    fontSize: "var(--text-xs)",
    color: "var(--color-gray-500)",
    background: "none",
    border: "none",
    cursor: "pointer",
    textDecoration: "underline",
  },
  recentDataBanner: {
    padding: "var(--space-2) var(--space-3)",
    fontSize: "var(--text-sm)",
    color: "var(--color-gray-700)",
    background: "var(--color-gray-100)",
    borderRadius: "var(--radius-md)",
    marginBottom: "var(--space-4)",
  },
  inputsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "var(--space-4)",
  },
  inputField: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--space-1)",
  },
  inputLabel: {
    fontSize: "var(--text-sm)",
    fontWeight: 500,
    color: "var(--color-gray-700)",
  },
  required: {
    color: "var(--color-gray-400)",
    marginLeft: "2px",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "var(--space-2)",
    fontSize: "var(--text-sm)",
    color: "var(--color-gray-700)",
    cursor: "pointer",
  },
  checkbox: {
    width: "16px",
    height: "16px",
  },
  generateSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "var(--space-5)",
    paddingTop: "var(--space-4)",
    borderTop: "1px solid var(--color-gray-200)",
  },
  estimateBox: {
    display: "flex",
    alignItems: "center",
    gap: "var(--space-2)",
  },
  estimateLabel: {
    fontSize: "var(--text-sm)",
    color: "var(--color-gray-500)",
  },
  estimateValue: {
    fontSize: "var(--text-sm)",
    fontWeight: 600,
    color: "var(--color-gray-700)",
  },
  generateButton: {
    padding: "var(--space-3) var(--space-6)",
  },
  outputHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "var(--space-3)",
  },
  outputActions: {
    display: "flex",
    gap: "var(--space-2)",
  },
  outputContent: {
    background: "var(--color-gray-50)",
    borderRadius: "var(--radius-md)",
    padding: "var(--space-4)",
    maxHeight: "400px",
    overflow: "auto",
  },
  outputText: {
    fontSize: "var(--text-sm)",
    color: "var(--color-gray-700)",
    fontFamily: "var(--font-mono)",
    whiteSpace: "pre-wrap",
    margin: 0,
  },
  sampleContainer: {
    display: "flex",
    flexDirection: "column",
  },
  sampleHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "var(--space-3)",
  },
  sampleLabel: {
    fontSize: "var(--text-base)",
    fontWeight: 600,
    color: "var(--color-gray-900)",
  },
  expandButton: {
    fontSize: "var(--text-xs)",
    color: "var(--color-gray-500)",
    background: "none",
    border: "none",
    cursor: "pointer",
    textDecoration: "underline",
  },
  sampleContent: {
    position: "relative",
    background: "var(--color-gray-50)",
    borderRadius: "var(--radius-md)",
    padding: "var(--space-4)",
  },
  sampleText: {
    fontSize: "var(--text-xs)",
    color: "var(--color-gray-600)",
    fontFamily: "var(--font-mono)",
    whiteSpace: "pre-wrap",
    margin: 0,
    lineHeight: 1.5,
  },
  fadeOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "60px",
    background: "linear-gradient(transparent, var(--color-gray-50))",
    pointerEvents: "none",
  },
  tipsList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "var(--space-2)",
  },
  tipItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "var(--space-2)",
    fontSize: "var(--text-sm)",
    color: "var(--color-gray-600)",
  },
  tipIcon: {
    flexShrink: 0,
  },
  relatedList: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--space-2)",
  },
  relatedItem: {
    display: "flex",
    alignItems: "center",
    gap: "var(--space-3)",
    padding: "var(--space-3)",
    background: "var(--color-gray-50)",
    borderRadius: "var(--radius-md)",
    textDecoration: "none",
    color: "inherit",
  },
  relatedIcon: {
    fontSize: "var(--text-xl)",
  },
  relatedTitle: {
    display: "block",
    fontSize: "var(--text-sm)",
    color: "var(--color-gray-800)",
  },
  relatedDesc: {
    display: "block",
    fontSize: "var(--text-xs)",
    color: "var(--color-gray-500)",
    fontWeight: 400,
  },
  patternNote: {
    fontSize: "var(--text-sm)",
    color: "var(--color-gray-600)",
    background: "var(--color-gray-50)",
    padding: "var(--space-3)",
    borderRadius: "var(--radius-md)",
    borderLeft: "3px solid var(--color-gray-400)",
  },
};
