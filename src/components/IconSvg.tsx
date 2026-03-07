/**
 * IconSvg.tsx
 *
 * Renders a Lucide icon directly from its node tree (no React component import).
 * This is how lucide.dev itself renders previews — keeps the picker fast
 * and avoids importing ~1500 components.
 */

import React from 'react';

type SVGElementName =
  | 'circle'
  | 'ellipse'
  | 'g'
  | 'line'
  | 'path'
  | 'polygon'
  | 'polyline'
  | 'rect';
type IconNodeElement = [SVGElementName, Record<string, string>];

interface IconSvgProps {
  node: IconNodeElement[];
  size?: number;
  className?: string;
  color?: string;
}

export function IconSvg({ node, size = 24, className, color = 'currentColor' }: IconSvgProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {node.map(([elementName, attrs], index) =>
        React.createElement(elementName, { key: index, ...attrs })
      )}
    </svg>
  );
}
