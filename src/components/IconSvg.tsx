/**
 * IconSvg.tsx
 *
 * Renders a Lucide icon directly from its node tree (no React component import).
 * This is how lucide.dev itself renders previews — keeps the picker fast
 * and avoids importing ~1500 components.
 */

import React from 'react';
import { cn } from 'utils';

type SVGElementName = 'circle' | 'ellipse' | 'g' | 'line' | 'path' | 'polygon' | 'polyline' | 'rect';
type IconNodeElement = [SVGElementName, Record<string, string>];

interface IconSvgProps {
  node: IconNodeElement[];
  size?: number;
  className?: string;
  color?: string;
}

export function IconSvg({ node, size = 24, className, color = 'currentColor' }: IconSvgProps) {
  // shadcn Button sets `[&_svg:not([class*='size-'])]:size-4` — inline dimensions beat that rule.
  const dimensionStyle = { width: size, height: size, minWidth: size, minHeight: size };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('shrink-0', className)}
      style={dimensionStyle}
    >
      {node.map(([elementName, attrs], index) => React.createElement(elementName, { key: index, ...attrs }))}
    </svg>
  );
}
