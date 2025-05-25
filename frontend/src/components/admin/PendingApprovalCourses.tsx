import { ColumnDef } from "@tanstack/react-table"
import { Check, X, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/common/DataTable"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/store"
import { verifyCourse } from "@/store/admin/adminSlice"
import { toast } from "sonner"

export interface Course {
  id: string
  title: string
  tutor: string
  category: string
  price: string
  enrollments: number
  rating: number
  status: "draft" | "published" | "archived"
}

interface PendingApprovalCoursesProps {
  courses: Course[];
  onCourseVerified: () => void;
}

export function PendingApprovalCourses({ courses, onCourseVerified }: PendingApprovalCoursesProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [loadingCourseId, setLoadingCourseId] = useState<string>("");

  const handleCourseVerification = async (courseId: string, isVerified: boolean) => {
    try {
      setLoadingCourseId(courseId);
      await dispatch(verifyCourse({ courseId, isVerified })).unwrap();
      toast.success(`Course ${isVerified ? 'approved' : 'rejected'} successfully`);
      onCourseVerified(); // Refresh the course list
    } catch (error) {
      toast.error('Failed to update course status');
      console.error('Verification error:', error);
    } finally {
      setLoadingCourseId("");
    }
  };

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
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.getValue("status") === "published" ? "default" : "secondary"}>
          {row.getValue("status")}
        </Badge>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const course = row.original;
        const isLoading = loadingCourseId === course.id;

        return (
          <div className="space-x-2">
            <Button 
              variant="outline" 
              className="bg-green-500/10 hover:bg-green-500/20 text-green-500"
              onClick={() => handleCourseVerification(course.id, true)}
              disabled={isLoading}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              className="bg-red-500/10 hover:bg-red-500/20 text-red-500"
              onClick={() => handleCourseVerification(course.id, false)}
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
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
