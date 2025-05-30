import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileText, AlertCircle, Check, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { toast } from "sonner"
import axiosInstance from "@/config/axios.config"

interface TutorDetails {
  qualification: string;
  experience: number;
  expertise: string;
  about: string;
  resume?: string;
  rejectReason?: string;
}

interface Tutor {
  _id: string;
  userName: string;
  userEmail: string;
  tutorDetails: TutorDetails | null;
  isVerified: 'verified' | 'pending' | 'rejected';
  createdAt: string;
}

interface TutorDetailsDialogProps {
  tutor: Tutor | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange?: () => void;
}

export function TutorDetailsDialog({ 
  tutor, 
  isOpen, 
  onOpenChange,
  onStatusChange 
}: TutorDetailsDialogProps) {
  const [rejectReason, setRejectReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleStatusChange = async (status: 'verified' | 'rejected') => {
    if (!tutor) return;
    
    if (status === 'rejected' && !rejectReason) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    try {
      setIsSubmitting(true);
      await axiosInstance.patch(`/api/v1/auth/tutor-verify/${tutor._id}/${status}`, {
        rejectReason: status === 'rejected' ? rejectReason : ''
      });
      toast.success(`Tutor ${status === 'verified' ? 'approved' : 'rejected'} successfully`);
      onStatusChange?.();
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to update tutor status');
      console.error('Status update error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-card/95 backdrop-blur-lg border border-sky-900/40">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Tutor Profile
            <Badge variant={
              tutor?.isVerified === 'verified' ? 'default' :
              tutor?.isVerified === 'pending' ? 'secondary' :
              'destructive'
            }>
              {tutor?.isVerified}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Review tutor's qualifications and experience
          </DialogDescription>
        </DialogHeader>

        {tutor && tutor.tutorDetails && (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <h4 className="font-medium">Basic Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Username</Label>
                  <p className="text-sm text-muted-foreground">{tutor.userName}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="text-sm text-muted-foreground">{tutor.userEmail}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Qualification</h4>
              <p className="text-sm text-muted-foreground">
                {tutor.tutorDetails.qualification}
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Experience</h4>
              <p className="text-sm text-muted-foreground">
                {tutor.tutorDetails.experience} years
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Expertise</h4>
              <p className="text-sm text-muted-foreground">
                {tutor.tutorDetails.expertise}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">About</h4>
              <p className="text-sm text-muted-foreground">
                {tutor.tutorDetails.about}
              </p>
            </div>

            {tutor.tutorDetails.resume && (
              <div className="space-y-2">
                <h4 className="font-medium">Resume</h4>
                <Button
                  variant="outline"
                  onClick={() => window.open(tutor.tutorDetails?.resume, '_blank')}
                  className="w-full bg-sky-900/20 hover:bg-sky-900/30"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  View Resume
                </Button>
              </div>
            )}

            {tutor.isVerified === 'pending' && (
              <div className="space-y-4 pt-4 border-t">
                <div className="space-y-2">
                  <Label htmlFor="rejectReason">Rejection Reason (required for rejection)</Label>
                  <Input
                    id="rejectReason"
                    placeholder="Enter reason for rejection..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => handleStatusChange('verified')}
                    disabled={isSubmitting}
                    className="bg-green-500/10 hover:bg-green-500/20 text-green-500"
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleStatusChange('rejected')}
                    disabled={isSubmitting}
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-500"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                </div>
              </div>
            )}

            {tutor.isVerified === 'rejected' && (
              <div className="space-y-2 pt-4 border-t">
                <div className="flex items-center gap-2 text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  <h4 className="font-medium">Rejection Reason</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  {tutor?.tutorDetails?.rejectReason || "No reason provided"}
                </p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
