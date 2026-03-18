'use client';

import { useState } from 'react';
import Image from 'next/image';

type StockLogoProps = { logo: string; code: string; /** 尺寸（px），默认 28 */ size?: number };

export function StockLogo({ logo, code, size = 28 }: StockLogoProps) {
  const [failed, setFailed] = useState(false);
  const isDefault = size === 28;
  if (failed) {
    return (
      <div
        className="flex shrink-0 items-center justify-center rounded-full bg-white/10 text-[10px] font-medium text-white/80"
        style={{ fontFamily: "var(--font-inter)", width: size, height: size }}
      >
        {code.slice(0, 2)}
      </div>
    );
  }
  return (
    <Image
      src={logo}
      alt=""
      width={size}
      height={size}
      className={`shrink-0 rounded-full object-cover bg-white/10 ${isDefault ? 'h-7 w-7' : ''}`}
      style={isDefault ? undefined : { width: size, height: size }}
      unoptimized
      onError={() => setFailed(true)}
    />
  );
}
