"use client";

/**
 * Contextual Launch Pads — Task Router (Homepage)
 * 
 * Demonstrates how a homepage prompt becomes a "task router" with smart defaults,
 * directing users to specialized, context-specific experiences rather than
 * trying to handle everything in one place.
 */

import React, { useState } from "react";
import { Card } from "../../../wireframe-primitives/Card";
import { Button } from "../../../wireframe-primitives/Button";
import { Divider } from "../../../wireframe-primitives/Divider";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

type TaskCategory = "board" | "compliance" | "entities" | "risk";

type QuickAction = {
  id: string;
  label: string;
  description: string;
  category: TaskCategory;
  route: string;
  icon: string;
};

type CategoryInfo = {
  label: string;
  color: string;
  description: string;
};

// ─────────────────────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────────────────────

const CATEGORIES: Record<TaskCategory, CategoryInfo> = {
  board: {
    label: "Board Management",
    color: "var(--color-gray-700)",
    description: "Meeting prep, reports, and resolutions",
  },
  compliance: {
    label: "Compliance",
    color: "var(--color-gray-600)",
    description: "Filings, audits, and regulatory tracking",
  },
  entities: {
    label: "Entity Management",
    color: "var(--color-gray-500)",
    description: "Structure, governance, and reporting",
  },
  risk: {
    label: "Risk & Vendors",
    color: "var(--color-gray-600)",
    description: "Third-party oversight and risk assessment",
  },
};

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: "board-report",
    label: "Draft board report",
    description: "Generate quarterly report from recent activity",
    category: "board",
    route: "/experiments/contextual-launch-pads/board",
    icon: "📋",
  },
  {
    id: "meeting-agenda",
    label: "Create meeting agenda",
    description: "Build agenda from open items and prior minutes",
    category: "board",
    route: "/experiments/contextual-launch-pads/board",
    icon: "📅",
  },
  {
    id: "filing-summary",
    label: "Generate filing summary",
    description: "Summarize regulatory changes in plain language",
    category: "compliance",
    route: "/experiments/contextual-launch-pads/filing",
    icon: "📄",
  },
  {
    id: "audit-checklist",
    label: "Prepare audit checklist",
    description: "Create checklist for upcoming compliance review",
    category: "compliance",
    route: "/experiments/contextual-launch-pads/filing",
    icon: "✓",
  },
  {
    id: "entity-status",
    label: "Entity compliance status",
    description: "Generate status report for leadership",
    category: "entities",
    route: "/experiments/contextual-launch-pads/entity",
    icon: "🏢",
  },
  {
    id: "org-chart",
    label: "Update org structure",
    description: "Review and document entity relationships",
    category: "entities",
    route: "/experiments/contextual-launch-pads/entity",
    icon: "🔗",
  },
  {
    id: "vendor-assessment",
    label: "Vendor risk assessment",
    description: "Evaluate third-party risk exposure",
    category: "risk",
    route: "/experiments/contextual-launch-pads/entity",
    icon: "⚠️",
  },
  {
    id: "due-diligence",
    label: "Due diligence report",
    description: "Compile vendor due diligence documentation",
    category: "risk",
    route: "/experiments/contextual-launch-pads/entity",
    icon: "🔍",
  },
];

const RECENT_CONTEXTS = [
  { label: "Q4 2025 Board Meeting", type: "board", route: "/experiments/contextual-launch-pads/board" },
  { label: "SOX 404 Filing", type: "compliance", route: "/experiments/contextual-launch-pads/filing" },
  { label: "Acme Corp Subsidiary", type: "entity", route: "/experiments/contextual-launch-pads/entity" },
];

// ─────────────────────────────────────────────────────────────
// Components
// ─────────────────────────────────────────────────────────────

