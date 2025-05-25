import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/common/DataTable"
import { Badge } from "@/components/ui/badge"
import axiosInstance from "@/config/axios.config"
import { toast } from "sonner"

export interface Course {
  id: string
  title: string
  tutor: string
  category: string
  isActive: boolean
  thumbnailKey: string;
  level: string;
  isVerified: boolean;
  price: string
  enrollments: number
  rating: number
  status: "draft" | "published" | "archived"
}

const columns: ColumnDef<Course>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
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
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"))
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(price)
    },
  },
  {
    accessorKey: "enrollments",
    header: "Enrollments",
    cell: ({ row }) => (
      <Badge variant="secondary" className="w-full justify-center">
        {row.getValue("enrollments")}
      </Badge>
    ),
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => {
      const rating = parseFloat(row.getValue("rating"))
      return <div className="text-center">{rating.toFixed(1)}</div>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const variants: { [key: string]: 'outline' | 'secondary' | 'destructive' } = {
        published: "outline",
        draft: "secondary",
        archived: "destructive",
      }
      return (
        <Badge
          variant={variants[status]}
          className="w-full justify-center"
        >
          {status}
        </Badge>
      )
    },
    
  },
  {
    accessorKey: "createdDate",
    header: "Created At",
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
]

export function CoursesTable({courses,setCourses}: {courses: Course[],setCourses: React.Dispatch<React.SetStateAction<Course[]>>}) {


const handleToggleStatus = async (course: Course) => {
    try {
      const response = await axiosInstance.patch(`/api/v1/admin/toggle-course-status/${course.id}/${course.isActive}`);

      const updatedCourses = courses.map((s) => {
        if (s.id === course.id) {
          return { ...s, isActive: !s.isActive };
        }
        return s;
      });
      setCourses(updatedCourses);
      toast.success("Status updated successfully");

      console.log("Status updated:", response.data);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };



  const handleAction = (action: string, course: Course) => {
    switch (action) {
      case "view":
        console.log("View course", course)
        break
      case "status":
        handleToggleStatus(course)
        console.log("Activate/Deactivate course", course)
        break
    }
  }

  return (
    <DataTable
      data={courses}
      columns={columns}
      filterColumn="title"
      filterPlaceholder="Filter courses..."
      showSelection={true}
      onSelectionChange={(selectedCourses) => {
        console.log("Selected courses:", selectedCourses)
      }}
      actionItems={[
        { label: "View Details", action: "view" },
        { label: "Activate/Deactivate", action: "status" },
      ]}
      onRowActionSelect={handleAction}
    />
  )
}
