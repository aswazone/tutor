import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/common/DataTable"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import axiosInstance from "@/config/axios.config"

export interface Student {
  id: string
  name: string
  email: string
  enrolledCourses: number
  completedCourses: number
  joinDate: string
  isActive: boolean;
}

const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "enrolledCourses",
    header: "Enrolled Courses",
    cell: ({ row }) => (
      <Badge variant="secondary" className="w-full justify-center">
        {row.getValue("enrolledCourses")}
      </Badge>
    ),
  },
  {
    accessorKey: "completedCourses",
    header: "Completed",
    cell: ({ row }) => (
      <Badge variant="secondary" className="w-full justify-center">
        {row.getValue("completedCourses")}
      </Badge>
    ),
  },
  {
    accessorKey: "joinDate",
    header: "Join Date",
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

export function StudentsTable({students,setStudents}: {students: Student[], setStudents: React.Dispatch<React.SetStateAction<Student[]>>}) {


   const handleToggleStatus = async (student: Student) => {
    try {
      const response = await axiosInstance.patch(`/api/v1/admin/toggle-user-status/${student.id}/${student.isActive}`);

      const updatedStudents = students.map((s) => {
        if (s.id === student.id) {
          return { ...s, isActive: !s.isActive };
        }
        return s;
      });
      setStudents(updatedStudents);
      toast.success("Status updated successfully");

      console.log("Status updated:", response.data);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };



  const handleAction = (action: string, student: Student) => {
    switch (action) {
      case "view":
        console.log("View student", student)
        break
      case "courses":
        console.log("View student courses", student)
        break
      case "status":
        handleToggleStatus(student)
        console.log("Block/Unblock student", student)
        break
    }
  }

  return (
    <DataTable
      data={students}
      columns={columns}
      filterColumn="name"
      filterPlaceholder="Filter students..."
      showSelection={true}
      onSelectionChange={(selectedStudents) => {
        console.log("Selected students:", selectedStudents)
      }}
      actionItems={[
        { label: "View Profile", action: "view" },
        { label: "Block/Unblock", action: "status" },
      ]}
      onRowActionSelect={handleAction}
    />
  )
}
