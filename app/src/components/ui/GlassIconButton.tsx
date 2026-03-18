'use client';

import React, { useState } from 'react';
import { hexToRgba, adjustBorderColor } from '@/lib/color-utils';

export type GlassIconButtonProps = {
  backgroundColor: string;
  borderColor: string;
  opacity: number;
  blur: number;
  borderBrightness: number;
  borderWidth: number;
  borderGradientContrast: number;
  highlightOpacity: number;
  highlightHeight: number;
  shadowStrength: number;
  size?: number;
  ariaLabel: string;
  onClick?: () => void;
  children: React.ReactNode;
};

export function GlassIconButton({
  backgroundColor,
  borderColor,
  opacity,
  blur,
  borderBrightness,
  borderWidth,
  borderGradientContrast,
  highlightOpacity,
  highlightHeight,
  shadowStrength,
  size = 28,
  ariaLabel,
  onClick,
  children,
}: GlassIconButtonProps) {
  const topColor = adjustBorderColor(
    borderColor,
    borderBrightness + 0.25 * borderGradientContrast,
  );
  const midColor = adjustBorderColor(borderColor, borderBrightness);
  const bottomColor = adjustBorderColor(
    borderColor,
    borderBrightness - 0.15 * borderGradientContrast,
  );

  const shadowAlpha = Math.max(
    0,
    Math.min(1, 0.2 + 0.4 * shadowStrength),
  );

  const outerSize = size;

  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const scale = pressed ? 0.88 : hovered ? 0.95 : 1;

  return (
    <div
      className="relative inline-flex shrink-0 items-center justify-center rounded-full"
      style={{
        width: outerSize,
        height: outerSize,
        padding: borderWidth,
        backgroundImage: `linear-gradient(to bottom, ${topColor}, ${midColor}, ${bottomColor})`,
        transform: `scale(${scale})`,
        transition: 'transform 150ms cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      <button
        type="button"
        aria-label={ariaLabel}
        onClick={onClick}
        className="relative flex h-full w-full items-center justify-center rounded-full text-white/80 outline-none"
        style={{
          backgroundColor: hexToRgba(
            backgroundColor,
            hovered ? Math.max(0, Math.min(1, opacity - 0.2)) : opacity,
          ),
          backdropFilter: blur > 0 ? `blur(${blur}px)` : 'none',
          boxShadow: `0 18px 45px rgba(0,0,0,${shadowAlpha})`,
          fontFamily: 'var(--font-inter)',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false);
          setPressed(false);
        }}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
      >
        {highlightOpacity > 0 && (
          <div
            className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/55 via-white/15 to-transparent mix-blend-screen"
            style={{
              opacity: highlightOpacity,
              transform: `scaleY(${highlightHeight})`,
              transformOrigin: 'center',
            }}
            aria-hidden
          />
        )}
        <span className="relative flex items-center justify-center">
          {children}
        </span>
      </button>
    </div>
  );
}

