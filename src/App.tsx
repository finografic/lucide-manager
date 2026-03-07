/**
 * App.tsx — Icon Picker & Manager
 *
 * Search, browse by category, and manage which Lucide icons
 * are registered in the DS icon registry (icons.json).
 */

import { useEffect, useMemo, useRef, useState } from 'react';

import { CategorySidebar } from './components/CategorySidebar';
import { IconCard } from './components/IconCard';
import { IconDetail } from './components/IconDetail';
import { COLORS } from './config/colors';
import { useIconsJson } from './hooks/useIconsJson';
import type { LucideIcon } from './hooks/useLucideData';
import { useLucideData } from './hooks/useLucideData';

// ── Category display labels ────────────────────────────────────────────────────
// Matches the titles from lucide's categoriesData.json

const CATEGORY_LABELS: Record<string, string> = {
  accessibility: 'Accessibility',
  account: 'Accounts & access',
  animals: 'Animals',
  arrows: 'Arrows',
  brands: 'Brands',
  buildings: 'Buildings',
  charts: 'Charts',
  communication: 'Communication',
  connectivity: 'Connectivity',
  cursors: 'Cursors',
  design: 'Design',
  development: 'Coding & development',
  devices: 'Devices',
  emoji: 'Emoji',
  files: 'File icons',
  finance: 'Finance',
  'food-beverage': 'Food & beverage',
  gaming: 'Gaming',
  home: 'Home',
  layout: 'Layout',
  mail: 'Mail',
  math: 'Math',
  medical: 'Medical',
  multimedia: 'Multimedia',
  nature: 'Nature',
  navigation: 'Navigation',
  notifications: 'Notifications',
  people: 'People',
  photography: 'Photography',
  science: 'Science',
  seasons: 'Seasons',
  security: 'Security',
  shapes: 'Shapes',
  shopping: 'Shopping',
  social: 'Social',
  sports: 'Sports',
  sustainability: 'Sustainability',
  text: 'Text',
  time: 'Time',
  tools: 'Tools',
  transportation: 'Transportation',
  travel: 'Travel',
  weather: 'Weather',
};

// ── App ────────────────────────────────────────────────────────────────────────

