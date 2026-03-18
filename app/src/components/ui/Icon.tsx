import { Search } from 'lucide-react';

type IconProps = { name: string; className?: string; strokeWidth?: number };

export function Icon({ name, className, strokeWidth }: IconProps) {
  const c = className ?? "h-5 w-5";
  const sw = strokeWidth ?? 1.5;
  switch (name) {
    case "search":
      return <Search className={c} strokeWidth={sw} />;
    case "screener":
      return (
        <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
      );
    case "trends":
      return (
        <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      );
    case "chart":
      return (
        <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4v16" />
        </svg>
      );
    case "bookmark":
      return (
        <svg className={c} fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" clipRule="evenodd" />
        </svg>
      );
    case "list":
      return (
        <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M5.29004 15.4803L7.73581 17.7263L12.4016 11.2227" strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} />
          <path d="M16.4135 11.9036H20M16.036 11.9036H19.6225M4 6.21875H19.9996M13.5437 17.7801H19.9997" strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} />
        </svg>
      );
    case "dots":
      return (
        <svg className={c} fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="6" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="12" cy="18" r="1.5" />
        </svg>
      );
    case "options":
      return (
        <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd" d="M7.2917 20.0014C5.92604 20.0014 4.81836 18.8937 4.81836 17.528C4.81836 16.1624 5.92604 15.0547 7.2917 15.0547C8.65735 15.0547 9.76503 16.1624 9.76503 17.528C9.76503 18.8937 8.65735 20.0014 7.2917 20.0014Z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} />
          <path fillRule="evenodd" clipRule="evenodd" d="M16.7097 14.4076C15.344 14.4076 14.2363 13.2999 14.2363 11.9343C14.2363 10.5686 15.344 9.46094 16.7097 9.46094C18.0753 9.46094 19.183 10.5686 19.183 11.9343C19.183 13.2999 18.0753 14.4076 16.7097 14.4076Z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} />
          <path d="M16.7284 14.4062V15.5752C16.7284 16.6838 15.8302 17.582 14.7217 17.582H9.76562" strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} />
          <path fillRule="evenodd" clipRule="evenodd" d="M7.2917 8.94667C5.92604 8.94667 4.81836 7.83899 4.81836 6.47334C4.81836 5.10768 5.92604 4 7.2917 4C8.65735 4 9.76503 5.10768 9.76503 6.47334C9.76503 7.83899 8.65735 8.94667 7.2917 8.94667Z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} />
          <path d="M7.29102 8.94531V15.052" strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} />
        </svg>
      );
    case "settings":
    case "factory":
      return (
        <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case "filter":
      return (
        <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
      );
    case "plus":
      return (
        <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d="M12 4v16m8-8H4" />
        </svg>
      );
    case "compass":
      return (
        <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      );
    case "lightning":
      return (
        <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
    case "brain":
      return (
        <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      );
    case "bank":
      return (
        <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      );
    case "grid":
      return (
        <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      );
    case "grip":
      return (
        <svg className={c} fill="currentColor" viewBox="0 0 24 24">
          <circle cx="9" cy="6" r="1.5" />
          <circle cx="9" cy="12" r="1.5" />
          <circle cx="9" cy="18" r="1.5" />
          <circle cx="15" cy="6" r="1.5" />
          <circle cx="15" cy="12" r="1.5" />
          <circle cx="15" cy="18" r="1.5" />
        </svg>
      );
    case "briefcase":
      return (
        <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      );
    case "chip":
      return (
        <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="4" y="6" width="16" height="12" rx="2" ry="2" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d="M8 10h5M8 14h3" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d="M16 14h.01" />
        </svg>
      );
    case "stethoscope":
      return (
        <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      );
    case "dna":
      return (
        <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      );
    case "globe":
      return (
        <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0h.5a2.5 2.5 0 002.5-2.5V3.935M12 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case "battery":
      return (
        <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
    case "shield":
      return (
        <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
    case "bricks":
      return (
        <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      );
    case "bags":
      return (
        <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      );
    case "plane":
      return (
        <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      );
    case "bell":
      return (
        <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      );
    case "bell-minus":
      return (
        <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M6.7398 16.6165C5.51582 16.13 4.88535 15.3118 4.77832 13.9983C4.77832 11.3879 6.34381 11.5494 6.34381 8.3464C6.34381 5.84395 8.62053 3 12.1125 3C14.5517 3 16.3876 4.38549 17.2876 6.06871" strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} />
          <path d="M17.9691 9.53711C18.298 11.5609 19.448 11.7662 19.448 13.9981C19.232 16.6173 16.9816 17.2653 12.1129 17.2653C11.4075 17.2653 10.7605 17.2536 10.168 17.2205" strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} />
          <path d="M10.0459 19.9736C10.5499 20.6031 11.3059 21.0001 12.1426 21.0001C12.9891 21.0001 13.7451 20.6031 14.2491 19.9736" strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} />
          <path d="M4.38672 18.9738L19.6145 3.74609" strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} />
        </svg>
      );
    case "bell-ring":
      return (
        <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd" d="M12.0013 17.3556C7.25587 17.3556 5.06075 16.7211 4.84863 14.1728C4.84863 11.6274 6.37919 11.7899 6.37919 8.66555C6.37919 6.22426 8.59766 3.44824 12.0013 3.44824C15.4049 3.44824 17.6234 6.22426 17.6234 8.66458C17.6234 11.7889 19.1539 11.6255 19.1539 14.1728C18.9408 16.7299 16.7457 17.3556 12.0013 17.3556Z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} />
          <path d="M9.98438 20C10.4757 20.614 11.2133 21.0003 12.0287 21.0003C12.8538 21.0003 13.5913 20.614 14.0827 20" strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} />
          <path d="M6.07171 3.00781C5.124 3.92926 4.43024 5.04433 4.04492 6.20222" strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} />
          <path d="M19.9555 6.21192C19.5692 5.05306 18.8764 3.9302 17.9199 3" strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} />
        </svg>
      );
    case "help":
      return (
        <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case "gift":
      return (
        <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d="M20 12v8H4v-8M2 7h20v5H2V7zM12 22V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" />
        </svg>
      );
    case "profile":
      return (
        <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d="M12 12a4 4 0 100-8 4 4 0 000 8z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d="M4 20a8 8 0 1116 0H4z" />
        </svg>
      );
    case "pencil":
      return (
        <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
        </svg>
      );
    case "edit":
      return (
        <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d="M4 16.5V19a1 1 0 001 1h2.5a1 1 0 00.707-.293L18.5 9.414a2 2 0 000-2.828L16.414 4.5a2 2 0 00-2.828 0L5.707 12.379A1 1 0 005.414 13L4 16.5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d="M13.5 6L18 10.5" />
        </svg>
      );
    case "trash":
      return (
        <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
      );
    case "copy":
      return (
        <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
        </svg>
      );
    case "duplicate":
      return (
        <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
        </svg>
      );
    case "ticker":
      return (
        <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d="M7 12h14M7 8h14M7 16h14M4 12h.01M4 8h.01M4 16h.01" />
        </svg>
      );
    case "event":
      return (
        <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M3.98389 9.66447H20.0253" strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} />
          <path d="M15.6388 3V5.96174" strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} />
          <path d="M8.36832 3V5.96174" strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} />
          <path fillRule="evenodd" clipRule="evenodd" d="M15.8145 4.42139H8.19413C5.55056 4.42139 3.90039 5.8935 3.90039 8.59935V16.7451C3.90039 19.4938 5.55056 20.9999 8.19413 20.9999H15.8067C18.4581 20.9999 20.1004 19.52 20.1004 16.8132V8.59935C20.1082 5.8935 18.4658 4.42139 15.8145 4.42139Z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} />
          <path d="M14.2495 15.0766H9.74951" strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} />
        </svg>
      );
    case "news":
      return (
        <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M7.06405 19.9023L6.30417 20.2661C5.50537 20.6485 4.58106 20.0657 4.58203 19.1793L4.59176 6.92492C4.59176 4.50225 5.93931 3 8.35809 3H15.6572C18.0818 3 19.4002 4.50225 19.4002 6.92492L19.4177 19.1774C19.4187 20.0638 18.4944 20.6475 17.6946 20.2642L16.9406 19.9032C16.4872 19.6853 15.9627 19.6697 15.4967 19.8604L13.3503 20.7351C12.4854 21.0883 11.5153 21.0883 10.6504 20.7351L8.50792 19.8604C8.04188 19.6697 7.51745 19.6853 7.06405 19.9023Z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} />
          <path d="M14.8287 14.1972H9.17188M14.8287 9.80273H9.17188" strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} />
        </svg>
      );
    case "snapshot":
      return (
        <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M6.78418 21.001H17.2156C19.0506 21.001 20.5373 19.5133 20.5373 17.6792V10.5054C20.5373 9.61412 20.1365 8.77054 19.4456 8.20718L13.8714 3.66723C12.7817 2.77889 11.2181 2.77889 10.1283 3.66723L4.55409 8.20718C3.86327 8.77054 3.4624 9.61412 3.4624 10.5054V17.6792C3.4624 19.5133 4.94913 21.001 6.78418 21.001Z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} />
          <path d="M7.62451 15.9072L10.4299 12.2621L13.6299 14.7746L16.3751 11.2313" strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} />
        </svg>
      );
    case "darkpool":
      return (
        <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M18.4677 8.88589C18.7421 9.69051 18.891 10.5535 18.891 11.4515C18.891 15.8395 15.3339 19.3975 10.946 19.3975C6.55705 19.3975 3 15.8395 3 11.4515C3 7.06358 6.55705 3.50653 10.946 3.50653C12.4258 3.50653 13.8122 3.91127 14.9992 4.61665" strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} />
          <path d="M20.8961 6.3252L15.0245 11.7795L12.4861 9.02217L8.23047 13.0385" strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} />
          <path d="M18.0527 6.17284L20.9959 6.16895L21.0007 9.1111" strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} />
          <path d="M16.3535 17.2705L19.5866 20.4948" strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} />
        </svg>
      );
    case "back":
      return (
        <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d="M15 19L8 12L15 5" />
        </svg>
      );
    case "logout":
      return (
        <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d="M10 6H6a2 2 0 00-2 2v8a2 2 0 002 2h4" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d="M14 16l4-4-4-4" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d="M18 12H9" />
        </svg>
      );
    case "pin-top":
      return (
        <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d="M4 4h16M12 20V8M9 11l3-3 3 3" />
        </svg>
      );
    case "pin-bottom":
      return (
        <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d="M4 20h16M12 4v12M9 13l3 3 3-3" />
        </svg>
      );
    default:
      return <span className={c} />;
  }
}
