import type { CSSProperties } from 'react';
import { asideStyle, WATCHLIST_BORDER, WATCHLIST_BG } from '@/constants/nav-theme';

/**
 * 所有 View 面板统一样式规范（与 Watchlist 完全一致）。
 * 新增 Screener、Trends AI、Chart 等 view 时必须复用本规范。
 */

/** 面板容器宽度 */
export const VIEW_PANEL_WIDTH = 280;

/** 面板圆角 */
export const VIEW_PANEL_RADIUS = 16;

/** 面板外边框默认颜色 */
export const VIEW_PANEL_BORDER = WATCHLIST_BORDER;
/** 面板背景默认颜色 */
export const VIEW_PANEL_BG = WATCHLIST_BG;

/** 面板容器 className（不含宽度，用于可拖拽调整时；min-h-0 防止 flex 子项撑高溢出） */
export const VIEW_PANEL_CONTAINER_BASE_CLASS =
  'flex h-full min-h-0 shrink-0 flex-col overflow-hidden rounded-[16px]';

/** 面板容器 className（与 Watchlist 一致，固定 280px） */
export const VIEW_PANEL_CONTAINER_CLASS =
  `${VIEW_PANEL_CONTAINER_BASE_CLASS} w-[280px]`;

/** 面板标题 className（与 Watchlist 的 h2 一致） */
export const VIEW_PANEL_TITLE_CLASS =
  'shrink-0 px-3 pt-3 pb-3 text-[13px] font-semibold text-[#F2F2F7]';

/** 面板标题 fontFamily */
export const VIEW_PANEL_TITLE_FONT = 'var(--font-inter)' as const;

/** 可滚动内容区 className（与 Watchlist 的 ReactLenis 一致） */
export const VIEW_PANEL_SCROLL_CLASS =
  'scrollbar-invisible flex-1 min-h-0 overflow-hidden px-2 pb-4';

/** 列表项（nav item）按钮 className（与 Watchlist 的 button 一致） */
export const VIEW_PANEL_NAV_ITEM_CLASS =
  'flex cursor-pointer items-center gap-1.5 rounded-lg px-1.5 py-1.5 text-left text-[13px] text-[#F2F2F7] outline-none transition-[background-color,border-color] duration-[280ms] ease-[cubic-bezier(0.4,0,0.2,1)] focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#444444] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1C1C1E]';

/** 列表项之间的间距容器 */
export const VIEW_PANEL_LIST_GAP_CLASS = 'flex flex-col gap-[2px]';

/**
 * 生成面板的 style 对象（border + background + asideStyle 变量）
 */
export function getViewPanelStyle(options: {
  borderColor?: string;
  backgroundColor?: string;
}): CSSProperties {
  const { borderColor = VIEW_PANEL_BORDER, backgroundColor = VIEW_PANEL_BG } = options;
  return {
    ...asideStyle,
    border: `1px solid ${borderColor}`,
    backgroundColor,
  };
}

/** Lenis 滚动配置（与 Watchlist 一致） */
export const VIEW_PANEL_LENIS_OPTIONS = {
  autoRaf: true,
  duration: 1.2,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
} as const;
