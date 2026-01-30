"use client";

/**
 * Filing Detail Page — In-Context Mini-Prompt
 * 
 * Demonstrates a specialized prompt for compliance/filing context,
 * pre-loaded with document-specific capabilities.
 */

import React, { useState } from "react";
import { Card } from "../../../../wireframe-primitives/Card";
import { Button } from "../../../../wireframe-primitives/Button";
import { Divider } from "../../../../wireframe-primitives/Divider";

// ─────────────────────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────────────────────

const FILING = {
  title: "SOX 404 Annual Assessment",
  type: "Regulatory Filing",
  deadline: "March 15, 2026",
  status: "In Progress",
  completion: 68,
  lastUpdated: "2 days ago",
};

const FILING_SECTIONS = [
  { id: "1", title: "Control Environment Assessment", status: "Complete", pages: 12 },
  { id: "2", title: "Risk Assessment Procedures", status: "Complete", pages: 8 },
  { id: "3", title: "Information & Communication", status: "In Review", pages: 15 },
  { id: "4", title: "Monitoring Activities", status: "Draft", pages: 6 },
  { id: "5", title: "Management's Conclusions", status: "Not Started", pages: 0 },
];

const REGULATORY_CHANGES = [
  { id: "1", title: "PCAOB AS 2201 Update", impact: "Medium", effective: "Jan 2026" },
  { id: "2", title: "SEC Rule 13a-15 Amendment", impact: "Low", effective: "Feb 2026" },
  { id: "3", title: "Internal Control Framework v2", impact: "High", effective: "Mar 2026" },
];

const MINI_PROMPT_SUGGESTIONS = [
  "Explain regulatory changes in plain language",
  "Generate executive summary of this filing",
  "Compare to last year's assessment",
  "Identify gaps in current documentation",
];

// ─────────────────────────────────────────────────────────────
// Components
// ─────────────────────────────────────────────────────────────

function MiniPrompt() {
  const [value, setValue] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = () => {
    if (value.trim()) {
      setResult(`Analysis for: "${value}"\n\nThe SOX 404 filing is progressing well at 68% completion. Key regulatory changes to note:\n\n• PCAOB AS 2201 requires enhanced documentation of control testing procedures\n• SEC Amendment 13a-15 clarifies disclosure requirements for material weaknesses\n• The new Internal Control Framework emphasizes IT general controls\n\nRecommendation: Prioritize the Monitoring Activities section to stay on track for the March deadline.`);
      setValue("");
    }
  };

  return (
    <div style={styles.miniPromptContainer}>
      <div style={styles.miniPromptHeader}>
        <span style={styles.miniPromptBadge}>Filing Assistant</span>
        <span style={styles.miniPromptContext}>Context: SOX 404 Annual Assessment</span>
      </div>
      
      <div style={styles.inputRow}>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Explain regulatory changes in plain language..."
          style={styles.miniInput}
        />
        <Button data-variant="primary" onClick={handleSubmit}>
          Run
        </Button>
      </div>

      <div style={styles.suggestionsRow}>
        {MINI_PROMPT_SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setValue(s)}
            style={styles.suggestionChip}
          >
            {s}
          </button>
        ))}
      </div>

      {result && (
        <div style={styles.resultBox}>
          <div style={styles.resultHeader}>
            <span style={styles.resultLabel}>Result</span>
            <button onClick={() => setResult(null)} style={styles.clearButton}>
              Clear
            </button>
          </div>
          <p style={styles.resultText}>{result}</p>
        </div>
      )}
    </div>
  );
}

