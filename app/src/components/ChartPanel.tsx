'use client';

import { ReactLenis } from 'lenis/react';
import type { Stock } from '@/data/stocks';
import { StockLogo } from '@/components/ui/StockLogo';
import { WATCHLIST_BORDER, WATCHLIST_BG } from '@/constants/nav-theme';
import {
  getViewPanelStyle,
  VIEW_PANEL_CONTAINER_BASE_CLASS,
  VIEW_PANEL_TITLE_CLASS,
  VIEW_PANEL_TITLE_FONT,
  VIEW_PANEL_SCROLL_CLASS,
  VIEW_PANEL_LENIS_OPTIONS,
} from '@/constants/view-panel-style';

type ChartPanelProps = {
  /** 当前选中的股票（用于标题：logo + 代码 + 公司名） */
  stock: Stock;
  /** 外边框颜色 */
  borderColor?: string;
  /** 背景颜色 */
  backgroundColor?: string;
  /** 面板宽度（'fill' 填满剩余空间） */
  width?: 'fill';
  /** 是否暂停（控制 Live/Pause 状态展示） */
  paused?: boolean;
};

export function ChartPanel({
  stock,
  borderColor,
  backgroundColor,
  width = 'fill',
  paused = false,
}: ChartPanelProps) {
  const panelStyle = getViewPanelStyle({
    borderColor: borderColor ?? WATCHLIST_BORDER,
    backgroundColor: backgroundColor ?? WATCHLIST_BG,
  });
  const containerClass = `${VIEW_PANEL_CONTAINER_BASE_CLASS} min-w-0 flex-1`;
  const containerStyle = panelStyle;

  return (
    <div
      className={containerClass}
      style={containerStyle}
      aria-label={`Chart ${stock.code}`}
    >
      <div
        className={`${VIEW_PANEL_TITLE_CLASS} flex select-none font-normal items-center gap-2`}
        style={{ fontFamily: VIEW_PANEL_TITLE_FONT }}
      >
        <StockLogo logo={stock.logo} code={stock.code} size={22} />
        <span className="shrink-0">{stock.code}</span>
        <div className="flex min-w-0 items-center gap-2 text-[12px] text-white/70">
          <span className="min-w-0 truncate">{stock.name}</span>
          <span
            className={`flex shrink-0 items-center gap-1.5 rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-medium ${
              paused ? 'text-amber-300' : 'text-emerald-300'
            }`}
          >
            <span
              className={`${paused ? '' : 'live-dot'} h-1 w-1 shrink-0 rounded-full ${
                paused ? 'bg-amber-300' : 'bg-emerald-400'
              }`}
              aria-hidden
            />
            {paused ? 'Pause' : 'Live'}
          </span>
        </div>
      </div>
      <ReactLenis
        className={`${VIEW_PANEL_SCROLL_CLASS} flex items-center justify-center`}
        options={VIEW_PANEL_LENIS_OPTIONS}
      >
        <span
          className="text-[13px] font-medium text-white/50"
          style={{ fontFamily: VIEW_PANEL_TITLE_FONT }}
        >
          Candlestick Chart
        </span>
      </ReactLenis>
    </div>
  );
}
