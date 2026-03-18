'use client';

import type { RefObject } from 'react';
import type { MouseEventHandler } from 'react';
import Image from 'next/image';
import type { Stock } from '@/data/stocks';
import { watchlists } from '@/data/watchlists';
import { GlassBar } from '@/components/ui/GlassBar';
import { Icon } from '@/components/ui/Icon';

type BarProps = {
  barAnimating: boolean;
  toolbarOpacity: number;
  toolbarBlur: number;
  toolbarBorderWidth: number;
  toolbarHighlight: number;
  toolbarHighlightHeight: number;
  toolbarShadowStrength: number;
  accentHighlightVisible: boolean;
  accentColor?: string;
  toolbarAccentOpacity: number;
  toolbarAccentGradientStop: number;
  selectedStockForChart: Stock | null;
  selectedWatchlist: string | null;
  currentWatchlistColor?: string;
  onBackToWatchlist: () => void;
  watchlistPopoverRect: { left: number; top: number; width: number; height: number } | null;
  setWatchlistPopoverRect: (rect: { left: number; top: number; width: number; height: number } | null) => void;
  watchlistButtonRef: RefObject<HTMLButtonElement | null>;
  barDotsPopoverRect?: DOMRect | null;
  setBarDotsPopoverRect: (rect: DOMRect | null) => void;
  onAddClick: MouseEventHandler<HTMLButtonElement>;
};

function BarButton({
  active = false,
  onClick,
  className,
  ariaLabel,
  buttonRef,
  disabled = false,
  children,
}: {
  active?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  ariaLabel: string;
  buttonRef?: RefObject<HTMLButtonElement | null>;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      ref={buttonRef}
      type="button"
      aria-label={ariaLabel}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={`relative flex h-8 items-center gap-2 rounded-full px-3 text-[13px] font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-white/25 disabled:pointer-events-none disabled:opacity-60 ${disabled ? '' : 'hover:bg-white/10'} ${active ? 'bg-white/12 text-white' : 'text-white/70'} ${className ?? ''}`}
      style={{ fontFamily: 'var(--font-inter)' }}
    >
      {children}
    </button>
  );
}

export function Bar({
  barAnimating,
  toolbarOpacity,
  toolbarBlur,
  toolbarBorderWidth,
  toolbarHighlight,
  toolbarHighlightHeight,
  toolbarShadowStrength,
  accentHighlightVisible,
  accentColor,
  toolbarAccentOpacity,
  toolbarAccentGradientStop,
  selectedStockForChart,
  selectedWatchlist,
  currentWatchlistColor,
  onBackToWatchlist,
  watchlistPopoverRect,
  setWatchlistPopoverRect,
  watchlistButtonRef,
  setBarDotsPopoverRect,
  onAddClick,
}: BarProps) {
  const watchboardLabel = (() => {
    if (!selectedWatchlist) return 'My Board 1';
    const watchlistIndex = watchlists.findIndex((item) => item.label === selectedWatchlist);
    return watchlistIndex >= 0 ? `My Board ${watchlistIndex + 1}` : selectedWatchlist;
  })();
  const displayWatchlistLabel = selectedStockForChart?.code ?? watchboardLabel;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-30 flex justify-center px-4">
      <GlassBar
        backgroundColor="var(--bar-bg)"
        borderColor="var(--bar-border)"
        opacity={toolbarOpacity}
        blur={toolbarBlur}
        borderBrightness={0}
        borderWidth={toolbarBorderWidth}
        borderGradientContrast={1}
        highlightOpacity={toolbarHighlight}
        highlightHeight={toolbarHighlightHeight}
        shadowStrength={toolbarShadowStrength}
        accentColor={accentHighlightVisible ? accentColor : undefined}
        accentOpacity={toolbarAccentOpacity}
        accentGradientStop={toolbarAccentGradientStop}
        height={42}
        role="toolbar"
        ariaLabel="Bottom Bar"
        className={`pointer-events-auto max-w-[calc(100vw-32px)] ${barAnimating ? 'bar-ticker-enter' : ''}`}
      >
        <div className="flex items-center gap-1">
          <BarButton
            active={Boolean(selectedStockForChart)}
            disabled={barAnimating}
            onClick={() => {
              if (selectedStockForChart) {
                onBackToWatchlist();
              }
            }}
            ariaLabel={selectedStockForChart ? 'Back to watchboard' : 'Current watchboard'}
            className="min-w-0 max-w-[220px]"
            buttonRef={watchlistButtonRef}
          >
            <span className="flex min-w-0 items-center gap-2">
              {selectedStockForChart ? (
                <Image
                  src={selectedStockForChart.logo}
                  alt={selectedStockForChart.code}
                  width={18}
                  height={18}
                  className="h-[18px] w-[18px] rounded-full object-contain"
                />
              ) : (
                <span
                  className="flex h-[18px] w-[18px] items-center justify-center rounded-full"
                  style={{ color: currentWatchlistColor ?? '#A1A1AA' }}
                >
                  <Icon name="bookmark" className="h-4 w-4" />
                </span>
              )}
              <span className="truncate">{displayWatchlistLabel}</span>
            </span>
          </BarButton>
        </div>

        <div className="ml-2 flex items-center gap-1">
          <BarButton ariaLabel="Add" className="px-2.5" onClick={onAddClick}>
            <Icon name="plus" className="h-4 w-4" />
          </BarButton>
          <BarButton
            ariaLabel="More"
            className="px-2.5"
            disabled
          >
            <Icon name="dots" className="h-4 w-4" />
          </BarButton>
        </div>
      </GlassBar>
    </div>
  );
}
