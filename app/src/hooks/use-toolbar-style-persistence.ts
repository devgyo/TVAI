'use client';

import { useEffect } from 'react';

const STORAGE_KEY = 'pitch-toolbar-style';

type ToolbarStylePayload = Partial<{
  barBgColor: string;
  barBorderColor: string;
  toolbarOpacity: number;
  toolbarBlur: number;
  toolbarHighlight: number;
  toolbarHighlightHeight: number;
  toolbarAccentOpacity: number;
  toolbarAccentGradientStop: number;
  toolbarShadowStrength: number;
  toolbarBorderWidth: number;
}>;

export function useToolbarStylePersistence(
  payload: ToolbarStylePayload,
  setters: {
    setBarBgColor: (v: string) => void;
    setBarBorderColor: (v: string) => void;
    setToolbarOpacity: (v: number) => void;
    setToolbarBlur: (v: number) => void;
    setToolbarHighlight: (v: number) => void;
    setToolbarHighlightHeight: (v: number) => void;
    setToolbarAccentOpacity: (v: number) => void;
    setToolbarAccentGradientStop: (v: number) => void;
    setToolbarShadowStrength: (v: number) => void;
    setToolbarBorderWidth: (v: number) => void;
  }
) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) return;
      const parsed = JSON.parse(stored) as ToolbarStylePayload;
      if (parsed.barBgColor) setters.setBarBgColor(parsed.barBgColor);
      if (parsed.barBorderColor) setters.setBarBorderColor(parsed.barBorderColor);
      if (typeof parsed.toolbarOpacity === 'number') setters.setToolbarOpacity(parsed.toolbarOpacity);
      if (typeof parsed.toolbarBlur === 'number') setters.setToolbarBlur(parsed.toolbarBlur);
      if (typeof parsed.toolbarHighlight === 'number') setters.setToolbarHighlight(parsed.toolbarHighlight);
      if (typeof parsed.toolbarHighlightHeight === 'number') {
        setters.setToolbarHighlightHeight(parsed.toolbarHighlightHeight);
      }
      if (typeof parsed.toolbarAccentOpacity === 'number') {
        setters.setToolbarAccentOpacity(parsed.toolbarAccentOpacity);
      }
      if (typeof parsed.toolbarAccentGradientStop === 'number') {
        setters.setToolbarAccentGradientStop(parsed.toolbarAccentGradientStop);
      }
      if (typeof parsed.toolbarShadowStrength === 'number') {
        setters.setToolbarShadowStrength(parsed.toolbarShadowStrength);
      }
      if (typeof parsed.toolbarBorderWidth === 'number') {
        setters.setToolbarBorderWidth(parsed.toolbarBorderWidth);
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignore write errors
    }
  }, [
    payload.barBgColor,
    payload.barBorderColor,
    payload.toolbarOpacity,
    payload.toolbarBlur,
    payload.toolbarHighlight,
    payload.toolbarHighlightHeight,
    payload.toolbarAccentOpacity,
    payload.toolbarAccentGradientStop,
    payload.toolbarShadowStrength,
    payload.toolbarBorderWidth,
  ]);
}

