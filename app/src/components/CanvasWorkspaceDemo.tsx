'use client';

import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import type { Stock } from '@/data/stocks';
import { TickerListPanel } from '@/components/TickerListPanel';
import { HeatmapPanel } from '@/components/HeatmapPanel';
import { ChartPanel } from '@/components/ChartPanel';
import { EventPanel } from '@/components/EventPanel';
import { NewsPanel } from '@/components/NewsPanel';
import {
  getViewPanelStyle,
  VIEW_PANEL_CONTAINER_BASE_CLASS,
  VIEW_PANEL_TITLE_CLASS,
  VIEW_PANEL_TITLE_FONT,
} from '@/constants/view-panel-style';

export type CardId =
  | 'ticker'
  | 'main'
  | 'event'
  | 'news'
  | 'fearGreed'
  | 'buffett'
  | 'peRatio'
  | 'blankMetric'
  | 'watchlist'
  | 'aiSummary'
  | 'tickerChart1'
  | 'tickerChart2'
  | 'tickerChart3'
  | 'tickerChart4'
  | 'darkpool'
  | 'snapshot'
  | 'options';

type CardInstanceId = string;

type CanvasCard = {
  id: CardInstanceId;
  type: CardId;
  isBase: boolean;
};

type CardLayout = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type DragState =
  | {
      type: 'move' | 'resize';
      id: CardInstanceId;
      startX: number;
      startY: number;
      startScrollTop: number;
      layout: CardLayout;
      preview: CardLayout;
      swapTargetId: CardInstanceId | null;
      resizeHandle?: 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';
    }
  | null;

type CanvasWorkspaceDemoProps = {
  currentStocks: Stock[];
  selectedStockForChart: Stock | null;
  onTickerClick: (stock: Stock) => void;
  borderColor: string;
  backgroundColor: string;
  layoutMode?: boolean;
  onLayoutModeChange?: (next: boolean) => void;
  paused?: boolean;
  showTicker?: boolean;
  showEvent?: boolean;
  showNews?: boolean;
  requestedCardId?: CardId | null;
  requestedCardToken?: number;
};

const MIN_WIDTH = 224;
const MIN_HEIGHT = 224;
const GRID_SIZE = 16;
const CARD_GAP = 16;
const CANVAS_PADDING = 16;
const BOTTOM_BUFFER = 64;
const MIN_CANVAS_HEIGHT = 1200;
const AUTO_EXPAND_THRESHOLD = 96;
const AUTO_EXPAND_STEP = 320;
const HANDLE_SIZE = 12;
const RESIZE_OUTSET = 10;
const LAYOUT_STORAGE_KEY = 'tv-prototype.watchlists.canvas-layouts.v1';
const HIDDEN_CARDS_STORAGE_KEY = 'tv-prototype.watchlists.hidden-cards.v1';
const EXTRA_CARDS_STORAGE_KEY = 'tv-prototype.watchlists.extra-cards.v1';

const INITIAL_LAYOUTS: Record<CardId, CardLayout> = {
  ticker: { x: CANVAS_PADDING, y: CANVAS_PADDING, width: 272, height: 768 },
  main: { x: CANVAS_PADDING + 272 + CARD_GAP, y: CANVAS_PADDING, width: 672, height: 768 },
  event: { x: CANVAS_PADDING + 272 + CARD_GAP + 672 + CARD_GAP, y: CANVAS_PADDING, width: 272, height: 368 },
  news: { x: CANVAS_PADDING + 272 + CARD_GAP + 672 + CARD_GAP, y: CANVAS_PADDING + 368 + CARD_GAP, width: 272, height: 368 },
  fearGreed: { x: CANVAS_PADDING, y: CANVAS_PADDING + 768 + CARD_GAP, width: 272, height: 224 },
  buffett: { x: CANVAS_PADDING + 272 + CARD_GAP, y: CANVAS_PADDING + 768 + CARD_GAP, width: 272, height: 224 },
  peRatio: { x: CANVAS_PADDING + (272 + CARD_GAP) * 2, y: CANVAS_PADDING + 768 + CARD_GAP, width: 272, height: 224 },
  aiSummary: { x: CANVAS_PADDING + (272 + CARD_GAP) * 3, y: CANVAS_PADDING + 768 + CARD_GAP, width: 272, height: 224 },
  blankMetric: { x: CANVAS_PADDING, y: CANVAS_PADDING + 768 + CARD_GAP + 224 + CARD_GAP, width: 272, height: 224 },
  watchlist: { x: CANVAS_PADDING + 272 + CARD_GAP, y: CANVAS_PADDING + 768 + CARD_GAP + 224 + CARD_GAP, width: 272, height: 224 },
  tickerChart1: { x: CANVAS_PADDING + (272 + CARD_GAP) * 2, y: CANVAS_PADDING + 768 + CARD_GAP + 224 + CARD_GAP, width: 272, height: 224 },
  tickerChart2: { x: CANVAS_PADDING + (272 + CARD_GAP) * 3, y: CANVAS_PADDING + 768 + CARD_GAP + 224 + CARD_GAP, width: 272, height: 224 },
  tickerChart3: { x: CANVAS_PADDING, y: CANVAS_PADDING + 768 + CARD_GAP + 224 + CARD_GAP + 224 + CARD_GAP, width: 272, height: 224 },
  tickerChart4: { x: CANVAS_PADDING + 272 + CARD_GAP, y: CANVAS_PADDING + 768 + CARD_GAP + 224 + CARD_GAP + 224 + CARD_GAP, width: 272, height: 224 },
  darkpool: { x: CANVAS_PADDING + (272 + CARD_GAP) * 2, y: CANVAS_PADDING + 768 + CARD_GAP + 224 + CARD_GAP + 224 + CARD_GAP, width: 272, height: 224 },
  snapshot: { x: CANVAS_PADDING + (272 + CARD_GAP) * 3, y: CANVAS_PADDING + 768 + CARD_GAP + 224 + CARD_GAP + 224 + CARD_GAP, width: 272, height: 224 },
  options: { x: CANVAS_PADDING, y: CANVAS_PADDING + 768 + CARD_GAP + 224 + CARD_GAP + 224 + CARD_GAP + 224 + CARD_GAP, width: 272, height: 224 },
};

