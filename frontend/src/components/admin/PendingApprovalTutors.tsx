import { ColumnDef } from "@tanstack/react-table"
import { Check, X, ArrowUpDown, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/common/DataTable"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { toast } from "sonner"
interface TutorDetails {
  qualification: string;
  experience: number;
  expertise: string;
  about: string;
  resume?: string;
}

interface Tutor {
  _id: string;
  userName: string;
  userEmail: string;
  tutorDetails: TutorDetails | null;
  isVerified: 'verified' | 'pending' | 'rejected';
  createdAt: string;
}
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import axiosInstance from "@/config/axios.config"

interface PendingApprovalTutorsProps {
  tutors: Tutor[];
  onTutorVerified: () => void;
}

export function PendingApprovalTutors({ tutors, onTutorVerified }: PendingApprovalTutorsProps) {
  const [loadingTutorId, setLoadingTutorId] = useState<string>("");
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleTutorVerification = async (tutorId: string, status: 'verified' | 'rejected') => {
    try {
      setLoadingTutorId(tutorId);
      await axiosInstance.patch(`/api/v1/admin/verify-tutor/${tutorId}/${status}`);
      toast.success(`Tutor ${status === 'verified' ? 'approved' : 'rejected'} successfully`);
      onTutorVerified();
    } catch (error) {
      toast.error('Failed to update tutor status');
      console.error('Verification error:', error);
    } finally {
      setLoadingTutorId("");
    }
  };
  const showTutorDetails = (tutor: Tutor) => {
    setSelectedTutor(tutor);
    setIsDetailsOpen(true);
  };

  const columns: ColumnDef<Tutor>[] = [
    {
      accessorKey: "userName",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Username
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "userEmail",
      header: "Email",
    },
    {
      accessorKey: "tutorDetails.qualification",
      header: "Qualification",
      cell: ({ row }) => {
        const details = row.original.tutorDetails;
        return <span>{details?.qualification || "N/A"}</span>;
      }
    },    {
      accessorKey: "tutorDetails.experience",
      header: "Experience",
      cell: ({ row }) => {
        const details = row.original.tutorDetails;
        return <span>{details?.experience || 0} years</span>;
      }
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const tutor = row.original;
        const isLoading = loadingTutorId === tutor._id;

        return (
          <div className="space-x-2">
            <Button
              size="icon"
              variant="outline"
              onClick={() => showTutorDetails(tutor)}
              className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-500"
            >
              <FileText className="h-4 w-4" />
            </Button>
            <Button 
              size="icon"
              variant="outline" 
              className="bg-green-500/10 hover:bg-green-500/20 text-green-500"
              onClick={() => handleTutorVerification(tutor._id, 'verified')}
              disabled={isLoading}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button 
              size="icon"
              variant="outline" 
              className="bg-red-500/10 hover:bg-red-500/20 text-red-500"
              onClick={() => handleTutorVerification(tutor._id, 'rejected')}
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        );
      },
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
        const tutor = row.original;
        const isLoading = loadingTutorId === tutor._id;

        return (
          <div className="space-x-2">
            <Button 
              variant="outline" 
              className="bg-green-500/10 hover:bg-green-500/20 text-green-500"
              // onClick={() => handleTutorVerification(tutor., true)}
              disabled={isLoading}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              className="bg-red-500/10 hover:bg-red-500/20 text-red-500"
              // onClick={() => handleTutorVerification(tutor.id, false)}
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
      <DataTable columns={columns} data={tutors} />

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[600px] bg-card/95 backdrop-blur-lg">
          <DialogHeader>
            <DialogTitle>Tutor Details</DialogTitle>
            <DialogDescription>
              Review the tutor's qualifications and experience
            </DialogDescription>
          </DialogHeader>

          {selectedTutor && selectedTutor.tutorDetails && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <h4 className="font-medium">Qualification</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedTutor.tutorDetails.qualification}
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Experience</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedTutor.tutorDetails.experience} years
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Expertise</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedTutor.tutorDetails.expertise}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">About</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedTutor.tutorDetails.about}
                </p>
              </div>

              {selectedTutor.tutorDetails.resume && (
                <div className="space-y-2">
                  <h4 className="font-medium">Resume</h4>
                  <Button
                    variant="outline"
                    onClick={() => window.open(selectedTutor.tutorDetails?.resume, '_blank')}
                    className="w-full"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    View Resume
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
