"use client";

/**
 * Entity Overview Page — In-Context Mini-Prompt
 * 
 * Demonstrates a specialized prompt for entity management context,
 * with capabilities scoped to organizational structure and compliance.
 */

import React, { useState } from "react";
import { Card } from "../../../../wireframe-primitives/Card";
import { Button } from "../../../../wireframe-primitives/Button";
import { Divider } from "../../../../wireframe-primitives/Divider";

// ─────────────────────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────────────────────

const ENTITY = {
  name: "Acme Corporation",
  type: "Subsidiary",
  jurisdiction: "Delaware, USA",
  status: "Active",
  parentEntity: "Acme Holdings Inc.",
  incorporationDate: "March 15, 2018",
  fiscalYearEnd: "December 31",
};

const COMPLIANCE_STATUS = {
  overall: "Good Standing",
  score: 92,
  items: [
    { category: "Annual Reports", status: "Current", dueDate: "Mar 2026" },
    { category: "Franchise Tax", status: "Current", dueDate: "Jun 2026" },
    { category: "Registered Agent", status: "Active", dueDate: "—" },
    { category: "Good Standing Certificate", status: "Expiring Soon", dueDate: "Feb 2026" },
  ],
};

const RELATED_ENTITIES = [
  { name: "Acme Holdings Inc.", relationship: "Parent", jurisdiction: "Delaware" },
  { name: "Acme Europe GmbH", relationship: "Sibling", jurisdiction: "Germany" },
  { name: "Acme Tech LLC", relationship: "Child", jurisdiction: "California" },
  { name: "Acme Services Ltd", relationship: "Child", jurisdiction: "UK" },
];

const KEY_OFFICERS = [
  { name: "Jane Smith", role: "CEO & Director", since: "2020" },
  { name: "Robert Johnson", role: "CFO", since: "2021" },
  { name: "Maria Garcia", role: "General Counsel", since: "2019" },
  { name: "David Lee", role: "Corporate Secretary", since: "2022" },
];

const MINI_PROMPT_SUGGESTIONS = [
  "Create compliance status report for leadership",
  "Show upcoming filing deadlines",
  "Generate entity relationship diagram",
  "Compare governance to best practices",
];

// ─────────────────────────────────────────────────────────────
// Components
// ─────────────────────────────────────────────────────────────