const BASE_CARD_TYPES = Object.keys(INITIAL_LAYOUTS) as CardId[];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function snap(value: number) {
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
}

function snapDown(value: number) {
  return Math.floor(value / GRID_SIZE) * GRID_SIZE;
}

function normalizeLayout(layout: CardLayout): CardLayout {
  return {
    x: snap(layout.x),
    y: snap(layout.y),
    width: Math.max(MIN_WIDTH, snap(layout.width)),
    height: Math.max(MIN_HEIGHT, snap(layout.height)),
  };
}

function normalizeLayouts<T extends string>(layouts: Record<T, CardLayout>) {
  return Object.fromEntries(
    Object.entries(layouts).map(([id, layout]) => [id, normalizeLayout(layout as CardLayout)]),
  ) as Record<T, CardLayout>;
}

function isCardLayout(value: unknown): value is CardLayout {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.x === 'number' &&
    typeof candidate.y === 'number' &&
    typeof candidate.width === 'number' &&
    typeof candidate.height === 'number'
  );
}

function readPersistedLayouts(): Record<string, CardLayout> | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(LAYOUT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const entries = Object.entries(parsed).filter((entry): entry is [string, CardLayout] => isCardLayout(entry[1]));
    return Object.fromEntries(entries) as Record<string, CardLayout>;
  } catch {
    return null;
  }
}

function readPersistedHiddenCards(): string[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(HIDDEN_CARDS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === 'string') : [];
  } catch {
    return [];
  }
}

function readPersistedExtraCards(): CanvasCard[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(EXTRA_CARDS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((value): value is CanvasCard => {
      if (!value || typeof value !== 'object') return false;
      const candidate = value as Record<string, unknown>;
      return typeof candidate.id === 'string' && typeof candidate.type === 'string' && candidate.isBase === false;
    });
  } catch {
    return [];
  }
}

function snapUp(value: number) {
  return Math.ceil(value / GRID_SIZE) * GRID_SIZE;
}

function getContentDrivenCanvasHeight(
  layouts: Record<string, CardLayout>,
  visibleCardIds: string[],
  minHeight: number,
) {
  const maxBottom = visibleCardIds.reduce((bottom, id) => {
    const layout = layouts[id];
    if (!layout) return bottom;
    return Math.max(bottom, layout.y + layout.height);
  }, 0);

  return snapUp(Math.max(minHeight, maxBottom + CANVAS_PADDING + BOTTOM_BUFFER));
}

const METRIC_CARD_PATHS: Record<
  'fearGreed' | 'buffett' | 'peRatio' | 'blankMetric' | 'tickerChart1' | 'tickerChart2' | 'tickerChart3' | 'tickerChart4' | 'options',
  string
