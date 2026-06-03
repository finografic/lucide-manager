/**
 * IconCard.tsx
 *
 * Single icon cell in the grid.
 * Click to open the detail panel. Visual highlight when included in the registry.
 */

import type { LucideIcon } from '../hooks/useLucideData';

import { IconSvg } from './IconSvg';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface IconCardProps {
  icon: LucideIcon;
  isFocused: boolean;
  isIncluded: boolean;
  onClick: (icon: LucideIcon) => void;
}

export function IconCard({ icon, isFocused, isIncluded, onClick }: IconCardProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      title={icon.name}
      onClick={() => onClick(icon)}
      className={cn(
        'flex h-auto min-w-0 flex-col items-center justify-center gap-1.5 rounded-lg border-2 px-1.5 py-5 transition-[background,border-color,color] duration-120',
        isFocused && 'border-ring bg-muted/60 text-foreground hover:bg-muted/60 hover:text-foreground',
        !isFocused &&
          isIncluded &&
          'border-primary bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary',
        !isFocused && !isIncluded && 'border-transparent text-muted-foreground hover:bg-accent/50',
      )}
    >
      <div className="px-2.5 py-0.5">
        <IconSvg node={icon.node} size={28} />
      </div>
      <span className="w-full truncate text-center text-[10px] leading-tight opacity-70">{icon.name}</span>
    </Button>
  );
}
