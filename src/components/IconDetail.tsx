/**
 * IconDetail.tsx
 *
 * Detail panel shown when an icon is clicked.
 * Displays: large preview, name, categories, current exportName, add/remove toggle,
 * and an inline rename field for the exportName (rare but supported).
 */

import { useEffect, useState } from 'react';

import type { IconEntry } from '../hooks/useIconsJson';
import type { LucideIcon } from '../hooks/useLucideData';
import { IconSvg } from './IconSvg';

interface IconDetailProps {
  icon: LucideIcon;
  selected: boolean;
  entry: IconEntry | undefined;
  onToggle: (lucideName: string) => void;
  onRename: (lucideName: string, exportName: string) => void;
  onClose: () => void;
}

export function IconDetail(
  { icon, selected, entry, onToggle, onRename, onClose }: IconDetailProps,
) {
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(entry?.exportName ?? '');

  // Sync input when entry changes (e.g. navigating between icons)
  useEffect(() => {
    setNameInput(entry?.exportName ?? '');
    setEditingName(false);
  }, [icon.name, entry?.exportName]);

  function commitRename() {
    const trimmed = nameInput.trim();
    if (trimmed && trimmed !== entry?.exportName) {
      onRename(icon.name, trimmed);
    }
    setEditingName(false);
  }

  const exportLabel = entry ? `${entry.exportName}Icon` : 'Not included';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#1a1a2e',
        borderTop: '1px solid #2d2d3f',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        zIndex: 100,
        boxShadow: '0 -4px 24px rgba(0,0,0,0.4)',
      }}
    >
      {/* Large preview */}
      <div
        style={{
          width: 72,
          height: 72,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255,255,255,0.04)',
          borderRadius: '12px',
          flexShrink: 0,
          color: selected ? '#60a5fa' : '#d1d5db',
        }}
      >
        <IconSvg node={icon.node} size={36} />
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '16px', fontWeight: 600, color: '#f1f5f9', marginBottom: '4px' }}>
          {icon.name}
        </div>

        {/* Categories */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
          {icon.categories.length > 0
            ? icon.categories.map(cat => (
              <span
                key={cat}
                style={{
                  fontSize: '11px',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  background: 'rgba(255,255,255,0.08)',
                  color: '#94a3b8',
                }}
              >
                {cat}
              </span>
            ))
            : <span style={{ fontSize: '11px', color: '#64748b' }}>No categories</span>}
        </div>

        {/* Export name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: '#64748b' }}>exports as</span>

          {selected && editingName
            ? (
              <input
                autoFocus
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                onBlur={commitRename}
                onKeyDown={e => {
                  if (e.key === 'Enter') commitRename();
                  if (e.key === 'Escape') {
                    setNameInput(entry?.exportName ?? '');
                    setEditingName(false);
                  }
                }}
                style={{
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  border: '1px solid #60a5fa',
                  background: '#0f172a',
                  color: '#f1f5f9',
                  width: '180px',
                }}
              />
            )
            : (
              <button
                onClick={() => selected && setEditingName(true)}
                title={selected ? 'Click to rename export' : 'Add icon first to rename'}
                style={{
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  color: selected ? '#93c5fd' : '#475569',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: selected ? 'text' : 'default',
                  textDecoration: selected ? 'underline dotted' : 'none',
                }}
              >
                {exportLabel}
              </button>
            )}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
        <button
          onClick={() => onToggle(icon.name)}
          style={{
            padding: '8px 20px',
            borderRadius: '8px',
            border: 'none',
            fontWeight: 600,
            fontSize: '14px',
            cursor: 'pointer',
            background: selected ? '#7f1d1d' : '#1d4ed8',
            color: selected ? '#fca5a5' : '#bfdbfe',
            transition: 'background 120ms',
          }}
        >
          {selected ? 'Remove' : 'Add'}
        </button>
        <button
          onClick={onClose}
          style={{
            padding: '8px 14px',
            borderRadius: '8px',
            border: '1px solid #2d2d3f',
            background: 'transparent',
            color: '#64748b',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
