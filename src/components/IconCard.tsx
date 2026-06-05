/**
 * IconCard.tsx
 *
 * Single icon cell in the grid.
 * Click to open the detail panel. Visual highlight when included in the registry.
 */

import { Button } from 'ui/button';
import { cn } from 'utils';
import type { LucideIcon } from '../hooks/useLucideData';

import { ICON_GRID_SIZE } from 'config/defaults.constants';

import { IconSvg } from './IconSvg';

interface IconCardProps {
  icon: LucideIcon;
  isFocused: boolean;
  isIncluded: boolean;
  onClick: (icon: LucideIcon) => void;
  /** Double-click or keyboard confirm — toggles registry inclusion (same as footer Add/Remove). */
  onConfirm: (icon: LucideIcon) => void;
}

const VERTICAL_SHIFT = '3px';

/** Tweak grid cell layout here — plain px/rem */
const CARD_LAYOUT = {
  paddingTop: `calc(1rem + (${VERTICAL_SHIFT}))`,
  paddingBottom: `calc(1rem - (${VERTICAL_SHIFT}))`,
  paddingInline: 6,
  gapBetweenIconAndLabel: 6,
} as const;

export function IconCard({ icon, isFocused, isIncluded, onClick, onConfirm }: IconCardProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      role="checkbox"
      aria-checked={isIncluded}
      aria-label={`${icon.name}. Double-click or Space when focused to add or remove.`}
      onClick={() => onClick(icon)}
      onDoubleClick={(e) => {
        e.preventDefault();
        onConfirm(icon);
      }}
      style={{
        paddingTop: CARD_LAYOUT.paddingTop,
        paddingBottom: CARD_LAYOUT.paddingBottom,
        paddingLeft: CARD_LAYOUT.paddingInline,
        paddingRight: CARD_LAYOUT.paddingInline,
        gap: CARD_LAYOUT.gapBetweenIconAndLabel,
      }}
      className={cn(
        'flex h-auto min-w-0 flex-col items-center justify-center rounded-lg border-2 transition-[background,border-color,color] duration-120',
        isFocused && 'border-ring bg-muted/60 text-foreground hover:bg-muted/60 hover:text-foreground',
        !isFocused &&
          isIncluded &&
          'border-primary/80 bg-primary/8 text-primary/80 hover:bg-primary/8 hover:text-primary/80',
        !isFocused && !isIncluded && 'border-transparent text-muted-foreground hover:bg-accent/50',
      )}
    >
      <IconSvg node={icon.node} size={ICON_GRID_SIZE} />
      <span className="w-full truncate text-center text-[10px] leading-tight opacity-70">{icon.name}</span>
    </Button>
  );
}
