# Agentic UI Wireframe Kit

A self-contained environment for generating grayscale interactive prototypes — designed to work with AI tools like ChatGPT, Cursor, and Claude.

## Quick Start

```bash
npm install
npm run dev
```

Then open:
- http://localhost:3000 — Experiment index
- http://localhost:3000/experiments/agentic-hero — Agentic dashboard
- http://localhost:3000/experiments/ca-books — Books list
- http://localhost:3000/experiments/ca-bookbuilder — Book editor

## What's Inside

| Folder | Purpose |
|--------|---------|
| `app/` | Next.js pages and experiments |
| `wireframe-primitives/` | Reusable components (Button, Card, Input, Divider) |
| `styles/` | CSS variables and base styles |
| `README-for-AI.md` | Detailed instructions for AI assistants |

## Design Principles

- **Grayscale only** — No brand colors, forces focus on UX
- **Self-contained** — No external dependencies beyond React/Next
- **Local mock data** — Everything defined inline
- **Simple state** — useState only, no complex hooks

## For AI Assistants

Read `README-for-AI.md` for detailed patterns, example prompts, and extension guidelines.

## Team Usage

1. Clone this repo
2. Run `npm install && npm run dev`
3. Browse experiments for inspiration
4. Copy patterns to start new prototypes
5. Tell Claude/Cursor: "Use the wireframe kit to build [your idea]"

---

*Maintained by: Design & Prototyping team*
