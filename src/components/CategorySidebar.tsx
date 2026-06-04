import type { ReactNode } from 'react';

/**
 * CategorySidebar.tsx
 *
 * Left sidebar with category list + counts, mirroring lucide.dev's layout.
 * "All" resets category filter. "Included" filters to selected icons only.
 */

import { Button } from 'ui/button';
import { ScrollArea } from 'ui/scroll-area';
import { cn } from 'utils';

import { APP_CHROME_ROW_SIDEBAR_CLASS } from 'config/app-chrome.constants';
import type { LucideManagerAppBranding } from 'config/lucide-manager.config.types';

interface Category {
  name: string;
  label: string;
  count: number;
}

interface CategorySidebarProps {
  appBranding: LucideManagerAppBranding;
  categories: Category[];
  activeCategory: string | null;
  showIncludedOnly: boolean;
  includedCount: number;
  onSelectCategory: (name: string | null) => void;
  onToggleIncluded: () => void;
}

function SidebarItem({
  active,
  includedTone,
  children,
  onClick,
}: {
  active: boolean;
  includedTone?: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onClick}
      className={cn(
        'h-auto w-full justify-between rounded-md border-l-2 py-1.5 pr-2.5 pl-2 text-[13px] font-normal',
        active &&
          !includedTone &&
          'border-l-sidebar-primary bg-sidebar-accent text-sidebar-accent-foreground',
        active && includedTone && 'border-l-primary bg-primary/10 text-primary',
        !active &&
          'border-l-transparent text-muted-foreground hover:bg-accent/50 hover:text-muted-foreground',
      )}
    >
      {children}
    </Button>
  );
}

export function CategorySidebar({
  appBranding,
  categories,
  activeCategory,
  showIncludedOnly,
  includedCount,
  onSelectCategory,
  onToggleIncluded,
}: CategorySidebarProps) {
  return (
    <aside className="flex h-full w-[220px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      {appBranding.showInSidebar ? (
        <div
          className={cn(
            APP_CHROME_ROW_SIDEBAR_CLASS,
            'gap-1.5 px-3.5 text-[15px] font-bold text-sidebar-foreground',
          )}
        >
          {appBranding.img ? <img src={appBranding.img} alt="" className="size-5 shrink-0" /> : null}
          <span className="truncate leading-none">{appBranding.title}</span>
        </div>
      ) : null}

      <ScrollArea className="min-h-0 flex-1 px-2.5 py-4">
        <div className="flex flex-col gap-1.5">
          <SidebarItem
            active={!showIncludedOnly && activeCategory === null}
            onClick={() => {
              onSelectCategory(null);
              if (showIncludedOnly) onToggleIncluded();
            }}
          >
            <span>All</span>
          </SidebarItem>

          <SidebarItem active={showIncludedOnly} includedTone onClick={onToggleIncluded}>
            <span>Included</span>
            <span className="text-[11px] opacity-70">{includedCount}</span>
          </SidebarItem>

          <div className="my-2 h-px bg-border" />

          <div className="px-2.5 pb-1 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
            Categories
          </div>

          {categories.map((cat) => (
            <SidebarItem
              key={cat.name}
              active={!showIncludedOnly && activeCategory === cat.name}
              onClick={() => {
                onSelectCategory(cat.name);
                if (showIncludedOnly) onToggleIncluded();
              }}
            >
              <span>{cat.label}</span>
              <span className="text-[11px] opacity-60">{cat.count}</span>
            </SidebarItem>
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
}
