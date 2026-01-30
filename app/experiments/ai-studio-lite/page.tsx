"use client";

/**
 * AI Studio Lite — Capability Visibility Through Templates
 * 
 * Reframes the prompt box as a template launcher where each template is an 
 * AI-powered workflow, making "limited" feel like "curated" — like Notion AI 
 * or ChatGPT's GPT store.
 */

import React, { useState } from "react";
import { Card } from "../../../wireframe-primitives/Card";
import { Button } from "../../../wireframe-primitives/Button";
import { Divider } from "../../../wireframe-primitives/Divider";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

type ViewMode = "prompt" | "gallery";
type TemplateCategory = "documents" | "compliance" | "analysis" | "meetings";
type TemplateStatus = "available" | "coming_soon" | "beta";

type Template = {
  id: string;
  title: string;
  description: string;
  category: TemplateCategory;
  status: TemplateStatus;
  icon: string;
  estimatedTime: string;
  usageCount: number;
  sampleOutput?: string;
  votes?: number;
};

// ─────────────────────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────────────────────

const CATEGORIES: Record<TemplateCategory, { label: string; icon: string }> = {
  documents: { label: "Documents", icon: "📄" },
  compliance: { label: "Compliance", icon: "✓" },
  analysis: { label: "Analysis", icon: "📊" },
  meetings: { label: "Meetings", icon: "📅" },
};

const TEMPLATES: Template[] = [
  {
    id: "board-report",
    title: "Board Report Generator",
    description: "Generate comprehensive board reports from quarterly data, filings, and meeting notes.",
    category: "documents",
    status: "available",
    icon: "📋",
    estimatedTime: "~30 seconds",
    usageCount: 234,
    sampleOutput: "**Q4 2025 Board Report Summary**\n\nExecutive Overview:\nThis quarter saw strong performance across key metrics...",
  },
  {
    id: "compliance-summary",
    title: "Compliance Summary Writer",
    description: "Transform complex regulatory requirements into clear, actionable summaries.",
    category: "compliance",
    status: "available",
    icon: "📑",
    estimatedTime: "~20 seconds",
    usageCount: 189,
    sampleOutput: "**SOX 404 Compliance Summary**\n\nKey Requirements:\n• Internal control documentation...",
  },
  {
    id: "meeting-minutes",
    title: "Meeting Minutes Draft",
    description: "Create structured meeting minutes from notes, action items, and decisions.",
    category: "meetings",
    status: "available",
    icon: "✍️",
    estimatedTime: "~15 seconds",
    usageCount: 312,
    sampleOutput: "**Board Meeting Minutes - December 15, 2025**\n\nAttendees: 8 directors present...",
  },
  {
    id: "entity-analysis",
    title: "Entity Structure Analysis",
    description: "Analyze corporate structure and identify governance gaps or optimization opportunities.",
    category: "analysis",
    status: "available",
    icon: "🏢",
    estimatedTime: "~45 seconds",
    usageCount: 87,
    sampleOutput: "**Corporate Structure Analysis**\n\nEntity Count: 23 subsidiaries across 8 jurisdictions...",
  },
  {
    id: "risk-assessment",
    title: "Risk Assessment Report",
    description: "Generate comprehensive risk assessments for vendors, entities, or processes.",
    category: "analysis",
    status: "beta",
    icon: "⚠️",
    estimatedTime: "~60 seconds",
    usageCount: 45,
    sampleOutput: "**Vendor Risk Assessment: Acme Services**\n\nOverall Risk Score: Medium (6.2/10)...",
  },
  {
    id: "policy-compare",
    title: "Policy Comparison Tool",
    description: "Compare policies across entities or against regulatory requirements.",
    category: "compliance",
    status: "available",
    icon: "⚖️",
    estimatedTime: "~40 seconds",
    usageCount: 156,
    sampleOutput: "**Policy Comparison Report**\n\nComparing: Data Retention Policy (US vs EU)...",
  },
  {
    id: "audit-prep",
    title: "Audit Preparation Kit",
    description: "Generate checklists, gather documents, and prepare briefings for upcoming audits.",
    category: "compliance",
    status: "coming_soon",
    icon: "🔍",
    estimatedTime: "~2 minutes",
    usageCount: 0,
    votes: 89,
  },
  {
    id: "director-brief",
    title: "Director Briefing Pack",
    description: "Create personalized briefing documents for board members before meetings.",
    category: "meetings",
    status: "coming_soon",
    icon: "📦",
    estimatedTime: "~90 seconds",
    usageCount: 0,
    votes: 127,
  },
  {
    id: "regulatory-tracker",
    title: "Regulatory Change Tracker",
    description: "Monitor and summarize regulatory changes relevant to your organization.",
    category: "compliance",
    status: "coming_soon",
    icon: "📡",
    estimatedTime: "Continuous",
    usageCount: 0,
    votes: 203,
  },
];

