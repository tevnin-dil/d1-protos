"use client";

/**
 * Do We Have This Data Already?
 * 
 * Explores UX patterns for when users want AI capabilities that depend on 
 * data from other products. Three scenarios:
 * 
 * A) We have the data, but you're not paying for access
 * B) We don't have the data — requires onboarding
 * C) We can infer/preview from public data
 */

import React, { useState } from "react";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

type Scenario = "have_data" | "no_data" | "infer_data";

type EntityPreview = {
  name: string;
  type: string;
  jurisdiction: string;
  status: "verified" | "inferred" | "unknown";
};

// ─────────────────────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────────────────────

const COMPANY = {
  name: "Acme Corp",
  website: "acme.com",
};

const EXISTING_ENTITIES: EntityPreview[] = [
  { name: "Acme Corp", type: "Parent Company", jurisdiction: "Delaware, USA", status: "verified" },
  { name: "Acme Holdings LLC", type: "Holding Company", jurisdiction: "Delaware, USA", status: "verified" },
  { name: "Acme Europe GmbH", type: "Subsidiary", jurisdiction: "Germany", status: "verified" },
  { name: "Acme UK Ltd", type: "Subsidiary", jurisdiction: "United Kingdom", status: "verified" },
  { name: "Acme Asia Pacific Pte", type: "Subsidiary", jurisdiction: "Singapore", status: "verified" },
];

const INFERRED_ENTITIES: EntityPreview[] = [
  { name: "Acme Corp (HQ)", type: "Headquarters", jurisdiction: "San Francisco, CA", status: "inferred" },
  { name: "Acme New York Office", type: "Branch", jurisdiction: "New York, NY", status: "inferred" },
  { name: "Acme London", type: "International Office", jurisdiction: "United Kingdom", status: "inferred" },
  { name: "Acme Singapore", type: "International Office", jurisdiction: "Singapore", status: "inferred" },
];

const SCENARIOS: { id: Scenario; title: string; subtitle: string }[] = [
  {
    id: "have_data",
    title: "Scenario A: Data Available",
    subtitle: "We have your entities data, but you're not currently paying for access",
  },
  {
    id: "no_data",
    title: "Scenario B: No Data Yet",
    subtitle: "We don't have your entities data — onboarding required",
  },
  {
    id: "infer_data",
    title: "Scenario C: Inferred Preview",
    subtitle: "We can preview capabilities using public data from your website",
  },
];

// ─────────────────────────────────────────────────────────────
// Components
// ─────────────────────────────────────────────────────────────

function ScenarioTabs({
  activeScenario,
  onChange,
}: {
  activeScenario: Scenario;
  onChange: (s: Scenario) => void;
}) {
  return (
    <div style={styles.scenarioTabs}>
      {SCENARIOS.map((s) => (
        <button
          key={s.id}
          onClick={() => onChange(s.id)}
          style={{
            ...styles.scenarioTab,
            ...(activeScenario === s.id ? styles.scenarioTabActive : {}),
          }}
        >
          <span style={styles.scenarioTabTitle}>{s.title}</span>
          <span style={styles.scenarioTabSubtitle}>{s.subtitle}</span>
        </button>
      ))}
    </div>
  );
}

