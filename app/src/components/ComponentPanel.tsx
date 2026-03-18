'use client';

import * as React from 'react';

const FONT = 'var(--font-inter)';

type BarDemoVariant = {
  id: string;
  name: string;
  desc: string;
  runClass: string;
};

const BAR_DEMO_VARIANTS: BarDemoVariant[] = [
  { id: '1', name: '方案 A：上移 + 淡入', desc: 'Bar 自下略上移 8px，透明度 0.9→1，0.28s ease', runClass: 'bar-demo-1-run' },
  { id: '2', name: '方案 B：轻微缩放', desc: 'Bar 从 0.97 缩放到 1，带淡入，0.28s', runClass: 'bar-demo-2-run' },
  { id: '3', name: '方案 C：仅上移', desc: '只做 6px 上移，无透明度，0.26s，最克制', runClass: 'bar-demo-3-run' },
  { id: '4', name: '方案 D：仅淡入', desc: '只做透明度 0.82→1，0.24s，最轻', runClass: 'bar-demo-4-run' },
  { id: '5', name: '方案 E：上移 + 轻缩放', desc: '6px 上移 + scale 0.98→1 + 淡入，0.3s', runClass: 'bar-demo-5-run' },
  { id: '6', name: '方案 F：上移 + 轻回弹', desc: '10px 上移 + 淡入，缓动带一点 overshoot，0.32s', runClass: 'bar-demo-6-run' },
];

function BarDemoBlock({ variant }: { variant: BarDemoVariant }) {
  const [mode, setMode] = React.useState<'wl' | 'ticker'>('wl');
  const [ticker, setTicker] = React.useState('AAPL');
  const [run, setRun] = React.useState(false);

  const trigger = React.useCallback(() => setRun(true), []);

  React.useEffect(() => {
    if (!run) return;
    const t = window.setTimeout(() => setRun(false), 400);
    return () => clearTimeout(t);
  }, [run]);

  const toTicker = () => {
    setMode('ticker');
    setTicker('AAPL');
    trigger();
  };
  const switchTicker = () => {
    setTicker((s) => (s === 'AAPL' ? 'MSFT' : 'AAPL'));
    trigger();
  };
  const toWl = () => {
    setMode('wl');
    trigger();
  };

  const barLabel = mode === 'wl' ? 'Watchlist' : `Ticker: ${ticker}`;

  return (
    <div className="rounded-lg border border-[#333] bg-[#252528] p-4">
      <p className="mb-1 text-[13px] font-medium text-[#F2F2F7]" style={{ fontFamily: FONT }}>
        {variant.name}
      </p>
      <p className="mb-3 text-[12px] text-[#A1A1AA]" style={{ fontFamily: FONT }}>
        {variant.desc}
      </p>
      <div className="flex flex-col items-center gap-3">
        <div
          className={`flex items-center justify-center rounded-full border border-[#404040] bg-[#1a1a1a] px-4 py-2 shadow-lg ${run ? variant.runClass : ''}`}
          style={{ fontFamily: FONT, minWidth: 140 }}
        >
          <span className="text-[12px] font-medium text-[#F2F2F7]">{barLabel}</span>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={toTicker}
            className="rounded-lg bg-[#2C2C2E] px-3 py-1.5 text-[11px] font-medium text-[#F2F2F7] outline-none transition-colors hover:bg-[#3A3A3C]"
            style={{ fontFamily: FONT }}
          >
            进 Ticker
          </button>
          <button
            type="button"
            onClick={switchTicker}
            disabled={mode === 'wl'}
            className="rounded-lg bg-[#2C2C2E] px-3 py-1.5 text-[11px] font-medium text-[#F2F2F7] outline-none transition-colors hover:bg-[#3A3A3C] disabled:opacity-50 disabled:pointer-events-none"
            style={{ fontFamily: FONT }}
          >
            切 Ticker
          </button>
          <button
            type="button"
            onClick={toWl}
            className="rounded-lg bg-[#2C2C2E] px-3 py-1.5 text-[11px] font-medium text-[#F2F2F7] outline-none transition-colors hover:bg-[#3A3A3C]"
            style={{ fontFamily: FONT }}
          >
            回 WL
          </button>
        </div>
      </div>
    </div>
  );
}

type ComponentPanelProps = {
  onClose: () => void;
};

export function ComponentPanel({ onClose }: ComponentPanelProps) {
  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50"
        aria-hidden
        onClick={onClose}
      />
      <div
        className="fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-[360px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border border-[#333] bg-[#1C1C1E] shadow-xl"
        role="dialog"
        aria-label="Bar 动效 Demo"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[#333] px-4 py-3">
          <h2
            className="text-[15px] font-semibold text-[#F2F2F7]"
            style={{ fontFamily: FONT }}
          >
            Bar 动效 Demo
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-[#A1A1AA] outline-none transition-colors hover:bg-white/10 hover:text-[#F2F2F7] focus-visible:ring-2 focus-visible:ring-[#444] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1C1C1E]"
            aria-label="关闭"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto p-4" style={{ maxHeight: 'calc(85vh - 60px)' }}>
          <p className="mb-2 text-[12px] text-[#A1A1AA]" style={{ fontFamily: FONT }}>
            三种场景用同一套简单动效：(a) Watchlist → Ticker (b) Ticker 之间互切 (c) Ticker → Watchlist。选一个方案后应用到正式 Bar。
          </p>
          <div className="flex flex-col gap-4">
            {BAR_DEMO_VARIANTS.map((v) => (
              <BarDemoBlock key={v.id} variant={v} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
