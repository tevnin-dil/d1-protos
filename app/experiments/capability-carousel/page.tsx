"use client";

/**
 * Capability Carousel Experiment
 * 
 * Demonstrates how a prompt box can dynamically showcase what it CAN do
 * through rotating example prompts tied to user role and recent activity,
 * making limitations feel like focused expertise rather than missing features.
 * 
 * Layout matches the Diligent-style dashbnoard with sidebar, greeting, 
 * quick actions, and What's New panel.
 */

import React, { useState, useEffect, useCallback } from "react";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

type UserRole = "gc" | "compliance" | "board_admin" | "general";

type CapabilityPrompt = {
  text: string;
  category: string;
  relevanceScore: number;
};

type QuickAction = {
  id: string;
  title: string;
  subtitle?: string;
};

type WhatsNewItem = {
  id: string;
  title: string;
  description: string;
};

type FavoriteApp = {
  id: string;
  name: string;
  icon: string;
};

// ─────────────────────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────────────────────

const USER = {
  name: "Sarah",
  initials: "SH",
  role: "board_admin" as UserRole,
};

const QUICK_ACTIONS: QuickAction[] = [
  { id: "1", title: "View recent chats", subtitle: "4 updates • 1 running process" },
  { id: "2", title: "Appoint a Director" },
  { id: "3", title: "Open application..." },
];

const WHATS_NEW: WhatsNewItem[] = [
  {
    id: "1",
    title: "Diligent Insights: Calm governance in steady-state",
    description: "A short read on maintaining confidence between cycles.",
  },
  {
    id: "2",
    title: "New AI capability: auto-summaries for quiet periods",
    description: "Weekly summaries that highlight what stayed the same.",
  },
  {
    id: "3",
    title: "Recently added: lightweight assurance notes",
    description: "Capture brief, optional notes without creating new tasks.",
  },
];

const FAVORITE_APPS: FavoriteApp[] = [
  { id: "1", name: "Boards", icon: "🏠" },
  { id: "2", name: "Entities", icon: "👥" },
];

const BASE_PROMPTS: Record<UserRole, CapabilityPrompt[]> = {
  gc: [
    { text: "Draft a board report summary from last quarter's filings", category: "Document Generation", relevanceScore: 80 },
    { text: "Generate compliance checklist for SOX 404", category: "Compliance", relevanceScore: 70 },
    { text: "Create meeting agenda from prior action items", category: "Document Generation", relevanceScore: 75 },
    { text: "Analyze coverage gaps across entities", category: "Analysis", relevanceScore: 65 },
  ],
  compliance: [
    { text: "Generate compliance checklist for SOX 404", category: "Compliance", relevanceScore: 85 },
    { text: "Map entity–vendor links for risk assessment", category: "Risk Management", relevanceScore: 80 },
    { text: "Assess audit readiness for Q4 review", category: "Compliance", relevanceScore: 75 },
    { text: "Identify policy drift across all entities", category: "Policy Management", relevanceScore: 70 },
  ],
  board_admin: [
    { text: "Create meeting agenda from prior action items", category: "Document Generation", relevanceScore: 90 },
    { text: "Draft board report summary from last quarter's filings", category: "Document Generation", relevanceScore: 85 },
    { text: "Generate director education tracking report", category: "Reporting", relevanceScore: 75 },
    { text: "Summarize key decisions from last board meeting", category: "Document Generation", relevanceScore: 80 },
  ],
  general: [
    { text: "Show me coverage gaps across entities", category: "Analysis", relevanceScore: 70 },
    { text: "Map entity–vendor links", category: "Risk Management", relevanceScore: 65 },
    { text: "Assess audit readiness", category: "Compliance", relevanceScore: 60 },
    { text: "Generate a summary report", category: "Reporting", relevanceScore: 55 },
  ],
};

const PLACEHOLDER_INTERVAL = 3500;

// ─────────────────────────────────────────────────────────────
// Components
// ─────────────────────────────────────────────────────────────