function MiniPrompt() {
  const [value, setValue] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = () => {
    if (value.trim()) {
      setResult(`Report generated for: "${value}"\n\n**Acme Corporation Compliance Status Report**\n\nExecutive Summary:\nAcme Corporation maintains good standing with a compliance score of 92/100. All major filing requirements are current.\n\nKey Points:\n• Annual report filed and current through 2025\n• Franchise tax paid through June 2026\n• Good Standing Certificate requires renewal by February 2026\n\nAction Required:\nSchedule renewal of Good Standing Certificate within the next 30 days to maintain uninterrupted compliance status.`);
      setValue("");
    }
  };

  return (
    <div style={styles.miniPromptContainer}>
      <div style={styles.miniPromptHeader}>
        <span style={styles.miniPromptBadge}>Entity Assistant</span>
        <span style={styles.miniPromptContext}>Context: {ENTITY.name}</span>
      </div>
      
      <div style={styles.inputRow}>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Create compliance status report for leadership..."
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

function ComplianceScoreRing({ score }: { score: number }) {
  return (
    <div style={styles.scoreContainer}>
      <div style={styles.scoreRing}>
        <span style={styles.scoreValue}>{score}</span>
      </div>
      <span style={styles.scoreLabel}>Compliance Score</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────

export default function EntityPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--color-gray-100)" }}>
      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navInner}>
          <span style={styles.navLabel}>Entity Management</span>
          <span style={styles.navTitle}>{ENTITY.name}</span>
        </div>
        <a href="/experiments/contextual-launch-pads" style={styles.navLink}>
          ← Back to Launch Pads
        </a>
      </nav>

      <main style={styles.main}>
        {/* Page Header */}
        <header style={styles.pageHeader}>
          <div style={styles.entityInfo}>
            <div style={styles.entityIcon}>🏢</div>
            <div>
              <h1 style={styles.entityName}>{ENTITY.name}</h1>
              <div style={styles.headerMeta}>
                <span style={styles.metaItem}>{ENTITY.type}</span>
                <span style={styles.metaDivider}>•</span>
                <span style={styles.metaItem}>{ENTITY.jurisdiction}</span>
                <span style={styles.metaDivider}>•</span>
                <span style={styles.metaItem}>Parent: {ENTITY.parentEntity}</span>
              </div>
            </div>
          </div>
          <span style={styles.statusBadge}>{ENTITY.status}</span>
        </header>

        {/* Mini-Prompt Card */}
        <Card>
          <MiniPrompt />
        </Card>

        <Divider />

        {/* Content Grid */}
        <div style={styles.contentGrid}>
          {/* Compliance Status */}
          <Card>
            <div style={styles.complianceHeader}>
              <div>
                <h3 style={styles.sectionTitle}>Compliance Status</h3>
                <span style={styles.overallStatus}>{COMPLIANCE_STATUS.overall}</span>
              </div>
              <ComplianceScoreRing score={COMPLIANCE_STATUS.score} />
            </div>
            <div style={styles.complianceItems}>
              {COMPLIANCE_STATUS.items.map((item) => (
                <div key={item.category} style={styles.complianceItem}>
                  <span style={styles.complianceCategory}>{item.category}</span>
                  <span style={{
                    ...styles.complianceStatus,
                    color: item.status === "Expiring Soon" 
                      ? "var(--color-gray-700)" 
                      : "var(--color-gray-600)",
                    fontWeight: item.status === "Expiring Soon" ? 600 : 500,
                  }}>
                    {item.status}
                  </span>
                  <span style={styles.complianceDue}>{item.dueDate}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Related Entities */}
          <Card>
            <h3 style={styles.sectionTitle}>Related Entities</h3>
            <div style={styles.relatedList}>
              {RELATED_ENTITIES.map((entity) => (
                <div key={entity.name} style={styles.relatedItem}>
                  <div style={styles.relatedInfo}>
                    <span style={styles.relatedName}>{entity.name}</span>
                    <span style={styles.relatedJurisdiction}>{entity.jurisdiction}</span>
                  </div>
                  <span style={styles.relationshipBadge}>{entity.relationship}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Officers */}
        <Card style={{ marginTop: "var(--space-4)" }}>
          <h3 style={styles.sectionTitle}>Key Officers</h3>
          <div style={styles.officersGrid}>
            {KEY_OFFICERS.map((officer) => (
              <div key={officer.name} style={styles.officerCard}>
                <div style={styles.officerAvatar}>
                  {officer.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div style={styles.officerInfo}>
                  <span style={styles.officerName}>{officer.name}</span>
                  <span style={styles.officerRole}>{officer.role}</span>
                  <span style={styles.officerSince}>Since {officer.since}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Pattern Note */}
        <Card style={{ marginTop: "var(--space-6)" }}>
          <div style={styles.patternNote}>
            <strong>Pattern Note:</strong> This mini-prompt is scoped to entity management — 
            it knows about this specific entity, its compliance status, related entities, and 
            officers. It can generate reports, check deadlines, and compare governance practices
            within its specialized domain.
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
  entityInfo: {
    display: "flex",
    gap: "var(--space-4)",
    alignItems: "center",
  },
  entityIcon: {
    fontSize: "40px",
  },
  entityName: {
    fontSize: "var(--text-2xl)",
    fontWeight: 600,
    color: "var(--color-gray-900)",
    marginBottom: "var(--space-1)",
  },
  headerMeta: {
    display: "flex",
    gap: "var(--space-2)",
    alignItems: "center",
  },
  metaItem: {
    fontSize: "var(--text-sm)",
    color: "var(--color-gray-600)",
  },
  metaDivider: {
    color: "var(--color-gray-400)",
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
    gridTemplateColumns: "1.5fr 1fr",
    gap: "var(--space-4)",
  },
  sectionTitle: {
    fontSize: "var(--text-base)",
    fontWeight: 600,
    color: "var(--color-gray-900)",
    marginBottom: "var(--space-3)",
  },
  complianceHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "var(--space-4)",
  },
  overallStatus: {
    fontSize: "var(--text-sm)",
    color: "var(--color-gray-600)",
  },
  scoreContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "var(--space-1)",
  },
  scoreRing: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    border: "4px solid var(--color-gray-300)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  scoreValue: {
    fontSize: "var(--text-lg)",
    fontWeight: 600,
    color: "var(--color-gray-800)",
  },
  scoreLabel: {
    fontSize: "var(--text-xs)",
    color: "var(--color-gray-500)",
  },
  complianceItems: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--space-2)",
  },
  complianceItem: {
    display: "flex",
    alignItems: "center",
    padding: "var(--space-2) 0",
    borderBottom: "1px solid var(--color-gray-100)",
  },
  complianceCategory: {
    flex: 1,
    fontSize: "var(--text-sm)",
    color: "var(--color-gray-800)",
  },
  complianceStatus: {
    fontSize: "var(--text-xs)",
    minWidth: "100px",
    textAlign: "center",
  },
  complianceDue: {
    fontSize: "var(--text-xs)",
    color: "var(--color-gray-500)",
    minWidth: "80px",
    textAlign: "right",
  },
  relatedList: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--space-2)",
  },
  relatedItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "var(--space-2)",
    background: "var(--color-gray-50)",
    borderRadius: "var(--radius-md)",
  },
  relatedInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  relatedName: {
    fontSize: "var(--text-sm)",
    fontWeight: 500,
    color: "var(--color-gray-800)",
  },
  relatedJurisdiction: {
    fontSize: "var(--text-xs)",
    color: "var(--color-gray-500)",
  },
  relationshipBadge: {
    padding: "2px 8px",
    fontSize: "var(--text-xs)",
    fontWeight: 500,
    color: "var(--color-gray-600)",
    background: "var(--color-gray-200)",
    borderRadius: "var(--radius-sm)",
  },
  officersGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "var(--space-3)",
  },
  officerCard: {
    display: "flex",
    gap: "var(--space-3)",
    padding: "var(--space-3)",
    background: "var(--color-gray-50)",
    borderRadius: "var(--radius-md)",
  },
  officerAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "var(--color-gray-300)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "var(--text-sm)",
    fontWeight: 600,
    color: "var(--color-gray-700)",
    flexShrink: 0,
  },
  officerInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  officerName: {
    fontSize: "var(--text-sm)",
    fontWeight: 600,
    color: "var(--color-gray-800)",
  },
  officerRole: {
    fontSize: "var(--text-xs)",
    color: "var(--color-gray-600)",
  },
  officerSince: {
    fontSize: "var(--text-xs)",
    color: "var(--color-gray-500)",
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
