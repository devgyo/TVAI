'use client';

import { useState, useEffect, useRef } from 'react';
import { BAR_ANIMATION_MS } from '@/constants/transitions';

export function useBarAnimation(
  openView: string | null,
  selectedStockForChart: { code: string } | null
) {
  const [barAnimating, setBarAnimating] = useState(false);
  const prevStockForChartRef = useRef<{ code: string } | null>(null);
  const barInitializedRef = useRef(false);

  useEffect(() => {
    if (openView !== 'watchlists') return;
    if (!barInitializedRef.current) {
      barInitializedRef.current = true;
      prevStockForChartRef.current = selectedStockForChart;
      return;
    }
    if (prevStockForChartRef.current !== selectedStockForChart) {
      setBarAnimating(true);
      prevStockForChartRef.current = selectedStockForChart;
      const t = setTimeout(() => setBarAnimating(false), BAR_ANIMATION_MS);
      return () => clearTimeout(t);
    }
  }, [openView, selectedStockForChart]);

  return barAnimating;
}
