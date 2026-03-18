'use client';

import type { Stock } from '@/data/stocks';
import { StockLogo } from '@/components/ui/StockLogo';

type TickerListProps = { stocks: Stock[]; onTickerClick?: (stock: Stock) => void };

export function TickerList({ stocks, onTickerClick }: TickerListProps) {
  const list = stocks ?? [];
  return (
    <div>
      {list.map((s) => {
          const isRise = s.risePercent > 0;
          const changeVal = isRise ? s.risePercent : -s.fallPercent;
          return (
            <div
              key={s.code}
              role={onTickerClick ? 'button' : undefined}
              tabIndex={onTickerClick ? 0 : undefined}
              className="flex cursor-pointer items-center gap-3 rounded-lg py-2 outline-none transition-[transform,background-color] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-white/5 active:scale-[0.98]"
              onClick={onTickerClick ? () => onTickerClick(s) : undefined}
              onKeyDown={
                onTickerClick
                  ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onTickerClick(s);
                      }
                    }
                  : undefined
              }
            >
              <StockLogo logo={s.logo} code={s.code} />
              <div className="min-w-0 flex-1">
                <div className="font-medium text-[#F2F2F7]" style={{ fontFamily: "var(--font-inter)", fontSize: "12px" }}>
                  {s.code}
                </div>
                <div className="w-[100px] min-w-0 truncate text-white/50" style={{ fontFamily: "var(--font-inter)", fontSize: "11px" }}>
                  {s.name}
                </div>
              </div>
              <div className="shrink-0 text-right">
                <div className="font-medium tabular-nums text-[#F2F2F7]" style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "11px" }}>
                  ${s.price.toFixed(2)}
                </div>
                <div
                  className={`tabular-nums ${changeVal >= 0 ? "text-emerald-400" : "text-red-400"}`}
                  style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "11px" }}
                >
                  {changeVal >= 0 ? "+" : ""}{changeVal}%
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}
