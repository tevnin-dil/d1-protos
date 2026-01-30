"use client";

/**
 * Mobile-First AI Experience
 * 
 * Demonstrates mobile-specific UX patterns for GRC AI workflows:
 * - Review mode: Reading generated drafts on the go
 * - Quick edits: Tweaking AI output before sharing
 * - Status checks: Progress tracking for in-flight tasks
 * - Approval flows: Quick review + approve workflows
 * 
 * Key principles:
 * - Recent/suggested actions over blank slate
 * - Bottom sheet pattern for prompts
 * - Voice input consideration
 * - Output-focused over input-focused
 */

import React, { useState } from "react";
import { Card } from "../../../wireframe-primitives/Card";
import { Button } from "../../../wireframe-primitives/Button";
import { Divider } from "../../../wireframe-primitives/Divider";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

type Screen = "home" | "review" | "edit" | "status" | "approval";
type TaskStatus = "generating" | "ready" | "reviewed" | "approved";

type Task = {
  id: string;
  title: string;
  type: string;
  status: TaskStatus;
  progress?: number;
  preview?: string;
  createdAt: string;
  readyAt?: string;
};

type Notification = {
  id: string;
  title: string;
  body: string;
  taskId: string;
  time: string;
  read: boolean;
};

// ─────────────────────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────────────────────

const TASKS: Task[] = [
  {
    id: "1",
    title: "Q4 Board Report",
    type: "Board Report",
    status: "ready",
    preview: "Executive Summary: Q4 showed strong performance across all key metrics...",
    createdAt: "2 hours ago",
    readyAt: "10 min ago",
  },
  {
    id: "2",
    title: "SOX Compliance Summary",
    type: "Compliance Summary",
    status: "generating",
    progress: 67,
    createdAt: "15 min ago",
  },
  {
    id: "3",
    title: "December Board Minutes",
    type: "Meeting Minutes",
    status: "reviewed",
    preview: "Board of Directors Meeting Minutes - December 15, 2025...",
    createdAt: "Yesterday",
    readyAt: "Yesterday",
  },
];

const PENDING_APPROVALS = [
  {
    id: "a1",
    title: "Risk Assessment Report",
    submittedBy: "Sarah Chen",
    submittedAt: "30 min ago",
    type: "For your approval",
  },
  {
    id: "a2",
    title: "Vendor Due Diligence",
    submittedBy: "Mike Johnson",
    submittedAt: "2 hours ago",
    type: "For your approval",
  },
];

const NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    title: "Your board report is ready",
    body: "Q4 Board Report has been generated and is ready for review.",
    taskId: "1",
    time: "10 min ago",
    read: false,
  },
  {
    id: "n2",
    title: "Approval requested",
    body: "Sarah Chen submitted Risk Assessment Report for your approval.",
    taskId: "a1",
    time: "30 min ago",
    read: false,
  },
];

const QUICK_ACTIONS = [
  { id: "recent1", label: "Continue: Q4 Board Report", icon: "📋" },
  { id: "recent2", label: "Check SOX Summary status", icon: "⏳" },
  { id: "action1", label: "Review pending approvals (2)", icon: "✓" },
];

const GENERATED_CONTENT = `**Q4 2025 Board Report**

**Executive Summary**
Q4 showed strong performance across all key metrics. Revenue grew 12% year-over-year, exceeding analyst expectations. The compliance program achieved full SOX certification with no material weaknesses.

**Financial Highlights**
• Revenue: $45.2M (+12% YoY)
• Operating Margin: 23.4%
• Cash Position: $128M

**Governance Updates**
• Completed annual board evaluation
• Onboarded 2 new independent directors
• Updated charter for Audit Committee

**Risk & Compliance**
All regulatory filings current. Key achievements:
• SOX 404 assessment completed
• GDPR compliance audit passed
• Cyber insurance renewed at favorable terms

**Looking Ahead**
Q1 2026 priorities include:
1. Strategic planning offsite (Jan 15)
2. FY2026 budget approval
3. Executive compensation review

**Recommendation**
Management recommends approval of the Q4 results and proposed dividend of $0.25/share.`;

// ─────────────────────────────────────────────────────────────
// Phone Frame Component
// ─────────────────────────────────────────────────────────────

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div style={styles.phoneFrame}>
      <div style={styles.phoneNotch} />
      <div style={styles.phoneScreen}>
        {children}
      </div>
      <div style={styles.phoneHomeIndicator} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Mobile Screens
// ─────────────────────────────────────────────────────────────

