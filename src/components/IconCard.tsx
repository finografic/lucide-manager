/**
 * IconCard.tsx
 *
 * Single icon cell in the grid.
 * Click to open the detail panel. Visual highlight when included in the registry.
 */

import type { LucideIcon } from '../hooks/useLucideData';
import { IconSvg } from './IconSvg';

interface IconCardProps {
  icon: LucideIcon;
  selected: boolean;
  onClick: (icon: LucideIcon) => void;
}

export function IconCard({ icon, selected, onClick }: IconCardProps) {
  return (
    <button
      onClick={() => onClick(icon)}
      title={icon.name}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        padding: '10px 6px 8px',
        border: selected ? '2px solid #60a5fa' : '2px solid transparent',
        borderRadius: '8px',
        background: selected ? 'rgba(96,165,250,0.12)' : 'transparent',
        cursor: 'pointer',
        color: selected ? '#60a5fa' : '#d1d5db',
        transition: 'background 120ms, border-color 120ms, color 120ms',
        minWidth: 0,
      }}
      onMouseEnter={e => {
        if (!selected) {
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)';
        }
      }}
      onMouseLeave={e => {
        if (!selected) {
          (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
        }
      }}
    >
      <IconSvg node={icon.node} size={20} />
      <span
        style={{
          fontSize: '10px',
          lineHeight: 1.2,
          textAlign: 'center',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          width: '100%',
          opacity: 0.7,
        }}
      >
        {icon.name}
      </span>
    </button>
  );
}
