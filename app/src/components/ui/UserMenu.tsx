import type { CSSProperties, ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon';

type MenuSurfaceProps = {
  /** 外层 fixed 容器的定位与颜色，由调用方传入（例如根据触发元素 rect 计算） */
  containerStyle: CSSProperties;
  /** 点击遮罩或任意菜单项后关闭菜单 */
  onClose: () => void;
  /** 无障碍 label，可按场景自定义 */
  ariaLabel?: string;
  /** 具体的菜单内容（按钮列表等） */
  children: ReactNode;
};

export function MenuSurface({ containerStyle, onClose, ariaLabel, children }: MenuSurfaceProps) {
  return (
    <>
      <div className="fixed inset-0 z-40" aria-hidden onClick={onClose} />
      <div
        className="fixed z-50 min-w-[160px] rounded-lg border px-1 py-1 shadow-xl"
        style={containerStyle}
        role="menu"
        aria-label={ariaLabel}
      >
        {children}
      </div>
    </>
  );
}

type UserMenuProps = {
  /** 外层 fixed 容器的定位与颜色，由调用方传入（例如根据 avatarPopoverRect 计算） */
  containerStyle: CSSProperties;
  /** 点击遮罩或任意菜单项后关闭菜单 */
  onClose: () => void;
  /** 点击 Account settings */
  onAccountSettings?: () => void;
  /** 点击 Alert Management */
  onAlertManagement?: () => void;
  /** 点击 Help & feedback */
  onHelpFeedback?: () => void;
  /** 点击 Log out */
  onLogout?: () => void;
};

export function UserMenu({
  containerStyle,
  onClose,
  onAccountSettings,
  onAlertManagement,
  onHelpFeedback,
  onLogout,
}: UserMenuProps) {
  const handleItemClick = (extra?: () => void) => (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onClose();
    if (extra) extra();
  };
  return (
    <MenuSurface containerStyle={containerStyle} onClose={onClose} ariaLabel="User menu">
      <div className="flex flex-col gap-1">
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded px-[6px] py-1.5 text-left text-[13px] text-[#F2F2F7] outline-none transition-colors hover:bg-white/10"
          style={{ fontFamily: 'var(--font-inter)' }}
          role="menuitem"
          onClick={handleItemClick(onAccountSettings)}
        >
          <Icon name="settings" className="h-4 w-4 shrink-0 text-[#A1A1AA]" />
          Account settings
        </button>
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded px-[6px] py-1.5 text-left text-[13px] text-[#F2F2F7] outline-none transition-colors hover:bg-white/10"
          style={{ fontFamily: 'var(--font-inter)' }}
          role="menuitem"
          onClick={handleItemClick(onAlertManagement)}
        >
          <Icon name="bell" className="h-4 w-4 shrink-0 text-[#A1A1AA]" />
          Alert management
        </button>
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded px-[6px] py-1.5 text-left text-[13px] text-[#F2F2F7] outline-none transition-colors hover:bg-white/10"
          style={{ fontFamily: 'var(--font-inter)' }}
          role="menuitem"
          onClick={handleItemClick(onHelpFeedback)}
        >
          <Icon name="help" className="h-4 w-4 shrink-0 text-[#A1A1AA]" />
          Help & feedback
        </button>
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded px-[6px] py-1.5 text-left text-[13px] text-[#FF453A] outline-none transition-colors hover:bg-white/10"
          style={{ fontFamily: 'var(--font-inter)' }}
          role="menuitem"
          onClick={handleItemClick(onLogout)}
        >
          <Icon name="back" className="h-4 w-4 shrink-0" />
          Log out
        </button>
      </div>
    </MenuSurface>
  );
}

