import type { Stock } from '@/data/stocks';
import { stocks } from '@/data/stocks';
import { watchlists } from '@/data/watchlists';

/** 固定种子的伪随机（保证 SSR 与客户端结果一致，避免 hydration 报错） */
function createSeededRandom(seed: number) {
  return function next() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

/** 打乱数组顺序（Fisher-Yates），使用传入的 random 以保证服务端/客户端一致 */
function shuffle<T>(arr: T[], random: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const WATCHLIST_STOCKS_SEED = 12345;

/** 为每个 Watchlist 生成 16～24 支随机股票；使用固定种子保证 SSR 与客户端一致 */
export function buildWatchlistStocks(): Stock[][] {
  const random = createSeededRandom(WATCHLIST_STOCKS_SEED);
  return watchlists.map(() => {
    const count = 16 + Math.floor(random() * 9);
    return shuffle(stocks, random).slice(0, count);
  });
}
