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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  onRowActionSelect?: (action: string, item: TData) => void
  actionItems?: {
    label: string
    action: string
  }[]
  isHierarchical?: boolean
  getRowType?: (item: TData) => 'parent' | 'child'
}

export function CustomDataTable<TData>({
  data,
  columns: userColumns,
  onRowActionSelect,
  isHierarchical = false,
  getRowType,
  actionItems = [],
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 8,
  })

  // Add selection column if showSelection is true
  const columns = React.useMemo(() => {
    const serialNumberColumn: ColumnDef<TData> = {
      id: "serialNumber",
      header: "S.No",
      cell: ({ row, table }) => {
        // Handle hierarchical numbering
        if (isHierarchical && getRowType) {
          const rowType = getRowType(row.original);
          if (rowType === 'child') return null;

          // Get all parent rows
          const parentRows = table.getFilteredRowModel().rows.filter(
            r => getRowType(r.original) === 'parent'
          );

          // Find index of current parent row
          const parentIndex = parentRows.findIndex(
            r => r.original === row.original
          );

          return <div className="text-center">{parentIndex + 1}</div>;
        }

        // Default numbering
        return <div className="text-center">{row.index + 1}</div>;
      },
      enableSorting: false,
      enableHiding: false,
    };


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
    finalColumns.push(...userColumns)
    if (actionItems.length > 0) {
      finalColumns.push(actionsColumn)
    }
    return finalColumns
  }, [userColumns, actionItems, onRowActionSelect, isHierarchical, getRowType])

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
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
    },
  })


  return (
    <div className="w-full">
      <div className="flex items-center py-4">
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
    </div>
  )
}
