/**
 * 股票数据：从 Finnhub.io 拉取，每项包含 Logo（本地 public/logos/）、代码、公司名、价格、涨幅、跌幅
 * 涨幅：正数表示上涨百分比；跌幅：正数表示下跌百分比（展示时取负）
 * 生成: npm run fetch-stocks
 */
export type Stock = {
  logo: string;
  code: string;
  name: string;
  price: number;
  /** 当日涨幅百分比（正） */
  risePercent: number;
  /** 当日跌幅百分比（正） */
  fallPercent: number;
  /** 以下字段目前为本地模拟数据，用于表格展示和占位 */
  open?: number;
  high?: number;
  low?: number;
  previousClose?: number;
  volume?: number;
  averageVolume10d?: number;
  averageVolume30d?: number;
  marketCap?: number;
  pe?: number;
  pb?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  beta?: number;
  oneDayReturn?: number;
  oneWeekReturn?: number;
  oneMonthReturn?: number;
  threeMonthReturn?: number;
  oneYearReturn?: number;
};

export const stocks: Stock[] = [
  { logo: "/logos/PDRO.png", code: "PDRO", name: "Pedro's List Inc", price: 0.0001, risePercent: 0, fallPercent: 0 },
  { logo: "/logos/WIFT.png", code: "WIFT", name: "Wi-Fi TV Inc", price: 0, risePercent: 0, fallPercent: 0 },
  { logo: "/logos/RPKIF.png", code: "RPKIF", name: "Richards Group Inc", price: 20.88, risePercent: 0, fallPercent: 2.34 },
  { logo: "/logos/WEBNF.png", code: "WEBNF", name: "Westpac Banking Corp", price: 27.25, risePercent: 0.78, fallPercent: 0 },
  { logo: "/logos/TGL.png", code: "TGL", name: "Treasure Global Inc", price: 4.71, risePercent: 0.64, fallPercent: 0 },
  { logo: "/logos/CZOOF.png", code: "CZOOF", name: "Cazoo Group Ltd", price: 0.0001, risePercent: 0, fallPercent: 0 },
  { logo: "/logos/MBGAF.png", code: "MBGAF", name: "Mercedes-Benz Group AG", price: 68.25, risePercent: 0.83, fallPercent: 0 },
  { logo: "/logos/RBCRS.png", code: "RBCRS", name: "RSE Archive LLC", price: 0, risePercent: 0, fallPercent: 0 },
  { logo: "/logos/CZZLF.png", code: "CZZLF", name: "Cizzle Brands Corp", price: 0.245, risePercent: 0, fallPercent: 8.89 },
  { logo: "/logos/ASFX.png", code: "ASFX", name: "American Scientific Resources Inc", price: 0, risePercent: 0, fallPercent: 0 },
  { logo: "/logos/SMSI.png", code: "SMSI", name: "Smith Micro Software Inc", price: 0.49, risePercent: 0, fallPercent: 0 },
  { logo: "/logos/MCRPF.png", code: "MCRPF", name: "Microport Scientific Corp", price: 1.57, risePercent: 0, fallPercent: 4.85 },
  { logo: "/logos/IDGXF.png", code: "IDGXF", name: "Integrated Diagnostics Holdings PLC", price: 0.6, risePercent: 0, fallPercent: 11.76 },
  { logo: "/logos/AQIA.png", code: "AQIA", name: "AQUIVA GROUP INC", price: 0.1759, risePercent: 0, fallPercent: 7.13 },
  { logo: "/logos/RAPT.png", code: "RAPT", name: "RAPT Therapeutics Inc", price: 57.72, risePercent: 0, fallPercent: 0.17 },
  { logo: "/logos/BRWXF.png", code: "BRWXF", name: "Brunswick Exploration Inc", price: 0.155, risePercent: 0, fallPercent: 9.99 },
  { logo: "/logos/NVGS.png", code: "NVGS", name: "Navigator Holdings Ltd", price: 19.3, risePercent: 3.04, fallPercent: 0 },
  { logo: "/logos/GBNW.png", code: "GBNW", name: "Global Energy Networks Corp", price: 0.000001, risePercent: 0, fallPercent: 0 },
  { logo: "/logos/NXEN.png", code: "NXEN", name: "Nexien Biopharma Inc", price: 0.0001, risePercent: 0, fallPercent: 0 },
  { logo: "/logos/CURN.png", code: "CURN", name: "Currency Exchange International Corp", price: 20.45, risePercent: 0.25, fallPercent: 0 },
  { logo: "/logos/AMSLF.png", code: "AMSLF", name: "Australian Mines Ltd", price: 0.0171, risePercent: 0, fallPercent: 0.29 },
  { logo: "/logos/CTGL.png", code: "CTGL", name: "Citrine Global Corp", price: 0.1375, risePercent: 19.57, fallPercent: 0 },
  { logo: "/logos/JORFF.png", code: "JORFF", name: "Consolidated Lithium Metals Inc", price: 0.0782, risePercent: 0, fallPercent: 6.9 },
  { logo: "/logos/FBP.png", code: "FBP", name: "First BanCorp", price: 22.43, risePercent: 0.04, fallPercent: 0 },
  { logo: "/logos/LANV.png", code: "LANV", name: "Lanvin Group Holdings Ltd", price: 1.45, risePercent: 0, fallPercent: 3.97 },
  { logo: "/logos/VTYX.png", code: "VTYX", name: "Ventyx Biosciences Inc", price: 13.97, risePercent: 0.29, fallPercent: 0 },
  { logo: "/logos/CPNBQ.png", code: "CPNBQ", name: "INTEGRATEL PERU SAA - B", price: 0, risePercent: 0, fallPercent: 0 },
  { logo: "/logos/PM.png", code: "PM", name: "Philip Morris International Inc", price: 187.51, risePercent: 0, fallPercent: 0.76 },
  { logo: "/logos/RLFTF.png", code: "RLFTF", name: "MindMaze Therapeutics Holding SA", price: 1.48, risePercent: 2.78, fallPercent: 0 },
  { logo: "/logos/SOC.png", code: "SOC", name: "Sable Offshore Corp", price: 8.89, risePercent: 7.89, fallPercent: 0 },
  { logo: "/logos/FHI.png", code: "FHI", name: "Federated Hermes Inc", price: 55.44, risePercent: 2.1, fallPercent: 0 },
  { logo: "/logos/GGXXF.png", code: "GGXXF", name: "Ggx Gold Corp", price: 0.06, risePercent: 17.65, fallPercent: 0 },
  { logo: "/logos/SLMFF.png", code: "SLMFF", name: "Solis Minerals Ltd", price: 0.0057, risePercent: 0, fallPercent: 94 },
  { logo: "/logos/GMBL.png", code: "GMBL", name: "Esports Entertainment Group Inc", price: 0.2295, risePercent: 0, fallPercent: 0.22 },
  { logo: "/logos/MWYN.png", code: "MWYN", name: "Marwynn Holdings Inc", price: 0.745, risePercent: 0, fallPercent: 1.82 },
  { logo: "/logos/PRPM.png", code: "PRPM", name: "ProTek Capital Inc", price: 0.000001, risePercent: 0, fallPercent: 0 },
  { logo: "/logos/AZZ.png", code: "AZZ", name: "AZZ Inc", price: 140.24, risePercent: 1.8, fallPercent: 0 },
  { logo: "/logos/KMRIF.png", code: "KMRIF", name: "Komeri Co Ltd", price: 0, risePercent: 0, fallPercent: 0 },
  { logo: "/logos/CNDT.png", code: "CNDT", name: "Conduent Inc", price: 1.535, risePercent: 14.13, fallPercent: 0 },
  { logo: "/logos/AOHLF.png", code: "AOHLF", name: "Autohellas SA", price: 0, risePercent: 0, fallPercent: 0 },
  { logo: "/logos/MWRES.png", code: "MWRES", name: "MASTERWORKS 075 LLC", price: 0, risePercent: 0, fallPercent: 0 },
  { logo: "/logos/ESCA.png", code: "ESCA", name: "Escalade Inc", price: 14.045, risePercent: 0, fallPercent: 1.37 },
  { logo: "/logos/MNTS.png", code: "MNTS", name: "Momentus Inc", price: 5.71, risePercent: 5.35, fallPercent: 0 },
  { logo: "/logos/XTAIF.png", code: "XTAIF", name: "XTAO Inc", price: 0.4, risePercent: 14.29, fallPercent: 0 },
  { logo: "/logos/MINOF.png", code: "MINOF", name: "Minor International PCL", price: 0.7834, risePercent: 1.85, fallPercent: 0 },
  { logo: "/logos/TRRXF.png", code: "TRRXF", name: "TNR Gold Corp", price: 0.14, risePercent: 0, fallPercent: 0 },
  { logo: "/logos/WTKN.png", code: "WTKN", name: "WellTek Inc", price: 0, risePercent: 0, fallPercent: 0 },
  { logo: "/logos/AEHHS.png", code: "AEHHS", name: "ARRIVED HOMES SER TOMLINSON", price: 0, risePercent: 0, fallPercent: 0 },
  { logo: "/logos/ASPS.png", code: "ASPS", name: "Altisource Portfolio Solutions SA", price: 5.41, risePercent: 0, fallPercent: 2.35 },
  { logo: "/logos/CMLMF.png", code: "CMLMF", name: "CML Microsystems Plc", price: 0, risePercent: 0, fallPercent: 0 },
];

