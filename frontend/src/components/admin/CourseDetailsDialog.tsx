import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertCircle, Check, X, BookOpen, Star, User, IndianRupee, BarChart, CirclePlay, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { env } from "@/config/env.config"
import { Course } from "@/types/admin.type"
import axiosInstance from "@/config/axios.config"
import { Chapter, ICourse, Module } from "@/types/course.type"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"
import VideoPlayer from "../course/VideoPlayer"

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
  const [courseFetched, setCourseFetched] = useState<ICourse>()
  const [isLoading, setIsLoading] = useState(false)
  const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] = useState('');
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    if (course) {
      const fetchCourse = async () => {
        setIsLoading(true);
        try {
          const response = await axiosInstance.get(`/api/v1/courses/${course.id}`);
          const data = response.data;
          setCourseFetched(data);
          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);
          console.error('Error fetching course details:', error);
        }
      }

      fetchCourse();
    }
  }, [course])

  if(courseFetched) {
    console.log(courseFetched,'courseFetched');
  }

  console.log(course,'course-in-dialog');

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

  const handleSetPreview = (chapter: Chapter) => {
      console.log(chapter);
      setShowDialog(true);
      setDisplayCurrentVideoFreePreview(chapter?.videoKey as string);
  }

  return (
    <Dialog  open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="h-full overflow-y-auto sm:max-w-[600px] bg-card/95 backdrop-blur-lg border-y-4 border-sky-900/50">
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

        {isLoading ? <p className="text-muted-foreground m-auto">Loading course details...</p> : course && (
          <div className="grid gap-4 pb-4">
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

            {/* Module List */}
              <Accordion
                type="single"
                collapsible
                className="w-full space-y-2"
                defaultValue="item-1"
              >
                {courseFetched && courseFetched.modules.map((module: Module) => (
                  <AccordionItem 
                    key={module.id} 
                    value={module.id}
                    className="shadow-sky-600/30 shadow-[0px_1.5px_2px_0.1px] border-none rounded-bl-xl rounded-tr-xl pb-0 bg-gradient-to-bl from-sky-700/12 from-20% to-10% to-sky-950/15 backdrop-blur-3xl"
                  >
                    <AccordionTrigger className="px-4 py-2 text-sm font-semibold  hover:text-sky-400 transition-colors">
                      {module.title}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-2">
                      <p className=" text-muted-foreground text-sm mb-4">{module.description}</p>
                      <div className="space-y-2">
                        {module.chapters.map((chapter: Chapter) => (
                          <div 
                            key={chapter.id}
                            className={`p-2 rounded-xl rounded-tl-none rounded-br-none bg-sky-900/30 border border-sky-800/50 cursor-pointer hover:bg-sky-900/40' 
                                 backdrop-blur-sm flex items-center justify-between`}
                          >
                            <div className="flex items-center gap-3" onClick={()=> handleSetPreview(chapter)}>
                              <CirclePlay className="w-5 h-5 text-sky-400" />
                              <p className="font-medium text-xs">{chapter.title}</p>
                            </div>
                            {chapter.pdfUrl && (
                              <a href={`${env.AMZ_BUCKET_NAME}/${chapter.pdfUrl}`} target="_blank">
                                <FileText className="text-[8px] bg-sky-500/20 text-sky-300 p-1 rounded"/>
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
                
              </Accordion>
              <Dialog
                open={showDialog} 
                onOpenChange={()=>{
                    setShowDialog(false)
                    setDisplayCurrentVideoFreePreview('')
                }}>
                <DialogContent className="bg-card backdrop-blur-xl gap-2 border border-sky-900/40">
                    <DialogHeader>
                    <DialogTitle className="text-white/70">Course Preview</DialogTitle>
                    
                    </DialogHeader>
                        <div className="aspect-video">
                            <VideoPlayer 
                                // onProgressUpdate={setDummyCurrentChapter} progressData={currentDummyChapter}
                                url={`${env.AMZ_BUCKET_NAME}/${displayCurrentVideoFreePreview}`}
                            />
                        </div>
                        
                    <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button className="px-2 py-1" type="button" variant="ghost">
                        Close
                        </Button>
                    </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

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
