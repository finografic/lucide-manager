/**
 * App.tsx — Icon Picker & Manager
 *
 * Search, browse by category, and manage which Lucide icons
 * are registered in the DS icon registry (icons.json).
 */

import { Search, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { LucideIcon } from './hooks/useLucideData';

import { CategorySidebar } from './components/CategorySidebar';
import { IconCard } from './components/IconCard';
import { IconDetail } from './components/IconDetail';
import { useIconsJson } from './hooks/useIconsJson';
import { useLucideData } from './hooks/useLucideData';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const CATEGORY_LABELS: Record<string, string> = {
  'accessibility': 'Accessibility',
  'account': 'Accounts & access',
  'animals': 'Animals',
  'arrows': 'Arrows',
  'brands': 'Brands',
  'buildings': 'Buildings',
  'charts': 'Charts',
  'communication': 'Communication',
  'connectivity': 'Connectivity',
  'cursors': 'Cursors',
  'design': 'Design',
  'development': 'Coding & development',
  'devices': 'Devices',
  'emoji': 'Emoji',
  'files': 'File icons',
  'finance': 'Finance',
  'food-beverage': 'Food & beverage',
  'gaming': 'Gaming',
  'home': 'Home',
  'layout': 'Layout',
  'mail': 'Mail',
  'math': 'Math',
  'medical': 'Medical',
  'multimedia': 'Multimedia',
  'nature': 'Nature',
  'navigation': 'Navigation',
  'notifications': 'Notifications',
  'people': 'People',
  'photography': 'Photography',
  'science': 'Science',
  'seasons': 'Seasons',
  'security': 'Security',
  'shapes': 'Shapes',
  'shopping': 'Shopping',
  'social': 'Social',
  'sports': 'Sports',
  'sustainability': 'Sustainability',
  'text': 'Text',
  'time': 'Time',
  'tools': 'Tools',
  'transportation': 'Transportation',
  'travel': 'Travel',
  'weather': 'Weather',
};

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

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setFocusedIcon(null);
        return;
      }

      if (e.key !== ' ' && e.code !== 'Space') return;

      const { target } = e;
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return;
      if (target instanceof HTMLElement && target.isContentEditable) return;

      if (!focusedIcon) return;

      e.preventDefault();
      toggleIcon(focusedIcon.name);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [focusedIcon, toggleIcon]);

  function handleIconConfirm(icon: LucideIcon) {
    toggleIcon(icon.name);
  }

  const categories = useMemo(() => {
    const countMap = new Map<string, number>();
    for (const icon of allIcons) {
      for (const cat of icon.categories) {
        countMap.set(cat, (countMap.get(cat) ?? 0) + 1);
      }
    }
    return Object.entries(CATEGORY_LABELS)
      .map(([name, label]) => ({ name, label, count: countMap.get(name) ?? 0 }))
      .filter((cat) => cat.count > 0)
      .toSorted((a, b) => a.label.localeCompare(b.label));
  }, [allIcons]);

  const filteredIcons = useMemo(() => {
    let result = allIcons;

    if (showIncludedOnly) {
      result = result.filter((icon) => isSelected(icon.name));
    } else if (activeCategory) {
      result = result.filter((icon) => icon.categories.includes(activeCategory));
    }

    if (query.trim()) {
      const lower = query.toLowerCase();
      result = result.filter(
        (icon) => icon.name.includes(lower) || icon.categories.some((cat) => cat.includes(lower)),
      );
    }

    return result;
  }, [allIcons, query, activeCategory, showIncludedOnly, isSelected]);

  const focusedEntry = focusedIcon ? entries.find((e) => e.lucideName === focusedIcon.name) : undefined;

  const loading = lucideLoading || jsonLoading;

  const filterLabel = query
    ? ` matching "${query}"`
    : activeCategory
      ? ` in ${CATEGORY_LABELS[activeCategory] ?? activeCategory}`
      : showIncludedOnly
        ? ' included'
        : '';

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <header className="flex shrink-0 items-center gap-4 border-b border-border px-3.5 py-3.5 pr-6">
        <div className="flex shrink-0 items-center gap-1.5 text-[15px] font-bold">
          <img src="/lucide.png" alt="" className="size-6" />
          <span>Lucide Manager</span>
        </div>

        <InputGroup className="max-w-[480px] flex-1">
          <InputGroupAddon>
            <Search className="size-3.5 opacity-40" />
          </InputGroupAddon>
          <InputGroupInput
            ref={searchRef}
            type="text"
            placeholder="Search icons…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query ? (
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                type="button"
                size="icon-xs"
                variant="ghost"
                aria-label="Clear search"
                onClick={() => setQuery('')}
              >
                <X className="size-3.5" />
              </InputGroupButton>
            </InputGroupAddon>
          ) : null}
        </InputGroup>

        <div className="ml-auto shrink-0 text-[13px] text-muted-foreground">
          {saving ? (
            <span className="text-chart-1">Saving…</span>
          ) : saveError ? (
            <span className="text-destructive">Save failed</span>
          ) : (
            <span>
              <span className="font-semibold text-primary">
                {entries.length}
                <span className="text-primary/55">{' included · '}</span>
              </span>
              <span>{allIcons.length || '…'}</span>
              <span>{' total'}</span>
            </span>
          )}
        </div>
      </header>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <CategorySidebar
          categories={categories}
          activeCategory={activeCategory}
          showIncludedOnly={showIncludedOnly}
          includedCount={entries.length}
          onSelectCategory={setActiveCategory}
          onToggleIncluded={() => setShowIncludedOnly((prev) => !prev)}
        />

        <main className={cn('min-w-0 flex-1', focusedIcon ? 'pb-[120px]' : '')}>
          <ScrollArea className="h-full">
            <div className="p-4">
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-32" />
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(88px,1fr))] gap-1.5">
                    {Array.from({ length: 24 }, (_, i) => (
                      <Skeleton key={i} className="aspect-square rounded-lg" />
                    ))}
                  </div>
                </div>
              ) : lucideError ? (
                <p className="p-6 text-destructive">Failed to load Lucide data: {lucideError}</p>
              ) : filteredIcons.length === 0 ? (
                <p className="flex h-[200px] items-center justify-center text-muted-foreground/70">
                  No icons match &ldquo;{query}&rdquo;
                </p>
              ) : (
                <>
                  <p className="mb-3 text-xs text-muted-foreground/70">
                    {filteredIcons.length} icon{filteredIcons.length !== 1 ? 's' : ''}
                    {filterLabel}
                  </p>
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(88px,1fr))] gap-1.5">
                    {filteredIcons.map((icon) => (
                      <IconCard
                        key={icon.name}
                        icon={icon}
                        isFocused={focusedIcon?.name === icon.name}
                        isIncluded={isSelected(icon.name)}
                        onClick={setFocusedIcon}
                        onConfirm={handleIconConfirm}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        </main>
      </div>

      {focusedIcon ? (
        <IconDetail
          icon={focusedIcon}
          selected={isSelected(focusedIcon.name)}
          entry={focusedEntry}
          onToggle={(name) => toggleIcon(name)}
          onRename={renameExport}
          onClose={() => setFocusedIcon(null)}
        />
      ) : null}
    </div>
  );
}