/** 额外的数值类指标（本地 mock，用于表格展示） */
export type StockMetrics = {
  open: number;
  high: number;
  low: number;
  previousClose: number;
  volume: number;
  averageVolume10d: number;
  averageVolume30d: number;
  marketCap: number;
  pe: number;
  pb: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  beta: number;
  oneDayReturn: number;
  oneWeekReturn: number;
  oneMonthReturn: number;
  threeMonthReturn: number;
  oneYearReturn: number;
};

/** 简单根据索引“编”的一组占位指标，方便在表格中使用 */
export const stockMetricsByCode: Record<string, StockMetrics> = Object.fromEntries(
  stocks.map((s, index) => {
    const base = 10 + index; // 只是为了让每个 ticker 有点差异
    return [
      s.code,
      {
        open: s.price || base,
        high: (s.price || base) * 1.05,
        low: (s.price || base) * 0.95,
        previousClose: s.price || base * 0.99,
        volume: 100_000 + index * 1_000,
        averageVolume10d: 80_000 + index * 900,
        averageVolume30d: 70_000 + index * 800,
        marketCap: 1_000_000_000 + index * 10_000_000,
        pe: 10 + (index % 15),
        pb: 1 + (index % 5) * 0.3,
        fiftyTwoWeekHigh: (s.price || base) * 1.4,
        fiftyTwoWeekLow: (s.price || base) * 0.6,
        beta: 0.7 + (index % 10) * 0.05,
        oneDayReturn: s.risePercent ? s.risePercent : -s.fallPercent,
        oneWeekReturn: ((index % 21) - 10) * 0.5,
        oneMonthReturn: ((index % 31) - 15) * 0.8,
        threeMonthReturn: ((index % 41) - 20) * 1.1,
        oneYearReturn: ((index % 51) - 25) * 1.5,
      },
    ];
  }),
);

/**
 * TableList：用于表格展示的 ticker 列表。
 * 在原始 stocks 的基础上，合并了本地生成的数值型指标字段。
 */
export const tableList: Stock[] = stocks.map((s) => {
  const metrics = stockMetricsByCode[s.code];
  return metrics ? { ...s, ...metrics } : s;
});


