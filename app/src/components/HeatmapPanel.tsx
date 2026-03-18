'use client';
import { WATCHLIST_BORDER, WATCHLIST_BG } from '@/constants/nav-theme';
import {
  getViewPanelStyle,
  VIEW_PANEL_CONTAINER_BASE_CLASS,
  VIEW_PANEL_CONTAINER_CLASS,
  VIEW_PANEL_TITLE_CLASS,
  VIEW_PANEL_TITLE_FONT,
} from '@/constants/view-panel-style';

type HeatmapPanelProps = {
  /** 面板标题，默认 "Heatmap" */
  title?: string;
  /** 外边框颜色 */
  borderColor?: string;
  /** 背景颜色 */
  backgroundColor?: string;
  /** 面板宽度（不传则固定 280px，传数字则固定宽度，'fill' 则填满剩余空间） */
  width?: number | 'fill';
};

function HeatmapPlaceholder() {
  return (
    <div className="h-full w-full p-2" aria-hidden>
      <div className="grid h-full w-full grid-cols-6 grid-rows-6 gap-2">
        {Array.from({ length: 36 }).map((_, index) => {
          return (
            <div
              key={index}
              className="h-full w-full rounded-[8px] bg-[#222222]"
            />
          );
        })}
      </div>
    </div>
  );
}

export function HeatmapPanel({
  title = 'Heatmap',
  borderColor,
  backgroundColor,
  width = undefined,
}: HeatmapPanelProps) {
  const panelStyle = getViewPanelStyle({
    borderColor: borderColor ?? WATCHLIST_BORDER,
    backgroundColor: backgroundColor ?? WATCHLIST_BG,
  });
  const fill = width === 'fill';
  const containerClass = fill
    ? `${VIEW_PANEL_CONTAINER_BASE_CLASS} min-w-0 flex-1`
    : VIEW_PANEL_CONTAINER_CLASS;
  const containerStyle =
    typeof width === 'number' ? { ...panelStyle, width } : panelStyle;

  return (
    <div
      className={containerClass}
      style={containerStyle}
      aria-label="Heatmap"
    >
      <h2 className={VIEW_PANEL_TITLE_CLASS} style={{ fontFamily: VIEW_PANEL_TITLE_FONT }}>
        {title}
      </h2>
      <div className="flex-1 min-h-0 overflow-hidden">
        <HeatmapPlaceholder />
      </div>
    </div>
  );
}
