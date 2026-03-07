/**
 * CategorySidebar.tsx
 *
 * Left sidebar with category list + counts, mirroring lucide.dev's layout.
 * "All" resets category filter. "Included" filters to selected icons only.
 */

import React from 'react';

interface Category {
  name: string;
  label: string;
  count: number;
}

interface CategorySidebarProps {
  categories: Category[];
  activeCategory: string | null; // null = "All"
  showIncludedOnly: boolean;
  includedCount: number;
  onSelectCategory: (name: string | null) => void;
  onToggleIncluded: () => void;
}

export function CategorySidebar({
  categories,
  activeCategory,
  showIncludedOnly,
  includedCount,
  onSelectCategory,
  onToggleIncluded,
}: CategorySidebarProps) {
  const itemStyle = (active: boolean): React.CSSProperties => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '5px 10px',
    borderRadius: '6px',
    cursor: 'pointer',
    background: active ? 'rgba(96,165,250,0.15)' : 'transparent',
    color: active ? '#60a5fa' : '#94a3b8',
    fontSize: '13px',
    border: 'none',
    width: '100%',
    textAlign: 'left',
    transition: 'background 100ms, color 100ms',
  });

  return (
    <aside
      style={{
        width: '200px',
        flexShrink: 0,
        overflowY: 'auto',
        borderRight: '1px solid #2d2d3f',
        padding: '12px 8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
      }}
    >
      {/* View section */}
      <div
        style={{
          fontSize: '11px',
          color: '#475569',
          padding: '4px 10px 6px',
          fontWeight: 600,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}
      >
        View
      </div>

      <button
        style={itemStyle(!showIncludedOnly && activeCategory === null)}
        onClick={() => {
          onSelectCategory(null);
          if (showIncludedOnly) onToggleIncluded();
        }}
      >
        <span>All</span>
      </button>

      <button
        style={{
          ...itemStyle(showIncludedOnly),
          color: showIncludedOnly ? '#34d399' : '#94a3b8',
          background: showIncludedOnly ? 'rgba(52,211,153,0.12)' : 'transparent',
        }}
        onClick={onToggleIncluded}
      >
        <span>Included</span>
        <span style={{ fontSize: '11px', opacity: 0.7 }}>{includedCount}</span>
      </button>

      {/* Categories section */}
      <div
        style={{
          fontSize: '11px',
          color: '#475569',
          padding: '12px 10px 6px',
          fontWeight: 600,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}
      >
        Categories
      </div>

      {categories.map(cat => (
        <button
          key={cat.name}
          style={itemStyle(!showIncludedOnly && activeCategory === cat.name)}
          onClick={() => {
            onSelectCategory(cat.name);
            if (showIncludedOnly) onToggleIncluded();
          }}
        >
          <span>{cat.label}</span>
          <span style={{ fontSize: '11px', opacity: 0.6 }}>{cat.count}</span>
        </button>
      ))}
    </aside>
  );
}
