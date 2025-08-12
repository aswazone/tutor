import { Button } from "@/components/ui/button";

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}: {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}) {
  const pageCount = Math.ceil(total / pageSize);
  const pages = [];

  // Create page buttons (show max 5, with ... if many)
  let start = Math.max(1, page - 2);
  const end = Math.min(pageCount, start + 4);
  if (end - start < 4) start = Math.max(1, end - 4);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex items-center justify-end gap-2">
      <Button size="icon" variant="outline" disabled={page === 1} onClick={() => onPageChange(page - 1)}>
        &lt;
      </Button>
      {start > 1 && (
        <>
          <Button size="icon" variant="ghost" onClick={() => onPageChange(1)}>1</Button>
          {start > 2 && <span className="px-2">...</span>}
        </>
      )}
      {pages.map(p => (
        <Button
          key={p}
          size="icon"
          variant={p === page ? "default" : "outline"}
          onClick={() => onPageChange(p)}
        >
          {p}
        </Button>
      ))}
      {end < pageCount && (
        <>
          {end < pageCount - 1 && <span className="px-2">...</span>}
          <Button size="icon" variant="ghost" onClick={() => onPageChange(pageCount)}>{pageCount}</Button>
        </>
      )}
      <Button size="icon" variant="outline" disabled={page === pageCount} onClick={() => onPageChange(page + 1)}>
        &gt;
      </Button>
      {onPageSizeChange && (
        <select
          value={pageSize}
          onChange={e => onPageSizeChange(Number(e.target.value))}
          className="ml-4 border rounded bg-background px-2 min-w-[70px] h-8"
        >
          {[5, 8, 15, 20, 50].map(s => (
            <option key={s} value={s}>{s}/page</option>
          ))}
        </select>
      )}
      <span className="ml-2 text-muted-foreground text-xs">{total} total</span>
    </div>
  );
}