function TaskRouter() {
  const [inputValue, setInputValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | null>(null);

  const filteredActions = selectedCategory
    ? QUICK_ACTIONS.filter((a) => a.category === selectedCategory)
    : QUICK_ACTIONS;

  const handleActionClick = (action: QuickAction) => {
    window.location.href = action.route + `?task=${action.id}`;
  };

  return (
    <div style={styles.routerContainer}>
      {/* Main Prompt */}
      <div style={styles.promptSection}>
        <h2 style={styles.promptTitle}>What would you like to do?</h2>
        <p style={styles.promptSubtitle}>
          Choose a task below or describe what you need
        </p>
        <div style={styles.inputRow}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Describe your task or select from quick actions..."
            style={styles.routerInput}
          />
          <Button data-variant="primary" style={styles.goButton}>
            Go
          </Button>
        </div>
      </div>

      {/* Category Filters */}
      <div style={styles.categoryFilters}>
        <button
          onClick={() => setSelectedCategory(null)}
          style={{
            ...styles.categoryChip,
            ...(selectedCategory === null ? styles.categoryChipActive : {}),
          }}
        >
          All
        </button>
        {(Object.keys(CATEGORIES) as TaskCategory[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              ...styles.categoryChip,
              ...(selectedCategory === cat ? styles.categoryChipActive : {}),
            }}
          >
            {CATEGORIES[cat].label}
          </button>
        ))}
      </div>

      {/* Quick Actions Grid */}
      <div style={styles.actionsGrid}>
        {filteredActions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleActionClick(action)}
            style={styles.actionCard}
          >
            <span style={styles.actionIcon}>{action.icon}</span>
            <div style={styles.actionContent}>
              <span style={styles.actionLabel}>{action.label}</span>
              <span style={styles.actionDesc}>{action.description}</span>
            </div>
            <span style={styles.actionArrow}>→</span>
          </button>
        ))}
      </div>

      {/* Recent Contexts */}
      <div style={styles.recentSection}>
        <span style={styles.recentLabel}>Continue where you left off:</span>
        <div style={styles.recentRow}>
          {RECENT_CONTEXTS.map((ctx) => (
            <a key={ctx.label} href={ctx.route} style={styles.recentChip}>
              {ctx.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function InContextDemoNav() {
  return (
    <Card style={{ marginTop: "var(--space-6)" }}>
      <h3 style={styles.demoTitle}>See In-Context Mini-Prompts</h3>
      <p style={styles.demoDesc}>
        Each page below has a specialized prompt that feels like a purpose-built tool,
        not a limited assistant.
      </p>
      <div style={styles.demoLinks}>
        <a href="/experiments/contextual-launch-pads/board" style={styles.demoLink}>
          <span style={styles.demoLinkIcon}>📋</span>
          <div>
            <strong>Board Page</strong>
            <span style={styles.demoLinkHint}>"Summarize this quarter's resolutions"</span>
          </div>
        </a>
        <a href="/experiments/contextual-launch-pads/filing" style={styles.demoLink}>
          <span style={styles.demoLinkIcon}>📄</span>
          <div>
            <strong>Filing Detail</strong>
            <span style={styles.demoLinkHint}>"Explain regulatory changes in plain language"</span>
          </div>
        </a>
        <a href="/experiments/contextual-launch-pads/entity" style={styles.demoLink}>
          <span style={styles.demoLinkIcon}>🏢</span>
          <div>
            <strong>Entity Overview</strong>
            <span style={styles.demoLinkHint}>"Create compliance status report for leadership"</span>
          </div>
        </a>
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────

export default function ContextualLaunchPadsPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--color-gray-100)" }}>
      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navInner}>
          <span style={styles.navLabel}>Experiment</span>
          <span style={styles.navTitle}>Contextual Launch Pads</span>
        </div>
        <a href="/" style={styles.navLink}>
          ← Back to Home
        </a>
      </nav>

      <main style={styles.main}>
        {/* Intro */}
        <header style={styles.header}>
          <h1 style={styles.headline}>Contextual Launch Pads</h1>
          <p style={styles.subhead}>
            Instead of one homepage prompt doing everything, place smaller, context-specific 
            prompt boxes where work actually happens — making each one feel like a 
            <strong> specialized tool</strong>, not a limited assistant.
          </p>
        </header>

        <Divider />

        {/* Task Router Demo */}
        <Card>
          <div style={styles.cardHeader}>
            <span style={styles.cardBadge}>Homepage — Task Router</span>
          </div>
          <TaskRouter />
        </Card>

        {/* Links to In-Context Demos */}
        <InContextDemoNav />

        <Divider />

        {/* How It Works */}
        <Card>
          <h3 style={styles.explainerTitle}>How it works</h3>
          <div style={styles.explainerGrid}>
            <div style={styles.explainerItem}>
              <span style={styles.explainerNumber}>1</span>
              <div>
                <strong>Task Router</strong>
                <p style={styles.explainerText}>
                  Homepage prompt becomes a dispatcher with categorized quick actions
                  that launch focused experiences.
                </p>
              </div>
            </div>
            <div style={styles.explainerItem}>
              <span style={styles.explainerNumber}>2</span>
              <div>
                <strong>In-Context Prompts</strong>
                <p style={styles.explainerText}>
                  Mini-prompts appear where work happens, pre-loaded with relevant context
                  and scoped capabilities.
                </p>
              </div>
            </div>
            <div style={styles.explainerItem}>
              <span style={styles.explainerNumber}>3</span>
              <div>
                <strong>Specialized Tools</strong>
                <p style={styles.explainerText}>
                  Each prompt feels complete and purpose-built rather than a constrained
                  general assistant.
                </p>
              </div>
            </div>
            <div style={styles.explainerItem}>
              <span style={styles.explainerNumber}>4</span>
              <div>
                <strong>Progressive Enhancement</strong>
                <p style={styles.explainerText}>
                  As orchestration matures, the router can handle cross-module requests
                  seamlessly.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <p style={styles.footerNote}>
          Wireframe note: This experiment demonstrates the Contextual Launch Pads pattern.
        </p>
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
    padding: "var(--space-8) var(--space-6)",
  },
  header: {
    textAlign: "center",
  },
  headline: {
    fontSize: "var(--text-3xl)",
    fontWeight: 600,
    color: "var(--color-gray-900)",
    marginBottom: "var(--space-3)",
  },
  subhead: {
    fontSize: "var(--text-base)",
    color: "var(--color-gray-600)",
    maxWidth: "600px",
    margin: "0 auto",
    lineHeight: "1.6",
  },
  cardHeader: {
    marginBottom: "var(--space-4)",
  },
  cardBadge: {
    fontSize: "var(--text-xs)",
    fontWeight: 600,
    color: "var(--color-gray-500)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    background: "var(--color-gray-100)",
    padding: "var(--space-1) var(--space-2)",
    borderRadius: "var(--radius-sm)",
  },
  routerContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--space-5)",
  },
  promptSection: {
    textAlign: "center",
  },
  promptTitle: {
    fontSize: "var(--text-xl)",
    fontWeight: 600,
    color: "var(--color-gray-900)",
    marginBottom: "var(--space-1)",
  },
  promptSubtitle: {
    fontSize: "var(--text-sm)",
    color: "var(--color-gray-500)",
    marginBottom: "var(--space-4)",
  },
  inputRow: {
    display: "flex",
    gap: "var(--space-2)",
    maxWidth: "500px",
    margin: "0 auto",
  },
  routerInput: {
    flex: 1,
    padding: "var(--space-3) var(--space-4)",
    fontSize: "var(--text-base)",
    border: "1px solid var(--color-gray-300)",
    borderRadius: "var(--radius-lg)",
    outline: "none",
  },
  goButton: {
    flexShrink: 0,
    padding: "var(--space-3) var(--space-5)",
  },
  categoryFilters: {
    display: "flex",
    justifyContent: "center",
    gap: "var(--space-2)",
    flexWrap: "wrap",
  },
  categoryChip: {
    padding: "var(--space-1) var(--space-3)",
    fontSize: "var(--text-xs)",
    fontWeight: 500,
    color: "var(--color-gray-600)",
    background: "var(--color-white)",
    border: "1px solid var(--color-gray-200)",
    borderRadius: "var(--radius-xl)",
    cursor: "pointer",
  },
  categoryChipActive: {
    background: "var(--color-gray-800)",
    borderColor: "var(--color-gray-800)",
    color: "var(--color-white)",
  },
  actionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "var(--space-3)",
  },
  actionCard: {
    display: "flex",
    alignItems: "center",
    gap: "var(--space-3)",
    padding: "var(--space-3) var(--space-4)",
    background: "var(--color-gray-50)",
    border: "1px solid var(--color-gray-200)",
    borderRadius: "var(--radius-lg)",
    cursor: "pointer",
    textAlign: "left",
    transition: "all 0.15s ease",
  },
  actionIcon: {
    fontSize: "var(--text-xl)",
    flexShrink: 0,
  },
  actionContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  actionLabel: {
    fontSize: "var(--text-sm)",
    fontWeight: 600,
    color: "var(--color-gray-900)",
  },
  actionDesc: {
    fontSize: "var(--text-xs)",
    color: "var(--color-gray-500)",
  },
  actionArrow: {
    fontSize: "var(--text-base)",
    color: "var(--color-gray-400)",
    flexShrink: 0,
  },
  recentSection: {
    display: "flex",
    alignItems: "center",
    gap: "var(--space-3)",
    flexWrap: "wrap",
    paddingTop: "var(--space-3)",
    borderTop: "1px solid var(--color-gray-200)",
  },
  recentLabel: {
    fontSize: "var(--text-xs)",
    fontWeight: 500,
    color: "var(--color-gray-500)",
  },
  recentRow: {
    display: "flex",
    gap: "var(--space-2)",
    flexWrap: "wrap",
  },
  recentChip: {
    padding: "var(--space-1) var(--space-2)",
    fontSize: "var(--text-xs)",
    color: "var(--color-gray-700)",
    background: "var(--color-white)",
    border: "1px solid var(--color-gray-200)",
    borderRadius: "var(--radius-md)",
    textDecoration: "none",
  },
  demoTitle: {
    fontSize: "var(--text-lg)",
    fontWeight: 600,
    color: "var(--color-gray-900)",
    marginBottom: "var(--space-2)",
  },
  demoDesc: {
    fontSize: "var(--text-sm)",
    color: "var(--color-gray-600)",
    marginBottom: "var(--space-4)",
  },
  demoLinks: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--space-2)",
  },
  demoLink: {
    display: "flex",
    alignItems: "center",
    gap: "var(--space-3)",
    padding: "var(--space-3)",
    background: "var(--color-gray-50)",
    border: "1px solid var(--color-gray-200)",
    borderRadius: "var(--radius-lg)",
    textDecoration: "none",
    color: "inherit",
  },
  demoLinkIcon: {
    fontSize: "var(--text-xl)",
  },
  demoLinkHint: {
    display: "block",
    fontSize: "var(--text-xs)",
    color: "var(--color-gray-500)",
    fontWeight: 400,
  },
  explainerTitle: {
    fontSize: "var(--text-lg)",
    fontWeight: 600,
    color: "var(--color-gray-900)",
    marginBottom: "var(--space-4)",
  },
  explainerGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "var(--space-4)",
  },
  explainerItem: {
    display: "flex",
    gap: "var(--space-3)",
  },
  explainerNumber: {
    width: "28px",
    height: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "var(--text-sm)",
    fontWeight: 600,
    color: "var(--color-gray-600)",
    background: "var(--color-gray-100)",
    borderRadius: "50%",
    flexShrink: 0,
  },
  explainerText: {
    fontSize: "var(--text-sm)",
    color: "var(--color-gray-600)",
    marginTop: "var(--space-1)",
  },
  footerNote: {
    marginTop: "var(--space-10)",
    fontSize: "var(--text-xs)",
    color: "var(--color-gray-400)",
    textAlign: "center",
  },
};