function HomeScreen({ 
  onNavigate, 
  notifications 
}: { 
  onNavigate: (screen: Screen) => void;
  notifications: Notification[];
}) {
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div style={styles.mobileScreen}>
      {/* Status Bar */}
      <div style={styles.statusBar}>
        <span>9:41</span>
        <span style={styles.statusIcons}>📶 🔋</span>
      </div>

      {/* Header */}
      <div style={styles.mobileHeader}>
        <h1 style={styles.mobileTitle}>AI Studio</h1>
        <button style={styles.notificationBell} onClick={() => onNavigate("status")}>
          🔔
          {unreadCount > 0 && <span style={styles.notificationBadge}>{unreadCount}</span>}
        </button>
      </div>

      {/* Recent/Suggested Actions (Not blank slate) */}
      <div style={styles.mobileContent}>
        <div style={styles.sectionLabel}>Pick up where you left off</div>
        <div style={styles.quickActionsList}>
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.id}
              style={styles.quickActionItem}
              onClick={() => {
                if (action.id === "recent1") onNavigate("review");
                else if (action.id === "recent2") onNavigate("status");
                else if (action.id === "action1") onNavigate("approval");
              }}
            >
              <span style={styles.quickActionIcon}>{action.icon}</span>
              <span style={styles.quickActionLabel}>{action.label}</span>
              <span style={styles.quickActionArrow}>›</span>
            </button>
          ))}
        </div>

        {/* In Progress */}
        <div style={styles.sectionLabel}>In Progress</div>
        {TASKS.filter(t => t.status === "generating").map(task => (
          <button 
            key={task.id} 
            style={styles.taskCard}
            onClick={() => onNavigate("status")}
          >
            <div style={styles.taskHeader}>
              <span style={styles.taskType}>{task.type}</span>
              <span style={styles.taskTime}>{task.createdAt}</span>
            </div>
            <div style={styles.taskTitle}>{task.title}</div>
            <div style={styles.progressContainer}>
              <div style={styles.progressBar}>
                <div style={{ ...styles.progressFill, width: `${task.progress}%` }} />
              </div>
              <span style={styles.progressText}>{task.progress}%</span>
            </div>
          </button>
        ))}

        {/* Ready for Review */}
        <div style={styles.sectionLabel}>Ready for Review</div>
        {TASKS.filter(t => t.status === "ready").map(task => (
          <button 
            key={task.id} 
            style={styles.taskCard}
            onClick={() => onNavigate("review")}
          >
            <div style={styles.taskHeader}>
              <span style={styles.taskType}>{task.type}</span>
              <span style={styles.readyBadge}>Ready</span>
            </div>
            <div style={styles.taskTitle}>{task.title}</div>
            <div style={styles.taskPreview}>{task.preview}</div>
          </button>
        ))}
      </div>

      {/* Bottom Sheet Trigger */}
      <button 
        style={styles.bottomSheetTrigger}
        onClick={() => setShowBottomSheet(true)}
      >
        <span style={styles.triggerIcon}>✨</span>
        <span>New task...</span>
        <span style={styles.micIcon}>🎤</span>
      </button>

      {/* Bottom Sheet */}
      {showBottomSheet && (
        <div style={styles.bottomSheetOverlay} onClick={() => setShowBottomSheet(false)}>
          <div style={styles.bottomSheet} onClick={e => e.stopPropagation()}>
            <div style={styles.bottomSheetHandle} />
            <div style={styles.bottomSheetContent}>
              <div style={styles.bottomSheetHeader}>
                <span style={styles.bottomSheetTitle}>New Task</span>
                <button style={styles.voiceButton}>
                  🎤 Voice
                </button>
              </div>
              
              <input
                type="text"
                placeholder="What do you need?"
                style={styles.bottomSheetInput}
                autoFocus
              />

              <div style={styles.suggestionLabel}>Suggested</div>
              <div style={styles.suggestionChips}>
                <button style={styles.suggestionChip}>Draft board report</button>
                <button style={styles.suggestionChip}>Compliance summary</button>
                <button style={styles.suggestionChip}>Meeting minutes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ReviewScreen({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  const [showEditSheet, setShowEditSheet] = useState(false);

  return (
    <div style={styles.mobileScreen}>
      {/* Status Bar */}
      <div style={styles.statusBar}>
        <span>9:41</span>
        <span style={styles.statusIcons}>📶 🔋</span>
      </div>

      {/* Header */}
      <div style={styles.reviewHeader}>
        <button style={styles.backButton} onClick={() => onNavigate("home")}>
          ‹ Back
        </button>
        <span style={styles.reviewTitle}>Q4 Board Report</span>
        <button style={styles.shareButton}>↗</button>
      </div>

      {/* Content - Optimized for reading */}
      <div style={styles.reviewContent}>
        <div style={styles.reviewMeta}>
          <span style={styles.reviewBadge}>AI Generated</span>
          <span style={styles.reviewTime}>Ready 10 min ago</span>
        </div>
        
        <div style={styles.documentContent}>
          {GENERATED_CONTENT.split('\n').map((line, i) => {
            if (line.startsWith('**') && line.endsWith('**')) {
              return <h3 key={i} style={styles.docHeading}>{line.replace(/\*\*/g, '')}</h3>;
            }
            if (line.startsWith('•')) {
              return <p key={i} style={styles.docBullet}>{line}</p>;
            }
            if (line.match(/^\d\./)) {
              return <p key={i} style={styles.docNumbered}>{line}</p>;
            }
            return line ? <p key={i} style={styles.docParagraph}>{line}</p> : <br key={i} />;
          })}
        </div>
      </div>

      {/* Fixed Bottom Actions */}
      <div style={styles.reviewActions}>
        <button 
          style={styles.editButton}
          onClick={() => setShowEditSheet(true)}
        >
          ✏️ Edit
        </button>
        <button style={styles.approveButton}>
          ✓ Approve & Share
        </button>
      </div>

      {/* Quick Edit Sheet */}
      {showEditSheet && (
        <div style={styles.bottomSheetOverlay} onClick={() => setShowEditSheet(false)}>
          <div style={styles.editSheet} onClick={e => e.stopPropagation()}>
            <div style={styles.bottomSheetHandle} />
            <div style={styles.editSheetContent}>
              <div style={styles.editSheetHeader}>
                <span style={styles.bottomSheetTitle}>Quick Edit</span>
                <button 
                  style={styles.doneButton}
                  onClick={() => setShowEditSheet(false)}
                >
                  Done
                </button>
              </div>
              
              <div style={styles.editOptions}>
                <button style={styles.editOption}>
                  <span>🎯</span>
                  <span>Make more concise</span>
                </button>
                <button style={styles.editOption}>
                  <span>📊</span>
                  <span>Add more data</span>
                </button>
                <button style={styles.editOption}>
                  <span>✍️</span>
                  <span>Adjust tone (more formal)</span>
                </button>
                <button style={styles.editOption}>
                  <span>📝</span>
                  <span>Edit specific section</span>
                </button>
              </div>

              <div style={styles.customEditSection}>
                <input
                  type="text"
                  placeholder="Or describe your edit..."
                  style={styles.customEditInput}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusScreen({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  return (
    <div style={styles.mobileScreen}>
      {/* Status Bar */}
      <div style={styles.statusBar}>
        <span>9:41</span>
        <span style={styles.statusIcons}>📶 🔋</span>
      </div>

      {/* Header */}
      <div style={styles.reviewHeader}>
        <button style={styles.backButton} onClick={() => onNavigate("home")}>
          ‹ Back
        </button>
        <span style={styles.reviewTitle}>Task Status</span>
        <div style={{ width: 60 }} />
      </div>

      {/* Status List */}
      <div style={styles.statusContent}>
        {TASKS.map(task => (
          <div key={task.id} style={styles.statusCard}>
            <div style={styles.statusCardHeader}>
              <div>
                <div style={styles.statusTaskType}>{task.type}</div>
                <div style={styles.statusTaskTitle}>{task.title}</div>
              </div>
              {task.status === "generating" ? (
                <div style={styles.generatingBadge}>
                  <span style={styles.spinnerIcon}>⏳</span>
                  Generating
                </div>
              ) : task.status === "ready" ? (
                <div style={styles.readyStatusBadge}>Ready</div>
              ) : (
                <div style={styles.reviewedBadge}>Reviewed</div>
              )}
            </div>

            {task.status === "generating" && (
              <div style={styles.statusProgress}>
                <div style={styles.statusProgressBar}>
                  <div style={{ ...styles.statusProgressFill, width: `${task.progress}%` }} />
                </div>
                <div style={styles.statusProgressMeta}>
                  <span>{task.progress}% complete</span>
                  <span>~2 min remaining</span>
                </div>
              </div>
            )}

            {task.status !== "generating" && (
              <div style={styles.statusMeta}>
                <span>Created {task.createdAt}</span>
                {task.readyAt && <span>Ready {task.readyAt}</span>}
              </div>
            )}

            {task.status === "ready" && (
              <button 
                style={styles.statusAction}
                onClick={() => onNavigate("review")}
              >
                Review Now →
              </button>
            )}
          </div>
        ))}

        {/* Notification Preferences */}
        <div style={styles.notificationPrefs}>
          <div style={styles.prefTitle}>Notifications</div>
          <div style={styles.prefItem}>
            <span>Push when tasks complete</span>
            <div style={styles.toggleOn} />
          </div>
          <div style={styles.prefItem}>
            <span>Approval requests</span>
            <div style={styles.toggleOn} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ApprovalScreen({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  const [approvedIds, setApprovedIds] = useState<string[]>([]);

  return (
    <div style={styles.mobileScreen}>
      {/* Status Bar */}
      <div style={styles.statusBar}>
        <span>9:41</span>
        <span style={styles.statusIcons}>📶 🔋</span>
      </div>

      {/* Header */}
      <div style={styles.reviewHeader}>
        <button style={styles.backButton} onClick={() => onNavigate("home")}>
          ‹ Back
        </button>
        <span style={styles.reviewTitle}>Approvals</span>
        <div style={{ width: 60 }} />
      </div>

      {/* Approval List */}
      <div style={styles.approvalContent}>
        <div style={styles.approvalCount}>
          {PENDING_APPROVALS.length - approvedIds.length} pending approval
        </div>

        {PENDING_APPROVALS.map(item => {
          const isApproved = approvedIds.includes(item.id);
          
          return (
            <div key={item.id} style={{
              ...styles.approvalCard,
              opacity: isApproved ? 0.5 : 1,
            }}>
              <div style={styles.approvalHeader}>
                <div style={styles.approvalType}>{item.type}</div>
                <div style={styles.approvalTime}>{item.submittedAt}</div>
              </div>
              <div style={styles.approvalTitle}>{item.title}</div>
              <div style={styles.approvalSubmitter}>
                From: {item.submittedBy}
              </div>

              {!isApproved ? (
                <div style={styles.approvalActions}>
                  <button style={styles.previewButton}>
                    Preview
                  </button>
                  <button 
                    style={styles.quickApproveButton}
                    onClick={() => setApprovedIds([...approvedIds, item.id])}
                  >
                    ✓ Approve
                  </button>
                </div>
              ) : (
                <div style={styles.approvedLabel}>
                  ✓ Approved
                </div>
              )}
            </div>
          );
        })}

        {approvedIds.length === PENDING_APPROVALS.length && (
          <div style={styles.allDone}>
            <span style={styles.allDoneIcon}>✅</span>
            <span>All caught up!</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────

export default function MobileFirstPage() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [notifications] = useState(NOTIFICATIONS);

  const renderScreen = () => {
    switch (currentScreen) {
      case "review":
        return <ReviewScreen onNavigate={setCurrentScreen} />;
      case "status":
        return <StatusScreen onNavigate={setCurrentScreen} />;
      case "approval":
        return <ApprovalScreen onNavigate={setCurrentScreen} />;
      default:
        return <HomeScreen onNavigate={setCurrentScreen} notifications={notifications} />;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-gray-100)" }}>
      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navInner}>
          <span style={styles.navLabel}>Experiment</span>
          <span style={styles.navTitle}>Mobile-First AI</span>
        </div>
        <a href="/" style={styles.navLink}>
          ← Back to Home
        </a>
      </nav>

      <main style={styles.main}>
        {/* Header */}
        <header style={styles.header}>
          <h1 style={styles.headline}>Mobile-First AI Experience</h1>
          <p style={styles.subhead}>
            Mobile isn't desktop-lite. These patterns optimize for real mobile GRC use cases: 
            reviewing drafts on commute, quick edits before sharing, status checks, and approvals.
          </p>
        </header>

        <Divider />

        {/* Screen Navigation */}
        <div style={styles.screenNav}>
          {[
            { id: "home", label: "Home", icon: "🏠" },
            { id: "review", label: "Review", icon: "📖" },
            { id: "status", label: "Status", icon: "⏳" },
            { id: "approval", label: "Approvals", icon: "✓" },
          ].map(screen => (
            <button
              key={screen.id}
              onClick={() => setCurrentScreen(screen.id as Screen)}
              style={{
                ...styles.screenNavButton,
                ...(currentScreen === screen.id ? styles.screenNavButtonActive : {}),
              }}
            >
              <span>{screen.icon}</span>
              <span>{screen.label}</span>
            </button>
          ))}
        </div>

        {/* Phone Mockup */}
        <div style={styles.mockupContainer}>
          <PhoneFrame>
            {renderScreen()}
          </PhoneFrame>
        </div>

        <Divider />

        {/* Principles */}
        <Card>
          <h3 style={styles.explainerTitle}>Mobile UX Principles Applied</h3>
          <div style={styles.principlesGrid}>
            <div style={styles.principleItem}>
              <span style={styles.principleIcon}>🎯</span>
              <div>
                <strong>Output-Focused</strong>
                <p style={styles.principleText}>
                  Prioritize viewing/editing generated content over creating new prompts.
                </p>
              </div>
            </div>
            <div style={styles.principleItem}>
              <span style={styles.principleIcon}>📋</span>
              <div>
                <strong>Recent Actions First</strong>
                <p style={styles.principleText}>
                  No blank slate — show recent tasks and suggested actions immediately.
                </p>
              </div>
            </div>
            <div style={styles.principleItem}>
              <span style={styles.principleIcon}>📱</span>
              <div>
                <strong>Bottom Sheet Pattern</strong>
                <p style={styles.principleText}>
                  Prompt input as bottom sheet keeps context visible while typing.
                </p>
              </div>
            </div>
            <div style={styles.principleItem}>
              <span style={styles.principleIcon}>🎤</span>
              <div>
                <strong>Voice Input Ready</strong>
                <p style={styles.principleText}>
                  Voice-to-text option for hands-free input (commute scenario).
                </p>
              </div>
            </div>
            <div style={styles.principleItem}>
              <span style={styles.principleIcon}>🔔</span>
              <div>
                <strong>Notification Integration</strong>
                <p style={styles.principleText}>
                  "Your report is ready" → tap to review directly in app.
                </p>
              </div>
            </div>
            <div style={styles.principleItem}>
              <span style={styles.principleIcon}>✏️</span>
              <div>
                <strong>Quick Edits</strong>
                <p style={styles.principleText}>
                  One-tap edit options instead of rewriting prompts from scratch.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Use Cases */}
        <Card style={{ marginTop: "var(--space-4)" }}>
          <h3 style={styles.explainerTitle}>When Users Actually Use Mobile</h3>
          <div style={styles.useCaseList}>
            <div style={styles.useCaseItem}>
              <span style={styles.useCaseIcon}>🚇</span>
              <div>
                <strong>Review Mode</strong>
                <span style={styles.useCaseDesc}>
                  Reading generated drafts while commuting or in meetings
                </span>
              </div>
            </div>
            <div style={styles.useCaseItem}>
              <span style={styles.useCaseIcon}>✏️</span>
              <div>
                <strong>Quick Edits</strong>
                <span style={styles.useCaseDesc}>
                  Tweaking AI output before sharing with exec team
                </span>
              </div>
            </div>
            <div style={styles.useCaseItem}>
              <span style={styles.useCaseIcon}>📊</span>
              <div>
                <strong>Status Checks</strong>
                <span style={styles.useCaseDesc}>
                  "Where's my compliance report?" — progress tracking
                </span>
              </div>
            </div>
            <div style={styles.useCaseItem}>
              <span style={styles.useCaseIcon}>✓</span>
              <div>
                <strong>Approval Flows</strong>
                <span style={styles.useCaseDesc}>
                  Quick review + approve of AI-generated content
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <p style={styles.footerNote}>
          Wireframe note: This experiment demonstrates mobile-specific AI UX patterns.
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
  screenNav: {
    display: "flex",
    justifyContent: "center",
    gap: "var(--space-2)",
    marginBottom: "var(--space-6)",
  },
  screenNavButton: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "var(--space-1)",
    padding: "var(--space-3) var(--space-4)",
    fontSize: "var(--text-sm)",
    color: "var(--color-gray-600)",
    background: "var(--color-white)",
    border: "1px solid var(--color-gray-200)",
    borderRadius: "var(--radius-lg)",
    cursor: "pointer",
    minWidth: "80px",
  },
  screenNavButtonActive: {
    background: "var(--color-gray-800)",
    borderColor: "var(--color-gray-800)",
    color: "var(--color-white)",
  },
  mockupContainer: {
    display: "flex",
    justifyContent: "center",
    padding: "var(--space-6) 0",
  },
  phoneFrame: {
    width: "375px",
    height: "812px",
    background: "var(--color-gray-900)",
    borderRadius: "44px",
    padding: "12px",
    position: "relative",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  },
  phoneNotch: {
    position: "absolute",
    top: "12px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "150px",
    height: "30px",
    background: "var(--color-gray-900)",
    borderRadius: "0 0 20px 20px",
    zIndex: 10,
  },
  phoneScreen: {
    width: "100%",
    height: "100%",
    background: "var(--color-white)",
    borderRadius: "36px",
    overflow: "hidden",
    position: "relative",
  },
  phoneHomeIndicator: {
    position: "absolute",
    bottom: "8px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "134px",
    height: "5px",
    background: "var(--color-gray-600)",
    borderRadius: "3px",
  },
  mobileScreen: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    background: "var(--color-gray-50)",
  },
  statusBar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "14px 24px 8px",
    fontSize: "14px",
    fontWeight: 600,
    color: "var(--color-gray-900)",
    background: "var(--color-white)",
  },
  statusIcons: {
    display: "flex",
    gap: "4px",
  },
  mobileHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 20px 16px",
    background: "var(--color-white)",
    borderBottom: "1px solid var(--color-gray-200)",
  },
  mobileTitle: {
    fontSize: "28px",
    fontWeight: 700,
    color: "var(--color-gray-900)",
    margin: 0,
  },
  notificationBell: {
    fontSize: "20px",
    background: "none",
    border: "none",
    cursor: "pointer",
    position: "relative",
    padding: "8px",
  },
  notificationBadge: {
    position: "absolute",
    top: "4px",
    right: "4px",
    width: "18px",
    height: "18px",
    background: "var(--color-gray-800)",
    color: "var(--color-white)",
    fontSize: "11px",
    fontWeight: 600,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  mobileContent: {
    flex: 1,
    overflow: "auto",
    padding: "16px 20px 100px",
  },
  sectionLabel: {
    fontSize: "13px",
    fontWeight: 600,
    color: "var(--color-gray-500)",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginTop: "20px",
    marginBottom: "12px",
  },
  quickActionsList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  quickActionItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px 16px",
    background: "var(--color-white)",
    border: "1px solid var(--color-gray-200)",
    borderRadius: "12px",
    cursor: "pointer",
    textAlign: "left",
  },
  quickActionIcon: {
    fontSize: "20px",
  },
  quickActionLabel: {
    flex: 1,
    fontSize: "15px",
    fontWeight: 500,
    color: "var(--color-gray-800)",
  },
  quickActionArrow: {
    fontSize: "20px",
    color: "var(--color-gray-400)",
  },
  taskCard: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    padding: "16px",
    background: "var(--color-white)",
    border: "1px solid var(--color-gray-200)",
    borderRadius: "12px",
    cursor: "pointer",
    textAlign: "left",
    marginBottom: "8px",
    width: "100%",
  },
  taskHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  taskType: {
    fontSize: "12px",
    fontWeight: 500,
    color: "var(--color-gray-500)",
  },
  taskTime: {
    fontSize: "12px",
    color: "var(--color-gray-400)",
  },
  taskTitle: {
    fontSize: "16px",
    fontWeight: 600,
    color: "var(--color-gray-900)",
  },
  taskPreview: {
    fontSize: "13px",
    color: "var(--color-gray-500)",
    lineHeight: 1.4,
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
  },
  readyBadge: {
    padding: "4px 10px",
    fontSize: "11px",
    fontWeight: 600,
    color: "var(--color-gray-700)",
    background: "var(--color-gray-200)",
    borderRadius: "12px",
  },
  progressContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  progressBar: {
    flex: 1,
    height: "6px",
    background: "var(--color-gray-200)",
    borderRadius: "3px",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "var(--color-gray-600)",
    borderRadius: "3px",
  },
  progressText: {
    fontSize: "12px",
    fontWeight: 600,
    color: "var(--color-gray-600)",
    minWidth: "36px",
  },
  bottomSheetTrigger: {
    position: "absolute",
    bottom: "24px",
    left: "20px",
    right: "20px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px 20px",
    background: "var(--color-gray-900)",
    color: "var(--color-white)",
    border: "none",
    borderRadius: "16px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: 500,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  },
  triggerIcon: {
    fontSize: "18px",
  },
  micIcon: {
    marginLeft: "auto",
    fontSize: "18px",
    opacity: 0.7,
  },
  bottomSheetOverlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0, 0, 0, 0.4)",
    display: "flex",
    alignItems: "flex-end",
    borderRadius: "36px",
    overflow: "hidden",
  },
  bottomSheet: {
    width: "100%",
    background: "var(--color-white)",
    borderTopLeftRadius: "20px",
    borderTopRightRadius: "20px",
    padding: "12px 20px 40px",
  },
  bottomSheetHandle: {
    width: "36px",
    height: "4px",
    background: "var(--color-gray-300)",
    borderRadius: "2px",
    margin: "0 auto 16px",
  },
  bottomSheetContent: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  bottomSheetHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bottomSheetTitle: {
    fontSize: "18px",
    fontWeight: 600,
    color: "var(--color-gray-900)",
  },
  voiceButton: {
    padding: "8px 12px",
    fontSize: "14px",
    fontWeight: 500,
    color: "var(--color-gray-700)",
    background: "var(--color-gray-100)",
    border: "1px solid var(--color-gray-200)",
    borderRadius: "8px",
    cursor: "pointer",
  },
  bottomSheetInput: {
    width: "100%",
    padding: "16px",
    fontSize: "16px",
    border: "2px solid var(--color-gray-300)",
    borderRadius: "12px",
    outline: "none",
  },
  suggestionLabel: {
    fontSize: "12px",
    fontWeight: 600,
    color: "var(--color-gray-500)",
    textTransform: "uppercase",
  },
  suggestionChips: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  suggestionChip: {
    padding: "10px 14px",
    fontSize: "14px",
    color: "var(--color-gray-700)",
    background: "var(--color-gray-100)",
    border: "1px solid var(--color-gray-200)",
    borderRadius: "20px",
    cursor: "pointer",
  },
  reviewHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    background: "var(--color-white)",
    borderBottom: "1px solid var(--color-gray-200)",
  },
  backButton: {
    fontSize: "17px",
    fontWeight: 500,
    color: "var(--color-gray-700)",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "8px",
  },
  reviewTitle: {
    fontSize: "17px",
    fontWeight: 600,
    color: "var(--color-gray-900)",
  },
  shareButton: {
    fontSize: "18px",
    color: "var(--color-gray-700)",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "8px",
  },
  reviewContent: {
    flex: 1,
    overflow: "auto",
    padding: "16px 20px 100px",
  },
  reviewMeta: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "16px",
  },
  reviewBadge: {
    padding: "4px 10px",
    fontSize: "11px",
    fontWeight: 600,
    color: "var(--color-gray-600)",
    background: "var(--color-gray-200)",
    borderRadius: "12px",
  },
  reviewTime: {
    fontSize: "13px",
    color: "var(--color-gray-500)",
  },
  documentContent: {
    background: "var(--color-white)",
    borderRadius: "12px",
    padding: "20px",
    border: "1px solid var(--color-gray-200)",
  },
  docHeading: {
    fontSize: "16px",
    fontWeight: 600,
    color: "var(--color-gray-900)",
    margin: "16px 0 8px",
  },
  docParagraph: {
    fontSize: "14px",
    color: "var(--color-gray-700)",
    lineHeight: 1.6,
    margin: "8px 0",
  },
  docBullet: {
    fontSize: "14px",
    color: "var(--color-gray-700)",
    lineHeight: 1.6,
    margin: "4px 0",
    paddingLeft: "8px",
  },
  docNumbered: {
    fontSize: "14px",
    color: "var(--color-gray-700)",
    lineHeight: 1.6,
    margin: "4px 0",
    paddingLeft: "8px",
  },
  reviewActions: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    display: "flex",
    gap: "12px",
    padding: "16px 20px 32px",
    background: "var(--color-white)",
    borderTop: "1px solid var(--color-gray-200)",
  },
  editButton: {
    flex: 1,
    padding: "14px",
    fontSize: "15px",
    fontWeight: 600,
    color: "var(--color-gray-700)",
    background: "var(--color-gray-100)",
    border: "1px solid var(--color-gray-200)",
    borderRadius: "12px",
    cursor: "pointer",
  },
  approveButton: {
    flex: 2,
    padding: "14px",
    fontSize: "15px",
    fontWeight: 600,
    color: "var(--color-white)",
    background: "var(--color-gray-800)",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
  },
  editSheet: {
    width: "100%",
    background: "var(--color-white)",
    borderTopLeftRadius: "20px",
    borderTopRightRadius: "20px",
    padding: "12px 20px 40px",
    maxHeight: "70%",
  },
  editSheetContent: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  editSheetHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  doneButton: {
    fontSize: "15px",
    fontWeight: 600,
    color: "var(--color-gray-800)",
    background: "none",
    border: "none",
    cursor: "pointer",
  },
  editOptions: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  editOption: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px 16px",
    fontSize: "15px",
    color: "var(--color-gray-800)",
    background: "var(--color-gray-50)",
    border: "1px solid var(--color-gray-200)",
    borderRadius: "12px",
    cursor: "pointer",
    textAlign: "left",
  },
  customEditSection: {
    marginTop: "8px",
  },
  customEditInput: {
    width: "100%",
    padding: "14px 16px",
    fontSize: "15px",
    border: "1px solid var(--color-gray-300)",
    borderRadius: "12px",
    outline: "none",
  },
  statusContent: {
    flex: 1,
    overflow: "auto",
    padding: "16px 20px",
  },
  statusCard: {
    padding: "16px",
    background: "var(--color-white)",
    border: "1px solid var(--color-gray-200)",
    borderRadius: "12px",
    marginBottom: "12px",
  },
  statusCardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "12px",
  },
  statusTaskType: {
    fontSize: "12px",
    fontWeight: 500,
    color: "var(--color-gray-500)",
    marginBottom: "4px",
  },
  statusTaskTitle: {
    fontSize: "16px",
    fontWeight: 600,
    color: "var(--color-gray-900)",
  },
  generatingBadge: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 10px",
    fontSize: "12px",
    fontWeight: 600,
    color: "var(--color-gray-600)",
    background: "var(--color-gray-100)",
    borderRadius: "12px",
  },
  spinnerIcon: {
    animation: "spin 1s linear infinite",
  },
  readyStatusBadge: {
    padding: "6px 10px",
    fontSize: "12px",
    fontWeight: 600,
    color: "var(--color-gray-700)",
    background: "var(--color-gray-200)",
    borderRadius: "12px",
  },
  reviewedBadge: {
    padding: "6px 10px",
    fontSize: "12px",
    fontWeight: 600,
    color: "var(--color-gray-500)",
    background: "var(--color-gray-100)",
    borderRadius: "12px",
  },
  statusProgress: {
    marginTop: "8px",
  },
  statusProgressBar: {
    height: "8px",
    background: "var(--color-gray-200)",
    borderRadius: "4px",
    overflow: "hidden",
    marginBottom: "8px",
  },
  statusProgressFill: {
    height: "100%",
    background: "var(--color-gray-600)",
    borderRadius: "4px",
    transition: "width 0.3s ease",
  },
  statusProgressMeta: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "12px",
    color: "var(--color-gray-500)",
  },
  statusMeta: {
    display: "flex",
    gap: "16px",
    fontSize: "13px",
    color: "var(--color-gray-500)",
  },
  statusAction: {
    marginTop: "12px",
    padding: "10px",
    fontSize: "14px",
    fontWeight: 600,
    color: "var(--color-gray-800)",
    background: "var(--color-gray-100)",
    border: "1px solid var(--color-gray-200)",
    borderRadius: "8px",
    cursor: "pointer",
    width: "100%",
  },
  notificationPrefs: {
    marginTop: "24px",
    padding: "16px",
    background: "var(--color-white)",
    border: "1px solid var(--color-gray-200)",
    borderRadius: "12px",
  },
  prefTitle: {
    fontSize: "14px",
    fontWeight: 600,
    color: "var(--color-gray-900)",
    marginBottom: "12px",
  },
  prefItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
    fontSize: "14px",
    color: "var(--color-gray-700)",
    borderBottom: "1px solid var(--color-gray-100)",
  },
  toggleOn: {
    width: "44px",
    height: "26px",
    background: "var(--color-gray-700)",
    borderRadius: "13px",
    position: "relative",
  },
  approvalContent: {
    flex: 1,
    overflow: "auto",
    padding: "16px 20px",
  },
  approvalCount: {
    fontSize: "14px",
    fontWeight: 500,
    color: "var(--color-gray-600)",
    marginBottom: "16px",
  },
  approvalCard: {
    padding: "16px",
    background: "var(--color-white)",
    border: "1px solid var(--color-gray-200)",
    borderRadius: "12px",
    marginBottom: "12px",
    transition: "opacity 0.3s ease",
  },
  approvalHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
  },
  approvalType: {
    fontSize: "12px",
    fontWeight: 600,
    color: "var(--color-gray-500)",
    textTransform: "uppercase",
  },
  approvalTime: {
    fontSize: "12px",
    color: "var(--color-gray-400)",
  },
  approvalTitle: {
    fontSize: "16px",
    fontWeight: 600,
    color: "var(--color-gray-900)",
    marginBottom: "4px",
  },
  approvalSubmitter: {
    fontSize: "13px",
    color: "var(--color-gray-500)",
    marginBottom: "12px",
  },
  approvalActions: {
    display: "flex",
    gap: "8px",
  },
  previewButton: {
    flex: 1,
    padding: "10px",
    fontSize: "14px",
    fontWeight: 500,
    color: "var(--color-gray-700)",
    background: "var(--color-gray-100)",
    border: "1px solid var(--color-gray-200)",
    borderRadius: "8px",
    cursor: "pointer",
  },
  quickApproveButton: {
    flex: 1,
    padding: "10px",
    fontSize: "14px",
    fontWeight: 600,
    color: "var(--color-white)",
    background: "var(--color-gray-800)",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  approvedLabel: {
    fontSize: "14px",
    fontWeight: 600,
    color: "var(--color-gray-500)",
    textAlign: "center",
    padding: "10px",
  },
  allDone: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    padding: "32px",
    color: "var(--color-gray-500)",
    fontSize: "16px",
    fontWeight: 500,
  },
  allDoneIcon: {
    fontSize: "32px",
  },
  explainerTitle: {
    fontSize: "var(--text-lg)",
    fontWeight: 600,
    color: "var(--color-gray-900)",
    marginBottom: "var(--space-4)",
  },
  principlesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "var(--space-4)",
  },
  principleItem: {
    display: "flex",
    gap: "var(--space-3)",
  },
  principleIcon: {
    fontSize: "24px",
    flexShrink: 0,
  },
  principleText: {
    fontSize: "var(--text-sm)",
    color: "var(--color-gray-600)",
    marginTop: "var(--space-1)",
  },
  useCaseList: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--space-3)",
  },
  useCaseItem: {
    display: "flex",
    alignItems: "center",
    gap: "var(--space-3)",
    padding: "var(--space-3)",
    background: "var(--color-gray-50)",
    borderRadius: "var(--radius-lg)",
  },
  useCaseIcon: {
    fontSize: "24px",
    flexShrink: 0,
  },
  useCaseDesc: {
    display: "block",
    fontSize: "var(--text-sm)",
    color: "var(--color-gray-500)",
    fontWeight: 400,
  },
  footerNote: {
    marginTop: "var(--space-10)",
    fontSize: "var(--text-xs)",
    color: "var(--color-gray-400)",
    textAlign: "center",
  },
};
