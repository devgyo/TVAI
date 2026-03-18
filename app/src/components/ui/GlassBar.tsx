'use client';

import React from 'react';
import { hexToRgba, adjustBorderColor } from '@/lib/color-utils';

export type GlassBarProps = {
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
  /** 可选：与 WL icon 一致的高光色，叠加在白色高光之上 */
  accentColor?: string;
  /** accent 层透明度 0–1，默认 0.22 */
  accentOpacity?: number;
  /** accent 渐变透明位置 0–1（如 0.6 表示 60% 处透明），默认 0.6 */
  accentGradientStop?: number;
  /** 整个 Bar 的目标高度（px），默认 42 */
  height?: number;
  role?: string;
  ariaLabel?: string;
  className?: string;
  children: React.ReactNode;
};

export function GlassBar({
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
  accentColor,
  accentOpacity = 0.22,
  accentGradientStop = 0.6,
  height,
  role,
  ariaLabel,
  className,
  children,
}: GlassBarProps) {
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

  const barHeight = height ?? 40;

  const currentAlpha = Math.min(1, Math.max(0, opacity));

  return (
    <div
      className={`relative rounded-full ${className ?? ''}`}
      style={{
        padding: borderWidth,
        backgroundImage: `linear-gradient(to bottom, ${topColor}, ${midColor}, ${bottomColor})`,
      }}
    >
      <div
        className="relative flex items-center gap-2 rounded-full bg-white/5 p-1"
        style={{
          backgroundColor: hexToRgba(backgroundColor, currentAlpha),
          backdropFilter: blur > 0 ? `blur(${blur}px)` : 'none',
          boxShadow: `0 18px 45px rgba(0,0,0,${shadowAlpha})`,
          height: barHeight,
          minHeight: barHeight,
        }}
        role={role}
        aria-label={ariaLabel}
      >
        {highlightOpacity > 0 && (
          <div
            className="pointer-events-none absolute inset-0 rounded-[999px] bg-gradient-to-b from-white/55 via-white/15 to-transparent mix-blend-screen"
            style={{
              opacity: highlightOpacity,
              transform: `scaleY(${highlightHeight})`,
              transformOrigin: 'center',
            }}
            aria-hidden
          />
        )}
        {accentColor && (
          <div
            className="pointer-events-none absolute inset-0 rounded-[999px]"
            style={{
              background: `linear-gradient(to bottom, ${hexToRgba(accentColor, Math.min(1, Math.max(0, accentOpacity)))}, transparent ${Math.round(accentGradientStop * 100)}%)`,
              mixBlendMode: 'overlay',
              transform: `scaleY(${highlightHeight})`,
              transformOrigin: 'center',
            }}
            aria-hidden
          />
        )}
        {/* children 自己决定内部布局 */}
        <div className="relative flex items-center gap-2">
          {children}
        </div>
      </div>
    </div>
  );
}

