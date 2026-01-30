"use client";

/**
 * Capability Carousel Component
 * 
 * A progressive disclosure UI pattern that showcases AI capabilities through:
 * - Rotating placeholder text based on user role
 * - Clickable example prompts ("Try this" pills)
 * - Capability badge showing current features
 * - Mobile-responsive design with bottom sheet
 * - Prompt attempt tracking for prioritization
 * 
 * @example
 * ```tsx
 * <CapabilityCarousel
 *   userRole="gc"
 *   value={prompt}
 *   onChange={setPrompt}
 *   onSubmit={handleSubmit}
 *   onPromptAttempt={(prompt, completed) => {
 *     // Track for analytics/prioritization
 *   }}
 * />
 * ```
 */

import React, { useState, useEffect, useCallback } from "react";
import { Input } from "./Input";
import { Button } from "./Button";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export type UserRole = "gc" | "compliance" | "board_admin" | "general";

export interface CapabilityExample {
  text: string;
  category: string;
}

export interface CapabilityCarouselProps {
  userRole?: UserRole;
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  onPromptAttempt?: (prompt: string, completed: boolean) => void;
  className?: string;
}

// ─────────────────────────────────────────────────────────────
// Role-based Prompt Examples
// ─────────────────────────────────────────────────────────────

const PROMPT_EXAMPLES: Record<UserRole, CapabilityExample[]> = {
  gc: [
    {
      text: "Draft a board report summary from last quarter's filings",
      category: "Document Generation",
    },
    {
      text: "Generate compliance checklist for SOX 404",
      category: "Compliance",
    },
    {
      text: "Create meeting agenda from prior action items",
      category: "Document Generation",
    },
    {
      text: "Analyze coverage gaps across entities and third parties",
      category: "Analysis",
    },
  ],
  compliance: [
    {
      text: "Generate compliance checklist for SOX 404",
      category: "Compliance",
    },
    {
      text: "Map entity–vendor links for risk assessment",
      category: "Risk Management",
    },
    {
      text: "Assess audit readiness for Q4 review",
      category: "Compliance",
    },
    {
      text: "Identify policy drift across all entities",
      category: "Policy Management",
    },
  ],
  board_admin: [
    {
      text: "Create meeting agenda from prior action items",
      category: "Document Generation",
    },
    {
      text: "Draft board report summary from last quarter's filings",
      category: "Document Generation",
    },
    {
      text: "Generate director education tracking report",
      category: "Reporting",
    },
    {
      text: "Summarize key decisions from last board meeting",
      category: "Document Generation",
    },
  ],
  general: [
    {
      text: "Show me coverage gaps across entities and third parties",
      category: "Analysis",
    },
    {
      text: "Map entity–vendor links",
      category: "Risk Management",
    },
    {
      text: "Assess audit readiness",
      category: "Compliance",
    },
    {
      text: "Generate recommendations",
      category: "Analysis",
    },
  ],
};

const PLACEHOLDER_ROTATION_INTERVAL = 4000; // 4 seconds

// ─────────────────────────────────────────────────────────────
// Capability Badge Text
// ─────────────────────────────────────────────────────────────

const CAPABILITY_BADGE = "AI Assistant · Document Generation";

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

