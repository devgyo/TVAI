'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { topNav, watchlists } from '@/data/watchlists';
import { cardGroups } from '@/data/card-groups';
import { buildWatchlistStocks } from '@/lib/watchlist-stocks';
import { stocks, type Stock } from '@/data/stocks';
import {
  asideStyle,
  WATCHLIST_BORDER,
  WATCHLIST_BG,
  CARD_HOVER,
  CARD_ACTIVE,
  BACK_BUTTON_HOVER_PRESET_DEFAULT,
  BAR_BG,
  BAR_BORDER,
  POPOVER_BG,
  POPOVER_BORDER,
  BAR_ICON_HOVER_PRESET_DEFAULT,
} from '@/constants/nav-theme';
import { MenuSurface, UserMenu } from '@/components/ui/UserMenu';
import type { BackButtonHoverPreset, BarIconHoverPreset } from '@/constants/nav-theme';
import {
  getViewPanelStyle,
  VIEW_PANEL_CONTAINER_BASE_CLASS,
  VIEW_PANEL_TITLE_CLASS,
  VIEW_PANEL_TITLE_FONT,
  VIEW_PANEL_SCROLL_CLASS,
} from '@/constants/view-panel-style';
import { Header } from '@/components/Header';
import { CanvasWorkspaceDemo, type CardId } from '@/components/CanvasWorkspaceDemo';
import { TickerListPanel } from '@/components/TickerListPanel';
import { HeatmapPanel } from '@/components/HeatmapPanel';
import { ChartPanel } from '@/components/ChartPanel';
import { NewsPanel } from '@/components/NewsPanel';
import { EventPanel } from '@/components/EventPanel';
import { DarkpoolPanel } from '@/components/DarkpoolPanel';
import { SnapshotPanel } from '@/components/SnapshotPanel';
import { TradesTable } from '@/components/TradesTable';
import { AppStyles } from '@/components/AppStyles';
import { ComponentPanel } from '@/components/ComponentPanel';
import { Icon } from '@/components/ui/Icon';
import { StockLogo } from '@/components/ui/StockLogo';
import { Bar } from '@/components/ui/Bar';
import { DEFAULT_TOOLTIP_CONFIG } from '@/constants/tooltip';
import { NAV_LABEL_TO_VIEW_ID } from '@/constants/nav-views';
import {
  PANEL_EXIT_DELAY_MS,
  OPTIONS_TRANSITION_MS,
  EXPAND_READY_DELAY_MS,
} from '@/constants/transitions';
import { RECENTS_MAX_COUNT, DEFAULT_WATCHLIST_LABEL } from '@/constants/layout';
import { useToolbarStylePersistence } from '@/hooks/use-toolbar-style-persistence';
import { useBarAnimation } from '@/hooks/use-bar-animation';
import { DEFAULT_SWITCH_STYLE, type SwitchStyle } from '@/constants/switch-style';

type ViewMoreListItem = {
  id: string;
  name: string;
  description?: string;
  themeKey?: string;
  emoji?: string;
  tickerCount?: number;
  iconSrc?: string | null;
};

type DrawerChatMessage = {
  id: string;
  role: 'assistant' | 'user';
  text: string;
};

type CreateMenuAnchor = {
  rect: DOMRect;
  source: 'header' | 'bar';
};

const CREATE_CARD_LIBRARY: Array<{ id: CardId; label: string }> = [
  { id: 'ticker', label: 'Tickers' },
  { id: 'main', label: 'Heatmap' },
  { id: 'event', label: 'Event' },
  { id: 'news', label: 'News' },
  { id: 'fearGreed', label: 'Fear and Greed Index' },
  { id: 'buffett', label: 'Buffett Indicator' },
  { id: 'peRatio', label: 'P/E Ratio' },
  { id: 'blankMetric', label: 'Yield curve inversion' },
  { id: 'watchlist', label: 'Watchlist' },
  { id: 'aiSummary', label: 'AI Summary' },
  { id: 'tickerChart1', label: 'Ticker chart 1' },
  { id: 'tickerChart2', label: 'Ticker chart 2' },
  { id: 'tickerChart3', label: 'Ticker chart 3' },
  { id: 'tickerChart4', label: 'Ticker chart 4' },
  { id: 'darkpool', label: 'Darkpool' },
  { id: 'snapshot', label: 'Snapshot' },
  { id: 'options', label: 'Options' },
];

const VALID_VIEW_IDS = new Set(['watchlists', 'screener', 'trends', 'darkpool', 'trades']);

