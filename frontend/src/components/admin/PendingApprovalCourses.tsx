import { ColumnDef } from "@tanstack/react-table"
import { Check, X, ArrowUpDown, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/common/DataTable"
import { Badge } from "@/components/ui/badge"

export interface Course {
  id: string
  title: string
  tutor: string
  category: string
  price: string
  enrollments: number
  rating: number
  status: "draft" | "published" | "archived"
  thumbnailKey: string
  level: string
  isVerified: string
  isActive: boolean
}

interface PendingApprovalCoursesProps {
  courses: Course[];
  setIsDetailsOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedCourse: React.Dispatch<React.SetStateAction<Course | null>>}

export function PendingApprovalCourses({ courses, setIsDetailsOpen, setSelectedCourse }: PendingApprovalCoursesProps) {
  

  const columns: ColumnDef<Course>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Title
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "tutor",
      header: "Tutor",
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => <Badge variant="outline">{row.getValue("category")}</Badge>,
    },
    {
      accessorKey: "price",
      header: "Price",
    },
    {
      accessorKey: "isActive",
      header: "Active",
      cell: ({ row }) => (
        <div className="flex justify-center">
          {row.getValue("isActive") ? (
            <Check className="h-5 w-5 text-green-500" />
          ) : (
            <X className="h-5 w-5 text-red-500" />
          )}
        </div>
      ),
    },
    {
      accessorKey: "isVerified",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.getValue("isVerified") === "rejected" ? "destructive" : "outline"}>
          {row.getValue("isVerified")}
        </Badge>
      ),
    },
    {
      header: "Details",
      id: "details",
      cell: ({ row }) => {
        const course = row.original;
        return (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              console.log("View course details:", course);
              setSelectedCourse(course);
              setIsDetailsOpen(true);
            }}
            className="hover:bg-sky-500/20 text-sky-500"
          >
            <FileText className="h-4 w-4" />
          </Button>
        );
      },
    },
  ];

  return (
    <div className="w-full">
      <DataTable columns={columns} data={courses} />
    </div>
  );
};
