import type { CSSProperties } from 'react';

export const NAV_HOVER = '#2e2e2e';
export const NAV_SELECTED = '#2e2e2e';
export const NAV_HOVER_OUTLINE = '#444444';
export const NAV_SELECTED_OUTLINE = '#444444';

/** Watchlist 面板外边框颜色 (Sim 默认) */
export const WATCHLIST_BORDER = '#27272d';
/** Watchlist 面板背景颜色 (Sim 默认) */
export const WATCHLIST_BG = '#141415';
/** 首页卡片 hover 背景颜色 (Sim 默认) */
export const CARD_HOVER = '#1e1e20';
/** 首页卡片点击(active)背景颜色 (Sim 默认) */
export const CARD_ACTIVE = '#252528';

/** Back 按钮 hover 预设：无 / 淡 / 中 / 深 (Sim 可选) */
export type BackButtonHoverPreset = 'none' | 'subtle' | 'medium' | 'strong';
export const BACK_BUTTON_HOVER_PRESET_DEFAULT: BackButtonHoverPreset = 'none';

/** Back 按钮 hover 预设对应的 Tailwind 类（仅 hover 背景） */
export const BACK_BUTTON_HOVER_CLASS: Record<BackButtonHoverPreset, string> = {
  none: '',
  subtle: 'hover:bg-white/5',
  medium: 'hover:bg-white/10',
  strong: 'hover:bg-white/15',
};

/** 底部 Bar 背景 (Sim 默认) */
export const BAR_BG = '#1a1a1a';
/** 底部 Bar 边框 (Sim 默认) */
export const BAR_BORDER = '#404040';
/** 下拉/菜单 背景 (Sim 默认) */
export const POPOVER_BG = '#18181B';
/** 下拉/菜单 边框 (Sim 默认) */
export const POPOVER_BORDER = '#404040';

/** Bar 内图标按钮 hover 预设：无 / 淡 / 中 */
export type BarIconHoverPreset = 'none' | 'subtle' | 'medium';
export const BAR_ICON_HOVER_PRESET_DEFAULT: BarIconHoverPreset = 'medium';
export const BAR_ICON_HOVER_CLASS: Record<BarIconHoverPreset, string> = {
  none: '',
  subtle: 'hover:bg-white/5',
  medium: 'hover:bg-white/10',
};

export const asideStyle = {
  ['--nav-hover' as string]: NAV_HOVER,
  ['--nav-selected' as string]: NAV_SELECTED,
  ['--nav-hover-outline' as string]: NAV_HOVER_OUTLINE,
  ['--nav-selected-outline' as string]: NAV_SELECTED_OUTLINE,
} as CSSProperties;

/**
 * 调试用主题预设（只在本地开发 / Cmd+1 调试时使用）。
 * 不改变任何 Sim 默认值，只提供一组高对比度的 outline 配置，方便查看布局与间距。
 */
export type NavDebugPreset = {
  /** 预设名称（例如 'debug'） */
  name: string;
  /** 用途说明，方便在调试工具里展示 */
  description: string;
  /** 调试 outline 颜色 */
  outlineColor: string;
  /** outline 宽度（px） */
  outlineWidth: number;
  /** outlineOffset（px），一般保持 0 即可 */
  outlineOffset: number;
};

export const NAV_DEBUG_PRESET: NavDebugPreset = {
  name: 'debug',
  description: '仅用于本地调试布局与间距的高对比主题，请勿在线上环境启用。',
  outlineColor: '#FF2D55',
  outlineWidth: 1,
  outlineOffset: 0,
};

/** 可直接用于组件 style 的调试 outline（例如在 Cmd+1 切到 debug 主题时注入） */
export const debugOutlineStyle: CSSProperties = {
  outline: `${NAV_DEBUG_PRESET.outlineWidth}px solid ${NAV_DEBUG_PRESET.outlineColor}`,
  outlineOffset: NAV_DEBUG_PRESET.outlineOffset,
};