// ─────────────────────────────────────────────────────────────
// Components
// ─────────────────────────────────────────────────────────────

function ViewToggle({ mode, onChange }: { mode: ViewMode; onChange: (m: ViewMode) => void }) {
  return (
    <div style={styles.viewToggle}>
      <button
        onClick={() => onChange("prompt")}
        style={{
          ...styles.toggleButton,
          ...(mode === "prompt" ? styles.toggleButtonActive : {}),
        }}
      >
        ✏️ Prompt
      </button>
      <button
        onClick={() => onChange("gallery")}
        style={{
          ...styles.toggleButton,
          ...(mode === "gallery" ? styles.toggleButtonActive : {}),
        }}
      >
        🎨 Gallery
      </button>
    </div>
  );
}

function PromptMode({ 
  onTemplateMatch 
}: { 
  onTemplateMatch: (template: Template | null) => void 
}) {
  const [value, setValue] = useState("");
  const [matchedTemplate, setMatchedTemplate] = useState<Template | null>(null);

  const handleChange = (input: string) => {
    setValue(input);
    
    // Simple keyword matching for demo
    const lower = input.toLowerCase();
    let match: Template | null = null;
    
    if (lower.includes("board") && lower.includes("report")) {
      match = TEMPLATES.find(t => t.id === "board-report") || null;
    } else if (lower.includes("compliance") || lower.includes("summary")) {
      match = TEMPLATES.find(t => t.id === "compliance-summary") || null;
    } else if (lower.includes("meeting") || lower.includes("minutes")) {
      match = TEMPLATES.find(t => t.id === "meeting-minutes") || null;
    } else if (lower.includes("entity") || lower.includes("structure")) {
      match = TEMPLATES.find(t => t.id === "entity-analysis") || null;
    } else if (lower.includes("risk")) {
      match = TEMPLATES.find(t => t.id === "risk-assessment") || null;
    } else if (lower.includes("policy") || lower.includes("compare")) {
      match = TEMPLATES.find(t => t.id === "policy-compare") || null;
    }
    
    setMatchedTemplate(match);
    onTemplateMatch(match);
  };

  return (
    <div style={styles.promptModeContainer}>
      <div style={styles.promptInputWrapper}>
        <input
          type="text"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Describe what you want to create..."
          style={styles.promptInput}
        />
        <Button data-variant="primary" style={styles.runButton}>
          {matchedTemplate ? `Use ${matchedTemplate.title}` : "Run"}
        </Button>
      </div>
      
      {matchedTemplate && (
        <div style={styles.matchedTemplate}>
          <span style={styles.matchIcon}>✨</span>
          <div style={styles.matchContent}>
            <span style={styles.matchLabel}>Matched template:</span>
            <a 
              href={`/experiments/ai-studio-lite/template?id=${matchedTemplate.id}`}
              style={styles.matchLink}
            >
              {matchedTemplate.icon} {matchedTemplate.title}
            </a>
          </div>
          <span style={styles.matchTime}>{matchedTemplate.estimatedTime}</span>
        </div>
      )}

      <div style={styles.promptHints}>
        <span style={styles.hintsLabel}>Try:</span>
        <button onClick={() => handleChange("Generate a board report")} style={styles.hintChip}>
          "Generate a board report"
        </button>
        <button onClick={() => handleChange("Summarize compliance requirements")} style={styles.hintChip}>
          "Summarize compliance requirements"
        </button>
        <button onClick={() => handleChange("Draft meeting minutes")} style={styles.hintChip}>
          "Draft meeting minutes"
        </button>
      </div>
    </div>
  );
}