> = {
  fearGreed: 'M0,28 C26,36 44,40 68,42 C96,44 116,42 140,34 C166,24 188,18 214,22 C236,26 252,24 272,14',
  buffett: 'M0,34 C18,40 38,44 62,45 C86,46 108,42 132,35 C156,28 180,22 206,24 C232,26 250,24 272,18',
  peRatio: 'M0,58 C18,50 34,48 56,54 C82,62 104,64 126,58 C148,52 172,46 198,40 C224,34 246,28 272,22',
  blankMetric: 'M0,60 C22,52 44,50 66,58 C88,66 110,66 132,60 C158,52 182,46 206,40 C230,34 250,30 272,26',
  tickerChart1: 'M0,62 C24,56 46,54 68,60 C90,66 112,66 136,60 C160,54 182,48 206,42 C228,36 248,32 272,28',
  tickerChart2: 'M0,62 C20,60 38,56 58,58 C78,60 98,66 122,64 C150,62 174,54 198,44 C224,34 246,28 272,22',
  tickerChart3: 'M0,58 C24,52 42,50 62,56 C82,62 102,62 126,58 C154,54 176,48 198,42 C220,36 242,30 272,24',
  tickerChart4: 'M0,56 C18,50 34,48 56,52 C78,56 98,64 122,62 C150,60 176,50 202,40 C226,32 248,26 272,20',
  options: 'M0,54 C18,48 34,44 56,46 C82,48 104,58 128,60 C152,62 176,54 202,44 C228,34 248,28 272,24',
};

