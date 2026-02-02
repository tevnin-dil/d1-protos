"use client";

/**
 * Cross-Product Access Without Commercial Friction
 * 
 * Explores UX patterns that let users discover and use AI features across
 * the Diligent product suite without being blocked by commercial boundaries.
 * 
 * Key concepts:
 * - Unified credit pools across products
 * - Try-before-you-buy experiences
 * - Graceful degradation when limits are reached
 * - Transparent usage tracking
 * - Cross-product discovery without paywalls
 */

import React, { useState } from "react";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

type AccessModel = "unified_pool" | "trial_first" | "graceful_limits" | "discovery_mode";

type Product = {
  id: string;
  name: string;
  icon: string;
  hasAccess: boolean;
  creditsUsed: number;
  creditsIncluded: number;
};

type CreditTier = {
  name: string;
  monthlyCredits: number;
  icon: string;
  isCurrentUser: boolean;
};

// ─────────────────────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────────────────────

const PRODUCTS: Product[] = [
  { id: "boards", name: "Boards", icon: "📋", hasAccess: true, creditsUsed: 1200, creditsIncluded: 2000 },
  { id: "entities", name: "Entities", icon: "🏢", hasAccess: true, creditsUsed: 800, creditsIncluded: 1500 },
  { id: "compliance", name: "Compliance", icon: "✓", hasAccess: false, creditsUsed: 0, creditsIncluded: 0 },
  { id: "audit", name: "Audit", icon: "🔍", hasAccess: false, creditsUsed: 0, creditsIncluded: 0 },
];

const CREDIT_TIERS: CreditTier[] = [
  { name: "Full seats", monthlyCredits: 4250, icon: "⚙️", isCurrentUser: true },
  { name: "All other seats", monthlyCredits: 500, icon: "👥", isCurrentUser: false },
];

const USER_CREDITS = {
  total: 4250,
  used: 222,
  remaining: 4028,
};

const ACCESS_MODELS: { id: AccessModel; title: string; description: string }[] = [
  {
    id: "unified_pool",
    title: "Unified Credit Pool",
    description: "One credit balance works across all Diligent products — use AI wherever you need it.",
  },
  {
    id: "trial_first",
    title: "Try Before Limits",
    description: "Experience AI features fully before any limits apply. Value first, commercial later.",
  },
  {
    id: "graceful_limits",
    title: "Graceful Degradation",
    description: "When credits run low, features degrade gracefully instead of hard blocking.",
  },
  {
    id: "discovery_mode",
    title: "Discovery Mode",
    description: "Explore AI capabilities in products you don't own — see what's possible without buying.",
  },
];

// ─────────────────────────────────────────────────────────────
// Components
// ─────────────────────────────────────────────────────────────

type CreditLevel = "high" | "low" | "zero";

function AccessModelTabs({
  activeModel,
  onChange,
}: {
  activeModel: AccessModel;
  onChange: (model: AccessModel) => void;
}) {
  return (
    <div style={styles.tabsContainer}>
      {ACCESS_MODELS.map((model) => (
        <button
          key={model.id}
          onClick={() => onChange(model.id)}
          style={{
            ...styles.tab,
            ...(activeModel === model.id ? styles.tabActive : {}),
          }}
        >
          {model.title}
        </button>
      ))}
    </div>
  );
}

function CreditLevelToggle({
  creditLevel,
  onChange,
}: {
  creditLevel: CreditLevel;
  onChange: (level: CreditLevel) => void;
}) {
  return (
    <div style={styles.globalCreditToggle}>
      <span style={styles.globalCreditLabel}>Demo Credit Level:</span>
      <div style={styles.globalCreditButtons}>
        {(["high", "low", "zero"] as const).map((level) => (
          <button
            key={level}
            onClick={() => onChange(level)}
            style={{
              ...styles.globalCreditButton,
              ...(creditLevel === level ? styles.globalCreditButtonActive : {}),
              ...(level === "high" ? styles.creditButtonHigh : {}),
              ...(level === "low" ? styles.creditButtonLow : {}),
              ...(level === "zero" ? styles.creditButtonZero : {}),
              ...(creditLevel === level && level === "high" ? styles.creditButtonHighActive : {}),
              ...(creditLevel === level && level === "low" ? styles.creditButtonLowActive : {}),
              ...(creditLevel === level && level === "zero" ? styles.creditButtonZeroActive : {}),
            }}
          >
            {level === "high" ? "Plenty (3,800)" : level === "low" ? "Running Low (150)" : "Depleted (0)"}
          </button>
        ))}
      </div>
    </div>
  );
}