function Sidebar({ activeItem }: { activeItem: string }) {
  const items = [
    { id: "home", icon: "🏠" },
    { id: "terminal", icon: "⌨️" },
    { id: "book", icon: "📖" },
    { id: "grid", icon: "⊞" },
    { id: "layers", icon: "◫" },
    { id: "chart", icon: "📊" },
    { id: "users", icon: "👤" },
  ];

  return (
    <div style={styles.sidebar}>
      <div style={styles.sidebarLogo}>
        <div style={styles.logoBox}>◼</div>
      </div>
      <div style={styles.sidebarNav}>
        {items.map((item) => (
          <button
            key={item.id}
            style={{
              ...styles.sidebarItem,
              ...(activeItem === item.id ? styles.sidebarItemActive : {}),
            }}
          >
            <span style={styles.sidebarIcon}>{item.icon}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Header() {
  return (
    <header style={styles.header}>
      <div style={styles.headerLeft}>
        <div style={styles.companyLogo}>▲</div>
        <span style={styles.companyName}>Acme, Inc.</span>
        <span style={styles.companyDropdown}>▾</span>
      </div>
      <div style={styles.headerRight}>
        <button style={styles.headerIcon}>💬</button>
        <button style={styles.notificationButton}>
          <span>🔔</span>
          <span style={styles.notificationBadge}>10</span>
        </button>
        <button style={styles.avatarButton}>👤</button>
      </div>
    </header>
  );
}

function Greeting({ name }: { name: string }) {
  const hour = new Date().getHours();
  const timeOfDay = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";

  return (
    <div style={styles.greetingSection}>
      <div style={styles.avatar}>
        <span style={styles.avatarText}>{USER.initials}</span>
        <span style={styles.onlineIndicator} />
      </div>
      <div style={styles.greetingText}>
        <h1 style={styles.greetingTitle}>Good {timeOfDay}, {name}.</h1>
        <p style={styles.greetingSubtitle}>Where should we get started today?</p>
      </div>
    </div>
  );
}

function QuickActionCards({ actions }: { actions: QuickAction[] }) {
  return (
    <div style={styles.quickActionsRow}>
      {actions.map((action) => (
        <button key={action.id} style={styles.quickActionCard}>
          <span style={styles.quickActionTitle}>{action.title}</span>
          {action.subtitle && (
            <span style={styles.quickActionSubtitle}>{action.subtitle}</span>
          )}
        </button>
      ))}
    </div>
  );
}

function CapabilityCarouselPrompt({
  prompts,
  currentIndex,
  value,
  onChange,
  onSubmit,
}: {
  prompts: CapabilityPrompt[];
  currentIndex: number;
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
}) {
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState(
    prompts[0]?.text || "What should we review?"
  );
  const [isFading, setIsFading] = useState(false);

  // Handle fade transition when currentIndex changes
  useEffect(() => {
    const newPlaceholder = prompts[currentIndex % prompts.length]?.text || "What should we review?";
    
    if (newPlaceholder !== displayedPlaceholder) {
      // Start fade out
      setIsFading(true);
      
      // After fade out, change text and fade in
      const timeout = setTimeout(() => {
        setDisplayedPlaceholder(newPlaceholder);
        setIsFading(false);
      }, 300); // Match the CSS transition duration
      
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, prompts, displayedPlaceholder]);

  return (
    <div style={styles.promptContainer}>
      <div style={styles.promptBox}>
        <div style={styles.textareaWrapper}>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSubmit();
              }
            }}
            style={styles.promptTextarea}
            rows={3}
          />
          {/* Custom animated placeholder */}
          {!value && (
            <div
              style={{
                ...styles.customPlaceholder,
                opacity: isFading ? 0 : 1,
              }}
            >
              {displayedPlaceholder}
            </div>
          )}
        </div>
        <div style={styles.promptActions}>
          <button style={styles.promptActionButton} title="Attach">📎</button>
          <button style={styles.promptActionButton} title="Voice">🎤</button>
          <button style={styles.promptSendButton} onClick={onSubmit}>
            <span style={styles.sendIcon}>➤</span>
          </button>
        </div>
      </div>
      
      {/* Carousel indicators */}
      <div style={styles.carouselIndicators}>
        {prompts.slice(0, 4).map((_, i) => (
          <span
            key={i}
            style={{
              ...styles.carouselDot,
              ...(i === currentIndex % 4 ? styles.carouselDotActive : {}),
            }}
          />
        ))}
      </div>
      
      <button style={styles.whatCanIDoLink}>
        What can I do?
      </button>
    </div>
  );
}

function FavoriteApps({ apps }: { apps: FavoriteApp[] }) {
  return (
    <div style={styles.favoriteAppsSection}>
      <h2 style={styles.sectionTitle}>Favorite Apps</h2>
      <div style={styles.favoriteAppsGrid}>
        {apps.map((app) => (
          <button key={app.id} style={styles.favoriteAppCard}>
            <span style={styles.favoriteAppIcon}>{app.icon}</span>
            <span style={styles.favoriteAppName}>{app.name}</span>
          </button>
        ))}
        <button style={styles.addFavoriteCard}>
          <span style={styles.addFavoriteIcon}>✚</span>
          <span style={styles.addFavoriteText}>Add favorite</span>
        </button>
      </div>
      <button style={styles.showAllAppsButton}>
        Show All Apps <span style={styles.dropdownIcon}>▾</span>
      </button>
    </div>
  );
}

function WhatsNewPanel({ items }: { items: WhatsNewItem[] }) {
  return (
    <div style={styles.whatsNewPanel}>
      <div style={styles.whatsNewHeader}>
        <span style={styles.whatsNewLabel}>WHAT'S NEW</span>
      </div>
      <p style={styles.whatsNewIntro}>
        Learn more about features and capabilities you already have today.
      </p>
      <div style={styles.whatsNewList}>
        {items.map((item) => (
          <div key={item.id} style={styles.whatsNewItem}>
            <h3 style={styles.whatsNewItemTitle}>{item.title}</h3>
            <p style={styles.whatsNewItemDesc}>{item.description}</p>
            <button style={styles.whatsNewOpenButton}>OPEN</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function RoleSelector({
  currentRole,
  onChange,
}: {
  currentRole: UserRole;
  onChange: (role: UserRole) => void;
}) {
  return (
    <div style={styles.roleSelectorContainer}>
      <span style={styles.roleSelectorLabel}>Demo: Switch role</span>
      <div style={styles.roleSelectorButtons}>
        {(["general", "gc", "compliance", "board_admin"] as UserRole[]).map((role) => (
          <button
            key={role}
            onClick={() => onChange(role)}
            style={{
              ...styles.roleSelectorButton,
              ...(currentRole === role ? styles.roleSelectorButtonActive : {}),
            }}
          >
            {role === "gc" ? "GC" : role === "board_admin" ? "Board" : role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────

export default function CapabilityCarouselPage() {
  const [userRole, setUserRole] = useState<UserRole>(USER.role);
  const [promptValue, setPromptValue] = useState("");
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);

  const prompts = BASE_PROMPTS[userRole];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholderIndex((prev) => (prev + 1) % prompts.length);
    }, PLACEHOLDER_INTERVAL);
    return () => clearInterval(interval);
  }, [prompts.length]);

  const handleSubmit = useCallback(() => {
    if (promptValue.trim()) {
      console.log("Submitted:", promptValue);
      setPromptValue("");
    }
  }, [promptValue]);

  return (
    <div style={styles.pageWrapper}>
      {/* Experiment Navigation */}
      <nav style={styles.experimentNav}>
        <div style={styles.experimentNavInner}>
          <span style={styles.experimentNavLabel}>Experiment</span>
          <span style={styles.experimentNavTitle}>Capability Carousel</span>
        </div>
        <a href="/" style={styles.experimentNavLink}>
          ← Back to Home
        </a>
      </nav>

      <div style={styles.pageContainer}>
        {/* Sidebar */}
        <Sidebar activeItem="home" />

        {/* Main Content Area */}
        <div style={styles.mainArea}>
          <Header />
        
        <div style={styles.contentWrapper}>
          {/* Center Content */}
          <main style={styles.mainContent}>
            <Greeting name={USER.name} />
            
            <QuickActionCards actions={QUICK_ACTIONS} />
            
            <CapabilityCarouselPrompt
              prompts={prompts}
              currentIndex={currentPlaceholderIndex}
              value={promptValue}
              onChange={setPromptValue}
              onSubmit={handleSubmit}
            />
            
            <FavoriteApps apps={FAVORITE_APPS} />
            
            {/* Role Selector for Demo */}
            <RoleSelector currentRole={userRole} onChange={setUserRole} />
          </main>

          {/* What's New Sidebar */}
          <aside style={styles.rightSidebar}>
            <WhatsNewPanel items={WHATS_NEW} />
          </aside>
        </div>
      </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  pageWrapper: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
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
  
  pageContainer: {
    display: "flex",
    flex: 1,
  },
  
  // Sidebar
  sidebar: {
    width: "56px",
    background: "#FFFFFF",
    borderRight: "1px solid #E5E5E5",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "16px",
    flexShrink: 0,
  },
  sidebarLogo: {
    marginBottom: "24px",
  },
  logoBox: {
    width: "32px",
    height: "32px",
    background: "#171717",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#FFFFFF",
    fontSize: "16px",
  },
  sidebarNav: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  sidebarItem: {
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "transparent",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background 0.15s ease",
  },
  sidebarItemActive: {
    background: "#F5F5F5",
  },
  sidebarIcon: {
    fontSize: "18px",
    opacity: 0.7,
  },
  
  // Main Area
  mainArea: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
  },
  
  // Header
  header: {
    height: "56px",
    background: "#FFFFFF",
    borderBottom: "1px solid #E5E5E5",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  companyLogo: {
    width: "28px",
    height: "28px",
    background: "#FEF3C7",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
  },
  companyName: {
    fontSize: "14px",
    fontWeight: 500,
    color: "#171717",
  },
  companyDropdown: {
    fontSize: "10px",
    color: "#737373",
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  headerIcon: {
    background: "none",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    opacity: 0.7,
  },
  notificationButton: {
    position: "relative",
    background: "none",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
  },
  notificationBadge: {
    position: "absolute",
    top: "-4px",
    right: "-8px",
    background: "#10B981",
    color: "#FFFFFF",
    fontSize: "10px",
    fontWeight: 600,
    padding: "2px 6px",
    borderRadius: "10px",
  },
  avatarButton: {
    width: "32px",
    height: "32px",
    background: "#F5F5F5",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: "14px",
  },
  
  // Content
  contentWrapper: {
    flex: 1,
    display: "flex",
    overflow: "auto",
  },
  mainContent: {
    flex: 1,
    maxWidth: "720px",
    margin: "0 auto",
    padding: "48px 32px",
  },
  rightSidebar: {
    width: "360px",
    borderLeft: "1px solid #E5E5E5",
    background: "#FFFFFF",
    padding: "24px",
    flexShrink: 0,
  },
  
  // Greeting
  greetingSection: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "32px",
  },
  avatar: {
    position: "relative",
    width: "56px",
    height: "56px",
    background: "#F5F5F5",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: "18px",
    fontWeight: 500,
    color: "#525252",
  },
  onlineIndicator: {
    position: "absolute",
    top: "2px",
    right: "2px",
    width: "12px",
    height: "12px",
    background: "#10B981",
    borderRadius: "50%",
    border: "2px solid #FAFAFA",
  },
  greetingText: {},
  greetingTitle: {
    fontSize: "24px",
    fontWeight: 600,
    color: "#171717",
    margin: 0,
  },
  greetingSubtitle: {
    fontSize: "14px",
    color: "#737373",
    margin: "4px 0 0 0",
  },
  
  // Quick Actions
  quickActionsRow: {
    display: "flex",
    gap: "12px",
    marginBottom: "32px",
  },
  quickActionCard: {
    flex: 1,
    padding: "16px",
    background: "#FFFFFF",
    border: "1px solid #E5E5E5",
    borderRadius: "8px",
    textAlign: "left",
    cursor: "pointer",
    transition: "border-color 0.15s ease",
  },
  quickActionTitle: {
    display: "block",
    fontSize: "14px",
    fontWeight: 500,
    color: "#171717",
  },
  quickActionSubtitle: {
    display: "block",
    fontSize: "12px",
    color: "#737373",
    marginTop: "4px",
  },
  
  // Prompt
  promptContainer: {
    marginBottom: "40px",
  },
  promptBox: {
    background: "#FFFFFF",
    border: "1px solid #E5E5E5",
    borderRadius: "12px",
    padding: "16px",
    position: "relative",
  },
  textareaWrapper: {
    position: "relative",
  },
  promptTextarea: {
    width: "100%",
    border: "none",
    outline: "none",
    resize: "none",
    fontSize: "15px",
    color: "#171717",
    fontFamily: "inherit",
    lineHeight: 1.5,
    background: "transparent",
    position: "relative",
    zIndex: 1,
  },
  customPlaceholder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    fontSize: "15px",
    color: "#A3A3A3",
    fontFamily: "inherit",
    lineHeight: 1.5,
    pointerEvents: "none",
    transition: "opacity 0.3s ease-in-out",
  },
  promptActions: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "8px",
    marginTop: "12px",
    paddingTop: "12px",
    borderTop: "1px solid #F5F5F5",
  },
  promptActionButton: {
    width: "36px",
    height: "36px",
    background: "none",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    opacity: 0.5,
    transition: "opacity 0.15s ease",
  },
  promptSendButton: {
    width: "36px",
    height: "36px",
    background: "#171717",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  sendIcon: {
    color: "#FFFFFF",
    fontSize: "14px",
  },
  carouselIndicators: {
    display: "flex",
    justifyContent: "center",
    gap: "6px",
    marginTop: "12px",
  },
  carouselDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#D4D4D4",
    transition: "background 0.2s ease",
  },
  carouselDotActive: {
    background: "#525252",
  },
  whatCanIDoLink: {
    display: "block",
    margin: "16px auto 0",
    background: "none",
    border: "none",
    fontSize: "13px",
    color: "#737373",
    cursor: "pointer",
    textDecoration: "underline",
    textUnderlineOffset: "2px",
  },
  
  // Favorite Apps
  favoriteAppsSection: {
    marginBottom: "40px",
  },
  sectionTitle: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#171717",
    marginBottom: "16px",
  },
  favoriteAppsGrid: {
    display: "flex",
    gap: "12px",
    marginBottom: "16px",
  },
  favoriteAppCard: {
    width: "100px",
    height: "100px",
    background: "#FFFFFF",
    border: "1px solid #E5E5E5",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    cursor: "pointer",
    transition: "border-color 0.15s ease",
  },
  favoriteAppIcon: {
    fontSize: "24px",
  },
  favoriteAppName: {
    fontSize: "13px",
    color: "#171717",
  },
  addFavoriteCard: {
    width: "100px",
    height: "100px",
    background: "#FFFFFF",
    border: "1px dashed #D4D4D4",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    cursor: "pointer",
    transition: "border-color 0.15s ease",
  },
  addFavoriteIcon: {
    fontSize: "20px",
    color: "#A3A3A3",
  },
  addFavoriteText: {
    fontSize: "12px",
    color: "#737373",
  },
  showAllAppsButton: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    margin: "0 auto",
    padding: "8px 16px",
    background: "#FFFFFF",
    border: "1px solid #E5E5E5",
    borderRadius: "20px",
    fontSize: "13px",
    color: "#525252",
    cursor: "pointer",
  },
  dropdownIcon: {
    fontSize: "10px",
  },
  
  // Role Selector
  roleSelectorContainer: {
    padding: "16px",
    background: "#FFFFFF",
    border: "1px solid #E5E5E5",
    borderRadius: "8px",
    marginTop: "24px",
  },
  roleSelectorLabel: {
    display: "block",
    fontSize: "11px",
    fontWeight: 500,
    color: "#737373",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "12px",
  },
  roleSelectorButtons: {
    display: "flex",
    gap: "8px",
  },
  roleSelectorButton: {
    padding: "8px 12px",
    fontSize: "12px",
    fontWeight: 500,
    color: "#525252",
    background: "#F5F5F5",
    border: "1px solid #E5E5E5",
    borderRadius: "6px",
    cursor: "pointer",
  },
  roleSelectorButtonActive: {
    background: "#171717",
    borderColor: "#171717",
    color: "#FFFFFF",
  },
  
  // What's New Panel
  whatsNewPanel: {},
  whatsNewHeader: {
    marginBottom: "12px",
  },
  whatsNewLabel: {
    fontSize: "11px",
    fontWeight: 600,
    color: "#737373",
    letterSpacing: "0.5px",
  },
  whatsNewIntro: {
    fontSize: "13px",
    color: "#525252",
    lineHeight: 1.5,
    marginBottom: "20px",
  },
  whatsNewList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  whatsNewItem: {
    padding: "16px",
    background: "#FAFAFA",
    borderRadius: "8px",
    border: "1px solid #F5F5F5",
  },
  whatsNewItemTitle: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#171717",
    margin: "0 0 8px 0",
    lineHeight: 1.4,
  },
  whatsNewItemDesc: {
    fontSize: "13px",
    color: "#737373",
    margin: "0 0 12px 0",
    lineHeight: 1.4,
  },
  whatsNewOpenButton: {
    background: "none",
    border: "none",
    fontSize: "12px",
    fontWeight: 600,
    color: "#171717",
    cursor: "pointer",
    padding: 0,
    letterSpacing: "0.3px",
  },
};