export function App() {
  const { icons: allIcons, loading: lucideLoading, error: lucideError } = useLucideData();
  const {
    entries,
    loading: jsonLoading,
    saving,
    error: saveError,
    isSelected,
    toggleIcon,
    renameExport,
  } = useIconsJson();

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showIncludedOnly, setShowIncludedOnly] = useState(false);
  const [focusedIcon, setFocusedIcon] = useState<LucideIcon | null>(null);

  const searchRef = useRef<HTMLInputElement>(null);

  // Focus search on mount
  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  // Keyboard: Escape closes detail panel
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setFocusedIcon(null);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // ── Derived categories with counts ──────────────────────────────────────────

  const categories = useMemo(() => {
    const countMap = new Map<string, number>();
    for (const icon of allIcons) {
      for (const cat of icon.categories) {
        countMap.set(cat, (countMap.get(cat) ?? 0) + 1);
      }
    }
    return Object.entries(CATEGORY_LABELS)
      .map(([name, label]) => ({ name, label, count: countMap.get(name) ?? 0 }))
      .filter(cat => cat.count > 0)
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [allIcons]);

  // ── Filtered icons ───────────────────────────────────────────────────────────

  const filteredIcons = useMemo(() => {
    let result = allIcons;

    if (showIncludedOnly) {
      result = result.filter(icon => isSelected(icon.name));
    } else if (activeCategory) {
      result = result.filter(icon => icon.categories.includes(activeCategory));
    }

    if (query.trim()) {
      const lower = query.toLowerCase();
      result = result.filter(icon =>
        icon.name.includes(lower)
        || icon.categories.some(cat => cat.includes(lower))
      );
    }

    return result;
  }, [allIcons, query, activeCategory, showIncludedOnly, isSelected]);

  // ── Focused entry ────────────────────────────────────────────────────────────

  const focusedEntry = focusedIcon
    ? entries.find(e => e.lucideName === focusedIcon.name)
    : undefined;

  // ── Render ───────────────────────────────────────────────────────────────────

  const loading = lucideLoading || jsonLoading;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: COLORS.bgApp,
        color: COLORS.textPrimary,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '12px 20px',
          borderBottom: `1px solid ${COLORS.border}`,
          flexShrink: 0,
        }}
      >
        <div
          style={{ fontWeight: 700, fontSize: '15px', color: COLORS.textPrimary, flexShrink: 0 }}
        >
          Lucide Manager
        </div>

        {/* Search */}
        <div style={{ position: 'relative', flex: 1, maxWidth: '480px' }}>
          <svg
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              opacity: 0.4,
            }}
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={searchRef}
            type="text"
            placeholder="Search icons…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '7px 12px 7px 32px',
              borderRadius: '8px',
              border: `1px solid ${COLORS.border}`,
              background: COLORS.bgSurface,
              color: COLORS.textPrimary,
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: COLORS.textDim,
                cursor: 'pointer',
                fontSize: '16px',
                lineHeight: 1,
                padding: '0 2px',
              }}
            >
              ×
            </button>
          )}
        </div>

        {/* Status */}
        <div style={{ fontSize: '13px', color: COLORS.textDim, flexShrink: 0, marginLeft: 'auto' }}>
          {saving
            ? <span style={{ color: COLORS.saving }}>Saving…</span>
            : saveError
            ? <span style={{ color: COLORS.error }}>Save failed</span>
            : (
              <span>
                <span style={{ color: COLORS.included, fontWeight: 600 }}>{entries.length}</span>
                {' included · '}
                <span style={{ color: COLORS.textMuted }}>{allIcons.length || '…'}</span>
                {' total'}
              </span>
            )}
        </div>
      </header>

      {/* ── Body ────────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <CategorySidebar
          categories={categories}
          activeCategory={activeCategory}
          showIncludedOnly={showIncludedOnly}
          includedCount={entries.length}
          onSelectCategory={setActiveCategory}
          onToggleIncluded={() => setShowIncludedOnly(prev => !prev)}
        />

        {/* Grid area */}
        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            paddingBottom: focusedIcon ? '120px' : '16px',
          }}
        >
          {loading
            ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '200px',
                  color: COLORS.textDimmer,
                }}
              >
                Loading icons…
              </div>
            )
            : lucideError
            ? (
              <div style={{ padding: '24px', color: COLORS.error }}>
                Failed to load Lucide data: {lucideError}
              </div>
            )
            : filteredIcons.length === 0
            ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '200px',
                  color: COLORS.textDimmer,
                }}
              >
                No icons match &ldquo;{query}&rdquo;
              </div>
            )
            : (
              <>
                <div style={{ fontSize: '12px', color: COLORS.textDimmer, marginBottom: '12px' }}>
                  {filteredIcons.length} icon{filteredIcons.length !== 1 ? 's' : ''}
                  {query
                    ? ` matching "${query}"`
                    : activeCategory
                    ? ` in ${CATEGORY_LABELS[activeCategory] ?? activeCategory}`
                    : showIncludedOnly
                    ? ' included'
                    : ''}
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(84px, 1fr))',
                    gap: '4px',
                  }}
                >
                  {filteredIcons.map(icon => (
                    <IconCard
                      key={icon.name}
                      icon={icon}
                      isFocused={focusedIcon?.name === icon.name}
                      isIncluded={isSelected(icon.name)}
                      onClick={setFocusedIcon}
                    />
                  ))}
                </div>
              </>
            )}
        </main>
      </div>

      {/* ── Detail panel ────────────────────────────────────────────────────── */}
      {focusedIcon && (
        <IconDetail
          icon={focusedIcon}
          selected={isSelected(focusedIcon.name)}
          entry={focusedEntry}
          onToggle={name => toggleIcon(name)}
          onRename={renameExport}
          onClose={() => setFocusedIcon(null)}
        />
      )}
    </div>
  );
}
