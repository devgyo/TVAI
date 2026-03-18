export type NavItem = { label: string; icon: string };
export type WatchlistItem = { label: string; icon: string; color: string; active?: boolean };

export const topNav: NavItem[] = [
  { label: "Overview", icon: "bookmark" },
  { label: "Screener", icon: "screener" },
  { label: "Trends AI", icon: "trends" },
  { label: "DarkPool", icon: "darkpool" },
  { label: "Trades", icon: "ticker" },
];

const watchlistColors = [
  "#EF4444", "#F97316", "#EAB308", "#22C55E", "#14B8A6",
  "#3B82F6", "#8B5CF6", "#EC4899", "#F43F5E", "#84CC16",
  "#06B6D4", "#6366F1", "#D946EF", "#E11D48", "#0EA5E9",
  "#64748B", "#A855F7", "#F59E0B", "#10B981", "#0D9488",
  "#2563EB", "#7C3AED", "#DB2777", "#DC2626", "#65A30D",
  "#0891B2",
];

export const watchlists: WatchlistItem[] = [
  { label: "Core Holdings", icon: "compass", active: true, color: watchlistColors[0] },
  { label: "Energy Transition", icon: "lightning", color: watchlistColors[1] },
  { label: "AI Infrastructure", icon: "brain", color: watchlistColors[2] },
  { label: "US Large Cap", icon: "bank", color: watchlistColors[3] },
  { label: "Quality Growth", icon: "grid", color: watchlistColors[4] },
  { label: "Dividend Kings", icon: "briefcase", color: watchlistColors[5] },
  { label: "Semiconductors", icon: "chip", color: watchlistColors[6] },
  { label: "Healthcare Leaders", icon: "stethoscope", color: watchlistColors[7] },
  { label: "Biopharma Innovators", icon: "dna", color: watchlistColors[8] },
  { label: "Global Brands", icon: "globe", color: watchlistColors[9] },
  { label: "Battery Supply Chain", icon: "battery", color: watchlistColors[10] },
  { label: "Cybersecurity", icon: "shield", color: watchlistColors[11] },
  { label: "Infrastructure", icon: "bricks", color: watchlistColors[12] },
  { label: "Consumer Leaders", icon: "bags", color: watchlistColors[13] },
  { label: "Travel & Leisure", icon: "plane", color: watchlistColors[14] },
  { label: "Industrial Automation", icon: "gift", color: watchlistColors[15] },
  { label: "Clean Energy", icon: "filter", color: watchlistColors[16] },
  { label: "Tech Giants", icon: "help", color: watchlistColors[17] },
  { label: "Green Bonds", icon: "copy", color: watchlistColors[18] },
  { label: "Water & Utilities", icon: "duplicate", color: watchlistColors[19] },
  { label: "Space & Defense", icon: "ticker", color: watchlistColors[20] },
  { label: "Fintech", icon: "event", color: watchlistColors[21] },
  { label: "Gaming & Metaverse", icon: "news", color: watchlistColors[22] },
  { label: "E-Commerce", icon: "snapshot", color: watchlistColors[23] },
  { label: "Value Picks", icon: "darkpool", color: watchlistColors[24] },
  { label: "Momentum Plays", icon: "bell-ring", color: watchlistColors[25] },
];
