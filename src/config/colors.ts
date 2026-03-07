/**
 * colors.ts
 *
 * All UI colors for the lucide-manager picker app.
 * Every inline style color value in every component references this object.
 */

export const COLORS = {
  // ── Surfaces ────────────────────────────────────────────────────────────────
  bgApp: '#0f0f1a', // darkest — overall app background
  bgSurface: '#1a1a2e', // panels, search input, detail panel
  bgSurfaceDark: '#0f172a', // rename input (inset / darker)

  // ── Borders ─────────────────────────────────────────────────────────────────
  border: '#2d2d3f', // dividers, card outlines, input borders

  // ── Text ────────────────────────────────────────────────────────────────────
  textPrimary: '#f1f5f9', // headings, main content
  textSecondary: '#d1d5db', // unselected icons, body copy
  textMuted: '#94a3b8', // sidebar labels, category counts
  textDim: '#64748b', // status bar, close button, "exports as"
  textDimmer: '#475569', // empty states, grid count, section headings

  // ── Selected  (icon is in the registry) ─────────────────────────────────────
  selected: '#c5d8f8', // near-white blue — border, icon stroke, label
  selectedBg: 'rgba(197,216,248,0.12)', // subtle tint behind selected card

  // ── Active  (sidebar navigation) ────────────────────────────────────────────
  active: '#60a5fa', // active category / "All" item
  activeBg: 'rgba(96,165,250,0.15)', // active item background

  // ── Included  (green "Included" filter) ─────────────────────────────────────
  included: '#34d399', // "Included" toggle text + count highlight
  includedBg: 'rgba(52,211,153,0.12)', // "Included" toggle background

  // ── Status ──────────────────────────────────────────────────────────────────
  saving: '#fbbf24', // saving indicator (amber)
  error: '#f87171', // error states (red)

  // ── Action buttons ──────────────────────────────────────────────────────────
  removeBg: '#7f1d1d', // "Remove" button background
  removeText: '#fca5a5', // "Remove" button label
  addBg: '#1d4ed8', // "Add" button background
  addText: '#bfdbfe', // "Add" button label
} as const;