export function CapabilityCarousel({
  userRole = "general",
  value,
  onChange,
  onSubmit,
  onPromptAttempt,
  className,
}: CapabilityCarouselProps) {
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileSheet, setShowMobileSheet] = useState(false);

  const examples = PROMPT_EXAMPLES[userRole];
  const displayedExamples = isMobile ? examples.slice(0, 2) : examples.slice(0, 3);

  // Rotate placeholder text
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholderIndex((prev) => (prev + 1) % examples.length);
    }, PLACEHOLDER_ROTATION_INTERVAL);

    return () => clearInterval(interval);
  }, [examples.length]);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const currentPlaceholder = examples[currentPlaceholderIndex]?.text || "";

  const handleExampleClick = useCallback(
    (example: CapabilityExample) => {
      onChange(example.text);
      // Track that user attempted this prompt
      onPromptAttempt?.(example.text, false);
    },
    [onChange, onPromptAttempt]
  );

  const handleSubmit = useCallback(() => {
    if (value.trim()) {
      onSubmit?.(value);
      // Track successful prompt attempt
      onPromptAttempt?.(value, true);
    }
  }, [value, onSubmit, onPromptAttempt]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={className} style={styles.container}>
      {/* Capability Badge */}
      <div style={styles.badgeContainer}>
        <span style={styles.badge}>{CAPABILITY_BADGE}</span>
      </div>

      {/* Prompt Input */}
      <div style={styles.inputContainer}>
        <Input
          placeholder={currentPlaceholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          style={styles.input}
        />
        {onSubmit && (
          <Button data-variant="primary" onClick={handleSubmit} style={styles.submitButton}>
            Run Task
          </Button>
        )}
      </div>

      {/* Example Pills */}
      {!isMobile && (
        <div style={styles.examplesContainer}>
          <span style={styles.examplesLabel}>Try this:</span>
          <div style={styles.examplesRow}>
            {displayedExamples.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example)}
                style={{
                  ...styles.examplePill,
                  ...(value === example.text ? styles.examplePillActive : {}),
                }}
              >
                {example.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mobile: Collapsed Examples */}
      {isMobile && !showMobileSheet && (
        <div style={styles.mobileExamplesTrigger}>
          <button
            onClick={() => setShowMobileSheet(true)}
            style={styles.mobileExamplesButton}
          >
            {displayedExamples.length} suggestions
          </button>
        </div>
      )}

      {/* Mobile: Bottom Sheet */}
      {isMobile && showMobileSheet && (
        <div style={styles.mobileSheetOverlay} onClick={() => setShowMobileSheet(false)}>
          <div
            style={styles.mobileSheet}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={styles.mobileSheetHeader}>
              <span style={styles.mobileSheetTitle}>Try this</span>
              <button
                onClick={() => setShowMobileSheet(false)}
                style={styles.mobileSheetClose}
              >
                ×
              </button>
            </div>
            <div style={styles.mobileSheetExamples}>
              {examples.map((example, index) => (
                <button
                  key={index}
                  onClick={() => {
                    handleExampleClick(example);
                    setShowMobileSheet(false);
                  }}
                  style={styles.mobileExampleItem}
                >
                  {example.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: "100%",
  },
  badgeContainer: {
    marginBottom: "var(--space-2)",
  },
  badge: {
    fontSize: "var(--text-xs)",
    fontWeight: 500,
    color: "var(--color-gray-500)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  inputContainer: {
    display: "flex",
    gap: "var(--space-2)",
    alignItems: "stretch",
  },
  input: {
    flex: 1,
  },
  submitButton: {
    flexShrink: 0,
  },
  examplesContainer: {
    marginTop: "var(--space-3)",
    display: "flex",
    alignItems: "center",
    gap: "var(--space-2)",
    flexWrap: "wrap",
  },
  examplesLabel: {
    fontSize: "var(--text-xs)",
    fontWeight: 500,
    color: "var(--color-gray-600)",
  },
  examplesRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "var(--space-2)",
  },
  examplePill: {
    padding: "var(--space-1) var(--space-3)",
    fontSize: "var(--text-xs)",
    color: "var(--color-gray-700)",
    background: "var(--color-gray-50)",
    border: "1px solid var(--color-gray-200)",
    borderRadius: "var(--radius-xl)",
    cursor: "pointer",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
    maxWidth: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  examplePillActive: {
    background: "var(--color-gray-200)",
    borderColor: "var(--color-gray-300)",
    fontWeight: 500,
  },
  mobileExamplesTrigger: {
    marginTop: "var(--space-2)",
  },
  mobileExamplesButton: {
    padding: "var(--space-2) var(--space-3)",
    fontSize: "var(--text-xs)",
    color: "var(--color-gray-600)",
    background: "var(--color-gray-50)",
    border: "1px solid var(--color-gray-200)",
    borderRadius: "var(--radius-lg)",
    cursor: "pointer",
    width: "100%",
    textAlign: "center",
  },
  mobileSheetOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
    display: "flex",
    alignItems: "flex-end",
  },
  mobileSheet: {
    width: "100%",
    maxHeight: "70vh",
    background: "var(--color-white)",
    borderTopLeftRadius: "var(--radius-xl)",
    borderTopRightRadius: "var(--radius-xl)",
    padding: "var(--space-4)",
    display: "flex",
    flexDirection: "column",
  },
  mobileSheetHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "var(--space-4)",
    paddingBottom: "var(--space-3)",
    borderBottom: "1px solid var(--color-gray-200)",
  },
  mobileSheetTitle: {
    fontSize: "var(--text-base)",
    fontWeight: 600,
    color: "var(--color-gray-900)",
  },
  mobileSheetClose: {
    background: "none",
    border: "none",
    fontSize: "24px",
    color: "var(--color-gray-600)",
    cursor: "pointer",
    padding: 0,
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  mobileSheetExamples: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--space-2)",
    overflowY: "auto",
  },
  mobileExampleItem: {
    padding: "var(--space-3)",
    fontSize: "var(--text-sm)",
    color: "var(--color-gray-700)",
    background: "var(--color-gray-50)",
    border: "1px solid var(--color-gray-200)",
    borderRadius: "var(--radius-lg)",
    cursor: "pointer",
    textAlign: "left",
    width: "100%",
  },
};
