import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  showTotal?: boolean;
  totalItems?: number;
  itemsPerPage?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  showTotal = true,
  totalItems,
  itemsPerPage = 10,
}: PaginationProps) {
  // Generate page numbers to show
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  return (
    <div className={cn("flex items-center justify-between px-2", className)}>
      {showTotal && totalItems !== undefined && (
        <div className="text-sm text-muted-foreground">
          Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} to{" "}
          {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
        </div>
      )}
      <div className="flex items-center space-x-2 ml-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-8 w-8 p-0 backdrop-blur-md backdrop-filter border-sky-900/20 hover:bg-sky-900/10"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <div className="flex items-center space-x-1">
          {getPageNumbers().map((pageNumber, idx) => (
            <Button
              key={idx}
              variant={pageNumber === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() =>
                typeof pageNumber === "number" && onPageChange(pageNumber)
              }
              disabled={typeof pageNumber !== "number"}
              className={cn(
                "h-8 w-8 p-0 backdrop-blur-md backdrop-filter",
                typeof pageNumber !== "number"
                  ? "cursor-default border-transparent hover:bg-transparent"
                  : pageNumber === currentPage
                  ? "bg-sky-900/80 hover:bg-sky-900/60 text-white border-transparent"
                  : "border-sky-900/20 hover:bg-sky-900/10"
              )}
            >
              {pageNumber}
            </Button>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-8 w-8 p-0 backdrop-blur-md backdrop-filter border-sky-900/20 hover:bg-sky-900/10"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
