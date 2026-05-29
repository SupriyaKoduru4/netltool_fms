import { useState } from "react";

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (value: unknown, row: T) => React.ReactNode;
  width?: string;
}

interface CustomTableProps<T> {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
  title?: string;
  subtitle?: string;
  onRowClick?: (row: T) => void;
}

function getValue<T>(row: T, key: string): unknown {
  return key.split(".").reduce((obj, k) => (obj as Record<string, unknown>)?.[k], row as unknown);
}

function CustomTable<T extends Record<string, unknown>>({
  data,
  columns,
  pageSize = 8,
  title,
  subtitle,
  onRowClick,
}: CustomTableProps<T>) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  // Search filter
  const filtered = data.filter((row) =>
    columns.some((col) => {
      const val = getValue(row, col.key as string);
      return String(val ?? "").toLowerCase().includes(search.toLowerCase());
    })
  );

  // Sort
  const sorted = sortKey
    ? [...filtered].sort((a, b) => {
        const av = String(getValue(a, sortKey) ?? "");
        const bv = String(getValue(b, sortKey) ?? "");
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      })
    : filtered;

  // Paginate
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginated = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const pageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safePage > 3) pages.push("...");
      for (let i = Math.max(2, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++) pages.push(i);
      if (safePage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">

      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          {title && <h2 className="text-base font-semibold text-gray-900">{title}</h2>}
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 w-full sm:w-64 focus-within:border-gray-400 focus-within:ring-2 focus-within:ring-gray-100 transition-all">
          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={handleSearch}
            className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
          />
          {search && (
            <button onClick={() => { setSearch(""); setPage(1); }} className="text-gray-400 hover:text-gray-600">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {columns.map((col) => (
                <th
                  key={col.key as string}
                  style={col.width ? { width: col.width } : {}}
                  onClick={() => handleSort(col.key as string)}
                  className="px-6 py-3 text-left text-[11px] font-medium uppercase tracking-widest text-gray-400 cursor-pointer select-none whitespace-nowrap group hover:text-gray-700 transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    {col.label}
                    <span className="flex flex-col gap-[1px] opacity-40 group-hover:opacity-100 transition-opacity">
                      <svg
                        className={`w-2.5 h-2.5 transition-colors ${sortKey === col.key && sortDir === "asc" ? "text-gray-800" : "text-gray-400"}`}
                        viewBox="0 0 10 6" fill="currentColor"
                      >
                        <path d="M5 0L9.33 6H0.67L5 0z" />
                      </svg>
                      <svg
                        className={`w-2.5 h-2.5 transition-colors ${sortKey === col.key && sortDir === "desc" ? "text-gray-800" : "text-gray-400"}`}
                        viewBox="0 0 10 6" fill="currentColor"
                      >
                        <path d="M5 6L0.67 0H9.33L5 6z" />
                      </svg>
                    </span>
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                    </svg>
                    <p className="text-sm font-medium">No results found</p>
                    <p className="text-xs">Try adjusting your search</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginated.map((row, i) => (
                <tr
                  key={i}
                  onClick={() => onRowClick?.(row)}
                  className={`transition-colors duration-100 ${onRowClick ? "cursor-pointer" : ""} hover:bg-gray-50 group`}
                >
                  {columns.map((col) => (
                    <td key={col.key as string} className="px-6 py-3.5 text-gray-700 whitespace-nowrap">
                      {col.render
                        ? col.render(getValue(row, col.key as string), row)
                        : (
                          <span className="text-sm text-gray-700">
                            {String(getValue(row, col.key as string) ?? "—")}
                          </span>
                        )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
      <div className="px-6 py-3.5 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-gray-400">
          Showing{" "}
          <span className="font-medium text-gray-600">
            {sorted.length === 0 ? 0 : (safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, sorted.length)}
          </span>{" "}
          of <span className="font-medium text-gray-600">{sorted.length}</span> results
        </p>

        <div className="flex items-center gap-1">
          {/* Prev */}
          <button
            disabled={safePage === 1}
            onClick={() => setPage((p) => p - 1)}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          {/* Page numbers */}
          {pageNumbers().map((p, idx) =>
            p === "..." ? (
              <span key={`ellipsis-${idx}`} className="w-8 h-8 flex items-center justify-center text-xs text-gray-400">
                …
              </span>
            ) : (
              <button
                key={p}
                onClick={() => setPage(p as number)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                  safePage === p
                    ? "bg-gray-900 text-white"
                    : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {p}
              </button>
            )
          )}

          {/* Next */}
          <button
            disabled={safePage === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CustomTable;