function MetricCardPlaceholderChart({
  variant,
}: {
  variant: keyof typeof METRIC_CARD_PATHS;
}) {
  const stroke = '#222222';

  return (
    <div className="absolute inset-x-0 bottom-0 h-16 overflow-hidden rounded-b-[16px]">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 272 64" preserveAspectRatio="none" aria-hidden>
        <path d={METRIC_CARD_PATHS[variant]} fill="none" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function TextBlockPlaceholder() {
  return (
    <div className="space-y-3 px-3 pb-4 pt-1" aria-hidden>
      <div className="space-y-2">
        <div className="h-3 w-full rounded-full bg-[#222222]" />
        <div className="h-3 w-11/12 rounded-full bg-[#222222]" />
        <div className="h-3 w-10/12 rounded-full bg-[#222222]" />
      </div>
      <div className="space-y-2 pt-2">
        <div className="h-3 w-full rounded-full bg-[#222222]" />
        <div className="h-3 w-9/12 rounded-full bg-[#222222]" />
        <div className="h-3 w-8/12 rounded-full bg-[#222222]" />
      </div>
      <div className="space-y-2 pt-2">
        <div className="h-3 w-full rounded-full bg-[#222222]" />
        <div className="h-3 w-10/12 rounded-full bg-[#222222]" />
        <div className="h-3 w-7/12 rounded-full bg-[#222222]" />
      </div>
    </div>
  );
}

function getCardTitle(type: CardId) {
  switch (type) {
    case 'ticker':
      return 'Tickers';
    case 'main':
      return 'Heatmap';
    case 'event':
      return 'Event';
    case 'news':
      return 'News';
    case 'fearGreed':
      return 'Fear and Greed Index';
    case 'buffett':
      return 'Buffett Indicator';
    case 'peRatio':
      return 'P/E Ratio';
    case 'blankMetric':
      return 'Yield curve inversion';
    case 'watchlist':
      return 'Watchlist';
    case 'aiSummary':
      return 'AI Summary';
    case 'tickerChart1':
      return 'Ticker chart 1';
    case 'tickerChart2':
      return 'Ticker chart 2';
    case 'tickerChart3':
      return 'Ticker chart 3';
    case 'tickerChart4':
      return 'Ticker chart 4';
    case 'darkpool':
      return 'Darkpool';
    case 'snapshot':
      return 'Snapshot';
    case 'options':
      return 'Options';
  }
}

function overlaps(a: CardLayout, b: CardLayout) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function violatesGap(a: CardLayout, b: CardLayout, gap = CARD_GAP) {
  return (
    a.x < b.x + b.width + gap &&
    a.x + a.width + gap > b.x &&
    a.y < b.y + b.height + gap &&
    a.y + a.height + gap > b.y
  );
}

function centerPoint(layout: CardLayout) {
  return {
    x: layout.x + layout.width / 2,
    y: layout.y + layout.height / 2,
  };
}

function containsPoint(layout: CardLayout, point: { x: number; y: number }) {
  return (
    point.x >= layout.x &&
    point.x <= layout.x + layout.width &&
    point.y >= layout.y &&
    point.y <= layout.y + layout.height
  );
}

function containsPointInInnerZone(layout: CardLayout, point: { x: number; y: number }, insetRatio = 0.2) {
  const insetX = layout.width * insetRatio;
  const insetY = layout.height * insetRatio;
  return (
    point.x >= layout.x + insetX &&
    point.x <= layout.x + layout.width - insetX &&
    point.y >= layout.y + insetY &&
    point.y <= layout.y + layout.height - insetY
  );
}

function findVerticalScrollParent(element: HTMLElement | null): HTMLElement | null {
  let current = element?.parentElement ?? null;

  while (current) {
    const style = window.getComputedStyle(current);
    const overflowY = style.overflowY;
    if ((overflowY === 'auto' || overflowY === 'scroll') && current.scrollHeight > current.clientHeight) {
      return current;
    }
    current = current.parentElement;
  }

  return null;
}

function canPlaceCard(
  candidate: CardLayout,
  layouts: Record<string, CardLayout>,
  visibleCardIds: string[],
  ignoreId?: string,
) {
  return visibleCardIds.every((id) => {
    if (id === ignoreId) return true;
    const layout = layouts[id];
    if (!layout) return true;
    return !violatesGap(candidate, layout);
  });
}

function findFirstAvailableSlot({
  template,
  layouts,
  visibleCardIds,
  canvasWidth,
  minCanvasHeight,
}: {
  template: CardLayout;
  layouts: Record<string, CardLayout>;
  visibleCardIds: string[];
  canvasWidth: number;
  minCanvasHeight: number;
}) {
  const width = normalizeLayout(template).width;
  const height = normalizeLayout(template).height;
  const maxX = Math.max(CANVAS_PADDING, snapDown(canvasWidth - width - CANVAS_PADDING));
  const searchBottom = Math.max(
    minCanvasHeight,
    getContentDrivenCanvasHeight(layouts, visibleCardIds, minCanvasHeight) + AUTO_EXPAND_STEP,
  );

  for (let y = CANVAS_PADDING; y <= searchBottom - height - CANVAS_PADDING; y += GRID_SIZE) {
    let rowHasSpace = false;
    for (let x = CANVAS_PADDING; x <= maxX; x += GRID_SIZE) {
      rowHasSpace = true;
      const candidate = { x, y, width, height };
      if (canPlaceCard(candidate, layouts, visibleCardIds)) {
        return candidate;
      }
    }

    if (!rowHasSpace) {
      break;
    }
  }

  return {
    ...normalizeLayout(template),
    x: CANVAS_PADDING,
    y: snapUp(getContentDrivenCanvasHeight(layouts, visibleCardIds, minCanvasHeight) - BOTTOM_BUFFER),
  };
}

export function CanvasWorkspaceDemo({
  currentStocks,
  selectedStockForChart,
  onTickerClick,
  borderColor,
  backgroundColor,
  layoutMode = false,
  onLayoutModeChange,
  paused = false,
  showTicker = true,
  showEvent = true,
  showNews = true,
  requestedCardId = null,
  requestedCardToken = 0,
}: CanvasWorkspaceDemoProps) {
  const [hiddenCards, setHiddenCards] = useState<string[]>([]);
  const [extraCards, setExtraCards] = useState<CanvasCard[]>([]);
  const baseVisibleCards = useMemo(
    () => ({
      ticker: showTicker,
      event: showEvent,
      news: showNews,
      fearGreed: true,
      buffett: true,
      peRatio: true,
      blankMetric: true,
      watchlist: true,
      aiSummary: true,
      tickerChart1: true,
      tickerChart2: true,
      tickerChart3: true,
      tickerChart4: true,
      darkpool: true,
      snapshot: true,
      options: true,
      main: true,
    }),
    [showEvent, showNews, showTicker],
  );
  const hiddenCardSet = useMemo(() => new Set(hiddenCards), [hiddenCards]);
  const baseCards = useMemo(
    () =>
      BASE_CARD_TYPES.filter((type) => baseVisibleCards[type] && !hiddenCardSet.has(type)).map((type) => ({
        id: type,
        type,
        isBase: true,
      })),
    [baseVisibleCards, hiddenCardSet],
  );
  const allCards = useMemo(
    () => [...baseCards, ...extraCards.filter((card) => !hiddenCardSet.has(card.id))],
    [baseCards, extraCards, hiddenCardSet],
  );
  const visibleCardIds = useMemo(() => allCards.map((card) => card.id), [allCards]);
  const defaultLayouts = useMemo<Record<string, CardLayout>>(() => normalizeLayouts(INITIAL_LAYOUTS), []);
  const initialCanvasHeight = useMemo(
    () => getContentDrivenCanvasHeight(defaultLayouts, baseCards.map((card) => card.id), MIN_CANVAS_HEIGHT),
    [defaultLayouts, baseCards],
  );
  const [canvasHeight, setCanvasHeight] = useState(initialCanvasHeight);
  const [layouts, setLayouts] = useState<Record<string, CardLayout>>(defaultLayouts);
  const [dragState, setDragState] = useState<DragState>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const lastHandledCardRequestRef = useRef(0);
  const pendingScrollCardIdRef = useRef<string | null>(null);

  const resolvedLayouts = useMemo<Record<string, CardLayout>>(
    () => ({ ...defaultLayouts, ...layouts }),
    [defaultLayouts, layouts],
  );

  useEffect(() => {
    setLayouts((prev) => ({ ...defaultLayouts, ...prev }));
  }, [defaultLayouts]);

  useEffect(() => {
    const persistedLayouts = readPersistedLayouts();
    const persistedHiddenCards = readPersistedHiddenCards();
    const persistedExtraCards = readPersistedExtraCards();

    if (persistedLayouts) {
      setLayouts(normalizeLayouts({ ...defaultLayouts, ...persistedLayouts }));
    }
    if (persistedHiddenCards.length > 0) {
      setHiddenCards(persistedHiddenCards);
    }
    if (persistedExtraCards.length > 0) {
      setExtraCards(persistedExtraCards);
    }
  }, [defaultLayouts]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(layouts));
  }, [layouts]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.localStorage.setItem(HIDDEN_CARDS_STORAGE_KEY, JSON.stringify(hiddenCards));
  }, [hiddenCards]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.localStorage.setItem(EXTRA_CARDS_STORAGE_KEY, JSON.stringify(extraCards));
  }, [extraCards]);

  useEffect(() => {
    if (!requestedCardId || requestedCardToken === 0) return;
    if (lastHandledCardRequestRef.current === requestedCardToken) return;

    lastHandledCardRequestRef.current = requestedCardToken;
    onLayoutModeChange?.(true);

    const nextId = `${requestedCardId}__${requestedCardToken}`;
    const template = normalizeLayout(defaultLayouts[requestedCardId]);
    const canvasWidth = snapDown(canvasRef.current?.clientWidth ?? 1280);
    const nextLayout = findFirstAvailableSlot({
      template,
      layouts: resolvedLayouts,
      visibleCardIds,
      canvasWidth,
      minCanvasHeight: MIN_CANVAS_HEIGHT,
    });
    pendingScrollCardIdRef.current = nextId;
    setExtraCards((prev) => [...prev, { id: nextId, type: requestedCardId, isBase: false }]);
    setLayouts((prev) => ({
      ...prev,
      [nextId]: nextLayout,
    }));
  }, [requestedCardId, requestedCardToken, defaultLayouts, resolvedLayouts, visibleCardIds]);

  useEffect(() => {
    setCanvasHeight(getContentDrivenCanvasHeight(resolvedLayouts, visibleCardIds, MIN_CANVAS_HEIGHT));
  }, [resolvedLayouts, visibleCardIds]);

  useEffect(() => {
    const targetId = pendingScrollCardIdRef.current;
    if (!targetId) return;
    if (!visibleCardIds.includes(targetId)) return;

    const frame = window.requestAnimationFrame(() => {
      const element = canvasRef.current?.querySelector<HTMLElement>(`[data-card-instance-id="${targetId}"]`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      pendingScrollCardIdRef.current = null;
    });

    return () => window.cancelAnimationFrame(frame);
  }, [visibleCardIds, layouts]);

  useEffect(() => {
    if (!dragState) return;

    const onMouseMove = (event: MouseEvent) => {
      if (!layoutMode) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const scrollParent = findVerticalScrollParent(canvas);
      const scrollDeltaY = scrollParent ? scrollParent.scrollTop - dragState.startScrollTop : 0;
      if (scrollParent) {
        const scrollRect = scrollParent.getBoundingClientRect();
        const threshold = 72;
        const maxStep = 28;

        if (event.clientY > scrollRect.bottom - threshold) {
          const intensity = (event.clientY - (scrollRect.bottom - threshold)) / threshold;
          scrollParent.scrollTop += Math.ceil(maxStep * clamp(intensity, 0, 1));
        } else if (event.clientY < scrollRect.top + threshold) {
          const intensity = ((scrollRect.top + threshold) - event.clientY) / threshold;
          scrollParent.scrollTop -= Math.ceil(maxStep * clamp(intensity, 0, 1));
        }
      }

      const canvasRect = canvas.getBoundingClientRect();
      const dx = event.clientX - dragState.startX;
      const dy = event.clientY - dragState.startY + scrollDeltaY;

      setDragState((prev) => {
        if (!prev) return prev;

        if (prev.type === 'move') {
          const preview: CardLayout = {
            ...prev.layout,
            x: clamp(
              snap(prev.layout.x + dx),
              CANVAS_PADDING,
              Math.max(snapDown(canvasRect.width - prev.layout.width - CANVAS_PADDING), CANVAS_PADDING),
            ),
            y: clamp(
              snap(prev.layout.y + dy),
              CANVAS_PADDING,
              Math.max(snapDown(canvasHeight - prev.layout.height - CANVAS_PADDING), CANVAS_PADDING),
            ),
          };
          if (preview.y + preview.height > canvasHeight - AUTO_EXPAND_THRESHOLD) {
            setCanvasHeight((height) => height + AUTO_EXPAND_STEP);
          }
          const center = centerPoint(preview);
          const swapTargetId =
            visibleCardIds.find((id) => {
              if (id === prev.id) return false;
              const targetLayout = resolvedLayouts[id];
              if (!targetLayout) return false;
              return containsPointInInnerZone(targetLayout, center);
            }) ?? null;

          return { ...prev, preview, swapTargetId };
        }

        const preview: CardLayout = {
          ...prev.layout,
          x:
            prev.resizeHandle === 'w' || prev.resizeHandle === 'nw' || prev.resizeHandle === 'sw'
              ? clamp(
                  snap(prev.layout.x + dx),
                  CANVAS_PADDING,
                  snapDown(prev.layout.x + prev.layout.width - MIN_WIDTH),
                )
              : prev.layout.x,
          y:
            prev.resizeHandle === 'n' || prev.resizeHandle === 'ne' || prev.resizeHandle === 'nw'
              ? clamp(
                  snap(prev.layout.y + dy),
                  CANVAS_PADDING,
                  snapDown(prev.layout.y + prev.layout.height - MIN_HEIGHT),
                )
              : prev.layout.y,
          width:
            prev.resizeHandle === 'w' || prev.resizeHandle === 'nw' || prev.resizeHandle === 'sw'
              ? clamp(
                  snap(prev.layout.width - dx),
                  MIN_WIDTH,
                  Math.max(snapDown(prev.layout.x + prev.layout.width - CANVAS_PADDING), MIN_WIDTH),
                )
              : prev.resizeHandle === 'e' || prev.resizeHandle === 'ne' || prev.resizeHandle === 'se'
                ? clamp(
                    snap(prev.layout.width + dx),
                    MIN_WIDTH,
                  Math.max(snapDown(canvasRect.width - prev.layout.x - CANVAS_PADDING), MIN_WIDTH),
                )
              : prev.layout.width,
          height:
            prev.resizeHandle === 'n' || prev.resizeHandle === 'ne' || prev.resizeHandle === 'nw'
              ? clamp(
                  snap(prev.layout.height - dy),
                  MIN_HEIGHT,
                  Math.max(snapDown(prev.layout.y + prev.layout.height - CANVAS_PADDING), MIN_HEIGHT),
                )
              : prev.resizeHandle === 's' || prev.resizeHandle === 'se' || prev.resizeHandle === 'sw'
                ? clamp(
                    snap(prev.layout.height + dy),
                    MIN_HEIGHT,
                  Math.max(snapDown(canvasHeight - prev.layout.y - CANVAS_PADDING), MIN_HEIGHT),
                )
              : prev.layout.height,
        };
        if (preview.y + preview.height > canvasHeight - AUTO_EXPAND_THRESHOLD) {
          setCanvasHeight((height) => height + AUTO_EXPAND_STEP);
        }

        return { ...prev, preview, swapTargetId: null };
      });
    };

    const onMouseUp = () => {
      setLayouts((prev) => {
        if (!dragState) return prev;
        const next = { ...prev };

        if (dragState.type === 'resize') {
          const blocked = visibleCardIds.some((id) => {
            if (id === dragState.id) return false;
            const targetLayout = prev[id];
            if (!targetLayout) return false;
            return violatesGap(dragState.preview, targetLayout);
          });
          if (!blocked) {
            next[dragState.id] = normalizeLayout(dragState.preview);
            setCanvasHeight((height) =>
              Math.max(height, getContentDrivenCanvasHeight({ ...defaultLayouts, ...next }, visibleCardIds, MIN_CANVAS_HEIGHT)),
            );
          }
          return next;
        }

        const movedLayout = normalizeLayout({
          ...dragState.preview,
          x: snap(dragState.preview.x),
          y: snap(dragState.preview.y),
        });

        const moveBlocked = visibleCardIds.some((id) => {
          if (id === dragState.id) return false;
          const targetLayout = prev[id];
          if (!targetLayout) return false;
          return violatesGap(movedLayout, targetLayout);
        });

        next[dragState.id] = moveBlocked ? dragState.layout : movedLayout;
        setCanvasHeight((height) =>
          Math.max(height, getContentDrivenCanvasHeight({ ...defaultLayouts, ...next }, visibleCardIds, MIN_CANVAS_HEIGHT)),
        );
        return next;
      });
      setDragState(null);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [canvasHeight, defaultLayouts, dragState, layoutMode, resolvedLayouts, visibleCardIds]);

  return (
    <div className="page-transition-in w-full shrink-0 self-start px-4 pb-16">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-3">
        <div
          ref={canvasRef}
          className={`relative w-full overflow-hidden rounded-[20px] ${layoutMode ? 'border border-white/8 bg-[#121214]' : 'border border-transparent bg-transparent'}`}
          style={{
            height: canvasHeight,
            backgroundImage: layoutMode
              ? 'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)'
              : undefined,
            backgroundSize: layoutMode ? '16px 16px' : undefined,
            backgroundPosition: layoutMode ? 'bottom left' : undefined,
          }}
        >
          {allCards.map((card) => {
            const id = card.id;
            const type = card.type;
            const layout =
              dragState?.id === id
                ? dragState.preview
                : resolvedLayouts[id];
            const isDragging = dragState?.id === id;
            const isSwapTarget = false;

            if (!layout) return null;

            return (
              <Fragment key={id}>
                <div
                  data-card-instance-id={id}
                  className={`absolute transition-[left,top,width,height,transform,box-shadow,opacity,border-color] duration-200 ease-out ${layoutMode ? 'group/edit' : ''}`}
                  style={{
                    left: layout.x,
                    top: layout.y,
                    width: layout.width,
                    height: layout.height,
                    zIndex: isDragging ? 30 : isSwapTarget ? 20 : 10,
                    transform: 'scale(1)',
                    opacity: isSwapTarget ? 0.82 : 1,
                    boxShadow: isDragging ? '0 24px 60px rgba(0,0,0,0.35)' : undefined,
                  }}
                >
                <div
                  className={`relative h-full w-full rounded-[16px] transition-transform duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] ${layoutMode && !isDragging ? 'hover:scale-[0.99]' : ''} ${isDragging ? 'scale-[1]' : ''}`}
                >
                  <div
                    className={`pointer-events-none absolute inset-0 rounded-[16px] transition-opacity duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isDragging
                        ? 'opacity-100 shadow-[inset_0_0_0_1px_#D7FF64]'
                        : layoutMode
                          ? 'opacity-0 group-hover/edit:opacity-100 shadow-[inset_0_0_0_1px_#D7FF64]'
                          : 'opacity-0'
                    }`}
                  />
                  {layoutMode ? (
                    <button
                      type="button"
                      aria-label={`Delete ${getCardTitle(type)}`}
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        if (card.isBase) {
                          setHiddenCards((prev) => (prev.includes(id) ? prev : [...prev, id]));
                          return;
                        }

                        setExtraCards((prev) => prev.filter((item) => item.id !== id));
                        setLayouts((prev) => {
                          const next = { ...prev };
                          delete next[id];
                          return next;
                        });
                      }}
                      className="absolute right-3 top-3 z-40 flex h-6 w-6 items-center justify-center rounded-full bg-[#121214] text-white/80 outline-none transition-colors duration-150 hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white/20"
                    >
                      <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" aria-hidden>
                        <path
                          d="M4 4L12 12M12 4L4 12"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  ) : null}
                  {layoutMode ? (
                    <button
                      type="button"
                      aria-label={`Move ${getCardTitle(type)}`}
                      onMouseDown={(event) => {
                        event.preventDefault();
                        setDragState({
                          type: 'move',
                          id,
                          startX: event.clientX,
                          startY: event.clientY,
                          startScrollTop: findVerticalScrollParent(canvasRef.current)?.scrollTop ?? 0,
                          layout: normalizeLayout(resolvedLayouts[id]),
                          preview: normalizeLayout(resolvedLayouts[id]),
                          swapTargetId: null,
                        });
                      }}
                      className="absolute z-20 rounded-[12px] bg-transparent cursor-move"
                      style={{
                        left: `${10}%`,
                        right: `${10}%`,
                        top: `${10}%`,
                        bottom: `${10}%`,
                      }}
                    />
                  ) : null}

                  <div className="h-full w-full">
                    {type === 'ticker' ? (
                      <TickerListPanel
                        stocks={currentStocks}
                        title="Tickers"
                        showAddButton={false}
                        onTickerClick={onTickerClick}
                        borderColor={borderColor}
                        backgroundColor={backgroundColor}
                        width="fill"
                      />
                    ) : null}

                    {type === 'watchlist' ? (
                      <TickerListPanel
                        stocks={currentStocks}
                        title="Watchlist"
                        showAddButton={false}
                        onTickerClick={onTickerClick}
                        borderColor={borderColor}
                        backgroundColor={backgroundColor}
                        width="fill"
                      />
                    ) : null}

                    {type === 'main' ? (
                      selectedStockForChart ? (
                        <ChartPanel
                          stock={selectedStockForChart}
                          borderColor={borderColor}
                          backgroundColor={backgroundColor}
                          width="fill"
                          paused={paused}
                        />
                      ) : (
                        <HeatmapPanel
                          title="Heatmap"
                          borderColor={borderColor}
                          backgroundColor={backgroundColor}
                          width="fill"
                        />
                      )
                    ) : null}

                    {type === 'event' ? (
                      <EventPanel
                        borderColor={borderColor}
                        backgroundColor={backgroundColor}
                        width="fill"
                      />
                    ) : null}

                    {type === 'news' ? (
                      <NewsPanel
                        borderColor={borderColor}
                        backgroundColor={backgroundColor}
                        width="fill"
                      />
                    ) : null}

                    {type === 'fearGreed' || type === 'buffett' || type === 'peRatio' || type === 'blankMetric' || type === 'aiSummary' || type === 'tickerChart1' || type === 'tickerChart2' || type === 'tickerChart3' || type === 'tickerChart4' || type === 'options' || type === 'darkpool' || type === 'snapshot' ? (
                      <div
                        className={`${VIEW_PANEL_CONTAINER_BASE_CLASS} min-w-0`}
                        style={getViewPanelStyle({
                          borderColor,
                          backgroundColor,
                        })}
                        aria-label={getCardTitle(type)}
                      >
                        <h2
                          className={VIEW_PANEL_TITLE_CLASS}
                          style={{ fontFamily: VIEW_PANEL_TITLE_FONT }}
                        >
                          {getCardTitle(type)}
                        </h2>
                        <div className="relative flex-1">
                          {type === 'aiSummary' ? (
                            <TextBlockPlaceholder />
                          ) : type === 'darkpool' || type === 'snapshot' || type === 'options' ? (
                            <div className="h-full w-full" />
                          ) : (
                            <MetricCardPlaceholderChart variant={type} />
                          )}
                        </div>
                      </div>
                    ) : null}
                  </div>

                  {layoutMode ? (
                    <>
                      {(
                        [
                          ['n', 'absolute cursor-ns-resize'],
                          ['s', 'absolute cursor-ns-resize'],
                          ['e', 'absolute cursor-ew-resize'],
                          ['w', 'absolute cursor-ew-resize'],
                          ['ne', 'absolute cursor-nesw-resize'],
                          ['nw', 'absolute cursor-nwse-resize'],
                          ['se', 'absolute cursor-nwse-resize'],
                          ['sw', 'absolute cursor-nesw-resize'],
                        ] as const
                      ).map(([handle, className]) => (
                        <button
                          key={handle}
                          type="button"
                          aria-label={`Resize ${id} ${handle}`}
                          onMouseDown={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            setDragState({
                              type: 'resize',
                              id,
                              startX: event.clientX,
                              startY: event.clientY,
                              startScrollTop: findVerticalScrollParent(canvasRef.current)?.scrollTop ?? 0,
                              layout: normalizeLayout(resolvedLayouts[id]),
                              preview: normalizeLayout(resolvedLayouts[id]),
                              swapTargetId: null,
                              resizeHandle: handle,
                            });
                          }}
                          className={`${className} z-30 bg-transparent`}
                          style={
                            handle === 'n'
                              ? {
                                  left: '10%',
                                  right: '10%',
                                  top: -RESIZE_OUTSET,
                                  height: HANDLE_SIZE + RESIZE_OUTSET * 2,
                                }
                              : handle === 's'
                                ? {
                                    left: '10%',
                                    right: '10%',
                                    bottom: -RESIZE_OUTSET,
                                    height: HANDLE_SIZE + RESIZE_OUTSET * 2,
                                  }
                                : handle === 'e'
                                  ? {
                                      right: -RESIZE_OUTSET,
                                      top: '10%',
                                      bottom: '10%',
                                      width: HANDLE_SIZE + RESIZE_OUTSET * 2,
                                    }
                                  : handle === 'w'
                                    ? {
                                        left: -RESIZE_OUTSET,
                                        top: '10%',
                                        bottom: '10%',
                                        width: HANDLE_SIZE + RESIZE_OUTSET * 2,
                                      }
                                    : handle === 'ne'
                                      ? {
                                          right: -RESIZE_OUTSET,
                                          top: -RESIZE_OUTSET,
                                          width: HANDLE_SIZE + RESIZE_OUTSET * 2,
                                          height: HANDLE_SIZE + RESIZE_OUTSET * 2,
                                        }
                                      : handle === 'nw'
                                        ? {
                                            left: -RESIZE_OUTSET,
                                            top: -RESIZE_OUTSET,
                                            width: HANDLE_SIZE + RESIZE_OUTSET * 2,
                                            height: HANDLE_SIZE + RESIZE_OUTSET * 2,
                                          }
                                        : handle === 'se'
                                          ? {
                                              right: -RESIZE_OUTSET,
                                              bottom: -RESIZE_OUTSET,
                                              width: HANDLE_SIZE + RESIZE_OUTSET * 2,
                                              height: HANDLE_SIZE + RESIZE_OUTSET * 2,
                                            }
                                          : {
                                              left: -RESIZE_OUTSET,
                                              bottom: -RESIZE_OUTSET,
                                              width: HANDLE_SIZE + RESIZE_OUTSET * 2,
                                              height: HANDLE_SIZE + RESIZE_OUTSET * 2,
                                            }
                          }
                        />
                      ))}
                    </>
                  ) : null}
                </div>
                </div>
              </Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
