export type SwitchStyle = {
  trackWidth: number;
  trackHeight: number;
  thumbSize: number;
  trackOnColor: string;
  trackOffColor: string;
  transitionDuration: number;
};

export const DEFAULT_SWITCH_STYLE: SwitchStyle = {
  trackWidth: 22,
  trackHeight: 14,
  thumbSize: 10,
  trackOnColor: '#EEEEEE',
  trackOffColor: '#666666',
  transitionDuration: 180,
};

