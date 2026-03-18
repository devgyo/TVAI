'use client';

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import Image from 'next/image';
import { tableList, type Stock } from '@/data/stocks';
import { VIEW_PANEL_TITLE_FONT } from '@/constants/view-panel-style';

const FONT = VIEW_PANEL_TITLE_FONT;

function formatPrice(n: number): string {
  if (n >= 1) return n.toFixed(2);
  if (n >= 0.01) return n.toFixed(4);
  return n.toFixed(6);
}

function formatPercent(n: number, signed = false): string {
  const s = n >= 0 ? `+${n.toFixed(2)}` : n.toFixed(2);
  return signed ? `${s}%` : `${n.toFixed(2)}%`;
}

function formatCompact(n: number): string {
  if (n >= 1e12) return `${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(2)}K`;
  return String(n);
}

const columnHelper = createColumnHelper<Stock>();

const columns = [
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (info) => {
      const row = info.row.original;
      return (
        <div className="flex items-center gap-2">
          {row.logo ? (
            <Image
              src={row.logo}
              alt=""
              width={24}
              height={24}
              className="h-6 w-6 shrink-0 rounded-full object-contain"
            />
          ) : null}
          <span className="truncate text-[#F2F2F7]" style={{ fontFamily: FONT }}>
            {info.getValue()}
          </span>
        </div>
      );
    },
  }),
  columnHelper.accessor('code', {
    header: 'Code',
    cell: (info) => (
      <span className="font-medium text-[#F2F2F7]" style={{ fontFamily: FONT }}>
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor('price', {
    header: 'Price',
    cell: (info) => (
      <span className="text-[#F2F2F7]" style={{ fontFamily: FONT }}>
        {formatPrice(info.getValue())}
      </span>
    ),
  }),
  columnHelper.display({
    id: 'change',
    header: 'Change %',
    cell: (info) => {
      const row = info.row.original;
      const pct = row.risePercent ? row.risePercent : row.fallPercent ? -row.fallPercent : 0;
      const isUp = pct >= 0;
      return (
        <span
          className={isUp ? 'text-[#34C759]' : 'text-[#FF3B30]'}
          style={{ fontFamily: FONT }}
        >
          {formatPercent(pct, true)}
        </span>
      );
    },
  }),
  columnHelper.accessor('open', {
    header: 'Open',
    cell: (info) => {
      const v = info.getValue();
      return v != null ? (
        <span className="text-[#A1A1AA]" style={{ fontFamily: FONT }}>
          {formatPrice(v)}
        </span>
      ) : (
        <span className="text-white/40">—</span>
      );
    },
  }),
  columnHelper.accessor('high', {
    header: 'High',
    cell: (info) => {
      const v = info.getValue();
      return v != null ? (
        <span className="text-[#34C759]" style={{ fontFamily: FONT }}>
          {formatPrice(v)}
        </span>
      ) : (
        <span className="text-white/40">—</span>
      );
    },
  }),
  columnHelper.accessor('low', {
    header: 'Low',
    cell: (info) => {
      const v = info.getValue();
      return v != null ? (
        <span className="text-[#FF3B30]" style={{ fontFamily: FONT }}>
          {formatPrice(v)}
        </span>
      ) : (
        <span className="text-white/40">—</span>
      );
    },
  }),
  columnHelper.accessor('volume', {
    header: 'Volume',
    cell: (info) => {
      const v = info.getValue();
      return v != null ? (
        <span className="text-[#A1A1AA]" style={{ fontFamily: FONT }}>
          {formatCompact(v)}
        </span>
      ) : (
        <span className="text-white/40">—</span>
      );
    },
  }),
  columnHelper.accessor('marketCap', {
    header: 'Market Cap',
    cell: (info) => {
      const v = info.getValue();
      return v != null ? (
        <span className="text-[#A1A1AA]" style={{ fontFamily: FONT }}>
          {formatCompact(v)}
        </span>
      ) : (
        <span className="text-white/40">—</span>
      );
    },
  }),
  columnHelper.accessor('pe', {
    header: 'P/E',
    cell: (info) => {
      const v = info.getValue();
      return v != null ? (
        <span className="text-[#A1A1AA]" style={{ fontFamily: FONT }}>
          {v.toFixed(1)}
        </span>
      ) : (
        <span className="text-white/40">—</span>
      );
    },
  }),
  columnHelper.accessor('pb', {
    header: 'P/B',
    cell: (info) => {
      const v = info.getValue();
      return v != null ? (
        <span className="text-[#A1A1AA]" style={{ fontFamily: FONT }}>
          {v.toFixed(2)}
        </span>
      ) : (
        <span className="text-white/40">—</span>
      );
    },
  }),
  columnHelper.accessor('fiftyTwoWeekHigh', {
    header: '52W High',
    cell: (info) => {
      const v = info.getValue();
      return v != null ? (
        <span className="text-[#A1A1AA]" style={{ fontFamily: FONT }}>
          {formatPrice(v)}
        </span>
      ) : (
        <span className="text-white/40">—</span>
      );
    },
  }),
  columnHelper.accessor('fiftyTwoWeekLow', {
    header: '52W Low',
    cell: (info) => {
      const v = info.getValue();
      return v != null ? (
        <span className="text-[#A1A1AA]" style={{ fontFamily: FONT }}>
          {formatPrice(v)}
        </span>
      ) : (
        <span className="text-white/40">—</span>
      );
    },
  }),
  columnHelper.accessor('beta', {
    header: 'Beta',
    cell: (info) => {
      const v = info.getValue();
      return v != null ? (
        <span className="text-[#A1A1AA]" style={{ fontFamily: FONT }}>
          {v.toFixed(2)}
        </span>
      ) : (
        <span className="text-white/40">—</span>
      );
    },
  }),
  columnHelper.accessor('oneDayReturn', {
    header: '1D %',
    cell: (info) => {
      const v = info.getValue();
      if (v == null) return <span className="text-white/40">—</span>;
      const isUp = v >= 0;
      return (
        <span
          className={isUp ? 'text-[#34C759]' : 'text-[#FF3B30]'}
          style={{ fontFamily: FONT }}
        >
          {formatPercent(v, true)}
        </span>
      );
    },
  }),
  columnHelper.accessor('oneWeekReturn', {
    header: '1W %',
    cell: (info) => {
      const v = info.getValue();
      if (v == null) return <span className="text-white/40">—</span>;
      const isUp = v >= 0;
      return (
        <span
          className={isUp ? 'text-[#34C759]' : 'text-[#FF3B30]'}
          style={{ fontFamily: FONT }}
        >
          {formatPercent(v, true)}
        </span>
      );
    },
  }),
  columnHelper.accessor('oneMonthReturn', {
    header: '1M %',
    cell: (info) => {
      const v = info.getValue();
      if (v == null) return <span className="text-white/40">—</span>;
      const isUp = v >= 0;
      return (
        <span
          className={isUp ? 'text-[#34C759]' : 'text-[#FF3B30]'}
          style={{ fontFamily: FONT }}
        >
          {formatPercent(v, true)}
        </span>
      );
    },
  }),
  columnHelper.accessor('oneYearReturn', {
    header: '1Y %',
    cell: (info) => {
      const v = info.getValue();
      if (v == null) return <span className="text-white/40">—</span>;
      const isUp = v >= 0;
      return (
        <span
          className={isUp ? 'text-[#34C759]' : 'text-[#FF3B30]'}
          style={{ fontFamily: FONT }}
        >
          {formatPercent(v, true)}
        </span>
      );
    },
  }),
];

type TradesTableProps = {
  borderColor: string;
  backgroundColor: string;
};

export function TradesTable({ borderColor, backgroundColor }: TradesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const data = useMemo(() => tableList, []);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div
      className="flex h-full min-h-0 flex-col overflow-hidden rounded-[16px] border"
      style={{
        borderColor,
        backgroundColor,
        fontFamily: FONT,
      }}
    >
      <div className="scrollbar-invisible flex-1 min-h-0 overflow-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead className="sticky top-0 z-10 shrink-0" style={{ backgroundColor }}>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="whitespace-nowrap border-b px-3 py-2.5 text-left text-[12px] font-semibold uppercase tracking-wide text-[#A1A1AA]"
                    style={{ borderColor }}
                  >
                    {header.column.getCanSort() ? (
                      <button
                        type="button"
                        className="flex items-center gap-1 outline-none hover:text-[#F2F2F7] focus-visible:ring-2 focus-visible:ring-[#444444] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1C1C1E]"
                        onClick={() => header.column.toggleSorting()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </button>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="transition-colors duration-[280ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-white/5"
                style={{ borderBottom: `1px solid ${borderColor}` }}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="whitespace-nowrap px-3 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