function ProgressBar({ completion }: { completion: number }) {
  return (
    <div style={styles.progressContainer}>
      <div style={styles.progressBar}>
        <div style={{ ...styles.progressFill, width: `${completion}%` }} />
      </div>
      <span style={styles.progressLabel}>{completion}% complete</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────

export default function FilingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--color-gray-100)" }}>
      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navInner}>
          <span style={styles.navLabel}>Compliance</span>
          <span style={styles.navTitle}>{FILING.title}</span>
        </div>
        <a href="/experiments/contextual-launch-pads" style={styles.navLink}>
          ← Back to Launch Pads
        </a>
      </nav>

      <main style={styles.main}>
        {/* Page Header */}
        <header style={styles.pageHeader}>
          <div>
            <div style={styles.headerMeta}>
              <span style={styles.metaItem}>📄 {FILING.type}</span>
              <span style={styles.metaItem}>📅 Due: {FILING.deadline}</span>
              <span style={styles.metaItem}>🕒 Updated {FILING.lastUpdated}</span>
            </div>
            <ProgressBar completion={FILING.completion} />
          </div>
          <span style={styles.statusBadge}>{FILING.status}</span>
        </header>

        {/* Mini-Prompt Card */}
        <Card>
          <MiniPrompt />
        </Card>

        <Divider />

        {/* Content Grid */}
        <div style={styles.contentGrid}>
          {/* Sections */}
          <Card>
            <div style={styles.listHeader}>
              <span style={styles.listTitle}>Filing Sections</span>
              <span style={styles.listCount}>{FILING_SECTIONS.length} sections</span>
            </div>
            <div style={styles.listItems}>
              {FILING_SECTIONS.map((section) => (
                <div key={section.id} style={styles.sectionItem}>
                  <div style={styles.sectionContent}>
                    <span style={styles.sectionTitle}>{section.title}</span>
                    <span style={styles.sectionMeta}>
                      {section.pages > 0 ? `${section.pages} pages` : "—"}
                    </span>
                  </div>
                  <span style={{
                    ...styles.sectionStatus,
                    background: section.status === "Complete" 
                      ? "var(--color-gray-200)" 
                      : section.status === "In Review"
                      ? "var(--color-gray-150)"
                      : "var(--color-gray-100)",
                  }}>
                    {section.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Regulatory Changes */}
          <Card>
            <div style={styles.listHeader}>
              <span style={styles.listTitle}>Regulatory Changes</span>
            </div>
            <div style={styles.listItems}>
              {REGULATORY_CHANGES.map((change) => (
                <div key={change.id} style={styles.changeItem}>
                  <div style={styles.changeContent}>
                    <span style={styles.changeTitle}>{change.title}</span>
                    <span style={styles.changeMeta}>Effective: {change.effective}</span>
                  </div>
                  <span style={{
                    ...styles.impactBadge,
                    background: change.impact === "High" 
                      ? "var(--color-gray-300)" 
                      : "var(--color-gray-200)",
                  }}>
                    {change.impact}
                  </span>
                </div>
              ))}
            </div>
            <button style={styles.viewAllButton}>
              View all changes →
            </button>
          </Card>
        </div>

        {/* Pattern Note */}
        <Card style={{ marginTop: "var(--space-6)" }}>
          <div style={styles.patternNote}>
            <strong>Pattern Note:</strong> This mini-prompt understands the filing context — 
            it knows about SOX requirements, can reference the specific sections, and offers 
            compliance-focused suggestions. It's a specialized tool for regulatory work.
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
    gap: "var(--space-3)",
  },
  navLabel: {
    fontSize: "var(--text-xs)",
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "var(--color-gray-400)",
  },
  navTitle: {
    fontSize: "var(--text-sm)",
    fontWeight: 600,
    color: "var(--color-gray-900)",
  },
  navLink: {
    fontSize: "var(--text-xs)",
    color: "var(--color-gray-600)",
    textDecoration: "none",
  },
  main: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "var(--space-6)",
  },
  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "var(--space-6)",
  },
  headerMeta: {
    display: "flex",
    gap: "var(--space-4)",
    marginBottom: "var(--space-3)",
  },
  metaItem: {
    fontSize: "var(--text-sm)",
    color: "var(--color-gray-600)",
  },
  statusBadge: {
    padding: "var(--space-1) var(--space-3)",
    fontSize: "var(--text-xs)",
    fontWeight: 600,
    color: "var(--color-gray-700)",
    background: "var(--color-gray-200)",
    borderRadius: "var(--radius-xl)",
  },
  progressContainer: {
    display: "flex",
    alignItems: "center",
    gap: "var(--space-3)",
  },
  progressBar: {
    width: "200px",
    height: "8px",
    background: "var(--color-gray-200)",
    borderRadius: "var(--radius-xl)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "var(--color-gray-600)",
    borderRadius: "var(--radius-xl)",
    transition: "width 0.3s ease",
  },
  progressLabel: {
    fontSize: "var(--text-xs)",
    fontWeight: 500,
    color: "var(--color-gray-600)",
  },
  miniPromptContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--space-3)",
  },
  miniPromptHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  miniPromptBadge: {
    fontSize: "var(--text-xs)",
    fontWeight: 600,
    color: "var(--color-gray-600)",
    background: "var(--color-gray-100)",
    padding: "var(--space-1) var(--space-2)",
    borderRadius: "var(--radius-sm)",
  },
  miniPromptContext: {
    fontSize: "var(--text-xs)",
    color: "var(--color-gray-500)",
  },
  inputRow: {
    display: "flex",
    gap: "var(--space-2)",
  },
  miniInput: {
    flex: 1,
    padding: "var(--space-3) var(--space-4)",
    fontSize: "var(--text-base)",
    border: "1px solid var(--color-gray-300)",
    borderRadius: "var(--radius-lg)",
    outline: "none",
  },
  suggestionsRow: {
    display: "flex",
    gap: "var(--space-2)",
    flexWrap: "wrap",
  },
  suggestionChip: {
    padding: "var(--space-1) var(--space-2)",
    fontSize: "var(--text-xs)",
    color: "var(--color-gray-700)",
    background: "var(--color-gray-50)",
    border: "1px solid var(--color-gray-200)",
    borderRadius: "var(--radius-lg)",
    cursor: "pointer",
  },
  resultBox: {
    marginTop: "var(--space-3)",
    padding: "var(--space-4)",
    background: "var(--color-gray-50)",
    borderRadius: "var(--radius-lg)",
    border: "1px solid var(--color-gray-200)",
  },
  resultHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "var(--space-2)",
  },
  resultLabel: {
    fontSize: "var(--text-xs)",
    fontWeight: 600,
    color: "var(--color-gray-500)",
    textTransform: "uppercase",
  },
  clearButton: {
    fontSize: "var(--text-xs)",
    color: "var(--color-gray-500)",
    background: "none",
    border: "none",
    cursor: "pointer",
    textDecoration: "underline",
  },
  resultText: {
    fontSize: "var(--text-sm)",
    color: "var(--color-gray-700)",
    lineHeight: 1.6,
    whiteSpace: "pre-wrap",
  },
  contentGrid: {
    display: "grid",
    gridTemplateColumns: "1.5fr 1fr",
    gap: "var(--space-4)",
  },
  listHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "var(--space-3)",
  },
  listTitle: {
    fontSize: "var(--text-base)",
    fontWeight: 600,
    color: "var(--color-gray-900)",
  },
  listCount: {
    fontSize: "var(--text-xs)",
    color: "var(--color-gray-500)",
  },
  listItems: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--space-2)",
  },
  sectionItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "var(--space-3)",
    background: "var(--color-gray-50)",
    borderRadius: "var(--radius-md)",
  },
  sectionContent: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  sectionTitle: {
    fontSize: "var(--text-sm)",
    fontWeight: 500,
    color: "var(--color-gray-800)",
  },
  sectionMeta: {
    fontSize: "var(--text-xs)",
    color: "var(--color-gray-500)",
  },
  sectionStatus: {
    padding: "var(--space-1) var(--space-2)",
    fontSize: "var(--text-xs)",
    fontWeight: 500,
    color: "var(--color-gray-700)",
    borderRadius: "var(--radius-sm)",
  },
  changeItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "var(--space-2) 0",
    borderBottom: "1px solid var(--color-gray-100)",
  },
  changeContent: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  changeTitle: {
    fontSize: "var(--text-sm)",
    fontWeight: 500,
    color: "var(--color-gray-800)",
  },
  changeMeta: {
    fontSize: "var(--text-xs)",
    color: "var(--color-gray-500)",
  },
  impactBadge: {
    padding: "2px 8px",
    fontSize: "var(--text-xs)",
    fontWeight: 500,
    color: "var(--color-gray-700)",
    borderRadius: "var(--radius-sm)",
  },
  viewAllButton: {
    marginTop: "var(--space-3)",
    fontSize: "var(--text-xs)",
    color: "var(--color-gray-600)",
    background: "none",
    border: "none",
    cursor: "pointer",
    textDecoration: "underline",
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
