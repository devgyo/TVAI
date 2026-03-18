/**
 * 从 Finnhub.io 拉取前 50 只股票数据并写入本地 src/data/stocks.ts
 * Logo 会下载到 public/logos/ 并在数据中引用本地路径 /logos/xxx.png
 * 运行: npm run fetch-stocks  或  node scripts/fetch-stocks.mjs
 *
 * API Key: 在项目根目录创建 .env.local，写入 FINNHUB_API_KEY=你的key
 * 或运行: FINNHUB_API_KEY=xxx npm run fetch-stocks
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");
const logosDir = path.join(rootDir, "public", "logos");

function loadEnvLocal() {
  const envPath = path.join(rootDir, ".env.local");
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, "utf8");
  for (const line of content.split("\n")) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
  }
}

function logoUrl(symbol) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(symbol)}&size=48&background=2e2e2e&color=f2f2f7&bold=true`;
}

function escapeStr(s) {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function safeLogoFilename(symbol) {
  return symbol.replace(/[^A-Za-z0-9_-]/g, "_");
}

async function downloadLogo(url, symbol) {
  const baseName = safeLogoFilename(symbol);
  let ext = "png";
  try {
    const res = await fetch(url, { redirect: "follow" });
    if (!res.ok) return null;
    const contentType = (res.headers.get("content-type") || "").toLowerCase();
    if (contentType.includes("jpeg") || contentType.includes("jpg")) ext = "jpg";
    else if (contentType.includes("webp")) ext = "webp";
    else if (contentType.includes("gif")) ext = "gif";
    const buf = Buffer.from(await res.arrayBuffer());
    fs.mkdirSync(logosDir, { recursive: true });
    const filePath = path.join(logosDir, `${baseName}.${ext}`);
    fs.writeFileSync(filePath, buf);
    return `/logos/${baseName}.${ext}`;
  } catch (e) {
    console.warn(`下载 logo ${symbol} 失败:`, e.message);
    return null;
  }
}

async function main() {
  loadEnvLocal();
  const token = process.env.FINNHUB_API_KEY;
  if (!token) {
    console.error("请设置 FINNHUB_API_KEY：在 .env.local 中写入 FINNHUB_API_KEY=你的key");
    console.error("或运行: FINNHUB_API_KEY=xxx npm run fetch-stocks");
    process.exit(1);
  }

  const base = "https://finnhub.io/api/v1";
  console.log("正在从 Finnhub.io 拉取美股符号列表...");

  const symRes = await fetch(`${base}/stock/symbol?exchange=US&token=${token}`);
  if (!symRes.ok) {
    console.error("获取符号列表失败:", symRes.status, await symRes.text());
    process.exit(1);
  }
  const symbols = await symRes.json();
  const common = (symbols || []).filter((s) => (s.type || "").toLowerCase() === "common stock").slice(0, 50);
  if (common.length < 50) {
    const fallback = (symbols || []).slice(0, 50);
    if (fallback.length === 0) {
      console.error("未获取到任何符号");
      process.exit(1);
    }
    common.length = 0;
    common.push(...fallback);
  }

  const stocks = [];
  for (let i = 0; i < common.length; i++) {
    const s = common[i];
    const symbol = s.symbol || s.description;
    let name = (s.description || symbol || "").replace(/"/g, "'");
    let logo = logoUrl(symbol);

    const [quoteRes, profileRes] = await Promise.all([
      fetch(`${base}/quote?symbol=${encodeURIComponent(symbol)}&token=${token}`),
      fetch(`${base}/stock/profile2?symbol=${encodeURIComponent(symbol)}&token=${token}`),
    ]);

    if (profileRes.ok) {
      const profile = await profileRes.json();
      if (profile.logo && typeof profile.logo === "string" && profile.logo.startsWith("http")) {
        logo = profile.logo;
      }
      if (profile.name && typeof profile.name === "string") {
        name = profile.name.replace(/"/g, "'");
      }
    }

    let localLogoPath = await downloadLogo(logo, symbol);
    if (!localLogoPath && logo !== logoUrl(symbol)) {
      localLogoPath = await downloadLogo(logoUrl(symbol), symbol);
    }
    const logoRef = localLogoPath || logo;

    let price = 0;
    let dp = 0;
    if (quoteRes.ok) {
      const q = await quoteRes.json();
      price = typeof q.c === "number" ? q.c : 0;
      dp = typeof q.dp === "number" ? q.dp : 0;
    }
    const risePercent = dp > 0 ? Math.round(dp * 100) / 100 : 0;
    const fallPercent = dp < 0 ? Math.round(-dp * 100) / 100 : 0;
    stocks.push({
      logo: logoRef,
      code: symbol,
      name: name || symbol,
      price,
      risePercent,
      fallPercent,
    });
    if ((i + 1) % 10 === 0) console.log(`已拉取 ${i + 1}/${common.length}...`);
    await new Promise((r) => setTimeout(r, 250));
  }

  const lines = [
    `/**`,
    ` * 股票数据：从 Finnhub.io 拉取，每项包含 Logo（本地 public/logos/）、代码、公司名、价格、涨幅、跌幅`,
    ` * 涨幅：正数表示上涨百分比；跌幅：正数表示下跌百分比（展示时取负）`,
    ` * 生成: npm run fetch-stocks`,
    ` */`,
    `export type Stock = {`,
    `  logo: string;`,
    `  code: string;`,
    `  name: string;`,
    `  price: number;`,
    `  risePercent: number;`,
    `  fallPercent: number;`,
    `};`,
    ``,
    `export const stocks: Stock[] = [`,
    ...stocks.map(
      (s) =>
        `  { logo: "${escapeStr(s.logo)}", code: "${escapeStr(s.code)}", name: "${escapeStr(s.name)}", price: ${s.price}, risePercent: ${s.risePercent}, fallPercent: ${s.fallPercent} },`
    ),
    `];`,
    ``,
  ];

  const outPath = path.join(rootDir, "src", "data", "stocks.ts");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, lines.join("\n"), "utf8");

  console.log(`已写入 ${stocks.length} 条数据到 ${outPath}`);
  console.log(`Logo 已下载到 ${logosDir}，数据中引用为 /logos/xxx.png`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
