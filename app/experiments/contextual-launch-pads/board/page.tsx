"use client";

/**
 * Board Page — In-Context Mini-Prompt
 * 
 * Demonstrates a specialized prompt that appears in the context of board management,
 * pre-loaded with relevant capabilities and suggestions.
 */

import React, { useState } from "react";
import { Card } from "../../../../wireframe-primitives/Card";
import { Button } from "../../../../wireframe-primitives/Button";
import { Divider } from "../../../../wireframe-primitives/Divider";

// ─────────────────────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────────────────────

const BOARD_MEETING = {
  title: "Q4 2025 Board Meeting",
  date: "December 15, 2025",
  status: "Preparation",
  attendees: 8,
  openItems: 12,
};

const RECENT_RESOLUTIONS = [
  { id: "1", title: "Executive Compensation Review", date: "Sep 2025", status: "Approved" },
  { id: "2", title: "FY2026 Budget Approval", date: "Sep 2025", status: "Approved" },
  { id: "3", title: "New Board Member Nomination", date: "Aug 2025", status: "Approved" },
  { id: "4", title: "Strategic Partnership Authorization", date: "Aug 2025", status: "Pending Review" },
];

const MINI_PROMPT_SUGGESTIONS = [
  "Summarize this quarter's resolutions",
  "Draft meeting agenda from open items",
  "Generate attendance tracking report",
  "Compare resolutions to last quarter",
];

// ─────────────────────────────────────────────────────────────
// Components
// ─────────────────────────────────────────────────────────────

function MiniPrompt() {
  const [value, setValue] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = () => {
    if (value.trim()) {
      // Simulate AI response
      setResult(`Generated summary for: "${value}"\n\nThis quarter saw 4 key resolutions passed by the board, including executive compensation adjustments and FY2026 budget approval. All items were approved with unanimous consent except for the Strategic Partnership Authorization which remains under review.`);
      setValue("");
    }
  };

  const handleSuggestion = (suggestion: string) => {
    setValue(suggestion);
  };

  return (
    <div style={styles.miniPromptContainer}>
      <div style={styles.miniPromptHeader}>
        <span style={styles.miniPromptBadge}>Board Assistant</span>
        <span style={styles.miniPromptContext}>Context: Q4 2025 Board Meeting</span>
      </div>
      
      <div style={styles.inputRow}>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Summarize this quarter's resolutions..."
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
            onClick={() => handleSuggestion(s)}
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

function ResolutionsList() {
  return (
    <div style={styles.listContainer}>
      <div style={styles.listHeader}>
        <span style={styles.listTitle}>Recent Resolutions</span>
        <span style={styles.listCount}>{RECENT_RESOLUTIONS.length} items</span>
      </div>
      <div style={styles.listItems}>
        {RECENT_RESOLUTIONS.map((res) => (
          <div key={res.id} style={styles.listItem}>
            <div style={styles.itemContent}>
              <span style={styles.itemTitle}>{res.title}</span>
              <span style={styles.itemMeta}>{res.date}</span>
            </div>
            <span style={{
              ...styles.itemStatus,
              color: res.status === "Approved" ? "var(--color-gray-600)" : "var(--color-gray-500)",
            }}>
              {res.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────

export default function BoardPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--color-gray-100)" }}>
      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navInner}>
          <span style={styles.navLabel}>Board Management</span>
          <span style={styles.navTitle}>{BOARD_MEETING.title}</span>
        </div>
        <a href="/experiments/contextual-launch-pads" style={styles.navLink}>
          ← Back to Launch Pads
        </a>
      </nav>

      <main style={styles.main}>
        {/* Page Header */}
        <header style={styles.pageHeader}>
          <div style={styles.headerMeta}>
            <span style={styles.metaItem}>📅 {BOARD_MEETING.date}</span>
            <span style={styles.metaItem}>👥 {BOARD_MEETING.attendees} attendees</span>
            <span style={styles.metaItem}>📋 {BOARD_MEETING.openItems} open items</span>
          </div>
          <span style={styles.statusBadge}>{BOARD_MEETING.status}</span>
        </header>

        {/* Mini-Prompt Card */}
        <Card>
          <MiniPrompt />
        </Card>

        <Divider />

        {/* Content */}
        <div style={styles.contentGrid}>
          <Card>
            <ResolutionsList />
          </Card>

          <Card>
            <div style={styles.sidePanel}>
              <h3 style={styles.sidePanelTitle}>Quick Actions</h3>
              <div style={styles.quickActions}>
                <button style={styles.quickAction}>
                  <span>📝</span> New Resolution
                </button>
                <button style={styles.quickAction}>
                  <span>📧</span> Send Invites
                </button>
                <button style={styles.quickAction}>
                  <span>📊</span> View Reports
                </button>
                <button style={styles.quickAction}>
                  <span>📁</span> Meeting Materials
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Pattern Explanation */}
        <Card style={{ marginTop: "var(--space-6)" }}>
          <div style={styles.patternNote}>
            <strong>Pattern Note:</strong> This mini-prompt is scoped to board management. 
            It knows the context (Q4 meeting, recent resolutions) and offers only relevant 
            suggestions. Users experience a specialized tool, not a constrained general assistant.
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
    alignItems: "center",
    marginBottom: "var(--space-6)",
  },
  headerMeta: {
    display: "flex",
    gap: "var(--space-4)",
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
    gridTemplateColumns: "2fr 1fr",
    gap: "var(--space-4)",
  },
  listContainer: {
    display: "flex",
    flexDirection: "column",
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
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "var(--space-3)",
    background: "var(--color-gray-50)",
    borderRadius: "var(--radius-md)",
  },
  itemContent: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  itemTitle: {
    fontSize: "var(--text-sm)",
    fontWeight: 500,
    color: "var(--color-gray-800)",
  },
  itemMeta: {
    fontSize: "var(--text-xs)",
    color: "var(--color-gray-500)",
  },
  itemStatus: {
    fontSize: "var(--text-xs)",
    fontWeight: 500,
  },
  sidePanel: {
    display: "flex",
    flexDirection: "column",
  },
  sidePanelTitle: {
    fontSize: "var(--text-base)",
    fontWeight: 600,
    color: "var(--color-gray-900)",
    marginBottom: "var(--space-3)",
  },
  quickActions: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--space-2)",
  },
  quickAction: {
    display: "flex",
    alignItems: "center",
    gap: "var(--space-2)",
    padding: "var(--space-2) var(--space-3)",
    fontSize: "var(--text-sm)",
    color: "var(--color-gray-700)",
    background: "var(--color-gray-50)",
    border: "1px solid var(--color-gray-200)",
    borderRadius: "var(--radius-md)",
    cursor: "pointer",
    textAlign: "left",
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
