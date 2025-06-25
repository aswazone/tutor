import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs"
import { DataTable } from "@/components/common/DataTable"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Check, FileText, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ColumnDef } from "@tanstack/react-table"
import axiosInstance from "@/config/axios.config"
import { useEffect, useState, useCallback } from "react"
import { toast } from "sonner"
import { TutorDetailsDialog } from "@/components/admin/TutorDetailsDialog"
import { Tutor } from "@/types/admin.type"

const Tutors = () => {
  const [selectedTab, setSelectedTab] = useState('approved');
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const columns: ColumnDef<Tutor>[] = [
    {
      accessorKey: "userName",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Username
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "userEmail",
      header: "Email",
    },
    {
      accessorKey: "isVerified",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={
          row.getValue("isVerified") === "verified" ? "outline" :
          row.getValue("isVerified") === "pending" ? "secondary" :
          "destructive"
        }>
          {row.getValue("isVerified")}
        </Badge>
      ),
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
      accessorKey: "coursesCount",
      header: "Courses",
      cell: ({ row }) => {
        return (
          <Badge variant="secondary" className="w-full justify-center">
            {row.getValue("coursesCount") || 0}
          </Badge>
        )
      },
    },
    {
      id: "details",
      cell: ({ row }) => {
        const tutor = row.original;
        return (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedTutor(tutor);
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

  const fetchTutors = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/api/v1/admin/tutors');
      setTutors(response.data);
    } catch (error) {
      console.error('Error fetching tutors:', error);
      toast.error('Failed to fetch tutors');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTutors();
  }, [fetchTutors]);

  const approvedTutors = tutors.filter(tutor => 
    tutor.isVerified === 'verified'
  );

  const pendingTutors = tutors.filter(tutor => 
    tutor.isVerified === 'pending' || tutor.isVerified === 'rejected'
  );

  const handleTutorVerified = () => {
    fetchTutors();
  };




  const handleToggleStatus = async (tutor: Tutor) => {
      try {
        const response = await axiosInstance.patch(`/api/v1/admin/toggle-user-status/${tutor._id}/${tutor.isActive}`);
  
        const updatedTutors = tutors.map((t) => {
          if (t._id === tutor._id) {
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
        case "status":
          console.log("Block/Unblock tutor", tutor)
          handleToggleStatus(tutor)
          break
      }
    }


  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Tabs defaultValue="approved" onValueChange={setSelectedTab} className="border-none">
        <TabsList>
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-between">
              <span className={`text-3xl bg-conic ${selectedTab === 'approved' ? 'from-sky-700 via-sky-400' : 'from-amber-500/90 via-amber-200/80'} to-white bg-clip-text text-transparent font-bold font-serif mr-1`}>Tutors</span>
              <span className={selectedTab === 'approved' ? 'text-sky-500/80 font-bold text-xs uppercase' : 'text-amber-400/80 font-bold text-xs uppercase'}>~{selectedTab}</span>
            </div>
            <div className="grid w-[350px] grid-cols-2 gap-2 mt-3 text-sm font-bold">
              <TabsTrigger className="border rounded py-1 text-sky-500/80 hover:border-sky-500/40 hover:scale-103" value="approved">
                Approved
              </TabsTrigger>
              <TabsTrigger className="border rounded py-1 text-amber-300/80 hover:border-amber-500/40 hover:scale-103" value="pending">
                Pending
              </TabsTrigger>
            </div>
          </div>
        </TabsList>
        
        <TabsContent value="approved">
            <DataTable 
              filterColumn="userName"
              filterPlaceholder="Search by username"
              columns={columns} 
              data={approvedTutors}
              onSelectionChange={(selectedTutors) => {
                console.log("Selected tutors:", selectedTutors)
              }}
              actionItems={[
                { label: "Block/Unblock", action: "status" },
              ]}
              onRowActionSelect={handleAction}
            />
        </TabsContent>
        
        <TabsContent value="pending">
            <DataTable 
              filterColumn="userName"
              filterPlaceholder="Search by username"
              columns={columns} 
              data={pendingTutors}
            />
        </TabsContent>
      </Tabs>

      <TutorDetailsDialog
        tutor={selectedTutor}
        isOpen={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        onStatusChange={handleTutorVerified}
      />
    </>
  );
};

export default Tutors;