'use client';

import Link from 'next/link';
import type { NavItem } from '@/data/watchlists';
import { Icon } from '@/components/ui/Icon';

type HeaderProps = {
  topNav: NavItem[];
  selectedTopNav: string | null;
  onSelectTopNav: (label: string) => void;
  layoutMode?: boolean;
  onEditLayoutClick?: () => void;
  onDrawerButtonClick?: () => void;
  /** 点击 logo 时调用（回到主页，关闭当前 view） */
  onLogoClick?: () => void;
  /** 为 true 时不显示 nav 底边（例如在 Watchlists 页面） */
  hideBorder?: boolean;
  /** 点击头像时调用，用于打开 popover */
  onAvatarClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** 头像 popover 是否打开（用于 aria-expanded） */
  avatarPopoverOpen?: boolean;
};

export function Header({
  topNav,
  selectedTopNav,
  onSelectTopNav,
  layoutMode = false,
  onEditLayoutClick,
  onDrawerButtonClick,
  onLogoClick,
  hideBorder,
  onAvatarClick,
  avatarPopoverOpen,
}: HeaderProps) {
  return (
    <header
      className="relative z-10 flex min-h-[52px] shrink-0 items-center gap-6 border-b border-[#27272d] bg-[var(--app-bg)] px-4 py-3"
    >
      {false ? (
      <div className="flex shrink-0 items-center gap-6">
        <Link
          href="/"
          className="shrink-0 cursor-pointer"
          aria-label="回到主页"
          onClick={onLogoClick}
        >
          <img
            src="/logo.svg"
            alt=""
            className="h-9 w-auto object-contain object-left transition-[transform] duration-150 ease active:scale-[0.98]"
            width={28}
            height={32}
          />
        </Link>
        <nav className="flex shrink-0 items-center" aria-label="主导航">
          <div className="top-nav-tabs flex items-center gap-4">
            {topNav.map((item) => (
              <button
                key={item.label}
                type="button"
                data-nav-item
                data-selected={selectedTopNav === item.label ? 'true' : 'false'}
                onClick={() => onSelectTopNav(item.label)}
                className="flex cursor-pointer items-center rounded-none px-0 py-0 text-[13px] font-medium outline-none transition-[background-color,color] duration-[280ms] ease-[cubic-bezier(0.4,0,0.2,1)] focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#444444] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1C1C1E]"
              >
                {item.label}
              </button>
            ))}
          </div>
        </nav>
      </div>
      ) : null}
      <div className="absolute left-1/2 top-1/2 z-10 flex w-[360px] -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 transition-colors focus-within:border-white/25 focus-within:bg-white/10">
        <Icon name="search" className="h-4 w-4 shrink-0 text-white/40" />
        <input
          type="search"
          placeholder=""
          aria-label="Search"
          className="min-w-0 flex-1 bg-transparent text-[13px] text-[#F2F2F7] placeholder:text-white/40 outline-none"
          style={{ fontFamily: "var(--font-inter)" }}
        />
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <div className="flex shrink-0 items-center gap-[4px]" aria-label="工具">
          <button
            type="button"
            aria-label="Edit layout"
            className={`flex h-7 items-center justify-center rounded-full border px-3 text-[12px] font-medium outline-none transition-[background-color,border-color,transform] duration-150 hover:scale-[0.98] focus-visible:ring-2 focus-visible:ring-white/25 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-bg)] ${
              layoutMode
                ? 'border-[#D7FF64] bg-[#D7FF64] text-[#111111]'
                : 'border-white/10 bg-white/[0.04] text-[#F2F2F7] hover:border-white/15 hover:bg-white/[0.08]'
            }`}
            style={{ fontFamily: 'var(--font-inter)' }}
            onClick={onEditLayoutClick}
          >
            Edit layout
          </button>
          {false ? (
          <>
          <button
            type="button"
            aria-label="帮助"
            className="flex h-fit w-fit items-center justify-center rounded-lg p-[5px] text-[#F2F2F7] outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#444444] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-bg)]"
          >
            <Icon name="help" className="h-[18px] w-[18px]" />
          </button>
          <button
            type="button"
            aria-label="礼物"
            className="flex h-fit w-fit items-center justify-center rounded-lg p-[5px] text-[#F2F2F7] outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#444444] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-bg)]"
          >
            <Icon name="gift" className="h-[18px] w-[18px]" />
          </button>
          <button
            type="button"
            aria-label="通知"
            className="flex h-fit w-fit items-center justify-center rounded-lg p-[5px] text-[#F2F2F7] outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#444444] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-bg)]"
          >
            <Icon name="bell" className="h-[18px] w-[18px]" />
          </button>
          </>
          ) : null}
        </div>
      </div>
      <div className="ml-auto flex shrink-0 items-center gap-3">
        <button
          type="button"
          aria-label="Open drawer"
          className="flex h-7 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-3 text-[12px] font-medium text-[#F2F2F7] outline-none transition-[background-color,border-color,transform] duration-150 hover:border-white/15 hover:bg-white/[0.08] hover:scale-[0.98] focus-visible:ring-2 focus-visible:ring-white/25 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-bg)]"
          style={{ fontFamily: 'var(--font-inter)' }}
          onClick={onDrawerButtonClick}
        >
          AI chat
        </button>
        {false ? (
        <button
          type="button"
          aria-label="用户"
          aria-expanded={avatarPopoverOpen ?? false}
          aria-haspopup="menu"
          className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/15 ring-1 ring-white/20 outline-none transition-[transform,colors] duration-150 hover:scale-95 hover:bg-white/20 hover:ring-white/30 focus-visible:ring-2 focus-visible:ring-[#444444] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-bg)]"
          onClick={onAvatarClick}
        >
          <img
            src="/profile-avatar.png"
            alt=""
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = '';
            }}
          />
          <span
            className="text-[11px] font-medium text-[#F2F2F7]"
            style={{ fontFamily: "var(--font-inter)", display: 'none' }}
            aria-hidden
          >
            U
          </span>
        </button>
        ) : null}
      </div>
    </header>
  );
}
