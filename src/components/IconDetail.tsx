/**
 * IconDetail.tsx
 *
 * Detail panel shown when an icon is clicked.
 * Displays: large preview, name, categories, current exportName, add/remove toggle,
 * and an inline rename field for the exportName (rare but supported).
 */

import { Check, Copy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from 'ui/badge';
import { Button } from 'ui/button';
import { Input } from 'ui/input';
import { cn } from 'utils';
import type { IconEntry } from '../hooks/useIconsJson';
import type { LucideIcon } from '../hooks/useLucideData';

import { ICON_DETAIL_SIZE } from 'config/defaults.constants';

import { IconSvg } from './IconSvg';

interface IconDetailProps {
  icon: LucideIcon;
  selected: boolean;
  entry: IconEntry | undefined;
  onToggle: (lucideName: string) => void;
  onRename: (lucideName: string, exportName: string) => void;
  onClose: () => void;
}

export function IconDetail({ icon, selected, entry, onToggle, onRename, onClose }: IconDetailProps) {
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(entry?.exportName ?? '');
  const [copied, setCopied] = useState(false);

  function copyExportName() {
    const text = entry ? `${entry.exportName}Icon` : icon.name;
    void navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

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
    <div className="fixed inset-x-0 bottom-0 z-100 flex items-center gap-6 border-t border-border bg-card px-6 py-4 shadow-[0_-4px_24px_rgba(0,0,0,0.4)]">
      <div
        className={cn(
          'flex size-[72px] shrink-0 items-center justify-center rounded-xl bg-black',
          selected ? 'text-primary' : 'text-muted-foreground',
        )}
      >
        <IconSvg node={icon.node} size={ICON_DETAIL_SIZE} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1 text-base font-semibold text-card-foreground">{icon.name}</div>

        <div className="mb-2 flex flex-wrap gap-1.5">
          {icon.categories.length > 0 ? (
            icon.categories.map((cat) => (
              <Badge key={cat} variant="secondary" className="text-[11px] font-normal">
                {cat}
              </Badge>
            ))
          ) : (
            <span className="text-[11px] text-muted-foreground">No categories</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">exports as :</span>

          {selected && editingName ? (
            <Input
              autoFocus
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onBlur={commitRename}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitRename();
                if (e.key === 'Escape') {
                  setNameInput(entry?.exportName ?? '');
                  setEditingName(false);
                }
              }}
              className="h-7 w-[180px] border-ring font-mono text-xs"
            />
          ) : (
            <Button
              type="button"
              variant="link"
              onClick={() => selected && setEditingName(true)}
              title={selected ? 'Click to rename export' : 'Add icon first to rename'}
              className={cn(
                'h-auto p-0 font-mono text-xs',
                selected
                  ? 'text-primary underline decoration-dotted'
                  : 'cursor-default text-muted-foreground/70 no-underline',
              )}
            >
              {exportLabel}
            </Button>
          )}

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={copyExportName}
            aria-label="Copy export name"
            className="size-6 shrink-0 self-center border-0 bg-transparent p-0 text-muted-foreground/50 shadow-none hover:bg-transparent hover:text-muted-foreground"
          >
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          </Button>
        </div>
      </div>

      <div className="flex shrink-0 gap-2.5">
        <Button
          type="button"
          variant={selected ? 'destructive' : 'default'}
          onClick={() => onToggle(icon.name)}
          className="min-w-[100px] font-semibold"
        >
          {selected ? 'Remove' : 'Add'}
        </Button>
        <Button type="button" variant="outline" size="icon" onClick={onClose} aria-label="Close">
          ✕
        </Button>
      </div>
    </div>
  );
}
