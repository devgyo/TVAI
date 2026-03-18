'use client';

type TooltipConfig = {
  backgroundColor: string;
  textColor: string;
  borderRadius: number;
  paddingX: number;
  paddingY: number;
  fontSize: number;
  fontWeight: number;
  shadow: boolean;
};

type AppStylesProps = { tooltipConfig: TooltipConfig };

/** 注入 Tippy 主题相关的动态样式（与 tooltipConfig 绑定） */
export function AppStyles({ tooltipConfig }: AppStylesProps) {
  return (
    <style dangerouslySetInnerHTML={{
      __html: `
        #tippy-root .tippy-box,
        .tippy-box {
          background-color: ${tooltipConfig.backgroundColor} !important;
          color: ${tooltipConfig.textColor} !important;
          font-family: var(--font-inter) !important;
          font-size: ${tooltipConfig.fontSize}px !important;
          font-weight: ${tooltipConfig.fontWeight} !important;
          border-radius: ${tooltipConfig.borderRadius}px !important;
          padding: ${tooltipConfig.paddingY}px ${tooltipConfig.paddingX}px !important;
          min-height: auto !important;
          line-height: 1.2 !important;
          border: none !important;
          ${tooltipConfig.shadow ? 'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;' : 'box-shadow: none !important;'}
        }
        #tippy-root .tippy-content,
        .tippy-content {
          padding: 0 !important;
        }
        .tippy-arrow {
          color: ${tooltipConfig.backgroundColor} !important;
        }
      `,
    }} />
  );
}
