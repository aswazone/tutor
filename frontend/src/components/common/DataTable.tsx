import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {  ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface DataTableProps<TData> {
  data: TData[]
  columns: ColumnDef<TData>[]
  filterColumn?: string
  filterPlaceholder?: string
  onRowActionSelect?: (action: string, item: TData) => void
  actionItems?: {
    label: string
    action: string
  }[]
  showSelection?: boolean
  onSelectionChange?: (selectedItems: TData[]) => void
}

export function DataTable<TData>({
  data,
  columns: userColumns,
  filterColumn,
  filterPlaceholder = "Filter...",
  onRowActionSelect,
  actionItems = [],
  showSelection = false,
  onSelectionChange,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 8,
  })

  // Add selection column if showSelection is true
  const columns = React.useMemo(() => {
    const serialNumberColumn: ColumnDef<TData> = {
      id: "serialNumber",
      header: "S.No",
      cell: ({ row }) => {
        return <div className="text-center">{pagination.pageIndex * pagination.pageSize + row.index + 1}</div>;
      },
      enableSorting: false,
      enableHiding: false,
    };

    const selectionColumn: ColumnDef<TData> = {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    }

    // Add actions column if actionItems are provided
    const actionsColumn: ColumnDef<TData> = {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const item = row.original

        return actionItems.length > 0 ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              {actionItems.map((actionItem, index) => (
                <React.Fragment key={actionItem.action}>
                  <DropdownMenuItem
                    onClick={() => onRowActionSelect?.(actionItem.action, item)}
                  >
                    {actionItem.label}
                  </DropdownMenuItem>
                  {index < actionItems.length - 1 && <DropdownMenuSeparator />}
                </React.Fragment>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null
      },
    }

    const finalColumns: ColumnDef<TData>[] = [serialNumberColumn]
    if (showSelection) {
      finalColumns.push(selectionColumn)
    }
    finalColumns.push(...userColumns)
    if (actionItems.length > 0) {
      finalColumns.push(actionsColumn)
    }
    return finalColumns
  }, [userColumns, showSelection, actionItems, onRowActionSelect, pagination.pageIndex, pagination.pageSize])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  })

  // Update parent component when selection changes
  React.useEffect(() => {
    if (onSelectionChange) {
      const selectedRows = table
        .getSelectedRowModel()
        .rows.map((row) => row.original)
      onSelectionChange(selectedRows)
    }
  }, [rowSelection, table, onSelectionChange])

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        {filterColumn && (
          <Input
            placeholder={filterPlaceholder}
            value={(table.getColumn(filterColumn)?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn(filterColumn)?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-b-md border">
        <Table>
          <TableHeader className="bg-gradient-to-b from-sky-800/30 via-sky-900/70 to-sky-800/30">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} >
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-center">
                    <span className="font-bold">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </span>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="text-center"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        {showSelection && (
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
        )}
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
