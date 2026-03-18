/**
 * 颜色工具函数，供 GlassBar、GlassIconButton 等组件复用
 */

export function hexToRgba(hex: string, alpha: number): string {
  const value = hex.replace('#', '');
  if (value.length !== 6) return hex;
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  const a = Math.min(1, Math.max(0, alpha));
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export function adjustBorderColor(hex: string, level: number): string {
  const value = hex.replace('#', '');
  if (value.length !== 6) return hex;
  let r = parseInt(value.slice(0, 2), 16);
  let g = parseInt(value.slice(2, 4), 16);
  let b = parseInt(value.slice(4, 6), 16);
  const cl = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const l = Math.max(-1, Math.min(1, level));
  if (l < 0) {
    const f = 1 + l;
    r *= f;
    g *= f;
    b *= f;
  } else if (l > 0) {
    const f = l;
    r = r + (255 - r) * f;
    g = g + (255 - g) * f;
    b = b + (255 - b) * f;
  }
  return `rgb(${cl(r)}, ${cl(g)}, ${cl(b)})`;
}