export default function HomePageClient() {
  const router = useRouter();
  const params = useParams();
  const viewFromUrl = (params?.view as string[] | undefined)?.[0];
  const validView = viewFromUrl && VALID_VIEW_IDS.has(viewFromUrl) ? viewFromUrl : null;

  /** 当前打开的 view：null = 主页（无 view）；与 URL 同步 */
  const [openView, setOpenViewState] = useState<string | null>(validView);

  const setOpenView = useCallback(
    (view: string | null) => {
      setOpenViewState(view);
      const path = view ? `/${view}` : '/';
      router.replace(path);
    },
    [router]
  );

  useEffect(() => {
    setOpenViewState(validView);
  }, [validView]);

  const [selectedWatchlist, setSelectedWatchlist] = useState<string | null>(null);
  /** 当前选中的 Watchlist 来源：system（Recommended 六个）或 user（自定义/My Watchlists） */
  const [selectedWatchlistSource, setSelectedWatchlistSource] = useState<'system' | 'user' | null>(null);
  const [tooltipConfig] = useState(DEFAULT_TOOLTIP_CONFIG);
  const [watchlistStocks, setWatchlistStocks] = useState<Stock[][]>([]);
  const [watchlistBorderColor, setWatchlistBorderColor] = useState(WATCHLIST_BORDER);
  const [watchlistBgColor, setWatchlistBgColor] = useState(WATCHLIST_BG);
  const [cardHoverColor, setCardHoverColor] = useState(CARD_HOVER);
  const [cardActiveColor, setCardActiveColor] = useState(CARD_ACTIVE);
  const [backButtonHoverPreset, setBackButtonHoverPreset] = useState<BackButtonHoverPreset>(
    BACK_BUTTON_HOVER_PRESET_DEFAULT
  );
  const [barBgColor, setBarBgColor] = useState(BAR_BG);
  const [barBorderColor, setBarBorderColor] = useState(BAR_BORDER);
  const [toolbarOpacity, setToolbarOpacity] = useState(1);
  const [toolbarBlur, setToolbarBlur] = useState(24);
  const [toolbarHighlight, setToolbarHighlight] = useState(0.15);
  const [toolbarHighlightHeight, setToolbarHighlightHeight] = useState(1);
  const [toolbarAccentOpacity, setToolbarAccentOpacity] = useState(0.22);
  const [toolbarAccentGradientStop, setToolbarAccentGradientStop] = useState(0.6);
  /** 是否显示 Bar 彩色高光（Ctrl+Shift+H 切换） */
  const [accentHighlightVisible, setAccentHighlightVisible] = useState(true);
  const [toolbarShadowStrength, setToolbarShadowStrength] = useState(1);
  const [toolbarBorderWidth, setToolbarBorderWidth] = useState(1);
  const [popoverBgColor, setPopoverBgColor] = useState(POPOVER_BG);
  const [popoverBorderColor, setPopoverBorderColor] = useState(POPOVER_BORDER);
  const [barIconHoverPreset, setBarIconHoverPreset] = useState<BarIconHoverPreset>(
    BAR_ICON_HOVER_PRESET_DEFAULT
  );
  /** App 背景（Sim 默认，勿在更新时覆盖） */
  const [appBgColor, setAppBgColor] = useState('#101011');
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [componentPanelOpen, setComponentPanelOpen] = useState(false);
  /** 各 view 显示/隐藏（底部 bar 按钮控制） */
  const [viewVisible, setViewVisible] = useState({
    watchlist: false,
    ticker: true,
    heatmap: true,
    news: true,
    event: true,
    snapshot: false,
    darkpool: false,
    options: false,
  });
  /** 全局 Switch 视觉样式（在 News 面板里调整） */
  const [switchStyle, setSwitchStyle] = useState<SwitchStyle>(DEFAULT_SWITCH_STYLE);
  /** Bar 上显示哪些 item（3-dots 里用 Switch 控制） */
  const [barItemsShown, setBarItemsShown] = useState({
    watchlist: true,
    ticker: true,
    event: true,
    news: true,
    options: true,
    snapshot: true,
    darkpool: true,
  });
  /** 最近访问的 watchlist 标签，最多 3 个，最新在前 */
  const [recents, setRecents] = useState<string[]>([]);
  /** Event/News 实际渲染用（关闭时延迟收起，用于离开动效） */
  const [displayEvent, setDisplayEvent] = useState(true);
  const [displayNews, setDisplayNews] = useState(true);
  /** Tickers 关闭时延迟收起，用于离开动效 */
  const [displayTicker, setDisplayTicker] = useState(true);
  /** Snapshot 关闭时延迟收起，用于离开动效 */
  const [displaySnapshot, setDisplaySnapshot] = useState(false);
  /** Darkpool 关闭时延迟收起，用于离开动效 */
  const [displayDarkpool, setDisplayDarkpool] = useState(false);
  /** Options（Strikes + Bull Put Spread）实际渲染用，与 Event/News 互斥，关闭时延迟收起用于离开动效 */
  const [displayOptions, setDisplayOptions] = useState(false);
  /** 点击 ticker 后中间面板显示 Chart，标题为该股票信息；null 时显示 Heatmap */
  const [selectedStockForChart, setSelectedStockForChart] = useState<Stock | null>(null);
  /** 开启时先 flex 0 再过渡到 flex 1，避免另一块高度突变 */
  const [eventExpandReady, setEventExpandReady] = useState(true);
  const [newsExpandReady, setNewsExpandReady] = useState(true);
  const eventExitRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const newsExitRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tickerExitRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const snapshotExitRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const darkpoolExitRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const optionsEnterRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const optionsExitRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevEventVisibleRef = useRef(true);
  const prevNewsVisibleRef = useRef(true);
  const watchlistButtonRef = useRef<HTMLButtonElement>(null);
  /** 卡片 3-dots 打开的 popover：{ watchlist label, 触发按钮的 rect } */
  const [cardPopover, setCardPopover] = useState<{ label: string; rect: DOMRect } | null>(null);
  /** 顶部 nav 头像点击后的 popover：触发按钮的 rect，null 表示关闭 */
  const [avatarPopoverRect, setAvatarPopoverRect] = useState<DOMRect | null>(null);
  const [createMenuAnchor, setCreateMenuAnchor] = useState<CreateMenuAnchor | null>(null);
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false);
  const [canvasLayoutMode, setCanvasLayoutMode] = useState(false);
  const [drawerChatInput, setDrawerChatInput] = useState('');
  const [drawerChatMessages, setDrawerChatMessages] = useState<DrawerChatMessage[]>([
    {
      id: 'assistant-1',
      role: 'assistant',
      text: 'Hi, I am your AI copilot. Ask me to build a card, summarize market context, or suggest a watchboard layout.',
    },
    {
      id: 'assistant-2',
      role: 'assistant',
      text: 'Example: "Create a new AI Summary card for NVDA and TSLA."',
    },
  ]);
  /** Bar 内 3-dots 按钮打开的 popover：触发按钮的 rect，null 表示关闭 */
  const [barDotsPopoverRect, setBarDotsPopoverRect] = useState<DOMRect | null>(null);
  /** 底部 Watchlist 按钮打开的 wl 列表 popover：触发按钮的 rect，null 表示关闭 */
  const [watchlistPopoverRect, setWatchlistPopoverRect] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);
  const [pendingCanvasCardRequest, setPendingCanvasCardRequest] = useState<{ id: CardId; token: number } | null>(null);
  const nextCanvasCardTokenRef = useRef(1);
  useEffect(() => {
    setWatchlistPopoverRect(null);
  }, [selectedStockForChart]);
  /** Recommended 区域「View more」全屏弹窗 */
  const [viewMorePopupOpen, setViewMorePopupOpen] = useState(false);
  /** 头像菜单里 Account settings 的全屏弹窗 */
  const [accountSettingsOpen, setAccountSettingsOpen] = useState(false);
  /** Account settings 弹窗当前选中的左侧分类 */
  const [accountSettingsSection, setAccountSettingsSection] = useState<
    'profile' | 'account' | 'alerts' | 'language' | 'referral' | 'subscription' | 'logout'
  >('profile');
  /** Alert Management 里展示的 Tickers：从本地股票库取前 20 只（带 logo） */
  const alertTickerStocks = stocks.slice(0, 20);
  const [tickerAlertEnabled, setTickerAlertEnabled] = useState<Record<string, boolean>>(() =>
    alertTickerStocks.reduce<Record<string, boolean>>((acc, s) => {
      acc[s.code] = false;
      return acc;
    }, {})
  );
  /** 每个 watchlist 的 Alert 开关（在 Alert Management 里管理） */
  const [watchlistAlertEnabled, setWatchlistAlertEnabled] = useState<Record<string, boolean>>(() =>
    watchlists.reduce<Record<string, boolean>>((acc, w) => {
      acc[w.label] = false;
      return acc;
    }, {})
  );
  /** View more 左侧分类选中项（Watchlist 分类） */
  const [viewMoreCategoryId, setViewMoreCategoryId] = useState<string>('recommended');
  /** View more 弹窗内搜索关键字 */
  const [viewMoreSearch, setViewMoreSearch] = useState('');
  /** View more 弹窗内当前选中的列表（card 视图） */
  const [viewMoreSelectedList, setViewMoreSelectedList] = useState<ViewMoreListItem | null>(null);
  /** 底部 bar 提醒按钮：true 为开启（bell），false 为关闭（bell-minus） */
  const [alertOn, setAlertOn] = useState(false);
  /** 点击 Alert 时弹出的基础对话框开关 */
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  /** Alert 对话框类型：系统列表开启说明 / 关闭确认 */
  const [alertDialogKind, setAlertDialogKind] = useState<'open' | 'close'>('open');
  /** Chart 是否处于暂停状态（影响 Live/Pause 徽标） */
  const [chartPaused, setChartPaused] = useState(false);

  const toggleView = useCallback((key: keyof typeof viewVisible) => {
    setViewVisible((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      if (key === 'options' && next.options) {
        next.event = false;
        next.news = false;
      }
      if ((key === 'event' || key === 'news') && next[key]) {
        next.options = false;
      }
      return next;
    });
  }, []);

  const selectedTopNav = openView
    ? (topNav.find((item) => NAV_LABEL_TO_VIEW_ID[item.label] === openView)?.label ?? null)
    : null;

  const barAnimating = useBarAnimation(openView, selectedStockForChart);

  /* Bar 主题色同步到 CSS 变量（Sim 覆盖时生效） */
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.style.setProperty('--bar-bg', barBgColor);
    document.documentElement.style.setProperty('--bar-border', barBorderColor);
  }, [barBgColor, barBorderColor]);

  useToolbarStylePersistence(
    {
      barBgColor,
      barBorderColor,
      toolbarOpacity,
      toolbarBlur,
      toolbarHighlight,
      toolbarHighlightHeight,
      toolbarAccentOpacity,
      toolbarAccentGradientStop,
      toolbarShadowStrength,
      toolbarBorderWidth,
    },
    {
      setBarBgColor,
      setBarBorderColor,
      setToolbarOpacity,
      setToolbarBlur,
      setToolbarHighlight,
      setToolbarHighlightHeight,
      setToolbarAccentOpacity,
      setToolbarAccentGradientStop,
      setToolbarShadowStrength,
      setToolbarBorderWidth,
    }
  );

  useEffect(() => {
    setWatchlistStocks(buildWatchlistStocks());
  }, []);

  /** 离开 Watchlists 视图时清空 ticker 选择，返回时默认显示 Heatmap */
  useEffect(() => {
    if (openView !== 'watchlists') setSelectedStockForChart(null);
  }, [openView]);

  /** 回到 Heatmap（未选 ticker）时关闭 Snapshot / Darkpool / Options，避免在 Heatmap 下显示这些附属视图 */
  useEffect(() => {
    if (!selectedStockForChart) {
      setViewVisible((prev) =>
        prev.snapshot || prev.darkpool || prev.options
          ? { ...prev, snapshot: false, darkpool: false, options: false }
          : prev,
      );
      setDisplayOptions(false);
    }
  }, [selectedStockForChart]);

  useEffect(() => {
    if (!viewMorePopupOpen) {
      setViewMoreSelectedList(null);
    }
  }, [viewMorePopupOpen]);

  useEffect(() => {
    if (viewMoreCategoryId === 'recommended') {
      setViewMoreSelectedList(null);
    }
  }, [viewMoreCategoryId]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setViewMorePopupOpen(false);
        setBarDotsPopoverRect(null);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === '1') {
        e.preventDefault();
        setColorPickerOpen((open) => !open);
      }
      if ((e.metaKey || e.ctrlKey) && (e.key === '2' || e.key === '3')) {
        e.preventDefault();
        e.stopPropagation();
        setComponentPanelOpen((open) => !open);
      }
      if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        setChartPaused((prev) => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === 'h' || e.key === 'H')) {
        e.preventDefault();
        setAccentHighlightVisible((v) => !v);
      }
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, []);

  /* Event/News 关闭时延迟卸载，用于播放离开动效 + flex 收缩过渡；开启时先 flex 0，下一帧再 flex 1，让两个面板的 flex 都有过渡（另一块从 2→1，新块从 0→1） */
  useEffect(() => {
    if (viewVisible.event) {
      if (eventExitRef.current) clearTimeout(eventExitRef.current);
      eventExitRef.current = null;
      setDisplayEvent(true);
      if (!prevEventVisibleRef.current) {
        prevEventVisibleRef.current = true;
        setEventExpandReady(false);
        const t = setTimeout(() => setEventExpandReady(true), EXPAND_READY_DELAY_MS);
        return () => clearTimeout(t);
      }
    } else {
      prevEventVisibleRef.current = false;
      eventExitRef.current = setTimeout(() => setDisplayEvent(false), PANEL_EXIT_DELAY_MS);
    }
    return () => {
      if (eventExitRef.current) clearTimeout(eventExitRef.current);
    };
  }, [viewVisible.event]);
  useEffect(() => {
    if (viewVisible.news) {
      if (newsExitRef.current) clearTimeout(newsExitRef.current);
      newsExitRef.current = null;
      setDisplayNews(true);
      if (!prevNewsVisibleRef.current) {
        prevNewsVisibleRef.current = true;
        setNewsExpandReady(false);
        const t = setTimeout(() => setNewsExpandReady(true), EXPAND_READY_DELAY_MS);
        return () => clearTimeout(t);
      }
    } else {
      prevNewsVisibleRef.current = false;
      newsExitRef.current = setTimeout(() => setDisplayNews(false), PANEL_EXIT_DELAY_MS);
    }
    return () => {
      if (newsExitRef.current) clearTimeout(newsExitRef.current);
    };
  }, [viewVisible.news]);

  /* Tickers 关闭时延迟卸载，用于离开动效 + 宽度过渡 */
  useEffect(() => {
    if (viewVisible.ticker) {
      if (tickerExitRef.current) clearTimeout(tickerExitRef.current);
      tickerExitRef.current = null;
      setDisplayTicker(true);
    } else {
      tickerExitRef.current = setTimeout(() => setDisplayTicker(false), PANEL_EXIT_DELAY_MS);
    }
    return () => {
      if (tickerExitRef.current) clearTimeout(tickerExitRef.current);
    };
  }, [viewVisible.ticker]);

  /* Snapshot 关闭时延迟卸载，用于离开动效 + 高度收缩过渡 */
  useEffect(() => {
    if (viewVisible.snapshot) {
      if (snapshotExitRef.current) clearTimeout(snapshotExitRef.current);
      snapshotExitRef.current = null;
      setDisplaySnapshot(true);
    } else {
      snapshotExitRef.current = setTimeout(() => setDisplaySnapshot(false), PANEL_EXIT_DELAY_MS);
    }
    return () => {
      if (snapshotExitRef.current) clearTimeout(snapshotExitRef.current);
    };
  }, [viewVisible.snapshot]);

  /* Darkpool 关闭时延迟卸载，用于离开动效 + 高度收缩过渡 */
  useEffect(() => {
    if (viewVisible.darkpool) {
      if (darkpoolExitRef.current) clearTimeout(darkpoolExitRef.current);
      darkpoolExitRef.current = null;
      setDisplayDarkpool(true);
    } else {
      darkpoolExitRef.current = setTimeout(() => setDisplayDarkpool(false), PANEL_EXIT_DELAY_MS);
    }
    return () => {
      if (darkpoolExitRef.current) clearTimeout(darkpoolExitRef.current);
    };
  }, [viewVisible.darkpool]);

  /* Options 与 Event/News 互斥：打开时等 Event/News 离开动效播完再显示 Options；关闭时播完离开动效再切回 Event/News */
  useEffect(() => {
    if (viewVisible.options) {
      if (optionsExitRef.current) {
        clearTimeout(optionsExitRef.current);
        optionsExitRef.current = null;
      }
      optionsEnterRef.current = setTimeout(() => setDisplayOptions(true), OPTIONS_TRANSITION_MS);
      return () => {
        if (optionsEnterRef.current) clearTimeout(optionsEnterRef.current);
      };
    } else {
      if (optionsEnterRef.current) {
        clearTimeout(optionsEnterRef.current);
        optionsEnterRef.current = null;
      }
      optionsExitRef.current = setTimeout(() => setDisplayOptions(false), OPTIONS_TRANSITION_MS);
      return () => {
        if (optionsExitRef.current) clearTimeout(optionsExitRef.current);
      };
    }
  }, [viewVisible.options]);

  const watchlistIndex = selectedWatchlist ? watchlists.findIndex((w) => w.label === selectedWatchlist) : -1;
  const currentStocks = watchlistIndex >= 0 ? (watchlistStocks[watchlistIndex] ?? []) : [];
  const currentWatchlistMeta = watchlistIndex >= 0 ? watchlists[watchlistIndex] : null;
  const getWatchboardLabel = useCallback((label: string) => {
    const index = watchlists.findIndex((item) => item.label === label);
    return index >= 0 ? `My Board ${index + 1}` : label;
  }, []);

  const addRecent = useCallback((label: string) => {
    setRecents((prev) => [label, ...prev.filter((l) => l !== label)].slice(0, RECENTS_MAX_COUNT));
  }, []);

  const handleDrawerChatSubmit = useCallback(() => {
    const value = drawerChatInput.trim();
    if (!value) return;

    const userMessage: DrawerChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: value,
    };
    const assistantMessage: DrawerChatMessage = {
      id: `assistant-${Date.now() + 1}`,
      role: 'assistant',
      text: 'This is a mock AI response. I can turn this drawer into a richer assistant flow next.',
    };

    setDrawerChatMessages((prev) => [...prev, userMessage, assistantMessage]);
    setDrawerChatInput('');
  }, [drawerChatInput]);

  return (
    <div
      className="flex h-screen overflow-hidden flex-col"
      style={{ ...asideStyle, ['--app-bg' as string]: appBgColor } as React.CSSProperties}
    >
      <AppStyles tooltipConfig={tooltipConfig} />
      <Header
        topNav={topNav}
        selectedTopNav={selectedTopNav}
        onSelectTopNav={(label) => {
          const viewId = NAV_LABEL_TO_VIEW_ID[label];
          if (viewId) setOpenView(viewId);
        }}
        layoutMode={canvasLayoutMode}
        onEditLayoutClick={() => setCanvasLayoutMode((prev) => !prev)}
        onDrawerButtonClick={() => {
          setCreateMenuAnchor(null);
          setRightDrawerOpen(true);
        }}
        onLogoClick={() => setOpenView(null)}
        hideBorder={openView === 'watchlists'}
        onAvatarClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setAvatarPopoverRect((prev) => (prev ? null : rect));
        }}
        avatarPopoverOpen={!!avatarPopoverRect}
      />
      <div className="flex min-h-0 flex-1 overflow-hidden bg-[var(--app-bg)]">
        <div
          className={`flex min-h-0 min-w-0 flex-1 gap-1.5 overflow-x-hidden overflow-y-auto p-3 pt-0 pl-2 pr-2 ${
            openView === 'watchlists' ? 'items-start' : 'items-stretch'
          } ${
            openView === 'watchlists' ? 'pb-8' : 'pb-0'
          }`}
        >
        {openView === null ? (
          <div className="page-transition-in flex min-h-0 flex-1 flex-col overflow-auto px-2">
              <div
                className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 pt-10 pb-10"
                style={{
                  ['--card-hover' as string]: cardHoverColor,
                  ['--card-active' as string]: cardActiveColor,
                }}
              >
              {cardGroups.map((group) => (
                <section key={group.id}>
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <h2
                      className="text-[15px] font-semibold text-[#F2F2F7]"
                      style={{ fontFamily: 'var(--font-inter)' }}
                    >
                      {group.title}
                    </h2>
                    {group.title === 'My Watchlists' ? (
                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          type="button"
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#F2F2F7] outline-none transition-[transform,background-color] duration-150 hover:bg-white/10 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#444444] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-bg)]"
                          style={{ fontFamily: 'var(--font-inter)' }}
                          aria-label="设置"
                        >
                          <Icon name="settings" className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg bg-[#2C2C2E] pl-2 pr-3 text-[13px] font-medium text-[#F2F2F7] outline-none transition-[transform,color] duration-150 hover:bg-[#3A3A3C] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#444444] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-bg)]"
                          style={{ fontFamily: 'var(--font-inter)' }}
                        >
                          <Icon name="plus" className="h-4 w-4" />
                          Create
                        </button>
                      </div>
                    ) : group.title === 'Recommended' ? (
                      <button
                        type="button"
                        className="shrink-0 rounded-lg px-3 py-1.5 text-[13px] font-medium text-[#F2F2F7] outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#444444] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-bg)]"
                        style={{ fontFamily: 'var(--font-inter)' }}
                        onClick={() => {
                          setViewMoreCategoryId('recommended');
                          setViewMorePopupOpen(true);
                        }}
                      >
                        View more
                      </button>
                    ) : null}
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {group.cards.map((card, cardIndex) => {
                      const tickerCount =
                        group.kind === 'user' ? (watchlistStocks[cardIndex]?.length ?? 0) : 0;
                      const wlForUser = group.kind === 'user' ? watchlists[cardIndex] : null;
                      const wlForRecommended =
                        group.kind === 'recommended' ? watchlists[cardIndex] ?? null : null;
                      const targetWl = wlForUser ?? wlForRecommended;
                      const isClickableCard = !!targetWl;
                      return (
                        <div
                          key={card.id}
                          role={isClickableCard ? 'button' : undefined}
                          tabIndex={isClickableCard ? 0 : undefined}
                          className={`card-hoverable group relative flex min-h-[140px] flex-col rounded-[12px] border p-4 shadow-sm ${isClickableCard ? 'cursor-pointer' : ''}`}
                          style={{
                            borderColor: watchlistBorderColor,
                            backgroundColor: watchlistBgColor,
                          }}
                          onClick={() => {
                            if (targetWl) {
                              addRecent(targetWl.label);
                              setOpenView('watchlists');
                              setSelectedWatchlist(targetWl.label);
                              setSelectedWatchlistSource(wlForRecommended ? 'system' : 'user');
                            }
                          }}
                          onKeyDown={(e) => {
                            if (targetWl && (e.key === 'Enter' || e.key === ' ')) {
                              e.preventDefault();
                              addRecent(targetWl.label);
                              setOpenView('watchlists');
                              setSelectedWatchlist(targetWl.label);
                              setSelectedWatchlistSource(wlForRecommended ? 'system' : 'user');
                            }
                          }}
                        >
                          {wlForUser && (
                            <div
                              className="absolute bottom-2 right-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                              role="presentation"
              >
              <button
                                type="button"
                                className="rounded-lg p-1.5 text-[#A1A1AA] outline-none transition-colors hover:bg-white/10 hover:text-[#F2F2F7] focus-visible:ring-2 focus-visible:ring-[#444444] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-bg)]"
                                aria-label="更多"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                                  setCardPopover((prev) =>
                                    prev?.label === wlForUser.label ? null : { label: wlForUser.label, rect }
                                  );
                                }}
                              >
                                <Icon name="dots" className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                          <div className="flex flex-col">
                            {group.kind === 'user' && wlForUser && (
                              <span className="mb-2 flex shrink-0" style={{ color: wlForUser.color }}>
                                <Icon name="bookmark" className="h-5 w-5" />
                              </span>
                            )}
                            {group.kind === 'recommended' && card.iconSrc && (
                              <span
                                className="mb-2 inline-flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden"
                                aria-hidden
                              >
                                <Image
                                  src={card.iconSrc}
                                  alt=""
                                  width={20}
                                  height={20}
                                  className="h-5 w-5 object-contain"
                                />
                              </span>
                            )}
                            {card.name ? (
                              <h3
                                className="text-[13px] font-semibold text-[#F2F2F7]"
                                style={{ fontFamily: 'var(--font-inter)' }}
                              >
                                {wlForUser ? getWatchboardLabel(wlForUser.label) : card.name}
                              </h3>
                            ) : null}
                          </div>
                          {group.kind === 'user' && (
                            <p
                              className="mt-auto pt-2 text-[12px] text-white/70"
                              style={{ fontFamily: 'var(--font-inter)' }}
                            >
                              Tickers: {tickerCount}
                            </p>
                          )}
                          {group.kind === 'recommended' && card.tickerCount != null && (
                            <p
                              className="mt-auto pt-2 text-[12px] text-white/70"
                              style={{ fontFamily: 'var(--font-inter)' }}
                            >
                              Tickers: {card.tickerCount}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          </div>
        ) : null}
        {openView === 'trades' ? (
          <div className="page-transition-in flex min-h-0 flex-1 flex-col overflow-hidden px-2">
            <h2
              className="shrink-0 px-1 pt-2 pb-3 text-[15px] font-semibold text-[#F2F2F7]"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Trades
            </h2>
            <div className="min-h-0 flex-1">
              <TradesTable
                borderColor={watchlistBorderColor}
                backgroundColor={watchlistBgColor}
              />
            </div>
          </div>
        ) : null}
        {openView === 'watchlists' ? (
          <CanvasWorkspaceDemo
            currentStocks={currentStocks}
            selectedStockForChart={selectedStockForChart}
            onTickerClick={(stock) => setSelectedStockForChart(stock)}
            borderColor={watchlistBorderColor}
            backgroundColor={watchlistBgColor}
            layoutMode={canvasLayoutMode}
            onLayoutModeChange={setCanvasLayoutMode}
            paused={chartPaused}
            showTicker={viewVisible.ticker}
            showEvent={viewVisible.event && displayEvent}
            showNews={viewVisible.news && displayNews}
            requestedCardId={pendingCanvasCardRequest?.id ?? null}
            requestedCardToken={pendingCanvasCardRequest?.token ?? 0}
          />
        ) : null}
        {openView === 'watchlists' ? (
          <Bar
            barAnimating={barAnimating}
            toolbarOpacity={toolbarOpacity}
            toolbarBlur={toolbarBlur}
            toolbarBorderWidth={toolbarBorderWidth}
            toolbarHighlight={toolbarHighlight}
            toolbarHighlightHeight={toolbarHighlightHeight}
            toolbarShadowStrength={toolbarShadowStrength}
            accentHighlightVisible={accentHighlightVisible}
            accentColor={accentHighlightVisible ? currentWatchlistMeta?.color : undefined}
            toolbarAccentOpacity={toolbarAccentOpacity}
            toolbarAccentGradientStop={toolbarAccentGradientStop}
            selectedStockForChart={selectedStockForChart}
            selectedWatchlist={selectedWatchlist}
            currentWatchlistColor={currentWatchlistMeta?.color}
            onBackToWatchlist={() => setSelectedStockForChart(null)}
            watchlistPopoverRect={watchlistPopoverRect}
            setWatchlistPopoverRect={setWatchlistPopoverRect}
            watchlistButtonRef={watchlistButtonRef}
            barDotsPopoverRect={barDotsPopoverRect}
            setBarDotsPopoverRect={setBarDotsPopoverRect}
            onAddClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setCreateMenuAnchor((prev) =>
                prev &&
                prev.source === 'bar' &&
                prev.rect.top === rect.top &&
                prev.rect.left === rect.left &&
                prev.rect.width === rect.width &&
                prev.rect.height === rect.height
                  ? null
                  : { rect, source: 'bar' }
              );
            }}
          />
        ) : null}
        </div>
        {rightDrawerOpen ? (
          <aside
            className="flex min-h-0 self-stretch w-[360px] max-w-[calc(100vw-24px)] shrink-0 flex-col overflow-hidden border-l border-white/10 bg-[#121214]"
            role="dialog"
            aria-modal="false"
            aria-label="AI chat drawer"
          >
            <div className="flex items-center justify-between px-4 py-4">
              <h2
                className="text-[14px] font-semibold text-[#F2F2F7]"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                AI Copilot
              </h2>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 outline-none transition-colors duration-150 hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-[#121214]"
                aria-label="Close drawer"
                onClick={() => setRightDrawerOpen(false)}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
                {drawerChatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`max-w-[88%] rounded-[16px] px-3 py-2.5 text-[13px] leading-5 ${
                      message.role === 'user'
                        ? 'ml-auto bg-[#D7FF64] text-[#111111]'
                        : 'border border-white/10 bg-white/[0.04] text-[#F2F2F7]'
                    }`}
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    {message.text}
                  </div>
                ))}
              </div>
              <div className="p-4">
                <div className="relative flex h-[100px] flex-col rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-3">
                  <div className="min-h-0 flex-1 pr-14">
                    <textarea
                    value={drawerChatInput}
                    onChange={(e) => setDrawerChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleDrawerChatSubmit();
                      }
                    }}
                    placeholder="Ask AI to create, summarize, or organize..."
                    className="h-full w-full resize-none bg-transparent text-[13px] text-[#F2F2F7] outline-none placeholder:text-white/30"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  />
                  </div>
                  <button
                    type="button"
                    className="mt-2 flex w-fit items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] p-[6px] text-[12px] font-medium text-[#F2F2F7] outline-none transition-colors duration-150 hover:bg-white/[0.08] focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-[#121214]"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    <span>My board 1</span>
                    <svg className="h-3 w-3 text-white/60" viewBox="0 0 12 12" fill="none" aria-hidden>
                      <path
                        d="M3 3L9 9M9 3L3 9"
                        stroke="currentColor"
                        strokeWidth="1.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={handleDrawerChatSubmit}
                    className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#D7FF64] text-[#111111] outline-none transition-[transform,filter] duration-150 hover:scale-[0.98] hover:brightness-95 focus-visible:ring-2 focus-visible:ring-[#D7FF64] focus-visible:ring-offset-2 focus-visible:ring-offset-[#121214]"
                    aria-label="Send"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path
                        d="M8 12V4M8 4L4.5 7.5M8 4l3.5 3.5"
                        stroke="currentColor"
                        strokeWidth="1.33"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </aside>
        ) : null}
      </div>
      {createMenuAnchor ? (
          <div className="fixed inset-0 z-50" aria-hidden onClick={() => setCreateMenuAnchor(null)}>
            <div
              className="absolute rounded-[16px] border border-white/10 bg-[#161618] p-3 shadow-[0_16px_40px_rgba(0,0,0,0.42)]"
              style={{
                top: createMenuAnchor.source === 'bar' ? undefined : createMenuAnchor.rect.bottom + 8,
                bottom: createMenuAnchor.source === 'bar' ? 42 + 16 + 12 : undefined,
                width: 700,
                left:
                  createMenuAnchor.source === 'bar'
                    ? '50%'
                    : Math.max(16, createMenuAnchor.rect.right - 700),
                transform:
                  createMenuAnchor.source === 'bar'
                    ? 'translateX(-50%)'
                    : undefined,
              }}
              onClick={(e) => e.stopPropagation()}
              role="menu"
              aria-label="Create menu"
            >
              <div className="grid grid-cols-5 gap-2">
                {CREATE_CARD_LIBRARY.map(({ id, label }) => (
                  <button
                    key={id}
                    type="button"
                    className="relative flex items-center justify-center rounded-[12px] border border-white/8 bg-white/[0.03] p-[12px] text-center text-[12px] leading-4 text-[#F2F2F7] outline-none transition-colors duration-150 hover:bg-white/[0.06] focus-visible:bg-white/[0.06]"
                    style={{ fontFamily: 'var(--font-inter)' }}
                    role="menuitem"
                    onClick={() => {
                      const token = nextCanvasCardTokenRef.current++;
                      setPendingCanvasCardRequest({ id, token });
                      setCreateMenuAnchor(null);
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}
        {watchlistPopoverRect && (
          <>
            <div
              className="fixed inset-0 z-40"
              aria-hidden
              onClick={() => setWatchlistPopoverRect(null)}
            />
            <div
              className="fixed z-50 max-h-[min(320px,50vh)] min-w-[220px] overflow-auto rounded-[10px] border px-1 pt-0 pb-1.5 shadow-2xl shadow-black/60 backdrop-blur-sm"
              style={{
                left: watchlistPopoverRect.left,
                top: watchlistPopoverRect.top - 8,
                transform: 'translateY(-100%)',
                backgroundColor: popoverBgColor,
                borderColor: popoverBorderColor,
              }}
              role="listbox"
              aria-label={selectedStockForChart ? 'Ticker 列表' : 'Watchlist 列表'}
            >
              {selectedStockForChart
                ? currentStocks.map((stock) => {
                    const isSelected = selectedStockForChart.code === stock.code;
                    return (
                      <button
                        key={stock.code}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          setSelectedStockForChart(stock);
                          setWatchlistPopoverRect(null);
                        }}
                        className={`my-1 flex w-full cursor-pointer items-center gap-2 rounded-[8px] px-[6px] py-1.5 text-left text-[13px] text-[#F2F2F7] outline-none transition-colors ${
                          isSelected
                            ? 'bg-white/12 ring-1 ring-white/10'
                            : 'hover:bg-white/8'
                        }`}
                        style={{ fontFamily: 'var(--font-inter)', width: '100%' }}
                      >
                        <span className="shrink-0">
                          <Image
                            src={stock.logo}
                            alt={stock.code}
                            width={20}
                            height={20}
                            className="h-5 w-5 rounded-full object-contain"
                          />
                        </span>
                        <span className="min-w-0 flex-1 text-left">
                          <span className="block truncate text-[13px] font-semibold text-white">
                            {stock.code}
                          </span>
                          <span className="block truncate text-[11px] text-white/60">
                            {stock.name}
                          </span>
                        </span>
                      </button>
                    );
                  })
                : watchlists.map((item) => {
                    const isSelected = selectedWatchlist === item.label;
                    return (
                      <button
                        key={item.label}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          setSelectedWatchlist(item.label);
                          setSelectedWatchlistSource('user');
                          setWatchlistPopoverRect(null);
                        }}
                        className={`my-1 flex w-full cursor-pointer items-center gap-2 rounded-[8px] px-[6px] py-1.5 text-left text-[13px] text-[#F2F2F7] outline-none transition-colors ${
                          isSelected
                            ? 'bg-white/12 ring-1 ring-white/10'
                            : 'hover:bg-white/8'
                        }`}
                        style={{ fontFamily: 'var(--font-inter)', width: '100%' }}
                      >
                        <span className="shrink-0" style={{ color: item.color }}>
                          <Icon name="bookmark" className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1 truncate">{getWatchboardLabel(item.label)}</span>
                      </button>
                    );
                  })}
            </div>
          </>
        )}
        {barDotsPopoverRect && (
          <MenuSurface
            containerStyle={{
              left: barDotsPopoverRect.left,
              top: barDotsPopoverRect.top - 8,
              transform: 'translateY(-100%)',
              backgroundColor: popoverBgColor,
              borderColor: popoverBorderColor,
            }}
            onClose={() => setBarDotsPopoverRect(null)}
            ariaLabel="Bar 更多"
          >
            <div className="flex flex-col gap-0 py-0.5">
              <div className="px-2 pt-1 pb-0.5">
                <span
                  className="text-[11px] font-medium text-white/40"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  显示在 Bar
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                {(
                  [
                    { key: 'watchlist' as const, label: 'List', icon: 'bookmark' as const },
                    { key: 'ticker' as const, label: 'Ticker', icon: 'list' as const },
                    { key: 'event' as const, label: 'Event', icon: 'event' as const },
                    { key: 'news' as const, label: 'News', icon: 'news' as const },
                    { key: 'options' as const, label: 'Options', icon: 'options' as const },
                    { key: 'snapshot' as const, label: 'Snapshot', icon: 'snapshot' as const },
                    { key: 'darkpool' as const, label: 'DarkPool', icon: 'darkpool' as const },
                  ] as const
                ).map(({ key, label, icon }) => {
                  const on = barItemsShown[key];
                  return (
                    <div
                      key={key}
                      className="flex cursor-pointer items-center justify-between gap-2 rounded px-[6px] py-1.5 text-left text-[13px] text-[#F2F2F7] transition-colors hover:bg-white/10"
                      style={{ fontFamily: 'var(--font-inter)' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setBarItemsShown((prev) => ({ ...prev, [key]: !prev[key] }));
                      }}
                    >
                      <span className="flex items-center gap-2">
                        <Icon name={icon} className="h-4 w-4 shrink-0 text-[#A1A1AA]" />
                        {label}
                      </span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={on}
                        aria-label={`${label} ${on ? '在 Bar 显示' : '在 Bar 隐藏'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setBarItemsShown((prev) => ({ ...prev, [key]: !prev[key] }));
                        }}
                        className="relative shrink-0 cursor-pointer rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#444] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--app-bg)]"
                        style={{
                          width: switchStyle.trackWidth,
                          height: switchStyle.trackHeight,
                          backgroundColor: on ? switchStyle.trackOnColor : switchStyle.trackOffColor,
                          transitionDuration: `${switchStyle.transitionDuration}ms`,
                        }}
                      >
                        <span
                          className="absolute rounded-full bg-[#1C1C1E] shadow-sm transition-[left] ease-out"
                          style={{
                            width: switchStyle.thumbSize,
                            height: switchStyle.thumbSize,
                            top: Math.max((switchStyle.trackHeight - switchStyle.thumbSize) / 2, 0),
                            left: on
                              ? Math.max(
                                  switchStyle.trackWidth - switchStyle.thumbSize - 2,
                                  0
                                )
                              : 2,
                            transitionDuration: `${switchStyle.transitionDuration}ms`,
                          }}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className="my-0.5 border-t border-white/10" role="separator" />
              <div className="px-2 pt-1 pb-0.5">
                <span
                  className="text-[11px] font-medium text-white/40"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  常用
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded px-[6px] py-1.5 text-left text-[13px] text-[#F2F2F7] outline-none transition-colors hover:bg-white/10"
                  style={{ fontFamily: 'var(--font-inter)' }}
                  role="menuitem"
                  onClick={(e) => {
                    e.stopPropagation();
                    setBarDotsPopoverRect(null);
                  }}
                >
                  <Icon name="settings" className="h-4 w-4 shrink-0 text-[#A1A1AA]" />
                  设置
                </button>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded px-[6px] py-1.5 text-left text-[13px] text-[#F2F2F7] outline-none transition-colors hover:bg-white/10"
                  style={{ fontFamily: 'var(--font-inter)' }}
                  role="menuitem"
                  onClick={(e) => {
                    e.stopPropagation();
                    setBarDotsPopoverRect(null);
                  }}
                >
                  <Icon name="search" className="h-4 w-4 shrink-0 text-[#A1A1AA]" />
                  搜索
                </button>
              </div>
              <div className="my-0.5 border-t border-white/10" role="separator" />
              <div className="px-2 pt-1 pb-0.5">
                <span
                  className="text-[11px] font-medium text-white/40"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  通知
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded px-[6px] py-1.5 text-left text-[13px] text-[#F2F2F7] outline-none transition-colors hover:bg-white/10"
                  style={{ fontFamily: 'var(--font-inter)' }}
                  role="menuitem"
                  onClick={(e) => {
                    e.stopPropagation();
                    setBarDotsPopoverRect(null);
                  }}
                >
                  <Icon name="bell" className="h-4 w-4 shrink-0 text-[#A1A1AA]" />
                  通知管理
                </button>
              </div>
              <div className="my-0.5 border-t border-white/10" role="separator" />
              <div className="px-2 pt-1 pb-0.5">
                <span
                  className="text-[11px] font-medium text-white/40"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  位置
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded px-[6px] py-1.5 text-left text-[13px] text-[#F2F2F7] outline-none transition-colors hover:bg-white/10"
                  style={{ fontFamily: 'var(--font-inter)' }}
                  role="menuitem"
                  onClick={(e) => {
                    e.stopPropagation();
                    setBarDotsPopoverRect(null);
                  }}
                >
                  <Icon name="pin-top" className="h-4 w-4 shrink-0 text-[#A1A1AA]" />
                  Pin to the top
                </button>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded px-[6px] py-1.5 text-left text-[13px] text-[#F2F2F7] outline-none transition-colors hover:bg-white/10"
                  style={{ fontFamily: 'var(--font-inter)' }}
                  role="menuitem"
                  onClick={(e) => {
                    e.stopPropagation();
                    setBarDotsPopoverRect(null);
                  }}
                >
                  <Icon name="pin-bottom" className="h-4 w-4 shrink-0 text-[#A1A1AA]" />
                  Pin to the bottom
                </button>
              </div>
            </div>
          </MenuSurface>
        )}
        {cardPopover && (
          <MenuSurface
            containerStyle={{
              left: cardPopover.rect.left,
              top: cardPopover.rect.bottom + 4,
              backgroundColor: popoverBgColor,
              borderColor: popoverBorderColor,
            }}
            onClose={() => setCardPopover(null)}
            ariaLabel="Card actions"
          >
            <div className="flex flex-col gap-1">
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded px-[6px] py-1.5 text-left text-[13px] text-[#F2F2F7] outline-none transition-colors hover:bg-white/10"
                style={{ fontFamily: 'var(--font-inter)' }}
                role="menuitem"
                onClick={(e) => {
                  e.stopPropagation();
                  setCardPopover(null);
                }}
              >
                <Icon name="edit" className="h-4 w-4 shrink-0 text-[#F2F2F7]" />
                Edit
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded px-[6px] py-1.5 text-left text-[13px] text-[#F2F2F7] outline-none transition-colors hover:bg-white/10"
                style={{ fontFamily: 'var(--font-inter)' }}
                role="menuitem"
                onClick={(e) => {
                  e.stopPropagation();
                  setCardPopover(null);
                }}
              >
                <Icon name="plus" className="h-4 w-4 shrink-0 text-[#F2F2F7]" />
                New tickers
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded px-[6px] py-1.5 text-left text-[13px] text-[#F2F2F7] outline-none transition-colors hover:bg-white/10"
                style={{ fontFamily: 'var(--font-inter)' }}
                role="menuitem"
                onClick={(e) => {
                  e.stopPropagation();
                  setCardPopover(null);
                }}
              >
                <Icon name="duplicate" className="h-4 w-4 shrink-0 text-[#F2F2F7]" />
                Duplicate
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded px-[6px] py-1.5 text-left text-[13px] text-[#F2F2F7] outline-none transition-colors hover:bg-white/10"
                style={{ fontFamily: 'var(--font-inter)' }}
                role="menuitem"
                onClick={(e) => {
                  e.stopPropagation();
                  setCardPopover(null);
                }}
              >
                <Icon name="bell-minus" className="h-4 w-4 shrink-0 text-[#F2F2F7]" />
                Alert off
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded px-[6px] py-1 text-left text-[13px] text-[#FF453A] outline-none transition-colors hover:bg-white/10"
                style={{ fontFamily: 'var(--font-inter)' }}
                role="menuitem"
                onClick={(e) => {
                  e.stopPropagation();
                  setCardPopover(null);
                }}
              >
                <Icon name="trash" className="h-4 w-4 shrink-0 text-[#FF453A]" />
                Delete
              </button>
            </div>
          </MenuSurface>
        )}
        {avatarPopoverRect && (
          <UserMenu
            containerStyle={{
              left: avatarPopoverRect.right,
              top: avatarPopoverRect.bottom + 6,
              transform: 'translateX(-100%)',
              backgroundColor: popoverBgColor,
              borderColor: popoverBorderColor,
            }}
            onClose={() => setAvatarPopoverRect(null)}
            onAccountSettings={() => {
              setAvatarPopoverRect(null);
              setAccountSettingsSection('profile');
              setAccountSettingsOpen(true);
            }}
            onAlertManagement={() => {
              setAvatarPopoverRect(null);
              setAccountSettingsSection('alerts');
              setAccountSettingsOpen(true);
            }}
          />
        )}
        {viewMorePopupOpen && (() => {
          const recommendedGroup = cardGroups.find((g) => g.kind === 'recommended');
          const baseCards = recommendedGroup?.cards ?? [];
          // 只在 View more 里使用的 demo Watchlists（生成 100 个），名字尽量贴近真实 Watchlist / Portfolio，再分布到 12 个分类里
          const themePresets = [
            {
              key: 'us-tech-growth',
              baseName: 'US Tech Growth',
              description: 'US large-cap tech and high-growth names with strong momentum.',
              emoji: '🚀',
            },
            {
              key: 'ai-cloud',
              baseName: 'AI & Cloud Leaders',
              description:
                'AI platforms, cloud infra and data leaders at the center of enterprise adoption and usage-based growth.',
              emoji: '☁️',
            },
            {
              key: 'quality-core',
              baseName: 'Quality Core',
              description: 'High ROIC, strong free cash flow compounders for core holdings.',
              emoji: '⭐️',
            },
            {
              key: 'value-dividend',
              baseName: 'Value & Dividend',
              description: 'Income-oriented value names with reasonable yield and payout history.',
              emoji: '💰',
            },
            {
              key: 'macro-thematic',
              baseName: 'Macro & Thematic',
              description: 'Watchlist for rates, inflation and macro-driven thematic trades.',
              emoji: '🌍',
            },
            {
              key: 'defensive-income',
              baseName: 'Defensive Income',
              description: 'Defensive utilities and staples focused on stable cash flows.',
              emoji: '🛡️',
            },
            {
              key: 'emerging-markets',
              baseName: 'Emerging Markets Focus',
              description: 'Growth opportunities across EM equities and ADRs.',
              emoji: '🌏',
            },
            {
              key: 'hedge-ideas',
              baseName: 'Hedge & Overlay Ideas',
              description: 'Ideas for hedging and overlay strategies using options and ETFs.',
              emoji: '🧩',
            },
            {
              key: 'short-term-trades',
              baseName: 'Short-term Trades',
              description: 'High-liquidity, higher-volatility names for tactical trading.',
              emoji: '⚡️',
            },
            {
              key: 'long-term-compounders',
              baseName: 'Compounders',
              description: 'Businesses with durable moats and long runway for compounding.',
              emoji: '🕒',
            },
            {
              key: 'sector-rotation',
              baseName: 'Sector Rotation',
              description: 'Rotational baskets across major sectors and styles.',
              emoji: '📊',
            },
          ];
          // 分类图标配置（对应 12 个 svg）
          const categoryIconMap: Record<string, string> = {
            'us-tech-growth': '/category-icons/Angur.svg',
            'ai-cloud': '/category-icons/Apel.svg',
            'quality-core': '/category-icons/Benaroshi.svg',
            'value-dividend': '/category-icons/Bokul.svg',
            'macro-thematic': '/category-icons/Golap.svg',
            'defensive-income': '/category-icons/Jamdani.svg',
            'emerging-markets': '/category-icons/Komola.svg',
            'hedge-ideas': '/category-icons/Pati.svg',
            'short-term-trades': '/category-icons/Porota.svg',
            'long-term-compounders': '/category-icons/Ruti.svg',
            'multi-theme': '/category-icons/Shurjo.svg',
            'sector-rotation': '/category-icons/Shutki.svg',
          };
          // 保证每个 demo watchlist 使用的 emoji 都不重复
          const emojiPool = [
            '🚀', '☁️', '⭐️', '💰', '🌍', '🛡️', '🌏', '🧩', '⚡️', '🕒',
            '📈', '📉', '📊', '💹', '💸', '🏦', '🏙️', '🏗️', '🏭', '🏝️',
            '🌋', '🏔️', '🌉', '🛤️', '🛰️', '🛫', '🚄', '🚇', '🚢', '🚁',
            '💻', '📱', '🖥️', '🧠', '🤖', '🧬', '🧪', '💊', '🏥', '🏦',
            '🏛️', '🏪', '🛒', '🎮', '🎧', '📦', '⚙️', '🔋', '🔌', '💡',
            '🏡', '🏘️', '🏬', '🏨', '🏛️', '🌳', '🌲', '🌾', '💧', '🔥',
            '🌪️', '🌈', '☀️', '🌙', '⭐', '🌟', '💎', '🪙', '🏅', '🥇',
            '🥈', '🥉', '🏆', '🎯', '🧭', '🗺️', '🧱', '🏗', '🛢️', '⚗️',
            '🧵', '🧶', '🪵', '🧱', '⚖️', '🔐', '🔑', '🛡️', '🚀', '📡',
            '🚚', '🚛', '🛰', '🧊', '🍎', '🍊', '🍋', '🍇', '🍓', '🥝',
            '🥑', '🥦', '🌽', '🍞', '🥨', '🥯', '🧀', '🥩', '🍣', '🍜',
          ];
          const suffixes = [' Focus', ' Select', ' Radar', ' Opportunities', ' Tracker', ' Universe', ' Screen', ' Watch', ' Plus', ' Insights'];
          const allLists = Array.from({ length: 100 }, (_, idx) => {
            const theme = themePresets[idx % themePresets.length];
            const suffixIndex = Math.floor(idx / themePresets.length);
            const suffix = suffixIndex === 0 ? '' : ` ${suffixes[(suffixIndex - 1) % suffixes.length]}`;
            const base = baseCards[idx % (baseCards.length || 1)];
            const emoji = emojiPool[idx] ?? emojiPool[idx % emojiPool.length];
            return {
              id: base?.id ? `${base.id}-${idx}` : `demo-wl-${idx}`,
              name: `${theme.baseName}${suffix}`,
              description: theme.description,
              themeKey: theme.key,
              emoji,
              tickerCount:
                typeof base?.tickerCount === 'number'
                  ? base.tickerCount + (idx % 5)
                  : 10 + (idx % 40),
              iconSrc: base?.iconSrc ?? null,
            };
          });
          const categories = [
            {
              id: 'us-tech-growth',
              name: 'US Tech Growth',
              description: 'US growth-focused tech names',
              items: allLists.filter((wl) => wl.themeKey === 'us-tech-growth'),
            },
            {
              id: 'ai-cloud',
              name: 'AI & Cloud Leaders',
              description: 'AI and cloud infra leaders',
              items: allLists.filter((wl) => wl.themeKey === 'ai-cloud'),
            },
            {
              id: 'quality-core',
              name: 'Quality Core',
              description: 'High quality core holdings',
              items: allLists.filter((wl) => wl.themeKey === 'quality-core'),
            },
            {
              id: 'value-dividend',
              name: 'Value & Dividend',
              description: 'Value and dividend ideas',
              items: allLists.filter((wl) => wl.themeKey === 'value-dividend'),
            },
            {
              id: 'macro-thematic',
              name: 'Macro & Thematic',
              description: 'Macro-driven thematics',
              items: allLists.filter((wl) => wl.themeKey === 'macro-thematic'),
            },
            {
              id: 'defensive-income',
              name: 'Defensive Income',
              description: 'Defensive income ideas',
              items: allLists.filter((wl) => wl.themeKey === 'defensive-income'),
            },
            {
              id: 'emerging-markets',
              name: 'Emerging Markets',
              description: 'Emerging markets names',
              items: allLists.filter((wl) => wl.themeKey === 'emerging-markets'),
            },
            {
              id: 'hedge-ideas',
              name: 'Hedge & Overlay',
              description: 'Hedging and overlay ideas',
              items: allLists.filter((wl) => wl.themeKey === 'hedge-ideas'),
            },
            {
              id: 'short-term-trades',
              name: 'Short-term Trades',
              description: 'Short-term trading universe',
              items: allLists.filter((wl) => wl.themeKey === 'short-term-trades'),
            },
            {
              id: 'long-term-compounders',
              name: 'Compounders',
              description: 'Long-term compounding names',
              items: allLists.filter((wl) => wl.themeKey === 'long-term-compounders'),
            },
            {
              id: 'multi-theme',
              name: 'Multi-theme Basket',
              description: 'Blend of growth, income and macro themes',
              items: allLists.filter((wl) =>
                ['us-tech-growth', 'ai-cloud', 'value-dividend', 'macro-thematic'].includes(wl.themeKey),
              ),
            },
            {
              id: 'sector-rotation',
              name: 'Sector Rotation',
              description: 'Rotation across sectors and styles',
              items: allLists.filter((wl) => wl.themeKey === 'sector-rotation'),
            },
          ];
          const isOverview = viewMoreCategoryId === 'recommended';
          const activeCategory =
            categories.find((c) => c.id === (isOverview ? 'us-tech-growth' : viewMoreCategoryId)) ??
            categories[0];
          const activeLists = activeCategory.items;
          const activeCategoryIcon = categoryIconMap[activeCategory.id] ?? null;
          const filteredLists = viewMoreSearch
            ? activeLists.filter((item) =>
                item.name.toLowerCase().includes(viewMoreSearch.toLowerCase()),
              )
            : activeLists;
          return (
            <div
              className="overlay-open fixed inset-0 z-[100] flex flex-col"
              role="dialog"
              aria-modal="true"
              aria-label="Recommended watchlists"
            >
              <div
                className="absolute inset-0 bg-black/70"
                aria-hidden
                onClick={() => setViewMorePopupOpen(false)}
              />
              <div
                className="overlay-content relative z-10 flex h-full w-full flex-col overflow-auto"
                style={{
                  border: `1px solid ${watchlistBorderColor}`,
                  backgroundColor: watchlistBgColor,
                  ['--card-hover' as string]: cardHoverColor,
                  ['--card-active' as string]: cardActiveColor,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  className="fixed right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full text-[#F2F2F7] outline-none transition-[transform,background-color] duration-150 hover:bg-white/10 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#444444] focus-visible:ring-offset-2 focus-visible:ring-offset-[#101011]"
                  aria-label="关闭"
                  onClick={() => setViewMorePopupOpen(false)}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              <div className="min-h-0 flex-1 px-6 py-6">
                  <div className="mx-auto flex w-full max-w-[1280px] gap-6">
                    <aside
                      className="w-[260px] shrink-0 pr-4 pt-[38px] sticky top-6 self-start"
                      style={{ fontFamily: 'var(--font-inter)' }}
                    >
                      <h3 className="mb-3 pl-2 text-[15px] font-semibold text-[#F2F2F7]">
                        Recommend Watchlists
                      </h3>
                      <ul className="flex flex-col gap-1.5">
                        <li>
                          <button
                            type="button"
                            onClick={() => {
                              setViewMoreCategoryId('recommended');
                              setViewMoreSelectedList(null);
                            }}
                            className={`flex w-full items-center rounded-[10px] px-2 py-1.5 text-left text-[12px] font-medium outline-none transition-colors ${
                              isOverview
                                ? 'bg-white/10 text-[#F2F2F7]'
                                : 'text-white/60 hover:text-[#F2F2F7]'
                            }`}
                          >
                            Recommended
                          </button>
                        </li>
                        {categories.map((cat) => (
                          <li key={cat.id}>
                            <button
                              type="button"
                              onClick={() => {
                                setViewMoreCategoryId(cat.id);
                                setViewMoreSelectedList(null);
                              }}
                              className={`flex w-full items-center rounded-[10px] px-2 py-1.5 text-left text-[12px] outline-none transition-colors w-[200px] ${
                                !isOverview && cat.id === activeCategory.id
                                  ? 'bg-white/10 text-[#F2F2F7]'
                                  : 'text-white/60 hover:bg-white/10 hover:text-[#F2F2F7]'
                              }`}
                            >
                              <span className="truncate font-medium">{cat.name}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </aside>
                  <div className="min-h-0 min-w-0 flex-1 overflow-y-auto flex flex-col gap-10 mt-8">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between gap-3">
                          <div
                            style={{ fontFamily: 'var(--font-inter)' }}
                          >
                          {isOverview ? (
                            <h3 className="text-[16px] font-semibold text-[#F2F2F7]">
                              Recommended
                            </h3>
                          ) : (
                            <div className="text-[13px] text-white/55">
                              <button
                                type="button"
                                onClick={() => {
                                  setViewMoreCategoryId('recommended');
                                  setViewMoreSelectedList(null);
                                }}
                                className={`transition-colors hover:text-white ${
                                  viewMoreSelectedList ? 'text-white/45' : 'text-white/60'
                                }`}
                              >
                                Recommended
                              </button>
                              <span className="mx-1 text-white/40">/</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setViewMoreCategoryId(activeCategory.id);
                                  setViewMoreSelectedList(null);
                                }}
                                className={`transition-colors hover:text-white ${
                                  viewMoreSelectedList ? 'text-white/70' : 'text-white'
                                }`}
                              >
                                {activeCategory.name}
                              </button>
                              {viewMoreSelectedList && (
                                <>
                                  <span className="mx-1 text-white/40">/</span>
                                  <span className="inline-flex items-center gap-1 text-white">
                                    {viewMoreSelectedList.emoji && (
                                      <span className="text-[14px]" aria-hidden>
                                        {viewMoreSelectedList.emoji}
                                      </span>
                                    )}
                                    <span>{viewMoreSelectedList.name}</span>
                                  </span>
                                </>
                              )}
                            </div>
                          )}
                          </div>
                      <div className="flex items-center">
                            <div className="flex h-8 w-56 items-center gap-2 rounded-lg border border-white/15 bg-[#1C1C1E] px-2 text-[12px] text-[#F2F2F7] focus-within:border-white/40">
                              <Icon name="search" className="h-3.5 w-3.5 shrink-0 text-white/40" />
                              <input
                                type="text"
                                value={viewMoreSearch}
                                onChange={(e) => setViewMoreSearch(e.target.value)}
                                placeholder="Search watchlists"
                                className="min-w-0 flex-1 bg-transparent text-[12px] text-[#F2F2F7] outline-none placeholder:text-white/40"
                                style={{ fontFamily: 'var(--font-inter)' }}
                              />
                            </div>
                          </div>
                        </div>
                        {isOverview && (
                          <div className="page-transition-in grid grid-cols-6 gap-3">
                            {categories.map((cat) => {
                              const iconSrc = categoryIconMap[cat.id];
                              return (
                                <button
                                  key={cat.id}
                                  type="button"
                                  onClick={() => {
                                    setViewMoreCategoryId(cat.id);
                                    setViewMoreSelectedList(null);
                                  }}
                                  className="flex flex-col items-center gap-2 text-center text-[#F2F2F7] outline-none transition-colors hover:opacity-90"
                                  style={{ fontFamily: 'var(--font-inter)' }}
                                >
                                  {iconSrc && (
                                    <Image
                                      src={iconSrc}
                                      alt={cat.name}
                                      width={96}
                                      height={96}
                                      className="w-full aspect-square rounded-[12px]"
                                    />
                                  )}
                                  <span className="mt-1 text-[12px] font-medium">{cat.name}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      {isOverview ? (
                        <>
                          <div className="mt-6 flex flex-col gap-10">
                            {categories.map((cat) => {
                              const iconSrc = categoryIconMap[cat.id];
                              const topCards = cat.items.slice(0, 4);
                              if (topCards.length === 0) return null;
                              return (
                                <section key={cat.id} className="flex flex-col gap-4">
                                  <div className="flex items-center justify-between gap-2">
                                    <div
                                      className="flex items-center gap-2 text-[16px] font-semibold text-[#F2F2F7]"
                                      style={{ fontFamily: 'var(--font-inter)' }}
                                    >
                                      {iconSrc && (
                                        <Image
                                          src={iconSrc}
                                          alt={cat.name}
                                          width={28}
                                          height={28}
                                          className="h-[28px] w-[28px] rounded-[6px]"
                                        />
                                      )}
                                      <span>{cat.name}</span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => setViewMoreCategoryId(cat.id)}
                                      className="shrink-0 rounded-lg px-3 py-1.5 text-[13px] font-medium text-[#F2F2F7] outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#444444] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-bg)]"
                                      style={{ fontFamily: 'var(--font-inter)' }}
                                    >
                                      View more
                                    </button>
                                  </div>
                                  <div className="page-transition-in grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2">
                                    {topCards.map((card) => (
                                      <div
                                        key={card.id}
                                        role="button"
                                        tabIndex={0}
                                        className="card-hoverable group relative flex min-h-[140px] flex-col rounded-[12px] border p-4 shadow-sm cursor-pointer"
                                        style={{
                                          borderColor: watchlistBorderColor,
                                          backgroundColor: watchlistBgColor,
                                        }}
                                        onClick={() => {
                                          setViewMoreCategoryId(cat.id);
                                          setViewMoreSelectedList(card);
                                        }}
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            setViewMoreCategoryId(cat.id);
                                            setViewMoreSelectedList(card);
                                          }
                                        }}
                                      >
                                        {card.emoji && (
                                          <span
                                            className="mb-2 inline-flex h-5 w-5 shrink-0 items-center justify-center"
                                            aria-hidden
                                          >
                                            <span className="text-[16px] leading-none">{card.emoji}</span>
                                          </span>
                                        )}
                                        <p
                                          className="text-[15px] font-medium text-[#F2F2F7]"
                                          style={{ fontFamily: 'var(--font-inter)' }}
                                        >
                                          {card.name}
                                        </p>
                                        {card.description && (
                                          <p
                                            className="mt-1 text-[12px] text-white/65"
                                            style={{ fontFamily: 'var(--font-inter)' }}
                                          >
                                            {card.description}
                                          </p>
                                        )}
                                        {card.tickerCount != null && (
                                          <p
                                            className="mt-auto pt-2 text-[12px] text-white/70"
                                            style={{ fontFamily: 'var(--font-inter)' }}
                                          >
                                            Tickers: {card.tickerCount}
                                          </p>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </section>
                              );
                            })}
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col gap-3">
                          {!viewMoreSelectedList && (
                            <h3
                              className="mb-3 flex items-center gap-3 text-[16px] font-semibold text-[#F2F2F7]"
                              style={{ fontFamily: 'var(--font-inter)' }}
                            >
                              {activeCategoryIcon && (
                                <Image
                                  src={activeCategoryIcon}
                                  alt=""
                                  width={28}
                                  height={28}
                                  className="h-[28px] w-[28px] rounded-[6px]"
                                />
                              )}
                              <span>{activeCategory.name}</span>
                            </h3>
                          )}
                          {viewMoreSelectedList && (
                          <>
                          <div
                            className="flex flex-col items-start justify-start gap-6 border-b border-white/12 pb-6"
                            style={{ fontFamily: 'var(--font-inter)', paddingBottom: 24 }}
                          >
                            <div className="flex w-full items-center gap-3">
                              {viewMoreSelectedList.emoji && (
                                <div className="flex items-center justify-center gap-2 rounded-full bg-white/10 px-4 py-4 flex-shrink-0">
                                  <span
                                    className="inline-flex h-[20px] w-[20px] items-center justify-center text-[20px] leading-none"
                                    aria-hidden
                                  >
                                    {viewMoreSelectedList.emoji}
                                  </span>
                                </div>
                              )}
                              <span className="text-[18px] font-semibold text-[#F2F2F7]">
                                {viewMoreSelectedList.name}
                              </span>
                                <div className="mt-1 ml-auto flex items-center gap-2">
                                  <button
                                    type="button"
                                    className="shrink-0 rounded-lg px-3 py-1.5 text-[12px] font-medium text-[#F2F2F7] outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#444444] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-bg)]"
                                  >
                                    Share
                                  </button>
                                  <button
                                    type="button"
                                    className="rounded-lg bg-white/10 px-3 py-1.5 text-[12px] font-medium text-[#F2F2F7] outline-none transition-colors hover:bg-white/16 focus-visible:ring-2 focus-visible:ring-[#444444] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-bg)]"
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                              <div className="flex flex-col gap-2">
                                {viewMoreSelectedList.description && (
                                  <div className="flex flex-col gap-1.5 text-[12px] text-white/65">
                                    <p>
                                      {viewMoreSelectedList.description}
                                    </p>
                                    <p>
                                      This watchlist is designed for iterative idea discovery, helping you spot patterns
                                      across names instead of looking at single tickers in isolation.
                                    </p>
                                    <p>
                                      Use it as a starting point, then adjust weights, add or remove names, and save
                                      your own version once it feels aligned with your process.
                                    </p>
                                  </div>
                                )}
                                <p className="flex items-center gap-1 text-[12px] text-white/40">
                                  <span>Created by Felix &amp; Friends</span>
                                  <span className="mx-1">·</span>
                                  <span>19K Views</span>
                                  <span className="mx-1">·</span>
                                  <span>9.3K Saves</span>
                                </p>
                              </div>
                          </div>
                          <div
                            className="mt-4 w-full rounded-[10px] border border-white/10 bg-[#1A1A1C] overflow-hidden"
                            style={{ fontFamily: 'var(--font-inter)' }}
                          >
                                  <table className="w-full border-collapse text-[12px] text-[#F2F2F7]">
                                    <thead className="bg-[#1F1F21]">
                                      <tr>
                                        <th className="px-3 py-2 text-left text-[11px] font-medium text-white/60">
                                          Ticker
                                        </th>
                                        <th className="px-3 py-2 text-left text-[11px] font-medium text-white/60">
                                          Name
                                        </th>
                                        <th className="px-3 py-2 text-left text-[11px] font-medium text-white/60">
                                          M/Cap
                                        </th>
                                        <th className="px-3 py-2 text-left text-[11px] font-medium text-white/60">
                                          Last
                                        </th>
                                        <th className="px-3 py-2 text-left text-[11px] font-medium text-white/60">
                                          Change
                                        </th>
                                        <th className="px-3 py-2 text-left text-[11px] font-medium text-white/60">
                                          Next Earn
                                        </th>
                                        <th className="px-3 py-2 text-left text-[11px] font-medium text-white/60">
                                          Next Div
                                        </th>
                                        <th className="px-3 py-2 text-left text-[11px] font-medium text-white/60">
                                          Last Earn
                                        </th>
                                        <th className="px-3 py-2 text-left text-[11px] font-medium text-white/60">
                                          Beta
                                        </th>
                                        <th className="px-3 py-2 text-left text-[11px] font-medium text-white/60">
                                          Options IV %
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {[
                                        {
                                          logo: 'A',
                                          ticker: 'AAPL',
                                          name: 'Apple Inc',
                                          mcap: '152B',
                                          last: '$661.97',
                                          change: '+0.36%',
                                          changePositive: true,
                                          nextEarn: '56',
                                          nextDiv: '6',
                                          lastEarn: '26',
                                          beta: '0.2',
                                          iv: '97.96%',
                                          bg: '#1F2933',
                                        },
                                        {
                                          logo: 'M',
                                          ticker: 'MSFT',
                                          name: 'Microsoft',
                                          mcap: '271B',
                                          last: '$201.92',
                                          change: '-1.46%',
                                          changePositive: false,
                                          nextEarn: '56',
                                          nextDiv: '1',
                                          lastEarn: '28',
                                          beta: '0.4',
                                          iv: '95%',
                                          bg: '#111827',
                                        },
                                        {
                                          logo: 'N',
                                          ticker: 'NVDA',
                                          name: 'NVIDIA',
                                          mcap: '180B',
                                          last: '$229.70',
                                          change: '-0.69%',
                                          changePositive: false,
                                          nextEarn: '57',
                                          nextDiv: '-',
                                          lastEarn: '28',
                                          beta: '1.1',
                                          iv: '37.47%',
                                          bg: '#17212B',
                                        },
                                        {
                                          logo: 'T',
                                          ticker: 'TSLA',
                                          name: 'Tesla',
                                          mcap: '180B',
                                          last: '$189.12',
                                          change: '+1.25%',
                                          changePositive: true,
                                          nextEarn: '32',
                                          nextDiv: '-',
                                          lastEarn: '24',
                                          beta: '1.6',
                                          iv: '62.3%',
                                          bg: '#1E293B',
                                        },
                                        {
                                          logo: 'A',
                                          ticker: 'AMZN',
                                          name: 'Amazon',
                                          mcap: '320B',
                                          last: '$142.35',
                                          change: '+0.82%',
                                          changePositive: true,
                                          nextEarn: '41',
                                          nextDiv: '-',
                                          lastEarn: '27',
                                          beta: '1.3',
                                          iv: '54.1%',
                                          bg: '#0F172A',
                                        },
                                        {
                                          logo: 'G',
                                          ticker: 'GOOGL',
                                          name: 'Alphabet',
                                          mcap: '280B',
                                          last: '$129.76',
                                          change: '-0.34%',
                                          changePositive: false,
                                          nextEarn: '48',
                                          nextDiv: '-',
                                          lastEarn: '29',
                                          beta: '1.0',
                                          iv: '41.9%',
                                          bg: '#020617',
                                        },
                                        {
                                          logo: 'M',
                                          ticker: 'META',
                                          name: 'Meta Platforms',
                                          mcap: '190B',
                                          last: '$304.21',
                                          change: '+2.05%',
                                          changePositive: true,
                                          nextEarn: '52',
                                          nextDiv: '-',
                                          lastEarn: '22',
                                          beta: '1.2',
                                          iv: '51.7%',
                                          bg: '#1D2433',
                                        },
                                        {
                                          logo: 'S',
                                          ticker: 'SHOP',
                                          name: 'Shopify',
                                          mcap: '72B',
                                          last: '$68.44',
                                          change: '-0.95%',
                                          changePositive: false,
                                          nextEarn: '37',
                                          nextDiv: '-',
                                          lastEarn: '18',
                                          beta: '1.5',
                                          iv: '66.2%',
                                          bg: '#111827',
                                        },
                                        {
                                          logo: 'S',
                                          ticker: 'SNOW',
                                          name: 'Snowflake',
                                          mcap: '58B',
                                          last: '$169.02',
                                          change: '+1.72%',
                                          changePositive: true,
                                          nextEarn: '63',
                                          nextDiv: '-',
                                          lastEarn: '19',
                                          beta: '1.4',
                                          iv: '71.4%',
                                          bg: '#020617',
                                        },
                                        {
                                          logo: 'S',
                                          ticker: 'CRM',
                                          name: 'Salesforce',
                                          mcap: '210B',
                                          last: '$246.13',
                                          change: '+0.44%',
                                          changePositive: true,
                                          nextEarn: '59',
                                          nextDiv: '-',
                                          lastEarn: '30',
                                          beta: '1.1',
                                          iv: '39.2%',
                                          bg: '#0B1120',
                                        },
                                        {
                                          logo: 'S',
                                          ticker: 'SQ',
                                          name: 'Block',
                                          mcap: '45B',
                                          last: '$72.88',
                                          change: '-1.12%',
                                          changePositive: false,
                                          nextEarn: '44',
                                          nextDiv: '-',
                                          lastEarn: '21',
                                          beta: '1.7',
                                          iv: '68.5%',
                                          bg: '#111827',
                                        },
                                        {
                                          logo: 'P',
                                          ticker: 'PYPL',
                                          name: 'PayPal',
                                          mcap: '86B',
                                          last: '$62.51',
                                          change: '+0.27%',
                                          changePositive: true,
                                          nextEarn: '45',
                                          nextDiv: '-',
                                          lastEarn: '23',
                                          beta: '1.3',
                                          iv: '52.8%',
                                          bg: '#020617',
                                        },
                                        {
                                          logo: 'A',
                                          ticker: 'ADBE',
                                          name: 'Adobe',
                                          mcap: '220B',
                                          last: '$531.47',
                                          change: '+0.63%',
                                          changePositive: true,
                                          nextEarn: '58',
                                          nextDiv: '-',
                                          lastEarn: '25',
                                          beta: '1.0',
                                          iv: '36.4%',
                                          bg: '#1F2933',
                                        },
                                        {
                                          logo: 'S',
                                          ticker: 'SPOT',
                                          name: 'Spotify',
                                          mcap: '45B',
                                          last: '$187.93',
                                          change: '-0.58%',
                                          changePositive: false,
                                          nextEarn: '39',
                                          nextDiv: '-',
                                          lastEarn: '17',
                                          beta: '1.4',
                                          iv: '59.3%',
                                          bg: '#020617',
                                        },
                                        {
                                          logo: 'U',
                                          ticker: 'UBER',
                                          name: 'Uber',
                                          mcap: '95B',
                                          last: '$62.14',
                                          change: '+1.11%',
                                          changePositive: true,
                                          nextEarn: '42',
                                          nextDiv: '-',
                                          lastEarn: '20',
                                          beta: '1.6',
                                          iv: '64.9%',
                                          bg: '#111827',
                                        },
                                        {
                                          logo: 'N',
                                          ticker: 'NET',
                                          name: 'Cloudflare',
                                          mcap: '32B',
                                          last: '$79.33',
                                          change: '+0.97%',
                                          changePositive: true,
                                          nextEarn: '47',
                                          nextDiv: '-',
                                          lastEarn: '16',
                                          beta: '1.5',
                                          iv: '72.1%',
                                          bg: '#020617',
                                        },
                                        {
                                          logo: 'D',
                                          ticker: 'DDOG',
                                          name: 'Datadog',
                                          mcap: '40B',
                                          last: '$118.62',
                                          change: '-0.41%',
                                          changePositive: false,
                                          nextEarn: '51',
                                          nextDiv: '-',
                                          lastEarn: '15',
                                          beta: '1.4',
                                          iv: '63.7%',
                                          bg: '#020617',
                                        },
                                        {
                                          logo: 'P',
                                          ticker: 'PLTR',
                                          name: 'Palantir',
                                          mcap: '38B',
                                          last: '$19.73',
                                          change: '+2.89%',
                                          changePositive: true,
                                          nextEarn: '34',
                                          nextDiv: '-',
                                          lastEarn: '14',
                                          beta: '1.8',
                                          iv: '79.5%',
                                          bg: '#111827',
                                        },
                                      ].map((row) => (
                                        <tr key={row.ticker} className="border-t border-white/10">
                                          <td className="px-3 py-2">
                                            <div className="flex items-center gap-2">
                                              <div
                                                className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold text-white"
                                                style={{ backgroundColor: row.bg }}
                                              >
                                                {row.logo}
                                              </div>
                                              <span className="text-[12px] font-semibold text-[#F2F2F7]">
                                                {row.ticker}
                                              </span>
                                            </div>
                                          </td>
                                          <td className="px-3 py-2 text-white/70">{row.name}</td>
                                          <td className="px-3 py-2 text-white/80">{row.mcap}</td>
                                          <td className="px-3 py-2 text-white/80">{row.last}</td>
                                          <td
                                            className={`px-3 py-2 text-[11px] ${
                                              row.changePositive ? 'text-[#22C55E]' : 'text-[#F97373]'
                                            }`}
                                          >
                                            {row.change}
                                          </td>
                                          <td className="px-3 py-2 text-white/70">{row.nextEarn}</td>
                                          <td className="px-3 py-2 text-white/70">{row.nextDiv}</td>
                                          <td className="px-3 py-2 text-white/70">{row.lastEarn}</td>
                                          <td className="px-3 py-2 text-white/70">{row.beta}</td>
                                          <td className="px-3 py-2 text-white/80">{row.iv}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                          </>
                          )}
                          <div
                            key={activeCategory.id}
                            className="page-transition-in grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2"
                          >
                            {viewMoreSelectedList
                              ? null
                              : filteredLists.map((card) => (
                                <div
                                  key={card.id}
                                  role="button"
                                  tabIndex={0}
                                  className="card-hoverable group relative flex min-h-[140px] flex-col rounded-[12px] border p-4 shadow-sm cursor-pointer"
                                  style={{
                                    borderColor: watchlistBorderColor,
                                    backgroundColor: watchlistBgColor,
                                  }}
                                  onClick={() => setViewMoreSelectedList(card)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                      e.preventDefault();
                                      setViewMoreSelectedList(card);
                                    }
                                  }}
                                >
                                  {card.emoji && (
                                    <span
                                      className="mb-2 inline-flex h-5 w-5 shrink-0 items-center justify-center"
                                      aria-hidden
                                    >
                                      <span className="text-[16px] leading-none">{card.emoji}</span>
                                    </span>
                                  )}
                                  <p
                                    className="text-[15px] font-medium text-[#F2F2F7]"
                                    style={{ fontFamily: 'var(--font-inter)' }}
                                  >
                                    {card.name}
                                  </p>
                                  {card.description && (
                                    <p
                                      className="mt-1 text-[12px] text-white/65"
                                      style={{ fontFamily: 'var(--font-inter)' }}
                                    >
                                      {card.description}
                                    </p>
                                  )}
                                  {card.tickerCount != null && (
                                    <p
                                      className="mt-auto pt-2 text-[12px] text-white/70"
                                      style={{ fontFamily: 'var(--font-inter)' }}
                                    >
                                      Tickers: {card.tickerCount}
                                    </p>
                                  )}
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
        {colorPickerOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/50"
              aria-hidden
              onClick={() => setColorPickerOpen(false)}
            />
            <div
              className="fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-[280px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border border-[#333] bg-[#1C1C1E] p-4 shadow-xl"
              role="dialog"
              aria-label="Sim 颜色"
            >
              <h3 className="mb-3 text-[15px] font-semibold text-[#F2F2F7]">Sim</h3>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <label className="text-[13px] text-[#F2F2F7]">App 背景</label>
                  <input
                    type="color"
                    value={appBgColor}
                    onChange={(e) => setAppBgColor(e.target.value)}
                    className="h-8 w-14 cursor-pointer rounded border-0 bg-transparent p-0"
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <label className="text-[13px] text-[#F2F2F7]">Watchlist 外边框</label>
                  <input
                    type="color"
                    value={watchlistBorderColor}
                    onChange={(e) => setWatchlistBorderColor(e.target.value)}
                    className="h-8 w-14 cursor-pointer rounded border-0 bg-transparent p-0"
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <label className="text-[13px] text-[#F2F2F7]">Watchlist 背景</label>
                  <input
                    type="color"
                    value={watchlistBgColor}
                    onChange={(e) => setWatchlistBgColor(e.target.value)}
                    className="h-8 w-14 cursor-pointer rounded border-0 bg-transparent p-0"
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <label className="text-[13px] text-[#F2F2F7]">Card hover</label>
                  <input
                    type="color"
                    value={cardHoverColor}
                    onChange={(e) => setCardHoverColor(e.target.value)}
                    className="h-8 w-14 cursor-pointer rounded border-0 bg-transparent p-0"
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <label className="text-[13px] text-[#F2F2F7]">Card 点击</label>
                  <input
                    type="color"
                    value={cardActiveColor}
                    onChange={(e) => setCardActiveColor(e.target.value)}
                    className="h-8 w-14 cursor-pointer rounded border-0 bg-transparent p-0"
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <label className="text-[13px] text-[#F2F2F7]">Back 按钮 hover</label>
                  <select
                    value={backButtonHoverPreset}
                    onChange={(e) => setBackButtonHoverPreset(e.target.value as BackButtonHoverPreset)}
                    className="rounded border border-white/20 bg-[#2a2a2a] px-2 py-1.5 text-[13px] text-[#F2F2F7] outline-none"
                  >
                    <option value="none">无</option>
                    <option value="subtle">淡</option>
                    <option value="medium">中</option>
                    <option value="strong">深</option>
                  </select>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <label className="text-[13px] text-[#F2F2F7]">底部 Bar 背景</label>
                  <input
                    type="color"
                    value={barBgColor}
                    onChange={(e) => setBarBgColor(e.target.value)}
                    className="h-8 w-14 cursor-pointer rounded border-0 bg-transparent p-0"
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <label className="text-[13px] text-[#F2F2F7]">底部 Bar 边框</label>
                  <input
                    type="color"
                    value={barBorderColor}
                    onChange={(e) => setBarBorderColor(e.target.value)}
                    className="h-8 w-14 cursor-pointer rounded border-0 bg-transparent p-0"
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <label className="text-[13px] text-[#F2F2F7]">底部 Bar 高光条</label>
                  <div className="flex flex-1 items-center gap-2">
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={toolbarHighlight}
                      onChange={(e) => setToolbarHighlight(parseFloat(e.target.value))}
                      className="h-1 flex-1 cursor-pointer accent-[#F2F2F7]"
                    />
                    <span className="w-10 text-right text-[11px] text-white/60">
                      {toolbarHighlight === 0 ? '关' : toolbarHighlight < 0.5 ? '弱' : '强'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <label className="text-[13px] text-[#F2F2F7]">下拉/菜单 背景</label>
                  <input
                    type="color"
                    value={popoverBgColor}
                    onChange={(e) => setPopoverBgColor(e.target.value)}
                    className="h-8 w-14 cursor-pointer rounded border-0 bg-transparent p-0"
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <label className="text-[13px] text-[#F2F2F7]">下拉/菜单 边框</label>
                  <input
                    type="color"
                    value={popoverBorderColor}
                    onChange={(e) => setPopoverBorderColor(e.target.value)}
                    className="h-8 w-14 cursor-pointer rounded border-0 bg-transparent p-0"
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <label className="text-[13px] text-[#F2F2F7]">Bar 图标 hover</label>
                  <select
                    value={barIconHoverPreset}
                    onChange={(e) => setBarIconHoverPreset(e.target.value as BarIconHoverPreset)}
                    className="rounded border border-white/20 bg-[#2a2a2a] px-2 py-1.5 text-[13px] text-[#F2F2F7] outline-none"
                  >
                    <option value="none">无</option>
                    <option value="subtle">淡</option>
                    <option value="medium">中</option>
                  </select>
                </div>
              </div>
            </div>
          </>
        )}
        {accountSettingsOpen && (
          <div
            className="overlay-open fixed inset-0 z-[100] flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Account settings"
          >
            <div
              className="absolute inset-0 bg-black/70"
              aria-hidden
              onClick={() => setAccountSettingsOpen(false)}
            />
            <div
              className="overlay-content relative z-10 flex h-full w-full flex-col overflow-auto"
              style={{
                border: `1px solid ${watchlistBorderColor}`,
                backgroundColor: watchlistBgColor,
                ['--card-hover' as string]: cardHoverColor,
                ['--card-active' as string]: cardActiveColor,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="fixed right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full text-[#F2F2F7] outline-none transition-[transform,background-color] duration-150 hover:bg-white/10 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#444444] focus-visible:ring-offset-2 focus-visible:ring-offset-[#101011]"
                aria-label="Close account settings"
                onClick={() => setAccountSettingsOpen(false)}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="min-h-0 flex-1 px-6 py-6">
                <div className="mx-auto flex w-full max-w-[1280px] gap-6">
                  <aside
                    className="w-[260px] shrink-0 pr-4 pt-[38px] sticky top-6 self-start"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    <h3 className="mb-3 pl-2 text-[15px] font-semibold text-[#F2F2F7]">
                      Settings
                    </h3>
                    <ul className="flex flex-col gap-1.5">
                      <li>
                        <button
                          type="button"
                          onClick={() => setAccountSettingsSection('profile')}
                          className={`flex w-full items-center gap-2 rounded-[10px] px-2 py-1.5 text-left text-[12px] outline-none transition-colors ${
                            accountSettingsSection === 'profile'
                              ? 'bg-white/10 font-medium text-[#F2F2F7]'
                              : 'text-white/70 hover:bg-white/10 hover:text-[#F2F2F7]'
                          }`}
                        >
                          <Icon name="profile" className="h-4 w-4 shrink-0 text-[#A1A1AA]" />
                          <span className="truncate">Profile</span>
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          onClick={() => setAccountSettingsSection('account')}
                          className={`flex w-full items-center gap-2 rounded-[10px] px-2 py-1.5 text-left text-[12px] outline-none transition-colors ${
                            accountSettingsSection === 'account'
                              ? 'bg-white/10 font-medium text-[#F2F2F7]'
                              : 'text-white/70 hover:bg-white/10 hover:text-[#F2F2F7]'
                          }`}
                        >
                          <Icon name="shield" className="h-4 w-4 shrink-0 text-[#A1A1AA]" />
                          <span className="truncate">Account</span>
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          onClick={() => setAccountSettingsSection('alerts')}
                          className={`flex w-full items-center gap-2 rounded-[10px] px-2 py-1.5 text-left text-[12px] outline-none transition-colors ${
                            accountSettingsSection === 'alerts'
                              ? 'bg-white/10 font-medium text-[#F2F2F7]'
                              : 'text-white/70 hover:bg-white/10 hover:text-[#F2F2F7]'
                          }`}
                        >
                          <Icon name="bell" className="h-4 w-4 shrink-0 text-[#A1A1AA]" />
                          <span className="truncate">Alert Management</span>
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          onClick={() => setAccountSettingsSection('language')}
                          className={`flex w-full items-center gap-2 rounded-[10px] px-2 py-1.5 text-left text-[12px] outline-none transition-colors ${
                            accountSettingsSection === 'language'
                              ? 'bg-white/10 font-medium text-[#F2F2F7]'
                              : 'text-white/70 hover:bg-white/10 hover:text-[#F2F2F7]'
                          }`}
                        >
                          <Icon name="globe" className="h-4 w-4 shrink-0 text-[#A1A1AA]" />
                          <span className="truncate">Language & region</span>
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          onClick={() => setAccountSettingsSection('referral')}
                          className={`flex w-full items-center gap-2 rounded-[10px] px-2 py-1.5 text-left text-[12px] outline-none transition-colors ${
                            accountSettingsSection === 'referral'
                              ? 'bg-white/10 font-medium text-[#F2F2F7]'
                              : 'text-white/70 hover:bg-white/10 hover:text-[#F2F2F7]'
                          }`}
                        >
                          <Icon name="gift" className="h-4 w-4 shrink-0 text-[#A1A1AA]" />
                          <span className="truncate">Referral link</span>
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          onClick={() => setAccountSettingsSection('subscription')}
                          className={`flex w-full items-center gap-2 rounded-[10px] px-2 py-1.5 text-left text-[12px] outline-none transition-colors ${
                            accountSettingsSection === 'subscription'
                              ? 'bg-white/10 font-medium text-[#F2F2F7]'
                              : 'text-white/70 hover:bg-white/10 hover:text-[#F2F2F7]'
                          }`}
                        >
                          <Icon name="chip" className="h-4 w-4 shrink-0 text-[#A1A1AA]" />
                          <span className="truncate">Subscription</span>
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          onClick={() => setAccountSettingsSection('logout')}
                          className={`flex w-full items-center gap-2 rounded-[10px] px-2 py-1.5 text-left text-[12px] outline-none transition-colors ${
                            accountSettingsSection === 'logout'
                              ? 'bg-white/10 font-medium text-[#F2F2F7]'
                              : 'text-white/70 hover:bg-white/10 hover:text-[#F2F2F7]'
                          }`}
                        >
                          <Icon name="logout" className="h-4 w-4 shrink-0 text-[#A1A1AA]" />
                          <span className="truncate">Log out</span>
                        </button>
                      </li>
                    </ul>
                  </aside>
                  <div
                    className="min-h-0 min-w-0 flex-1 overflow-y-auto flex flex-col gap-6 mt-8"
                    style={{ width: 640 }}
                  >
                    {(() => {
                      const commonCardStyle = {
                        borderColor: watchlistBorderColor,
                        backgroundColor: cardHoverColor,
                        fontFamily: 'var(--font-inter)',
                      } as const;

                      switch (accountSettingsSection) {
                        case 'profile':
                          return (
                            <>
                              <h2
                                className="text-[16px] font-semibold text-[#F2F2F7]"
                                style={{ fontFamily: 'var(--font-inter)' }}
                              >
                                Profile
                              </h2>
                              <div
                                className="rounded-[12px] border px-4 py-4 text-[13px] text-[#D4D4D8]"
                                style={commonCardStyle}
                              >
                                Basic account details and preferences will appear here. You can add real profile
                                fields and controls later.
                              </div>
                            </>
                          );
                        case 'alerts':
                          return (
                            <>
                              <h2
                                className="text-[16px] font-semibold text-[#F2F2F7]"
                                style={{ fontFamily: 'var(--font-inter)' }}
                              >
                                Alert management
                              </h2>
                              <div className="flex flex-col gap-2.5" style={{ fontFamily: 'var(--font-inter)' }}>
                                <div className="flex flex-col gap-3">
                                  <p className="text-[12px] font-medium text-[#A1A1AA]">Watchlists</p>
                                  <div
                                    className="flex flex-col gap-0 rounded-[12px] overflow-hidden"
                                    style={{
                                      backgroundColor: '#1C1C1E',
                                      fontFamily: 'var(--font-inter)',
                                    }}
                                  >
                                    {watchlists.map((wl, index) => {
                                    const on = watchlistAlertEnabled[wl.label] ?? false;
                                    const tickerCount = watchlistStocks[index]?.length ?? 0;
                                    return (
                                    <div
                                      key={wl.label}
                                      className="flex items-center justify-between gap-3 px-4 py-2.5 border-b last:border-b-0"
                                      style={{
                                        borderColor: 'rgba(255,255,255,0.08)',
                                        backgroundColor: 'transparent',
                                      }}
                                    >
                                      <div className="flex min-w-0 flex-1 items-start gap-2">
                                        <span
                                          className="mt-[3px] flex h-4 w-4 shrink-0 items-center justify-center"
                                          style={{ color: wl.color }}
                                        >
                                          <Icon name="bookmark" className="h-4 w-4 shrink-0" />
                                        </span>
                                        <div className="min-w-0 flex-1">
                                          <div className="text-[13px] font-medium text-[#F2F2F7] truncate">
                                            {getWatchboardLabel(wl.label)}
                                          </div>
                                          <div className="mt-0.5 text-[12px] text-[#A1A1AA]">
                                            Tickers: {tickerCount}
                                          </div>
                                        </div>
                                      </div>
                                      <button
                                        type="button"
                                        role="switch"
                                        aria-checked={on}
                                        aria-label={`${on ? 'Disable' : 'Enable'} alerts for ${wl.label}`}
                                        onClick={() =>
                                          setWatchlistAlertEnabled((prev) => ({
                                            ...prev,
                                            [wl.label]: !prev[wl.label],
                                          }))
                                        }
                                        className="relative shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#444444] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-bg)]"
                                        style={{
                                          width: switchStyle.trackWidth,
                                          height: switchStyle.trackHeight,
                                          backgroundColor: on
                                            ? switchStyle.trackOnColor
                                            : switchStyle.trackOffColor,
                                        }}
                                      >
                                        <span
                                          className="absolute rounded-full bg-[#1C1C1E] shadow-sm transition-[left] duration-200 ease-out"
                                          style={{
                                            width: switchStyle.thumbSize,
                                            height: switchStyle.thumbSize,
                                            top: Math.max(
                                              (switchStyle.trackHeight - switchStyle.thumbSize) / 2,
                                              0
                                            ),
                                            left: on
                                              ? Math.max(
                                                  switchStyle.trackWidth -
                                                    switchStyle.thumbSize -
                                                    2,
                                                  0
                                                )
                                              : 2,
                                          }}
                                        />
                                      </button>
                                    </div>
                                    );
                                  })}
                                  </div>
                                </div>
                                <div className="flex flex-col gap-10">
                                  <p className="text-[12px] font-medium text-[#A1A1AA]">Tickers</p>
                                  <div
                                    className="flex flex-col gap-0 rounded-[12px] overflow-hidden"
                                    style={{
                                      backgroundColor: '#1C1C1E',
                                      fontFamily: 'var(--font-inter)',
                                    }}
                                  >
                                    {alertTickerStocks.map((s) => {
                                    const on = tickerAlertEnabled[s.code] ?? true;
                                    return (
                                      <div
                                        key={s.code}
                                        className="flex items-center justify-between gap-3 px-4 py-2.5 border-b last:border-b-0"
                                        style={{
                                          borderColor: 'rgba(255,255,255,0.08)',
                                          backgroundColor: 'transparent',
                                        }}
                                      >
                                        <div className="flex min-w-0 flex-1 items-start gap-2">
                                          <span className="mt-[3px] flex h-6 w-6 shrink-0 items-center justify-center">
                                            <StockLogo logo={s.logo} code={s.code} size={24} />
                                          </span>
                                          <div className="min-w-0 flex-1">
                                            <div className="text-[13px] font-medium text-[#F2F2F7]">{s.code}</div>
                                            <div className="mt-0.5 text-[12px] text-[#A1A1AA]">{s.name}</div>
                                          </div>
                                        </div>
                                        <button
                                          type="button"
                                          role="switch"
                                          aria-checked={on}
                                          aria-label={`${on ? 'Disable' : 'Enable'} alerts for ${s.code}`}
                                          onClick={() =>
                                            setTickerAlertEnabled((prev) => ({
                                              ...prev,
                                              [s.code]: !prev[s.code],
                                            }))
                                          }
                                          className="relative shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#444444] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-bg)]"
                                          style={{
                                            width: switchStyle.trackWidth,
                                            height: switchStyle.trackHeight,
                                            backgroundColor: on
                                              ? switchStyle.trackOnColor
                                              : switchStyle.trackOffColor,
                                          }}
                                        >
                                          <span
                                            className="absolute rounded-full bg-[#1C1C1E] shadow-sm transition-[left] duration-200 ease-out"
                                            style={{
                                              width: switchStyle.thumbSize,
                                              height: switchStyle.thumbSize,
                                              top: Math.max(
                                                (switchStyle.trackHeight - switchStyle.thumbSize) / 2,
                                                0
                                              ),
                                              left: on
                                                ? Math.max(
                                                    switchStyle.trackWidth -
                                                      switchStyle.thumbSize -
                                                      2,
                                                    0
                                                  )
                                                : 2,
                                            }}
                                          />
                                        </button>
                                      </div>
                                    );
                                  })}
                                  </div>
                                </div>
                              </div>
                            </>
                          );
                        case 'language':
                          return (
                            <>
                              <h2
                                className="text-[20px] font-semibold text-[#F2F2F7]"
                                style={{ fontFamily: 'var(--font-inter)' }}
                              >
                                Language & region
                              </h2>
                              <div
                                className="rounded-[12px] border px-4 py-4 text-[13px] text-[#D4D4D8] space-y-2"
                                style={commonCardStyle}
                              >
                                <p>Choose default language, timezone and number formats.</p>
                                <ul className="list-disc pl-4 space-y-1 text-[#E4E4E7]">
                                  <li>Display language for the UI and content.</li>
                                  <li>Time zone for charts, events and alerts.</li>
                                  <li>Currency and number formatting preferences.</li>
                                </ul>
                              </div>
                            </>
                          );
                        case 'referral':
                          return (
                            <>
                              <h2
                                className="text-[20px] font-semibold text-[#F2F2F7]"
                                style={{ fontFamily: 'var(--font-inter)' }}
                              >
                                Referral link
                              </h2>
                              <div
                                className="rounded-[12px] border px-4 py-4 text-[13px] text-[#D4D4D8] space-y-3"
                                style={commonCardStyle}
                              >
                                <p>Invite friends and teammates to try this workspace.</p>
                                <p className="rounded-lg bg-black/20 px-3 py-2 text-[12px] text-white/80">
                                  Referral link placeholder — generate and copy a shareable link here.
                                </p>
                              </div>
                            </>
                          );
                        case 'account':
                          return (
                            <>
                              <h2
                                className="text-[20px] font-semibold text-[#F2F2F7]"
                                style={{ fontFamily: 'var(--font-inter)' }}
                              >
                                Account
                              </h2>
                              <div
                                className="rounded-[12px] border px-4 py-4 text-[13px] text-[#D4D4D8] space-y-2"
                                style={commonCardStyle}
                              >
                                <p>Manage login details, connected providers and billing owner info.</p>
                                <ul className="list-disc pl-4 space-y-1 text-[#E4E4E7]">
                                  <li>Email / username and sign-in methods.</li>
                                  <li>Linked SSO or identity providers.</li>
                                  <li>Organization ownership and team membership.</li>
                                </ul>
                              </div>
                            </>
                          );
                        case 'subscription':
                          return (
                            <>
                              <h2
                                className="text-[20px] font-semibold text-[#F2F2F7]"
                                style={{ fontFamily: 'var(--font-inter)' }}
                              >
                                Subscription
                              </h2>
                              <div
                                className="rounded-[12px] border px-4 py-4 text-[13px] text-[#D4D4D8] space-y-2"
                                style={commonCardStyle}
                              >
                                <p>View your current plan and control billing settings.</p>
                                <ul className="list-disc pl-4 space-y-1 text-[#E4E4E7]">
                                  <li>Current tier, usage summary and renewal date.</li>
                                  <li>Payment method and billing email.</li>
                                  <li>Upgrade, downgrade or cancel subscription.</li>
                                </ul>
                              </div>
                            </>
                          );
                        case 'logout':
                          return (
                            <>
                              <h2
                                className="text-[20px] font-semibold text-[#F2F2F7]"
                                style={{ fontFamily: 'var(--font-inter)' }}
                              >
                                Log out
                              </h2>
                              <div
                                className="rounded-[12px] border px-4 py-4 text-[13px] text-[#FCA5A5]"
                                style={{
                                  ...commonCardStyle,
                                  backgroundColor: '#2A1515',
                                  borderColor: '#7F1D1D',
                                }}
                              >
                                This is a placeholder for a log-out confirmation flow. Hook your real sign-out
                                action here when wiring auth.
                              </div>
                            </>
                          );
                        default:
                          return null;
                      }
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {componentPanelOpen && (
          <ComponentPanel onClose={() => setComponentPanelOpen(false)} />
        )}
        <div
          className={`fixed inset-0 z-[120] flex items-center justify-center transition-opacity duration-200 ease-out ${
            alertDialogOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Alert preferences"
          aria-hidden={!alertDialogOpen}
        >
          <div
            className="absolute inset-0 bg-black/60"
            aria-hidden
            onClick={() => setAlertDialogOpen(false)}
          />
          <div
            className={`relative z-10 w-full max-w-[480px] rounded-[16px] border px-5 py-4 text-[13px] text-[#E4E4E7] shadow-2xl shadow-black/70 transition-all duration-200 ease-out ${
              alertDialogOpen ? 'translate-y-0 scale-100' : 'translate-y-1 scale-95'
            }`}
            style={{
              borderColor: watchlistBorderColor,
              backgroundColor: cardHoverColor,
              fontFamily: 'var(--font-inter)',
            }}
            >
              <h2 className="mb-2 text-[14px] font-semibold text-[#F2F2F7]">
                {alertDialogKind === 'close'
                  ? 'Turn off alerts for this list?'
                  : 'Global alerts for this list'}
              </h2>
              <p className="mb-4 text-[13px] text-[#A1A1AA]">
                {alertDialogKind === 'close'
                  ? 'You will stop receiving alerts for this watchlist. If you are sure, you can turn alerts off now.'
                  : (
                    <>
                      Alerts for system watchlists like Breakout, Hot, Bullish, Bearish, S&amp;P 500 and NASDAQ focus on{' '}
                      <span className="text-[#F2F2F7] font-medium">
                        global news, major events and market‑wide sentiment
                      </span>{' '}
                      around the whole list, not detailed updates for each single ticker; for per‑ticker alerts, use your own tickers or custom watchlists.
                    </>
                  )}
              </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="rounded-lg px-3 py-1.5 text-[13px] text-[#E4E4E7] outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#444] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-bg)]"
                onClick={() => setAlertDialogOpen(false)}
              >
                Close
              </button>
              <button
                type="button"
                className="rounded-lg bg-white/90 px-3 py-1.5 text-[13px] font-medium text-[#111827] outline-none transition-[background-color,transform] duration-150 hover:bg-white active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#444] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-bg)]"
                onClick={() => {
                  if (alertDialogKind === 'close') {
                    setAlertOn(false);
                  } else {
                    setAlertOn(true);
                  }
                  setAlertDialogOpen(false);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}