function EntityCard({ entity }: { entity: EntityPreview }) {
  return (
    <div style={{
      ...styles.entityCard,
      ...(entity.status === "inferred" ? styles.entityCardInferred : {}),
    }}>
      <div style={styles.entityHeader}>
        <span style={styles.entityName}>{entity.name}</span>
        {entity.status === "verified" && (
          <span style={styles.verifiedBadge}>✓ Verified</span>
        )}
        {entity.status === "inferred" && (
          <span style={styles.inferredBadge}>~ Inferred</span>
        )}
      </div>
      <div style={styles.entityDetails}>
        <span style={styles.entityType}>{entity.type}</span>
        <span style={styles.entityJurisdiction}>{entity.jurisdiction}</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Scenario A: We Have the Data
// ─────────────────────────────────────────────────────────────

function HaveDataScenario() {
  const [showUnlock, setShowUnlock] = useState(false);

  return (
    <div style={styles.scenarioContainer}>
      {/* Context Banner */}
      <div style={styles.contextBanner}>
        <span style={styles.contextIcon}>🔒</span>
        <div style={styles.contextContent}>
          <strong>We already manage {COMPANY.name}'s entity data</strong>
          <p style={styles.contextText}>
            Your organization uses Diligent Entities. This data can power AI capabilities 
            in Boards — you just need access.
          </p>
        </div>
      </div>

      {/* Preview of what we have */}
      <div style={styles.previewSection}>
        <div style={styles.previewHeader}>
          <h3 style={styles.previewTitle}>Your Entity Structure</h3>
          <span style={styles.previewCount}>{EXISTING_ENTITIES.length} entities</span>
        </div>
        <div style={styles.entityGrid}>
          {EXISTING_ENTITIES.slice(0, 3).map((entity, i) => (
            <EntityCard key={i} entity={entity} />
          ))}
          <div style={styles.moreEntitiesCard}>
            <span style={styles.moreEntitiesNumber}>+{EXISTING_ENTITIES.length - 3}</span>
            <span style={styles.moreEntitiesLabel}>more entities</span>
          </div>
        </div>
      </div>

      {/* What you could do */}
      <div style={styles.capabilitiesSection}>
        <h3 style={styles.capabilitiesTitle}>With access, AI can help you:</h3>
        <div style={styles.capabilitiesList}>
          <div style={styles.capabilityItem}>
            <span style={styles.capabilityIcon}>📊</span>
            <div>
              <strong>Generate cross-entity compliance reports</strong>
              <p style={styles.capabilityDesc}>Automatically compile compliance status across all subsidiaries</p>
            </div>
          </div>
          <div style={styles.capabilityItem}>
            <span style={styles.capabilityIcon}>🔗</span>
            <div>
              <strong>Map board member relationships</strong>
              <p style={styles.capabilityDesc}>Visualize director overlaps and identify governance gaps</p>
            </div>
          </div>
          <div style={styles.capabilityItem}>
            <span style={styles.capabilityIcon}>⚠️</span>
            <div>
              <strong>Flag jurisdiction-specific risks</strong>
              <p style={styles.capabilityDesc}>Alert you to regulatory changes affecting your entities</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      {!showUnlock ? (
        <div style={styles.ctaSection}>
          <button style={styles.primaryButton} onClick={() => setShowUnlock(true)}>
            Request Access to Entities Data
          </button>
          <p style={styles.ctaNote}>
            Your admin can grant access, or we can help coordinate.
          </p>
        </div>
      ) : (
        <div style={styles.unlockFlow}>
          <div style={styles.unlockHeader}>
            <span style={styles.unlockIcon}>✉️</span>
            <strong>Request sent to your admin</strong>
          </div>
          <p style={styles.unlockText}>
            We've notified Sarah Johnson (IT Admin) about your request. 
            You'll get access once approved — usually within 24 hours.
          </p>
          <div style={styles.unlockActions}>
            <button style={styles.secondaryButton}>Add a note</button>
            <button style={styles.textButton}>I'll follow up myself</button>
          </div>
        </div>
      )}

      {/* Insight */}
      <div style={styles.insightCard}>
        <span style={styles.insightIcon}>💡</span>
        <div>
          <strong>Why this works:</strong> Users see the value immediately — real data they 
          recognize. The barrier isn't "buy more stuff" but "get permission," which feels 
          more surmountable.
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Scenario B: We Don't Have the Data
// ─────────────────────────────────────────────────────────────

function NoDataScenario() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  return (
    <div style={styles.scenarioContainer}>
      {/* Context Banner */}
      <div style={styles.contextBannerEmpty}>
        <span style={styles.contextIcon}>📭</span>
        <div style={styles.contextContent}>
          <strong>We don't have {COMPANY.name}'s entity data yet</strong>
          <p style={styles.contextText}>
            To use entity-aware AI features, we'll need to onboard your corporate structure. 
            This typically takes 2-3 weeks.
          </p>
        </div>
      </div>

      {/* What's involved */}
      <div style={styles.onboardingOverview}>
        <h3 style={styles.onboardingTitle}>What onboarding looks like</h3>
        <div style={styles.onboardingSteps}>
          <div style={styles.onboardingStep}>
            <span style={styles.stepNumber}>1</span>
            <div>
              <strong>Share your entity list</strong>
              <p style={styles.stepDesc}>Upload a spreadsheet or connect to your existing system</p>
            </div>
          </div>
          <div style={styles.onboardingStep}>
            <span style={styles.stepNumber}>2</span>
            <div>
              <strong>We verify and structure</strong>
              <p style={styles.stepDesc}>Our team validates jurisdictions and relationships</p>
            </div>
          </div>
          <div style={styles.onboardingStep}>
            <span style={styles.stepNumber}>3</span>
            <div>
              <strong>AI features unlock</strong>
              <p style={styles.stepDesc}>Cross-entity reporting, compliance tracking, and more</p>
            </div>
          </div>
        </div>
      </div>

      {/* Preview of capabilities */}
      <div style={styles.previewCapabilities}>
        <h3 style={styles.previewCapTitle}>What you'll be able to do</h3>
        <div style={styles.previewCapGrid}>
          <div style={styles.previewCapCard}>
            <span style={styles.previewCapIcon}>📋</span>
            <span>Entity compliance dashboard</span>
          </div>
          <div style={styles.previewCapCard}>
            <span style={styles.previewCapIcon}>🌍</span>
            <span>Jurisdiction risk alerts</span>
          </div>
          <div style={styles.previewCapCard}>
            <span style={styles.previewCapIcon}>👥</span>
            <span>Director overlap analysis</span>
          </div>
          <div style={styles.previewCapCard}>
            <span style={styles.previewCapIcon}>📊</span>
            <span>Cross-entity reporting</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      {!showOnboarding ? (
        <div style={styles.ctaSection}>
          <button style={styles.primaryButton} onClick={() => setShowOnboarding(true)}>
            Start Onboarding Conversation
          </button>
          <button style={styles.secondaryButton}>
            Try with sample data first
          </button>
        </div>
      ) : (
        <div style={styles.onboardingFlow}>
          <div style={styles.onboardingFlowHeader}>
            <span style={styles.onboardingFlowIcon}>📅</span>
            <strong>Let's get you set up</strong>
          </div>
          <p style={styles.onboardingFlowText}>
            We'll schedule a quick call to understand your entity structure and 
            find the fastest path to getting you live.
          </p>
          <div style={styles.calendarPicker}>
            <div style={styles.calendarSlot}>Tue, Feb 4 at 10:00 AM</div>
            <div style={styles.calendarSlot}>Wed, Feb 5 at 2:00 PM</div>
            <div style={styles.calendarSlot}>Thu, Feb 6 at 11:00 AM</div>
          </div>
        </div>
      )}

      {/* Insight */}
      <div style={styles.insightCard}>
        <span style={styles.insightIcon}>💡</span>
        <div>
          <strong>Why this works:</strong> Honest about the effort required, but makes it 
          feel achievable. "2-3 weeks" is concrete, and showing the value upfront motivates 
          users to start the process.
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Scenario C: We Can Infer from Public Data
// ─────────────────────────────────────────────────────────────

function InferDataScenario() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
    }, 2000);
  };

  return (
    <div style={styles.scenarioContainer}>
      {/* Context Banner */}
      <div style={styles.contextBannerInfer}>
        <span style={styles.contextIcon}>🔍</span>
        <div style={styles.contextContent}>
          <strong>We can preview capabilities using public data</strong>
          <p style={styles.contextText}>
            Based on {COMPANY.website}, we can infer your locations and structure 
            to show you what's possible — no commitment required.
          </p>
        </div>
      </div>

      {!scanComplete ? (
        <>
          {/* Scan prompt */}
          <div style={styles.scanSection}>
            <div style={styles.scanVisual}>
              <div style={styles.websitePreview}>
                <div style={styles.websiteBrowser}>
                  <div style={styles.browserDots}>
                    <span style={styles.browserDot} />
                    <span style={styles.browserDot} />
                    <span style={styles.browserDot} />
                  </div>
                  <span style={styles.browserUrl}>{COMPANY.website}/locations</span>
                </div>
                <div style={styles.websiteContent}>
                  <div style={styles.websiteLine} />
                  <div style={styles.websiteLine} />
                  <div style={styles.websiteLineShort} />
                </div>
              </div>
              {isScanning && (
                <div style={styles.scanOverlay}>
                  <span style={styles.scanningText}>Scanning public pages...</span>
                </div>
              )}
            </div>
            
            {!isScanning && (
              <div style={styles.scanCta}>
                <h3 style={styles.scanTitle}>See a preview based on your website</h3>
                <p style={styles.scanDesc}>
                  We'll look at your public locations page to build a preview of 
                  what entity-aware AI could do for you.
                </p>
                <button style={styles.primaryButton} onClick={handleScan}>
                  Scan {COMPANY.website}
                </button>
                <p style={styles.scanNote}>
                  Read-only scan • No data stored • Takes ~10 seconds
                </p>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Inferred results */}
          <div style={styles.inferredResults}>
            <div style={styles.inferredHeader}>
              <span style={styles.inferredIcon}>✨</span>
              <div>
                <strong>Found {INFERRED_ENTITIES.length} possible locations</strong>
                <p style={styles.inferredSubtext}>
                  Based on {COMPANY.website}/locations and /about pages
                </p>
              </div>
            </div>

            <div style={styles.entityGrid}>
              {INFERRED_ENTITIES.map((entity, i) => (
                <EntityCard key={i} entity={entity} />
              ))}
            </div>

            <div style={styles.inferredDisclaimer}>
              <span style={styles.disclaimerIcon}>ℹ️</span>
              <span>
                This is inferred from public data and may not match your actual 
                corporate structure. Accuracy improves with verified data.
              </span>
            </div>
          </div>

          {/* Preview capability */}
          <div style={styles.previewDemo}>
            <h3 style={styles.previewDemoTitle}>Try a preview prompt</h3>
            <div style={styles.previewPromptBox}>
              <input
                type="text"
                placeholder="Which of our locations has the most compliance requirements?"
                style={styles.previewInput}
                readOnly
              />
              <button style={styles.previewRunButton}>Run Preview</button>
            </div>
            <p style={styles.previewDemoNote}>
              Preview results use inferred data. For production use, onboard your verified entities.
            </p>
          </div>

          {/* CTAs */}
          <div style={styles.inferredCtas}>
            <button style={styles.primaryButton}>
              This looks right — start onboarding
            </button>
            <button style={styles.secondaryButton}>
              Let me correct some of this
            </button>
          </div>
        </>
      )}

      {/* Insight */}
      <div style={styles.insightCard}>
        <span style={styles.insightIcon}>💡</span>
        <div>
          <strong>Why this works:</strong> Zero-friction preview lets users experience 
          value before any commitment. Even rough data makes capabilities concrete. 
          Users who see value are more likely to invest in proper onboarding.
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────

export default function DataAvailabilityPage() {
  const [activeScenario, setActiveScenario] = useState<Scenario>("have_data");

  const renderScenario = () => {
    switch (activeScenario) {
      case "have_data":
        return <HaveDataScenario />;
      case "no_data":
        return <NoDataScenario />;
      case "infer_data":
        return <InferDataScenario />;
    }
  };

  return (
    <div style={styles.pageWrapper}>
      {/* Experiment Navigation */}
      <nav style={styles.experimentNav}>
        <div style={styles.experimentNavInner}>
          <span style={styles.experimentNavLabel}>Experiment</span>
          <span style={styles.experimentNavTitle}>Data Availability</span>
        </div>
        <a href="/" style={styles.experimentNavLink}>
          ← Back to Home
        </a>
      </nav>

      <main style={styles.main}>
        {/* Header */}
        <header style={styles.header}>
          <h1 style={styles.headline}>Do We Have This Data Already?</h1>
          <p style={styles.subhead}>
            When users want AI capabilities that depend on data from other products, 
            different scenarios require different UX approaches.
          </p>
        </header>

        {/* Scenario Selection */}
        <ScenarioTabs activeScenario={activeScenario} onChange={setActiveScenario} />

        {/* Scenario Content */}
        <div style={styles.scenarioContent}>
          {renderScenario()}
        </div>

        {/* Footer */}
        <p style={styles.footerNote}>
          Wireframe note: This experiment explores data availability patterns for cross-product AI.
        </p>
      </main>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  pageWrapper: {
    minHeight: "100vh",
    background: "#FAFAFA",
  },
  
  // Experiment Navigation
  experimentNav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 24px",
    borderBottom: "1px solid #E5E5E5",
    background: "#FFFFFF",
  },
  experimentNavInner: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  experimentNavLabel: {
    fontSize: "11px",
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    color: "#A3A3A3",
  },
  experimentNavTitle: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#171717",
  },
  experimentNavLink: {
    fontSize: "13px",
    color: "#525252",
    textDecoration: "none",
  },
  
  // Main
  main: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "48px 32px",
  },
  
  // Header
  header: {
    textAlign: "center",
    marginBottom: "40px",
  },
  headline: {
    fontSize: "28px",
    fontWeight: 600,
    color: "#171717",
    margin: "0 0 12px 0",
  },
  subhead: {
    fontSize: "16px",
    color: "#525252",
    lineHeight: 1.6,
    maxWidth: "600px",
    margin: "0 auto",
  },
  
  // Scenario Tabs
  scenarioTabs: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginBottom: "32px",
  },
  scenarioTab: {
    padding: "16px 20px",
    background: "#FFFFFF",
    border: "1px solid #E5E5E5",
    borderRadius: "12px",
    textAlign: "left",
    cursor: "pointer",
    transition: "all 0.15s ease",
  },
  scenarioTabActive: {
    borderColor: "#171717",
    boxShadow: "0 0 0 1px #171717",
  },
  scenarioTabTitle: {
    display: "block",
    fontSize: "15px",
    fontWeight: 600,
    color: "#171717",
    marginBottom: "4px",
  },
  scenarioTabSubtitle: {
    display: "block",
    fontSize: "13px",
    color: "#737373",
  },
  
  // Scenario Content
  scenarioContent: {
    marginBottom: "48px",
  },
  scenarioContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  
  // Context Banners
  contextBanner: {
    display: "flex",
    gap: "16px",
    padding: "20px",
    background: "#FEF3C7",
    borderRadius: "12px",
  },
  contextBannerEmpty: {
    display: "flex",
    gap: "16px",
    padding: "20px",
    background: "#F5F5F5",
    borderRadius: "12px",
  },
  contextBannerInfer: {
    display: "flex",
    gap: "16px",
    padding: "20px",
    background: "#EDE9FE",
    borderRadius: "12px",
  },
  contextIcon: {
    fontSize: "24px",
    flexShrink: 0,
  },
  contextContent: {
    flex: 1,
  },
  contextText: {
    margin: "4px 0 0 0",
    fontSize: "14px",
    color: "#525252",
    lineHeight: 1.5,
  },
  
  // Preview Section (Scenario A)
  previewSection: {
    padding: "24px",
    background: "#FFFFFF",
    border: "1px solid #E5E5E5",
    borderRadius: "12px",
  },
  previewHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  previewTitle: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#171717",
    margin: 0,
  },
  previewCount: {
    fontSize: "13px",
    color: "#737373",
  },
  
  // Entity Grid & Cards
  entityGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "12px",
  },
  entityCard: {
    padding: "16px",
    background: "#F9FAFB",
    border: "1px solid #E5E5E5",
    borderRadius: "8px",
  },
  entityCardInferred: {
    background: "#FEFCE8",
    borderColor: "#FEF08A",
    borderStyle: "dashed",
  },
  entityHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },
  entityName: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#171717",
  },
  verifiedBadge: {
    fontSize: "11px",
    fontWeight: 500,
    color: "#059669",
    background: "#D1FAE5",
    padding: "2px 8px",
    borderRadius: "10px",
  },
  inferredBadge: {
    fontSize: "11px",
    fontWeight: 500,
    color: "#D97706",
    background: "#FEF3C7",
    padding: "2px 8px",
    borderRadius: "10px",
  },
  entityDetails: {
    display: "flex",
    gap: "12px",
    fontSize: "12px",
    color: "#737373",
  },
  entityType: {},
  entityJurisdiction: {},
  moreEntitiesCard: {
    padding: "16px",
    background: "#F5F5F5",
    border: "1px dashed #D4D4D4",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  moreEntitiesNumber: {
    fontSize: "24px",
    fontWeight: 600,
    color: "#737373",
  },
  moreEntitiesLabel: {
    fontSize: "12px",
    color: "#A3A3A3",
  },
  
  // Capabilities Section
  capabilitiesSection: {
    padding: "24px",
    background: "#FFFFFF",
    border: "1px solid #E5E5E5",
    borderRadius: "12px",
  },
  capabilitiesTitle: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#171717",
    margin: "0 0 16px 0",
  },
  capabilitiesList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  capabilityItem: {
    display: "flex",
    gap: "12px",
  },
  capabilityIcon: {
    fontSize: "20px",
    flexShrink: 0,
  },
  capabilityDesc: {
    margin: "4px 0 0 0",
    fontSize: "13px",
    color: "#737373",
  },
  
  // CTA Section
  ctaSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
    padding: "24px",
    background: "#FFFFFF",
    border: "1px solid #E5E5E5",
    borderRadius: "12px",
  },
  primaryButton: {
    padding: "12px 24px",
    fontSize: "14px",
    fontWeight: 500,
    color: "#FFFFFF",
    background: "#171717",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  secondaryButton: {
    padding: "12px 24px",
    fontSize: "14px",
    fontWeight: 500,
    color: "#525252",
    background: "#FFFFFF",
    border: "1px solid #E5E5E5",
    borderRadius: "8px",
    cursor: "pointer",
  },
  textButton: {
    padding: "8px 16px",
    fontSize: "14px",
    fontWeight: 500,
    color: "#737373",
    background: "none",
    border: "none",
    cursor: "pointer",
    textDecoration: "underline",
  },
  ctaNote: {
    fontSize: "13px",
    color: "#737373",
    margin: 0,
  },
  
  // Unlock Flow (Scenario A)
  unlockFlow: {
    padding: "24px",
    background: "#F0FDF4",
    border: "1px solid #BBF7D0",
    borderRadius: "12px",
  },
  unlockHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "12px",
  },
  unlockIcon: {
    fontSize: "20px",
  },
  unlockText: {
    fontSize: "14px",
    color: "#166534",
    margin: "0 0 16px 0",
    lineHeight: 1.5,
  },
  unlockActions: {
    display: "flex",
    gap: "12px",
  },
  
  // Onboarding (Scenario B)
  onboardingOverview: {
    padding: "24px",
    background: "#FFFFFF",
    border: "1px solid #E5E5E5",
    borderRadius: "12px",
  },
  onboardingTitle: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#171717",
    margin: "0 0 20px 0",
  },
  onboardingSteps: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  onboardingStep: {
    display: "flex",
    gap: "16px",
  },
  stepNumber: {
    width: "28px",
    height: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    fontWeight: 600,
    color: "#FFFFFF",
    background: "#171717",
    borderRadius: "50%",
    flexShrink: 0,
  },
  stepDesc: {
    margin: "4px 0 0 0",
    fontSize: "13px",
    color: "#737373",
  },
  previewCapabilities: {
    padding: "24px",
    background: "#FFFFFF",
    border: "1px solid #E5E5E5",
    borderRadius: "12px",
  },
  previewCapTitle: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#171717",
    margin: "0 0 16px 0",
  },
  previewCapGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "12px",
  },
  previewCapCard: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px",
    background: "#F9FAFB",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#525252",
  },
  previewCapIcon: {
    fontSize: "20px",
  },
  onboardingFlow: {
    padding: "24px",
    background: "#EFF6FF",
    border: "1px solid #BFDBFE",
    borderRadius: "12px",
  },
  onboardingFlowHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "12px",
  },
  onboardingFlowIcon: {
    fontSize: "20px",
  },
  onboardingFlowText: {
    fontSize: "14px",
    color: "#1E40AF",
    margin: "0 0 16px 0",
    lineHeight: 1.5,
  },
  calendarPicker: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  calendarSlot: {
    padding: "12px 16px",
    background: "#FFFFFF",
    border: "1px solid #BFDBFE",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#1E40AF",
    cursor: "pointer",
  },
  
  // Scan Section (Scenario C)
  scanSection: {
    padding: "32px",
    background: "#FFFFFF",
    border: "1px solid #E5E5E5",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "24px",
  },
  scanVisual: {
    position: "relative",
    width: "280px",
  },
  websitePreview: {
    background: "#F5F5F5",
    borderRadius: "8px",
    overflow: "hidden",
    border: "1px solid #E5E5E5",
  },
  websiteBrowser: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 12px",
    background: "#FFFFFF",
    borderBottom: "1px solid #E5E5E5",
  },
  browserDots: {
    display: "flex",
    gap: "4px",
  },
  browserDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#D4D4D4",
  },
  browserUrl: {
    fontSize: "11px",
    color: "#737373",
  },
  websiteContent: {
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  websiteLine: {
    height: "8px",
    background: "#E5E5E5",
    borderRadius: "4px",
  },
  websiteLineShort: {
    height: "8px",
    width: "60%",
    background: "#E5E5E5",
    borderRadius: "4px",
  },
  scanOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(124, 58, 237, 0.1)",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  scanningText: {
    fontSize: "13px",
    fontWeight: 500,
    color: "#7C3AED",
  },
  scanCta: {
    textAlign: "center",
  },
  scanTitle: {
    fontSize: "18px",
    fontWeight: 600,
    color: "#171717",
    margin: "0 0 8px 0",
  },
  scanDesc: {
    fontSize: "14px",
    color: "#737373",
    margin: "0 0 20px 0",
    maxWidth: "400px",
  },
  scanNote: {
    fontSize: "12px",
    color: "#A3A3A3",
    margin: "12px 0 0 0",
  },
  
  // Inferred Results (Scenario C)
  inferredResults: {
    padding: "24px",
    background: "#FFFFFF",
    border: "1px solid #E5E5E5",
    borderRadius: "12px",
  },
  inferredHeader: {
    display: "flex",
    gap: "12px",
    marginBottom: "20px",
  },
  inferredIcon: {
    fontSize: "24px",
  },
  inferredSubtext: {
    margin: "4px 0 0 0",
    fontSize: "13px",
    color: "#737373",
  },
  inferredDisclaimer: {
    display: "flex",
    alignItems: "flex-start",
    gap: "8px",
    marginTop: "16px",
    padding: "12px",
    background: "#F5F5F5",
    borderRadius: "8px",
    fontSize: "12px",
    color: "#737373",
  },
  disclaimerIcon: {
    flexShrink: 0,
  },
  previewDemo: {
    padding: "24px",
    background: "#FFFFFF",
    border: "1px solid #E5E5E5",
    borderRadius: "12px",
  },
  previewDemoTitle: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#171717",
    margin: "0 0 16px 0",
  },
  previewPromptBox: {
    display: "flex",
    gap: "12px",
  },
  previewInput: {
    flex: 1,
    padding: "12px 16px",
    fontSize: "14px",
    border: "1px solid #E5E5E5",
    borderRadius: "8px",
    color: "#737373",
  },
  previewRunButton: {
    padding: "12px 20px",
    fontSize: "14px",
    fontWeight: 500,
    color: "#FFFFFF",
    background: "#7C3AED",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  previewDemoNote: {
    fontSize: "12px",
    color: "#A3A3A3",
    margin: "12px 0 0 0",
  },
  inferredCtas: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
  },
  
  // Insight Card
  insightCard: {
    display: "flex",
    gap: "12px",
    padding: "16px",
    background: "#FEF3C7",
    borderRadius: "12px",
    fontSize: "14px",
    color: "#92400E",
    lineHeight: 1.5,
  },
  insightIcon: {
    fontSize: "20px",
    flexShrink: 0,
  },
  
  // Footer
  footerNote: {
    marginTop: "48px",
    fontSize: "12px",
    color: "#A3A3A3",
    textAlign: "center",
  },
};
