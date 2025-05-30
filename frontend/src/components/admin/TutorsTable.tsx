import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/common/DataTable"
import { Badge } from "@/components/ui/badge"
import axiosInstance from "@/config/axios.config"
import { toast } from "sonner"

export interface Tutor {
  id: string
  name: string
  email: string
  rating: number
  isVerified: string
  coursesCount: number
  joinDate: string
  isActive: boolean
}

const columns: ColumnDef<Tutor>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          className="font-bold"
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
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => {
      const rating = parseFloat(row.getValue("rating"))
      return <div className="text-center">{rating.toFixed(1)}</div>
    },
  },
  {
    accessorKey: "joinDate",
    header: "Join Date",
  },
  {
    accessorKey: "coursesCount",
    header: "Courses",
    cell: ({ row }) => {
      return (
        <Badge variant="secondary" className="w-full justify-center">
          {row.getValue("coursesCount")}
        </Badge>
      )
    },
  },
]










export function TutorsTable({ tutors ,setTutors}: { tutors: Tutor[], setTutors: React.Dispatch<React.SetStateAction<Tutor[]>> }) {

  const handleToggleStatus = async (tutor: Tutor) => {
    try {
      const response = await axiosInstance.patch(`/api/v1/admin/toggle-user-status/${tutor.id}/${tutor.isActive}`);

      const updatedTutors = tutors.map((t) => {
        if (t.id === tutor.id) {
          return { ...t, isActive: !t.isActive };
        }
        return t;
      });
      setTutors(updatedTutors);
      toast.success("Status updated successfully");

      console.log("Status updated:", response.data);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleAction = (action: string, tutor: Tutor) => {
    switch (action) {
      case "view":
        console.log("View tutor", tutor)
        break
      case "status":
        console.log("Block/Unblock tutor", tutor)
        handleToggleStatus(tutor)
        break
    }
  }

  return (
    <DataTable
      data={tutors}
      columns={columns}
      filterColumn="name"
      filterPlaceholder="Filter tutors..."
      showSelection={true}
      onSelectionChange={(selectedTutors) => {
        console.log("Selected tutors:", selectedTutors)
      }}
      actionItems={[
        { label: "View Profile", action: "view" },
        { label: "Block/Unblock", action: "status" },
      ]}
      onRowActionSelect={handleAction}
    />
  )
}