function GalleryMode({ 
  selectedCategory, 
  onCategoryChange 
}: { 
  selectedCategory: TemplateCategory | null;
  onCategoryChange: (cat: TemplateCategory | null) => void;
}) {
  const filteredTemplates = selectedCategory
    ? TEMPLATES.filter(t => t.category === selectedCategory)
    : TEMPLATES;

  const availableTemplates = filteredTemplates.filter(t => t.status !== "coming_soon");
  const comingSoonTemplates = filteredTemplates.filter(t => t.status === "coming_soon");

  return (
    <div style={styles.galleryContainer}>
      {/* Category Filters */}
      <div style={styles.categoryFilters}>
        <button
          onClick={() => onCategoryChange(null)}
          style={{
            ...styles.categoryChip,
            ...(selectedCategory === null ? styles.categoryChipActive : {}),
          }}
        >
          All Templates
        </button>
        {(Object.keys(CATEGORIES) as TemplateCategory[]).map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            style={{
              ...styles.categoryChip,
              ...(selectedCategory === cat ? styles.categoryChipActive : {}),
            }}
          >
            {CATEGORIES[cat].icon} {CATEGORIES[cat].label}
          </button>
        ))}
      </div>

      {/* Available Templates */}
      <div style={styles.templateGrid}>
        {availableTemplates.map((template) => (
          <a
            key={template.id}
            href={`/experiments/ai-studio-lite/template?id=${template.id}`}
            style={styles.templateCard}
          >
            <div style={styles.templateHeader}>
              <span style={styles.templateIcon}>{template.icon}</span>
              {template.status === "beta" && (
                <span style={styles.betaBadge}>Beta</span>
              )}
            </div>
            <h3 style={styles.templateTitle}>{template.title}</h3>
            <p style={styles.templateDesc}>{template.description}</p>
            <div style={styles.templateFooter}>
              <span style={styles.templateTime}>⏱ {template.estimatedTime}</span>
              <span style={styles.templateUsage}>{template.usageCount} uses</span>
            </div>
            {template.sampleOutput && (
              <div style={styles.samplePreview}>
                <span style={styles.previewLabel}>Preview</span>
                <p style={styles.previewText}>
                  {template.sampleOutput.substring(0, 80)}...
                </p>
              </div>
            )}
          </a>
        ))}
      </div>

      {/* Coming Soon */}
      {comingSoonTemplates.length > 0 && (
        <>
          <h3 style={styles.sectionHeader}>Coming Soon</h3>
          <div style={styles.templateGrid}>
            {comingSoonTemplates.map((template) => (
              <div key={template.id} style={styles.comingSoonCard}>
                <div style={styles.templateHeader}>
                  <span style={styles.templateIconMuted}>{template.icon}</span>
                  <span style={styles.comingSoonBadge}>Coming Soon</span>
                </div>
                <h3 style={styles.templateTitleMuted}>{template.title}</h3>
                <p style={styles.templateDescMuted}>{template.description}</p>
                <div style={styles.voteSection}>
                  <span style={styles.voteCount}>👍 {template.votes} votes</span>
                  <button style={styles.voteButton}>Vote for this</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function RequestTemplateForm({ onClose }: { onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={styles.requestSuccess}>
        <span style={styles.successIcon}>✅</span>
        <h3 style={styles.successTitle}>Request Submitted!</h3>
        <p style={styles.successText}>
          Thanks for your input! We review all requests and prioritize based on demand.
        </p>
        <Button onClick={onClose}>Close</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={styles.requestForm}>
      <h3 style={styles.formTitle}>Request a Template</h3>
      <p style={styles.formSubtitle}>
        Help us build what you need. Describe the AI workflow you'd like to see.
      </p>
      
      <div style={styles.formField}>
        <label style={styles.formLabel}>Template Name</label>
        <input
          type="text"
          placeholder="e.g., Quarterly Risk Summary"
          style={styles.formInput}
          required
        />
      </div>
      
      <div style={styles.formField}>
        <label style={styles.formLabel}>What should it do?</label>
        <textarea
          placeholder="Describe the inputs, outputs, and use case..."
          style={styles.formTextarea}
          rows={4}
          required
        />
      </div>
      
      <div style={styles.formField}>
        <label style={styles.formLabel}>Category</label>
        <select style={styles.formSelect} required>
          <option value="">Select a category</option>
          {(Object.keys(CATEGORIES) as TemplateCategory[]).map((cat) => (
            <option key={cat} value={cat}>
              {CATEGORIES[cat].label}
            </option>
          ))}
          <option value="other">Other</option>
        </select>
      </div>
      
      <div style={styles.formActions}>
        <Button type="button" onClick={onClose}>Cancel</Button>
        <Button type="submit" data-variant="primary">Submit Request</Button>
      </div>
    </form>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────

export default function AIStudioLitePage() {
  const [viewMode, setViewMode] = useState<ViewMode>("gallery");
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | null>(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [, setMatchedTemplate] = useState<Template | null>(null);

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-gray-100)" }}>
      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navInner}>
          <span style={styles.navLabel}>Experiment</span>
          <span style={styles.navTitle}>AI Studio Lite</span>
        </div>
        <a href="/" style={styles.navLink}>
          ← Back to Home
        </a>
      </nav>

      <main style={styles.main}>
        {/* Header */}
        <header style={styles.header}>
          <h1 style={styles.headline}>AI Studio</h1>
          <p style={styles.subhead}>
            Curated AI templates for governance, compliance, and board management. 
            Each template is a purpose-built workflow — select one to get started.
          </p>
        </header>

        {/* View Toggle + Request Button */}
        <div style={styles.controlBar}>
          <ViewToggle mode={viewMode} onChange={setViewMode} />
          <Button onClick={() => setShowRequestForm(true)}>
            + Request Template
          </Button>
        </div>

        <Divider />

        {/* Main Content */}
        <Card>
          {viewMode === "prompt" ? (
            <PromptMode onTemplateMatch={setMatchedTemplate} />
          ) : (
            <GalleryMode 
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          )}
        </Card>

        {/* Request Form Modal */}
        {showRequestForm && (
          <div style={styles.modalOverlay} onClick={() => setShowRequestForm(false)}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <RequestTemplateForm onClose={() => setShowRequestForm(false)} />
            </div>
          </div>
        )}

        <Divider />

        {/* How It Works */}
        <Card>
          <h3 style={styles.explainerTitle}>How it works</h3>
          <div style={styles.explainerGrid}>
            <div style={styles.explainerItem}>
              <span style={styles.explainerNumber}>1</span>
              <div>
                <strong>Browse or Search</strong>
                <p style={styles.explainerText}>
                  Use Gallery mode to explore templates, or type naturally in Prompt mode 
                  to find matching workflows.
                </p>
              </div>
            </div>
            <div style={styles.explainerItem}>
              <span style={styles.explainerNumber}>2</span>
              <div>
                <strong>Curated Templates</strong>
                <p style={styles.explainerText}>
                  Each template is a tested, purpose-built workflow — not a generic prompt.
                  "Limited" becomes "specialized."
                </p>
              </div>
            </div>
            <div style={styles.explainerItem}>
              <span style={styles.explainerNumber}>3</span>
              <div>
                <strong>Coming Soon</strong>
                <p style={styles.explainerText}>
                  Vote on upcoming templates. Your feedback directly shapes the roadmap.
                </p>
              </div>
            </div>
            <div style={styles.explainerItem}>
              <span style={styles.explainerNumber}>4</span>
              <div>
                <strong>Request New</strong>
                <p style={styles.explainerText}>
                  Can't find what you need? Submit a request — it's a product insight goldmine.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <p style={styles.footerNote}>
          Wireframe note: This experiment demonstrates the AI Studio Lite pattern.
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
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "var(--space-8) var(--space-6)",
  },
  header: {
    textAlign: "center",
    marginBottom: "var(--space-6)",
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
  controlBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "var(--space-4)",
  },
  viewToggle: {
    display: "flex",
    gap: "var(--space-1)",
    padding: "var(--space-1)",
    background: "var(--color-gray-200)",
    borderRadius: "var(--radius-lg)",
  },
  toggleButton: {
    padding: "var(--space-2) var(--space-4)",
    fontSize: "var(--text-sm)",
    fontWeight: 500,
    color: "var(--color-gray-600)",
    background: "transparent",
    border: "none",
    borderRadius: "var(--radius-md)",
    cursor: "pointer",
  },
  toggleButtonActive: {
    background: "var(--color-white)",
    color: "var(--color-gray-900)",
    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
  },
  promptModeContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--space-4)",
    padding: "var(--space-4) 0",
  },
  promptInputWrapper: {
    display: "flex",
    gap: "var(--space-2)",
  },
  promptInput: {
    flex: 1,
    padding: "var(--space-4)",
    fontSize: "var(--text-lg)",
    border: "2px solid var(--color-gray-300)",
    borderRadius: "var(--radius-lg)",
    outline: "none",
  },
  runButton: {
    padding: "var(--space-4) var(--space-6)",
    fontSize: "var(--text-base)",
  },
  matchedTemplate: {
    display: "flex",
    alignItems: "center",
    gap: "var(--space-3)",
    padding: "var(--space-3) var(--space-4)",
    background: "var(--color-gray-50)",
    border: "1px solid var(--color-gray-200)",
    borderRadius: "var(--radius-lg)",
  },
  matchIcon: {
    fontSize: "var(--text-xl)",
  },
  matchContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  matchLabel: {
    fontSize: "var(--text-xs)",
    color: "var(--color-gray-500)",
  },
  matchLink: {
    fontSize: "var(--text-sm)",
    fontWeight: 600,
    color: "var(--color-gray-800)",
    textDecoration: "none",
  },
  matchTime: {
    fontSize: "var(--text-xs)",
    color: "var(--color-gray-500)",
  },
  promptHints: {
    display: "flex",
    alignItems: "center",
    gap: "var(--space-2)",
    flexWrap: "wrap",
  },
  hintsLabel: {
    fontSize: "var(--text-xs)",
    fontWeight: 500,
    color: "var(--color-gray-500)",
  },
  hintChip: {
    padding: "var(--space-1) var(--space-2)",
    fontSize: "var(--text-xs)",
    color: "var(--color-gray-600)",
    background: "var(--color-white)",
    border: "1px solid var(--color-gray-200)",
    borderRadius: "var(--radius-lg)",
    cursor: "pointer",
  },
  galleryContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--space-5)",
  },
  categoryFilters: {
    display: "flex",
    gap: "var(--space-2)",
    flexWrap: "wrap",
  },
  categoryChip: {
    padding: "var(--space-2) var(--space-3)",
    fontSize: "var(--text-sm)",
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
  templateGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "var(--space-4)",
  },
  templateCard: {
    display: "flex",
    flexDirection: "column",
    padding: "var(--space-4)",
    background: "var(--color-white)",
    border: "1px solid var(--color-gray-200)",
    borderRadius: "var(--radius-lg)",
    textDecoration: "none",
    color: "inherit",
    transition: "all 0.15s ease",
    cursor: "pointer",
  },
  templateHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "var(--space-3)",
  },
  templateIcon: {
    fontSize: "32px",
  },
  templateIconMuted: {
    fontSize: "32px",
    opacity: 0.5,
  },
  betaBadge: {
    padding: "2px 8px",
    fontSize: "10px",
    fontWeight: 600,
    color: "var(--color-gray-600)",
    background: "var(--color-gray-200)",
    borderRadius: "var(--radius-sm)",
    textTransform: "uppercase",
  },
  templateTitle: {
    fontSize: "var(--text-base)",
    fontWeight: 600,
    color: "var(--color-gray-900)",
    marginBottom: "var(--space-2)",
  },
  templateTitleMuted: {
    fontSize: "var(--text-base)",
    fontWeight: 600,
    color: "var(--color-gray-500)",
    marginBottom: "var(--space-2)",
  },
  templateDesc: {
    fontSize: "var(--text-sm)",
    color: "var(--color-gray-600)",
    lineHeight: 1.5,
    marginBottom: "var(--space-3)",
    flex: 1,
  },
  templateDescMuted: {
    fontSize: "var(--text-sm)",
    color: "var(--color-gray-400)",
    lineHeight: 1.5,
    marginBottom: "var(--space-3)",
    flex: 1,
  },
  templateFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "var(--space-3)",
    borderTop: "1px solid var(--color-gray-100)",
  },
  templateTime: {
    fontSize: "var(--text-xs)",
    color: "var(--color-gray-500)",
  },
  templateUsage: {
    fontSize: "var(--text-xs)",
    color: "var(--color-gray-400)",
  },
  samplePreview: {
    marginTop: "var(--space-3)",
    padding: "var(--space-2)",
    background: "var(--color-gray-50)",
    borderRadius: "var(--radius-md)",
  },
  previewLabel: {
    fontSize: "10px",
    fontWeight: 600,
    color: "var(--color-gray-400)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  previewText: {
    fontSize: "var(--text-xs)",
    color: "var(--color-gray-500)",
    fontFamily: "var(--font-mono)",
    marginTop: "var(--space-1)",
    lineHeight: 1.4,
  },
  sectionHeader: {
    fontSize: "var(--text-sm)",
    fontWeight: 600,
    color: "var(--color-gray-500)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  comingSoonCard: {
    display: "flex",
    flexDirection: "column",
    padding: "var(--space-4)",
    background: "var(--color-gray-50)",
    border: "1px dashed var(--color-gray-300)",
    borderRadius: "var(--radius-lg)",
    opacity: 0.8,
  },
  comingSoonBadge: {
    padding: "2px 8px",
    fontSize: "10px",
    fontWeight: 600,
    color: "var(--color-gray-500)",
    background: "var(--color-gray-200)",
    borderRadius: "var(--radius-sm)",
    textTransform: "uppercase",
  },
  voteSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "var(--space-3)",
    borderTop: "1px solid var(--color-gray-200)",
  },
  voteCount: {
    fontSize: "var(--text-xs)",
    color: "var(--color-gray-500)",
  },
  voteButton: {
    padding: "var(--space-1) var(--space-2)",
    fontSize: "var(--text-xs)",
    fontWeight: 500,
    color: "var(--color-gray-700)",
    background: "var(--color-white)",
    border: "1px solid var(--color-gray-300)",
    borderRadius: "var(--radius-md)",
    cursor: "pointer",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modalContent: {
    background: "var(--color-white)",
    borderRadius: "var(--radius-xl)",
    padding: "var(--space-6)",
    maxWidth: "500px",
    width: "90%",
    maxHeight: "90vh",
    overflow: "auto",
  },
  requestForm: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--space-4)",
  },
  formTitle: {
    fontSize: "var(--text-xl)",
    fontWeight: 600,
    color: "var(--color-gray-900)",
  },
  formSubtitle: {
    fontSize: "var(--text-sm)",
    color: "var(--color-gray-600)",
  },
  formField: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--space-1)",
  },
  formLabel: {
    fontSize: "var(--text-sm)",
    fontWeight: 500,
    color: "var(--color-gray-700)",
  },
  formInput: {
    padding: "var(--space-3)",
    fontSize: "var(--text-base)",
    border: "1px solid var(--color-gray-300)",
    borderRadius: "var(--radius-md)",
    outline: "none",
  },
  formTextarea: {
    padding: "var(--space-3)",
    fontSize: "var(--text-base)",
    border: "1px solid var(--color-gray-300)",
    borderRadius: "var(--radius-md)",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
  },
  formSelect: {
    padding: "var(--space-3)",
    fontSize: "var(--text-base)",
    border: "1px solid var(--color-gray-300)",
    borderRadius: "var(--radius-md)",
    outline: "none",
    background: "var(--color-white)",
  },
  formActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "var(--space-2)",
    marginTop: "var(--space-2)",
  },
  requestSuccess: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "var(--space-3)",
    textAlign: "center",
    padding: "var(--space-4)",
  },
  successIcon: {
    fontSize: "48px",
  },
  successTitle: {
    fontSize: "var(--text-xl)",
    fontWeight: 600,
    color: "var(--color-gray-900)",
  },
  successText: {
    fontSize: "var(--text-sm)",
    color: "var(--color-gray-600)",
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
