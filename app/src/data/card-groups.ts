/**
 * 卡片分组数据（可由后台生成/替换）
 * - 第一个分组为「推荐」，固定 6 张卡片，内容暂不填充
 * - 「用户自定义」分组来自 watchlists，全部自定义 wl 作为卡片
 */

import { watchlists } from './watchlists';

export type CardItem = {
  id: string;
  name: string;
  /** 卡片图标（静态资源路径） */
  iconSrc?: string;
  /** 推荐卡片展示用，ticker 数量 */
  tickerCount?: number;
};

export type CardGroupKind = 'recommended' | 'user';

export type CardGroup = {
  id: string;
  kind: CardGroupKind;
  /** 分组标题：推荐 / 用户自定义 等 */
  title: string;
  cards: CardItem[];
};

/** 推荐分组：6 张卡片，标题 + 随机 ticker 数量 */
const recommendedCards: CardItem[] = [
  { id: 'rec-1', name: 'Breakout', iconSrc: '/recommended-icons/rec-4.svg', tickerCount: 24 },
  { id: 'rec-2', name: 'Hot', iconSrc: '/recommended-icons/rec-3.svg', tickerCount: 18 },
  { id: 'rec-3', name: 'Bullish', iconSrc: '/recommended-icons/rec-5.svg', tickerCount: 31 },
  { id: 'rec-4', name: 'Bearish', iconSrc: '/recommended-icons/rec-6.svg', tickerCount: 12 },
  { id: 'rec-5', name: 'S&P 500', iconSrc: '/recommended-icons/rec-1.svg', tickerCount: 502 },
  { id: 'rec-6', name: 'NASDAQ', iconSrc: '/recommended-icons/rec-2.svg', tickerCount: 347 },
];

/** 用户自定义分组：来自 watchlists，所有自定义 wl 作为卡片 */
const userCards: CardItem[] = watchlists.map((w, i) => ({
  id: `wl-${i}`,
  name: w.label,
}));

export const cardGroups: CardGroup[] = [
  {
    id: 'group-recommended',
    kind: 'recommended',
    title: 'Recommended',
    cards: recommendedCards,
  },
  {
    id: 'group-user',
    kind: 'user',
    title: 'My Watchlists',
    cards: userCards,
  },
];
