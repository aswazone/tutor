import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertCircle, Check, X, BookOpen, Star, User, IndianRupee, BarChart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { toast } from "sonner"
import { Course } from "@/pages/admin/Courses"
import { env } from "@/config/env.config"

interface CourseDetailsDialogProps {
  course: Course | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange?: (courseId: string, isVerified: string ,rejectReason?: string) => Promise<void>;
}

export function CourseDetailsDialog({ 
  course, 
  isOpen, 
  onOpenChange,
  onStatusChange 
}: CourseDetailsDialogProps) {
  const [rejectReason, setRejectReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleStatusChange = async (status: 'verified' | 'rejected') => {
    if (!course) return;
    
    if (status === 'rejected' && !rejectReason) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    try {
      setIsSubmitting(true);
      onStatusChange?.(course.id, status, rejectReason);
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to update course status');
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
            Course Details
            <Badge variant={
              course?.isVerified === 'verified' ? 'outline' :
              course?.isVerified === 'pending' ? 'secondary' :
              'destructive'
            }>
              {course?.isVerified}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Review course details and content
          </DialogDescription>
        </DialogHeader>

        {course && (
          <div className="grid gap-4 py-4">
            {/* Thumbnail Section */}
            <div className="w-full aspect-video relative overflow-hidden rounded-lg border border-sky-900/20">
              <img 
                src={`${env.AMZ_BUCKET_NAME}/${course.thumbnailKey}`}
                alt={course.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Course Basic Info */}
            <div className="grid gap-2">
              <h4 className="font-medium text-lg">{course.title}</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <Label>Tutor:</Label>
                  <span className="text-sm text-muted-foreground">{course.tutor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                  <Label>Category:</Label>
                  <span className="text-sm text-muted-foreground">{course.category}</span>
                </div>
              </div>
            </div>

            {/* Course Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <BarChart className="w-4 h-4 text-yellow-500" />
                  <Label>Level:</Label>
                  <Badge variant="outline">{course.level}</Badge>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-green-500" />
                  <Label>Price:</Label>
                  <Badge variant="outline">{course.price}</Badge>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <Label>Rating:</Label>
                  <span className="text-sm text-muted-foreground">{course.rating}/5</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-500" />
                  <Label>Status:</Label>
                  <Badge>{course.status}</Badge>
                </div>
              </div>
            </div>

            {/* Verification Controls */}
            {course.isVerified === 'pending' && (
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

            {/* Rejection Reason Display */}
            {course.isVerified === 'rejected' && (
              <div className="space-y-2 pt-4 border-t">
                <div className="flex items-center gap-2 text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  <h4 className="font-medium">Rejection Reason</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  {course.rejectReason || "No reason provided"}
                </p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