function ModelDescription({ model }: { model: AccessModel }) {
  const info = ACCESS_MODELS.find((m) => m.id === model);
  if (!info) return null;

  return (
    <div style={styles.modelDescription}>
      <h2 style={styles.modelTitle}>{info.title}</h2>
      <p style={styles.modelSubtitle}>{info.description}</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Model 1: Unified Credit Pool
// ─────────────────────────────────────────────────────────────

function UnifiedPoolDemo({ creditLevel }: { creditLevel: CreditLevel }) {
  const getCredits = () => {
    switch (creditLevel) {
      case "high": return { total: 4250, used: 450, remaining: 3800 };
      case "low": return { total: 4250, used: 4100, remaining: 150 };
      case "zero": return { total: 4250, used: 4250, remaining: 0 };
    }
  };

  const credits = getCredits();

  return (
    <div style={styles.demoContainer}>
      {/* Credit Balance Card */}
      <div style={{
        ...styles.creditCard,
        ...(creditLevel === "zero" ? styles.creditCardDepleted : {}),
      }}>
        <div style={styles.creditCardHeader}>
          <span style={styles.creditCardLabel}>AI Credits</span>
          <span style={{
            ...styles.creditCardBadge,
            ...(creditLevel === "low" ? styles.creditCardBadgeYellow : {}),
            ...(creditLevel === "zero" ? styles.creditCardBadgeRed : {}),
          }}>
            {creditLevel === "high" ? "Unified Pool" : creditLevel === "low" ? "Running Low" : "Depleted"}
          </span>
        </div>
        <div style={styles.creditBalance}>
          <span style={styles.creditNumber}>{credits.remaining.toLocaleString()}</span>
          <span style={styles.creditLabel}>credits remaining</span>
        </div>
        <div style={styles.creditProgressContainer}>
          <div style={styles.creditProgressBg}>
            <div
              style={{
                ...styles.creditProgressFill,
                ...(creditLevel === "low" ? styles.creditProgressFillYellow : {}),
                ...(creditLevel === "zero" ? styles.creditProgressFillRed : {}),
                width: `${(credits.used / credits.total) * 100}%`,
              }}
            />
          </div>
          <div style={styles.creditProgressLabels}>
            <span>{credits.used.toLocaleString()} used</span>
            <span>{credits.total.toLocaleString()} / month</span>
          </div>
        </div>
        {creditLevel === "zero" && (
          <div style={styles.creditRefreshNote}>
            Credits refresh Feb 1 — 3 days away
          </div>
        )}
      </div>

      {/* Product Grid */}
      <div style={styles.sectionHeader}>
        <h3 style={styles.sectionTitle}>Use credits in any product</h3>
        <p style={styles.sectionSubtitle}>
          {creditLevel === "zero" 
            ? "AI generation paused across products until credits refresh"
            : "Your credits work everywhere — no per-product limits"}
        </p>
      </div>

      <div style={styles.productGrid}>
        {PRODUCTS.map((product) => (
          <div
            key={product.id}
            style={{
              ...styles.productCard,
              ...(product.hasAccess ? {} : styles.productCardLocked),
              ...(creditLevel === "zero" && product.hasAccess ? styles.productCardPaused : {}),
            }}
          >
            <span style={styles.productIcon}>{product.icon}</span>
            <span style={styles.productName}>{product.name}</span>
            {product.hasAccess ? (
              <span style={{
                ...styles.productCredits,
                ...(creditLevel === "zero" ? styles.productCreditsPaused : {}),
              }}>
                {creditLevel === "zero" ? "Paused" : product.creditsUsed > 0 ? `${product.creditsUsed} used` : "Ready"}
              </span>
            ) : (
              <span style={styles.productLocked}>No seat</span>
            )}
            {product.hasAccess && (
              <div style={styles.productUsageBar}>
                <div
                  style={{
                    ...styles.productUsageFill,
                    width: `${(product.creditsUsed / USER_CREDITS.total) * 100}%`,
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Key Insight */}
      <div style={styles.insightCard}>
        <span style={styles.insightIcon}>💡</span>
        <div>
          <strong>Why this works:</strong> Users think in terms of "AI budget" not 
          "per-product allocation." A unified pool removes friction and encourages 
          exploration across the platform.
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Model 2: Trial First
// ─────────────────────────────────────────────────────────────

function TrialFirstDemo({ creditLevel }: { creditLevel: CreditLevel }) {
  // Map credit level to trial phase
  const trialPhase = creditLevel === "high" ? "active" : creditLevel === "low" ? "ending" : "ended";

  return (
    <div style={styles.demoContainer}>
      {/* Trial Status */}
      <div style={styles.trialCard}>
        <div style={styles.trialHeader}>
          <span style={{
            ...styles.trialBadge,
            ...(trialPhase === "ending" ? styles.trialBadgeEnding : {}),
            ...(trialPhase === "ended" ? styles.trialBadgeEnded : {}),
          }}>
            {trialPhase === "active" ? "✨ Unlimited AI Trial" : 
             trialPhase === "ending" ? "⏳ Trial Ending Soon" : "✓ Trial Completed"}
          </span>
        </div>
        
        {trialPhase === "active" && (
          <>
            <h3 style={styles.trialTitle}>Experience AI without limits</h3>
            <p style={styles.trialSubtitle}>
              For your first 30 days, use AI features freely across all products. 
              No credit limits, no feature restrictions.
            </p>
            <div style={styles.trialFeatures}>
              <div style={styles.trialFeature}>
                <span style={styles.checkIcon}>✓</span>
                <span>Unlimited AI generations</span>
              </div>
              <div style={styles.trialFeature}>
                <span style={styles.checkIcon}>✓</span>
                <span>All AI features unlocked</span>
              </div>
              <div style={styles.trialFeature}>
                <span style={styles.checkIcon}>✓</span>
                <span>Cross-product access</span>
              </div>
            </div>
            <div style={styles.trialProgress}>
              <span>22 days remaining</span>
              <div style={styles.trialProgressBar}>
                <div style={{ ...styles.trialProgressFill, width: "27%" }} />
              </div>
            </div>
          </>
        )}

        {trialPhase === "ending" && (
          <>
            <h3 style={styles.trialTitle}>Your trial ends in 3 days</h3>
            <p style={styles.trialSubtitle}>
              You've generated 47 AI outputs. After the trial, you'll have 4,250 
              credits/month — plenty for typical usage.
            </p>
            <div style={styles.usageSummary}>
              <div style={styles.usageStat}>
                <span style={styles.usageNumber}>47</span>
                <span style={styles.usageLabel}>AI outputs created</span>
              </div>
              <div style={styles.usageStat}>
                <span style={styles.usageNumber}>~180</span>
                <span style={styles.usageLabel}>Est. credits used</span>
              </div>
            </div>
            <button style={styles.continueButton}>
              Continue with 4,250 credits/mo →
            </button>
          </>
        )}

        {trialPhase === "ended" && (
          <>
            <h3 style={styles.trialTitle}>Welcome to your AI allowance</h3>
            <p style={styles.trialSubtitle}>
              Based on your trial usage, your monthly credits will easily cover 
              your needs. You're set up for success.
            </p>
            <div style={styles.creditCompare}>
              <div style={styles.creditCompareItem}>
                <span style={styles.creditCompareLabel}>Your trial usage</span>
                <span style={styles.creditCompareValue}>~180 credits</span>
              </div>
              <div style={styles.creditCompareItem}>
                <span style={styles.creditCompareLabel}>Your monthly allowance</span>
                <span style={styles.creditCompareValue}>4,250 credits</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Key Insight */}
      <div style={styles.insightCard}>
        <span style={styles.insightIcon}>💡</span>
        <div>
          <strong>Why this works:</strong> Users experience the full value of AI before 
          encountering any limits. By the time limits apply, they understand the value 
          and their actual usage patterns.
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Model 3: Graceful Degradation
// ─────────────────────────────────────────────────────────────

function GracefulLimitsDemo({ creditLevel }: { creditLevel: CreditLevel }) {
  const getCreditsRemaining = () => {
    switch (creditLevel) {
      case "high": return 3800;
      case "low": return 150;
      case "zero": return 0;
    }
  };

  return (
    <div style={styles.demoContainer}>
      {/* Current Credit Status */}
      <div style={styles.creditStatusBar}>
        <div style={styles.creditStatusLeft}>
          <span style={styles.creditStatusNumber}>{getCreditsRemaining().toLocaleString()}</span>
          <span style={styles.creditStatusLabel}>credits left</span>
        </div>
        <div style={styles.creditStatusRight}>
          {creditLevel === "high" && <span style={styles.statusBadgeGreen}>Plenty of credits</span>}
          {creditLevel === "low" && <span style={styles.statusBadgeYellow}>Running low</span>}
          {creditLevel === "zero" && <span style={styles.statusBadgeRed}>Credits depleted</span>}
        </div>
      </div>

      {/* Feature Cards showing degradation */}
      <div style={styles.featureList}>
        {/* Full AI Generation */}
        <div style={styles.featureCard}>
          <div style={styles.featureHeader}>
            <span style={styles.featureIcon}>✨</span>
            <span style={styles.featureName}>AI Document Generation</span>
            {creditLevel === "zero" ? (
              <span style={styles.featureBadgeDisabled}>Paused</span>
            ) : (
              <span style={styles.featureBadgeActive}>Active</span>
            )}
          </div>
          <p style={styles.featureDesc}>
            {creditLevel === "zero" 
              ? "Full generation paused. You can still edit and refine existing AI drafts."
              : "Generate board reports, meeting minutes, and compliance summaries."}
          </p>
          {creditLevel === "zero" && (
            <div style={styles.degradedAction}>
              <span style={styles.degradedIcon}>📝</span>
              <span>Edit existing drafts</span>
              <button style={styles.degradedButton}>Open</button>
            </div>
          )}
        </div>

        {/* AI Suggestions */}
        <div style={styles.featureCard}>
          <div style={styles.featureHeader}>
            <span style={styles.featureIcon}>💬</span>
            <span style={styles.featureName}>AI Suggestions</span>
            {creditLevel === "zero" ? (
              <span style={styles.featureBadgeLimited}>Limited</span>
            ) : creditLevel === "low" ? (
              <span style={styles.featureBadgeYellow}>Conserving</span>
            ) : (
              <span style={styles.featureBadgeActive}>Active</span>
            )}
          </div>
          <p style={styles.featureDesc}>
            {creditLevel === "zero" 
              ? "Showing cached suggestions. New suggestions resume when credits refresh."
              : creditLevel === "low"
              ? "Suggestions reduced to conserve credits. Most relevant only."
              : "Contextual suggestions as you work."}
          </p>
        </div>

        {/* AI Search */}
        <div style={styles.featureCard}>
          <div style={styles.featureHeader}>
            <span style={styles.featureIcon}>🔍</span>
            <span style={styles.featureName}>AI-Powered Search</span>
            <span style={styles.featureBadgeActive}>Always on</span>
          </div>
          <p style={styles.featureDesc}>
            Search always works — it's essential to your workflow. No credit cost.
          </p>
        </div>
      </div>

      {/* Credit Refresh Notice */}
      {creditLevel === "zero" && (
        <div style={styles.refreshNotice}>
          <span style={styles.refreshIcon}>🔄</span>
          <div>
            <strong>Credits refresh Feb 1</strong>
            <p style={styles.refreshText}>
              Full AI features resume in 3 days. Until then, core workflows continue 
              with gracefully reduced AI assistance.
            </p>
          </div>
        </div>
      )}

      {/* Key Insight */}
      <div style={styles.insightCard}>
        <span style={styles.insightIcon}>💡</span>
        <div>
          <strong>Why this works:</strong> Instead of hard blocks that frustrate users, 
          features degrade gracefully. Essential work continues, and users understand 
          exactly when full features return.
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Model 4: Discovery Mode
// ─────────────────────────────────────────────────────────────

function DiscoveryModeDemo({ creditLevel }: { creditLevel: CreditLevel }) {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const discoveryProducts = [
    {
      id: "compliance",
      name: "Compliance AI",
      icon: "✓",
      owned: false,
      features: [
        "Auto-generate compliance reports",
        "Policy gap analysis",
        "Regulatory change summaries",
      ],
      sampleOutput: "Based on recent SEC guidance, your current disclosure practices align with 87% of requirements. Key gaps identified in ESG reporting...",
    },
    {
      id: "audit",
      name: "Audit AI",
      icon: "🔍",
      owned: false,
      features: [
        "Risk assessment automation",
        "Audit finding summaries",
        "Control testing assistance",
      ],
      sampleOutput: "Preliminary risk assessment complete. 3 high-priority areas identified: vendor management controls, access provisioning, and change management...",
    },
    {
      id: "risk",
      name: "Risk AI",
      icon: "⚠️",
      owned: false,
      features: [
        "Risk scenario modeling",
        "Mitigation recommendations",
        "Cross-entity risk mapping",
      ],
      sampleOutput: "Interconnected risk analysis shows supply chain disruption could impact 4 entities. Recommended mitigation: diversify vendor portfolio in APAC region...",
    },
  ];

  return (
    <div style={styles.demoContainer}>
      {/* Discovery Header */}
      <div style={styles.discoveryHeader}>
        <h3 style={styles.discoveryTitle}>Explore AI in other products</h3>
        <p style={styles.discoverySubtitle}>
          See what AI can do across Diligent — no purchase required. 
          Try with sample data or connect your own.
        </p>
      </div>

      {/* Product Discovery Cards */}
      <div style={styles.discoveryGrid}>
        {discoveryProducts.map((product) => (
          <div
            key={product.id}
            style={{
              ...styles.discoveryCard,
              ...(selectedProduct === product.id ? styles.discoveryCardSelected : {}),
            }}
            onClick={() => setSelectedProduct(
              selectedProduct === product.id ? null : product.id
            )}
          >
            <div style={styles.discoveryCardHeader}>
              <span style={styles.discoveryProductIcon}>{product.icon}</span>
              <span style={styles.discoveryProductName}>{product.name}</span>
              <span style={styles.discoveryBadge}>Preview</span>
            </div>
            
            <ul style={styles.discoveryFeatures}>
              {product.features.map((feature, i) => (
                <li key={i} style={styles.discoveryFeatureItem}>
                  <span style={styles.discoveryCheck}>✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            {selectedProduct === product.id && (
              <div style={styles.sampleOutputSection}>
                <span style={styles.sampleOutputLabel}>Sample AI output:</span>
                <div style={styles.sampleOutput}>
                  {product.sampleOutput}
                </div>
                <div style={styles.discoveryActions}>
                  <button style={styles.tryWithDataButton}>
                    Try with your data
                  </button>
                  <button style={styles.learnMoreButton}>
                    Learn more
                  </button>
                </div>
              </div>
            )}

            {selectedProduct !== product.id && (
              <button style={styles.expandButton}>
                See sample output →
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Cross-sell without pressure */}
      <div style={{
        ...styles.softSellCard,
        ...(creditLevel === "zero" ? styles.softSellCardMuted : {}),
      }}>
        <span style={styles.softSellIcon}>🎯</span>
        <div style={styles.softSellContent}>
          <strong>
            {creditLevel === "zero" 
              ? "Discover while you wait" 
              : "Based on your Boards usage"}
          </strong>
          <p style={styles.softSellText}>
            {creditLevel === "zero"
              ? "While your credits refresh, explore what other products can do. Preview is always free."
              : "Teams like yours often find Compliance AI saves 4+ hours per week on regulatory reporting. Want to explore?"}
          </p>
        </div>
        <button style={styles.softSellButton}>
          {creditLevel === "zero" ? "Explore" : "Show me"}
        </button>
      </div>

      {/* Credit status notice for discovery */}
      {creditLevel !== "high" && (
        <div style={{
          ...styles.discoveryNotice,
          ...(creditLevel === "zero" ? styles.discoveryNoticeZero : styles.discoveryNoticeLow),
        }}>
          <span>{creditLevel === "zero" ? "💡" : "ℹ️"}</span>
          <span>
            {creditLevel === "zero"
              ? "Discovery mode is always available — even with zero credits. Explore freely."
              : "Running low on credits? Discovery previews are free and don't use your balance."}
          </span>
        </div>
      )}

      {/* Key Insight */}
      <div style={styles.insightCard}>
        <span style={styles.insightIcon}>💡</span>
        <div>
          <strong>Why this works:</strong> Users can explore and validate value before 
          any commercial conversation. Discovery creates demand naturally, without 
          friction or pressure.
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────

export default function CrossProductAccessPage() {
  const [activeModel, setActiveModel] = useState<AccessModel>("unified_pool");
  const [creditLevel, setCreditLevel] = useState<CreditLevel>("high");

  const renderDemo = () => {
    switch (activeModel) {
      case "unified_pool":
        return <UnifiedPoolDemo creditLevel={creditLevel} />;
      case "trial_first":
        return <TrialFirstDemo creditLevel={creditLevel} />;
      case "graceful_limits":
        return <GracefulLimitsDemo creditLevel={creditLevel} />;
      case "discovery_mode":
        return <DiscoveryModeDemo creditLevel={creditLevel} />;
    }
  };

  return (
    <div style={styles.pageWrapper}>
      {/* Experiment Navigation */}
      <nav style={styles.experimentNav}>
        <div style={styles.experimentNavInner}>
          <span style={styles.experimentNavLabel}>Experiment</span>
          <span style={styles.experimentNavTitle}>Cross-Product Access</span>
        </div>
        <a href="/" style={styles.experimentNavLink}>
          ← Back to Home
        </a>
      </nav>

      <main style={styles.main}>
        {/* Header */}
        <header style={styles.header}>
          <h1 style={styles.headline}>Cross-Product Access Without Commercial Friction</h1>
          <p style={styles.subhead}>
            Explore UX patterns that let users discover and use AI features across products 
            without being blocked by commercial boundaries. Value first, commerce later.
          </p>
        </header>

        {/* Demo Controls */}
        <div style={styles.demoControlsSection}>
          <div style={styles.controlRow}>
            <span style={styles.controlRowLabel}>UX Pattern:</span>
            <AccessModelTabs activeModel={activeModel} onChange={setActiveModel} />
          </div>
          <div style={styles.controlsDivider} />
          <div style={styles.controlRow}>
            <span style={styles.controlRowLabel}>Credit Level:</span>
            <CreditLevelToggle creditLevel={creditLevel} onChange={setCreditLevel} />
          </div>
        </div>

        {/* Model Description */}
        <ModelDescription model={activeModel} />

        {/* Demo Area */}
        <div style={styles.demoWrapper}>
          {renderDemo()}
        </div>

        {/* Footer */}
        <p style={styles.footerNote}>
          Wireframe note: This experiment explores commercial UX patterns for AI features.
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
    maxWidth: "960px",
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
    maxWidth: "640px",
    margin: "0 auto",
  },
  
  // Demo Controls Section
  demoControlsSection: {
    padding: "20px 24px",
    marginBottom: "32px",
    background: "#FFFFFF",
    border: "1px solid #E5E5E5",
    borderRadius: "12px",
  },
  controlRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  controlRowLabel: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#525252",
    minWidth: "90px",
    flexShrink: 0,
  },
  controlsDivider: {
    height: "1px",
    background: "#E5E5E5",
    margin: "16px 0",
  },
  
  // Tabs
  tabsContainer: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    flex: 1,
  },
  tab: {
    padding: "8px 16px",
    fontSize: "13px",
    fontWeight: 500,
    color: "#525252",
    background: "#F5F5F5",
    border: "1px solid #E5E5E5",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.15s ease",
  },
  tabActive: {
    background: "#171717",
    borderColor: "#171717",
    color: "#FFFFFF",
  },
  
  // Global Credit Toggle
  globalCreditToggle: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flex: 1,
  },
  globalCreditLabel: {
    display: "none",
  },
  globalCreditButtons: {
    display: "flex",
    gap: "8px",
  },
  globalCreditButton: {
    padding: "8px 16px",
    fontSize: "13px",
    fontWeight: 500,
    color: "#525252",
    background: "#F5F5F5",
    border: "1px solid #E5E5E5",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.15s ease",
  },
  globalCreditButtonActive: {
    fontWeight: 600,
  },
  creditButtonHigh: {
    borderColor: "#D1FAE5",
  },
  creditButtonLow: {
    borderColor: "#FEF3C7",
  },
  creditButtonZero: {
    borderColor: "#FEE2E2",
  },
  creditButtonHighActive: {
    background: "#059669",
    borderColor: "#059669",
    color: "#FFFFFF",
  },
  creditButtonLowActive: {
    background: "#D97706",
    borderColor: "#D97706",
    color: "#FFFFFF",
  },
  creditButtonZeroActive: {
    background: "#DC2626",
    borderColor: "#DC2626",
    color: "#FFFFFF",
  },
  
  // Model Description
  modelDescription: {
    textAlign: "center",
    marginBottom: "32px",
    padding: "24px",
    background: "#FFFFFF",
    borderRadius: "12px",
    border: "1px solid #E5E5E5",
  },
  modelTitle: {
    fontSize: "20px",
    fontWeight: 600,
    color: "#171717",
    margin: "0 0 8px 0",
  },
  modelSubtitle: {
    fontSize: "15px",
    color: "#525252",
    margin: 0,
  },
  
  // Demo Wrapper
  demoWrapper: {
    marginBottom: "48px",
  },
  demoContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  
  // Credit Card (Unified Pool)
  creditCard: {
    padding: "24px",
    background: "#171717",
    borderRadius: "16px",
    color: "#FFFFFF",
  },
  creditCardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  creditCardLabel: {
    fontSize: "13px",
    fontWeight: 500,
    color: "#A3A3A3",
  },
  creditCardBadge: {
    padding: "4px 10px",
    fontSize: "11px",
    fontWeight: 600,
    color: "#10B981",
    background: "rgba(16, 185, 129, 0.15)",
    borderRadius: "12px",
  },
  creditBalance: {
    marginBottom: "20px",
  },
  creditNumber: {
    fontSize: "48px",
    fontWeight: 600,
    display: "block",
    lineHeight: 1,
  },
  creditLabel: {
    fontSize: "14px",
    color: "#A3A3A3",
    marginTop: "4px",
    display: "block",
  },
  creditProgressContainer: {},
  creditProgressBg: {
    height: "8px",
    background: "#404040",
    borderRadius: "4px",
    overflow: "hidden",
  },
  creditProgressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #10B981, #34D399)",
    borderRadius: "4px",
  },
  creditProgressLabels: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "8px",
    fontSize: "12px",
    color: "#A3A3A3",
  },
  creditCardDepleted: {
    background: "#450A0A",
  },
  creditCardBadgeYellow: {
    color: "#D97706",
    background: "rgba(217, 119, 6, 0.15)",
  },
  creditCardBadgeRed: {
    color: "#FCA5A5",
    background: "rgba(220, 38, 38, 0.2)",
  },
  creditProgressFillYellow: {
    background: "linear-gradient(90deg, #D97706, #FBBF24)",
  },
  creditProgressFillRed: {
    background: "linear-gradient(90deg, #DC2626, #F87171)",
  },
  creditRefreshNote: {
    marginTop: "16px",
    padding: "12px",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "8px",
    fontSize: "13px",
    color: "#FCA5A5",
    textAlign: "center",
  },
  
  // Section Headers
  sectionHeader: {
    marginBottom: "16px",
  },
  sectionTitle: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#171717",
    margin: "0 0 4px 0",
  },
  sectionSubtitle: {
    fontSize: "14px",
    color: "#737373",
    margin: 0,
  },
  
  // Product Grid
  productGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "12px",
  },
  productCard: {
    padding: "16px",
    background: "#FFFFFF",
    border: "1px solid #E5E5E5",
    borderRadius: "12px",
    textAlign: "center",
  },
  productCardLocked: {
    opacity: 0.5,
  },
  productIcon: {
    fontSize: "24px",
    display: "block",
    marginBottom: "8px",
  },
  productName: {
    fontSize: "14px",
    fontWeight: 500,
    color: "#171717",
    display: "block",
    marginBottom: "4px",
  },
  productCredits: {
    fontSize: "12px",
    color: "#10B981",
    display: "block",
    marginBottom: "8px",
  },
  productLocked: {
    fontSize: "12px",
    color: "#A3A3A3",
    display: "block",
  },
  productCardPaused: {
    borderColor: "#FEE2E2",
    background: "#FEF2F2",
  },
  productCreditsPaused: {
    color: "#DC2626",
  },
  productUsageBar: {
    height: "4px",
    background: "#F5F5F5",
    borderRadius: "2px",
    overflow: "hidden",
  },
  productUsageFill: {
    height: "100%",
    background: "#10B981",
    borderRadius: "2px",
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
  
  // Trial Card
  trialCard: {
    padding: "32px",
    background: "#FFFFFF",
    border: "1px solid #E5E5E5",
    borderRadius: "16px",
  },
  trialHeader: {
    marginBottom: "16px",
  },
  trialBadge: {
    padding: "6px 12px",
    fontSize: "13px",
    fontWeight: 600,
    color: "#7C3AED",
    background: "#EDE9FE",
    borderRadius: "16px",
  },
  trialBadgeEnding: {
    color: "#D97706",
    background: "#FEF3C7",
  },
  trialBadgeEnded: {
    color: "#059669",
    background: "#D1FAE5",
  },
  trialTitle: {
    fontSize: "24px",
    fontWeight: 600,
    color: "#171717",
    margin: "0 0 8px 0",
  },
  trialSubtitle: {
    fontSize: "15px",
    color: "#525252",
    lineHeight: 1.6,
    margin: 0,
  },
  trialFeatures: {
    marginTop: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  trialFeature: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    color: "#171717",
  },
  checkIcon: {
    color: "#10B981",
    fontWeight: 600,
  },
  trialProgress: {
    marginTop: "24px",
    fontSize: "13px",
    color: "#737373",
  },
  trialProgressBar: {
    height: "6px",
    background: "#F5F5F5",
    borderRadius: "3px",
    marginTop: "8px",
    overflow: "hidden",
  },
  trialProgressFill: {
    height: "100%",
    background: "#7C3AED",
    borderRadius: "3px",
  },
  usageSummary: {
    display: "flex",
    gap: "32px",
    marginTop: "24px",
  },
  usageStat: {
    display: "flex",
    flexDirection: "column",
  },
  usageNumber: {
    fontSize: "32px",
    fontWeight: 600,
    color: "#171717",
  },
  usageLabel: {
    fontSize: "13px",
    color: "#737373",
  },
  continueButton: {
    marginTop: "24px",
    padding: "12px 24px",
    fontSize: "14px",
    fontWeight: 500,
    color: "#FFFFFF",
    background: "#171717",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  creditCompare: {
    marginTop: "24px",
    display: "flex",
    gap: "24px",
  },
  creditCompareItem: {
    flex: 1,
    padding: "16px",
    background: "#F5F5F5",
    borderRadius: "8px",
  },
  creditCompareLabel: {
    fontSize: "12px",
    color: "#737373",
    display: "block",
    marginBottom: "4px",
  },
  creditCompareValue: {
    fontSize: "18px",
    fontWeight: 600,
    color: "#171717",
  },
  
  // Demo Controls
  demoControls: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    background: "#FFFFFF",
    border: "1px solid #E5E5E5",
    borderRadius: "8px",
  },
  demoControlLabel: {
    fontSize: "12px",
    fontWeight: 500,
    color: "#737373",
  },
  demoControlButtons: {
    display: "flex",
    gap: "8px",
  },
  demoControlButton: {
    padding: "6px 12px",
    fontSize: "12px",
    fontWeight: 500,
    color: "#525252",
    background: "#F5F5F5",
    border: "1px solid #E5E5E5",
    borderRadius: "6px",
    cursor: "pointer",
  },
  demoControlButtonActive: {
    background: "#171717",
    borderColor: "#171717",
    color: "#FFFFFF",
  },
  
  // Graceful Limits
  creditStatusBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    background: "#FFFFFF",
    border: "1px solid #E5E5E5",
    borderRadius: "12px",
  },
  creditStatusLeft: {
    display: "flex",
    alignItems: "baseline",
    gap: "8px",
  },
  creditStatusNumber: {
    fontSize: "24px",
    fontWeight: 600,
    color: "#171717",
  },
  creditStatusLabel: {
    fontSize: "14px",
    color: "#737373",
  },
  creditStatusRight: {},
  statusBadgeGreen: {
    padding: "4px 12px",
    fontSize: "12px",
    fontWeight: 500,
    color: "#059669",
    background: "#D1FAE5",
    borderRadius: "12px",
  },
  statusBadgeYellow: {
    padding: "4px 12px",
    fontSize: "12px",
    fontWeight: 500,
    color: "#D97706",
    background: "#FEF3C7",
    borderRadius: "12px",
  },
  statusBadgeRed: {
    padding: "4px 12px",
    fontSize: "12px",
    fontWeight: 500,
    color: "#DC2626",
    background: "#FEE2E2",
    borderRadius: "12px",
  },
  featureList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  featureCard: {
    padding: "20px",
    background: "#FFFFFF",
    border: "1px solid #E5E5E5",
    borderRadius: "12px",
  },
  featureHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "8px",
  },
  featureIcon: {
    fontSize: "18px",
  },
  featureName: {
    fontSize: "15px",
    fontWeight: 600,
    color: "#171717",
    flex: 1,
  },
  featureBadgeActive: {
    padding: "4px 10px",
    fontSize: "11px",
    fontWeight: 500,
    color: "#059669",
    background: "#D1FAE5",
    borderRadius: "10px",
  },
  featureBadgeDisabled: {
    padding: "4px 10px",
    fontSize: "11px",
    fontWeight: 500,
    color: "#DC2626",
    background: "#FEE2E2",
    borderRadius: "10px",
  },
  featureBadgeLimited: {
    padding: "4px 10px",
    fontSize: "11px",
    fontWeight: 500,
    color: "#D97706",
    background: "#FEF3C7",
    borderRadius: "10px",
  },
  featureBadgeYellow: {
    padding: "4px 10px",
    fontSize: "11px",
    fontWeight: 500,
    color: "#D97706",
    background: "#FEF3C7",
    borderRadius: "10px",
  },
  featureDesc: {
    fontSize: "14px",
    color: "#525252",
    margin: 0,
    lineHeight: 1.5,
  },
  degradedAction: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "12px",
    padding: "12px",
    background: "#F5F5F5",
    borderRadius: "8px",
    fontSize: "13px",
    color: "#525252",
  },
  degradedIcon: {
    fontSize: "16px",
  },
  degradedButton: {
    marginLeft: "auto",
    padding: "6px 12px",
    fontSize: "12px",
    fontWeight: 500,
    color: "#171717",
    background: "#FFFFFF",
    border: "1px solid #E5E5E5",
    borderRadius: "6px",
    cursor: "pointer",
  },
  refreshNotice: {
    display: "flex",
    gap: "12px",
    padding: "16px",
    background: "#EFF6FF",
    borderRadius: "12px",
    fontSize: "14px",
    color: "#1E40AF",
  },
  refreshIcon: {
    fontSize: "20px",
    flexShrink: 0,
  },
  refreshText: {
    margin: "4px 0 0 0",
    fontSize: "13px",
    color: "#3B82F6",
    lineHeight: 1.5,
  },
  
  // Discovery Mode
  discoveryHeader: {
    marginBottom: "24px",
  },
  discoveryTitle: {
    fontSize: "18px",
    fontWeight: 600,
    color: "#171717",
    margin: "0 0 8px 0",
  },
  discoverySubtitle: {
    fontSize: "14px",
    color: "#525252",
    margin: 0,
    lineHeight: 1.5,
  },
  discoveryGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  discoveryCard: {
    padding: "20px",
    background: "#FFFFFF",
    border: "1px solid #E5E5E5",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.15s ease",
  },
  discoveryCardSelected: {
    borderColor: "#7C3AED",
    boxShadow: "0 0 0 1px #7C3AED",
  },
  discoveryCardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "12px",
  },
  discoveryProductIcon: {
    fontSize: "24px",
  },
  discoveryProductName: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#171717",
    flex: 1,
  },
  discoveryBadge: {
    padding: "4px 10px",
    fontSize: "11px",
    fontWeight: 500,
    color: "#7C3AED",
    background: "#EDE9FE",
    borderRadius: "10px",
  },
  discoveryFeatures: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  discoveryFeatureItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    color: "#525252",
  },
  discoveryCheck: {
    color: "#10B981",
    fontWeight: 600,
  },
  expandButton: {
    marginTop: "16px",
    padding: 0,
    background: "none",
    border: "none",
    fontSize: "13px",
    fontWeight: 500,
    color: "#7C3AED",
    cursor: "pointer",
  },
  sampleOutputSection: {
    marginTop: "20px",
    paddingTop: "20px",
    borderTop: "1px solid #F5F5F5",
  },
  sampleOutputLabel: {
    fontSize: "11px",
    fontWeight: 500,
    color: "#737373",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    display: "block",
    marginBottom: "8px",
  },
  sampleOutput: {
    padding: "16px",
    background: "#F5F5F5",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#525252",
    lineHeight: 1.6,
    fontStyle: "italic",
  },
  discoveryActions: {
    display: "flex",
    gap: "12px",
    marginTop: "16px",
  },
  tryWithDataButton: {
    padding: "10px 20px",
    fontSize: "14px",
    fontWeight: 500,
    color: "#FFFFFF",
    background: "#7C3AED",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  learnMoreButton: {
    padding: "10px 20px",
    fontSize: "14px",
    fontWeight: 500,
    color: "#525252",
    background: "#FFFFFF",
    border: "1px solid #E5E5E5",
    borderRadius: "8px",
    cursor: "pointer",
  },
  softSellCard: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "20px",
    background: "#F0FDF4",
    border: "1px solid #BBF7D0",
    borderRadius: "12px",
  },
  softSellIcon: {
    fontSize: "24px",
    flexShrink: 0,
  },
  softSellContent: {
    flex: 1,
  },
  softSellText: {
    margin: "4px 0 0 0",
    fontSize: "14px",
    color: "#166534",
    lineHeight: 1.5,
  },
  softSellButton: {
    padding: "10px 20px",
    fontSize: "14px",
    fontWeight: 500,
    color: "#166534",
    background: "#FFFFFF",
    border: "1px solid #BBF7D0",
    borderRadius: "8px",
    cursor: "pointer",
    flexShrink: 0,
  },
  softSellCardMuted: {
    background: "#EFF6FF",
    borderColor: "#BFDBFE",
  },
  discoveryNotice: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 16px",
    borderRadius: "8px",
    fontSize: "13px",
  },
  discoveryNoticeLow: {
    background: "#FEF3C7",
    color: "#92400E",
  },
  discoveryNoticeZero: {
    background: "#D1FAE5",
    color: "#065F46",
  },
  
  // Footer
  footerNote: {
    marginTop: "48px",
    fontSize: "12px",
    color: "#A3A3A3",
    textAlign: "center",
  },
};
