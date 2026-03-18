'use client';

import { useState } from 'react';
import { ReactLenis } from 'lenis/react';
import { WATCHLIST_BORDER, WATCHLIST_BG } from '@/constants/nav-theme';
import {
  getViewPanelStyle,
  VIEW_PANEL_CONTAINER_BASE_CLASS,
  VIEW_PANEL_CONTAINER_CLASS,
  VIEW_PANEL_TITLE_CLASS,
  VIEW_PANEL_TITLE_FONT,
  VIEW_PANEL_SCROLL_CLASS,
  VIEW_PANEL_LENIS_OPTIONS,
} from '@/constants/view-panel-style';
import { DEFAULT_SWITCH_STYLE, type SwitchStyle } from '@/constants/switch-style';

type NewsPanelProps = {
  borderColor?: string;
  backgroundColor?: string;
  width?: number | 'fill';
  switchStyle?: SwitchStyle;
  onSwitchStyleChange?: (style: SwitchStyle) => void;
};

function NewsPlaceholder() {
  return (
    <div className="space-y-3" aria-hidden>
      {Array.from({ length: 10 }).map((_, index) => (
        <div key={index} className="space-y-2 p-3">
          <div className="h-3 w-20 rounded-full bg-[#222222]" />
          <div className="h-2.5 w-full rounded-full bg-[#222222]" />
          <div className="h-2.5 w-4/5 rounded-full bg-[#222222]" />
          <div className="flex items-center justify-between pt-1">
            <div className="h-2.5 w-14 rounded-full bg-[#222222]" />
            <div className="h-5 w-9 rounded-full bg-[#222222]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function NewsPanel({
  borderColor,
  backgroundColor,
  width = undefined,
  switchStyle,
  onSwitchStyleChange,
}: NewsPanelProps) {
  const [previewChecked, setPreviewChecked] = useState(true);
  const hasControls = onSwitchStyleChange != null;
  const effectiveStyle = switchStyle ?? DEFAULT_SWITCH_STYLE;
  const { trackWidth, trackHeight, thumbSize, trackOnColor, trackOffColor, transitionDuration } =
    effectiveStyle;

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
      aria-label="News"
    >
      <h2 className={VIEW_PANEL_TITLE_CLASS} style={{ fontFamily: VIEW_PANEL_TITLE_FONT }}>
        News
      </h2>
      {hasControls ? (
        <ReactLenis
          className={`${VIEW_PANEL_SCROLL_CLASS} flex flex-col gap-3 px-1 pb-4`}
          options={VIEW_PANEL_LENIS_OPTIONS}
        >
        <div className="flex items-center justify-between gap-3 px-1 pt-1">
          <div>
            <p
              className="text-[12px] font-medium text-white/70"
              style={{ fontFamily: VIEW_PANEL_TITLE_FONT }}
            >
              Switch 预览
            </p>
            <p
              className="mt-0.5 text-[11px] text-white/40"
              style={{ fontFamily: VIEW_PANEL_TITLE_FONT }}
            >
              在这里调整 News 下的 Switch 样式参数
            </p>
          </div>
          <button
            type="button"
            onClick={() => setPreviewChecked((v) => !v)}
            className="relative inline-flex shrink-0 items-center justify-center rounded-full border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-[#444444] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--app-bg)]"
            aria-label="Switch 预览"
          >
            <span
              style={{
                position: 'relative',
                width: trackWidth,
                height: trackHeight,
                borderRadius: 999,
                backgroundColor: previewChecked ? trackOnColor : trackOffColor,
                transition: `background-color ${transitionDuration}ms ease-out`,
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: Math.max((trackHeight - thumbSize) / 2, 0),
                  left: previewChecked
                    ? Math.max(trackWidth - thumbSize - 2, 0)
                    : 2,
                  width: thumbSize,
                  height: thumbSize,
                  borderRadius: 999,
                  backgroundColor: '#1C1C1E',
                  boxShadow: '0 0 0.5px rgba(0,0,0,0.4)',
                  transition: `left ${transitionDuration}ms ease-out`,
                }}
              />
            </span>
          </button>
        </div>

        <div className="mt-1 px-1">
          <p
            className="text-[11px] font-semibold text-white/40"
            style={{ fontFamily: VIEW_PANEL_TITLE_FONT }}
          >
            轨道（Track）
          </p>
        </div>
        <div className="flex flex-col gap-1 px-1">
          <div className="flex items-center gap-2">
            <span
              className="shrink-0 text-[12px] text-white/60"
              style={{ fontFamily: VIEW_PANEL_TITLE_FONT }}
            >
              宽度
            </span>
            <input
              type="range"
              min={18}
              max={40}
              step={2}
              value={trackWidth}
              onChange={(e) => {
                const next = parseInt(e.target.value, 10) || 0;
                const style: SwitchStyle = { ...effectiveStyle, trackWidth: next };
                onSwitchStyleChange?.(style);
              }}
              className="h-1 flex-1 cursor-pointer accent-[#F2F2F7]"
            />
            <span className="w-10 text-right text-[11px] text-white/60">
              {trackWidth}px
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="shrink-0 text-[12px] text-white/60"
              style={{ fontFamily: VIEW_PANEL_TITLE_FONT }}
            >
              高度
            </span>
            <input
              type="range"
              min={10}
              max={24}
              step={1}
              value={trackHeight}
              onChange={(e) => {
                const next = parseInt(e.target.value, 10) || 0;
                const style: SwitchStyle = { ...effectiveStyle, trackHeight: next };
                onSwitchStyleChange?.(style);
              }}
              className="h-1 flex-1 cursor-pointer accent-[#F2F2F7]"
            />
            <span className="w-10 text-right text-[11px] text-white/60">
              {trackHeight}px
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="shrink-0 text-[12px] text-white/60"
              style={{ fontFamily: VIEW_PANEL_TITLE_FONT }}
            >
              开启颜色
            </span>
            <input
              type="color"
              value={trackOnColor}
              onChange={(e) => {
                const style: SwitchStyle = { ...effectiveStyle, trackOnColor: e.target.value };
                onSwitchStyleChange?.(style);
              }}
              className="h-6 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
            />
            <span
              className="shrink-0 text-[11px] text-white/40"
              style={{ fontFamily: VIEW_PANEL_TITLE_FONT }}
            >
              {trackOnColor.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="shrink-0 text-[12px] text-white/60"
              style={{ fontFamily: VIEW_PANEL_TITLE_FONT }}
            >
              关闭颜色
            </span>
            <input
              type="color"
              value={trackOffColor}
              onChange={(e) => {
                const style: SwitchStyle = { ...effectiveStyle, trackOffColor: e.target.value };
                onSwitchStyleChange?.(style);
              }}
              className="h-6 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
            />
            <span
              className="shrink-0 text-[11px] text-white/40"
              style={{ fontFamily: VIEW_PANEL_TITLE_FONT }}
            >
              {trackOffColor.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="mt-2 px-1">
          <p
            className="text-[11px] font-semibold text-white/40"
            style={{ fontFamily: VIEW_PANEL_TITLE_FONT }}
          >
            滑块（Thumb）
          </p>
        </div>
        <div className="flex items-center gap-2 px-1">
          <span
            className="shrink-0 text-[12px] text-white/60"
            style={{ fontFamily: VIEW_PANEL_TITLE_FONT }}
          >
            尺寸
          </span>
          <input
            type="range"
            min={6}
            max={20}
            step={1}
            value={thumbSize}
            onChange={(e) => {
              const next = parseInt(e.target.value, 10) || 0;
              const style: SwitchStyle = { ...effectiveStyle, thumbSize: next };
              onSwitchStyleChange?.(style);
            }}
            className="h-1 flex-1 cursor-pointer accent-[#F2F2F7]"
          />
          <span className="w-10 text-right text-[11px] text-white/60">
            {thumbSize}px
          </span>
        </div>

        <div className="mt-2 px-1">
          <p
            className="text-[11px] font-semibold text-white/40"
            style={{ fontFamily: VIEW_PANEL_TITLE_FONT }}
          >
            动效（Motion）
          </p>
        </div>
        <div className="flex items-center gap-2 px-1 pb-2">
          <span
            className="shrink-0 text-[12px] text-white/60"
            style={{ fontFamily: VIEW_PANEL_TITLE_FONT }}
          >
            时长
          </span>
          <input
            type="range"
            min={80}
            max={400}
            step={10}
            value={transitionDuration}
            onChange={(e) => {
              const next = parseInt(e.target.value, 10) || 0;
              const style: SwitchStyle = { ...effectiveStyle, transitionDuration: next };
              onSwitchStyleChange?.(style);
            }}
            className="h-1 flex-1 cursor-pointer accent-[#F2F2F7]"
          />
          <span className="w-12 text-right text-[11px] text-white/60">
            {transitionDuration}ms
          </span>
        </div>
        </ReactLenis>
      ) : (
        <ReactLenis
          className="scrollbar-invisible flex-1 min-h-0 overflow-hidden"
          options={VIEW_PANEL_LENIS_OPTIONS}
        >
          <NewsPlaceholder />
        </ReactLenis>
      )}
    </div>
  );
}
