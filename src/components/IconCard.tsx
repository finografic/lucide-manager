/**
 * IconCard.tsx
 *
 * Single icon cell in the grid.
 * Click to open the detail panel. Visual highlight when included in the registry.
 */

import { COLORS } from '../config/colors';
import type { LucideIcon } from '../hooks/useLucideData';
import { IconSvg } from './IconSvg';

interface IconCardProps {
  icon: LucideIcon;
  isFocused: boolean;
  isIncluded: boolean;
  onClick: (icon: LucideIcon) => void;
}

export function IconCard({ icon, isFocused, isIncluded, onClick }: IconCardProps) {
  const borderColor = isFocused
    ? COLORS.active
    : isIncluded
    ? COLORS.included
    : 'transparent';
  const bgColor = isFocused
    ? COLORS.activeBg
    : isIncluded
    ? COLORS.includedBg
    : 'transparent';
  const textColor = isFocused
    ? COLORS.selected
    : isIncluded
    ? COLORS.included
    : COLORS.textSecondary;
  const isHighlighted = isFocused || isIncluded;

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
        border: `2px solid ${borderColor}`,
        borderRadius: '8px',
        background: bgColor,
        cursor: 'pointer',
        color: textColor,
        transition: 'background 120ms, border-color 120ms, color 120ms',
        minWidth: 0,
      }}
      onMouseEnter={e => {
        if (!isHighlighted) {
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)';
        }
      }}
      onMouseLeave={e => {
        if (!isHighlighted) {
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
