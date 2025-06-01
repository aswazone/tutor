import { AnimatePresence, motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CourseCurriculum from "@/components/profile/add-new-course/course-curriculum"
import CourseLandingPage from "@/components/profile/add-new-course/course-landing-page"
import CourseSettings from "@/components/profile/add-new-course/course-settings"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import { CourseLandingFormData } from "@/schemas/course/course-landing.schema"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/store"
import { submitCourse, setModules, updateCourse, setEditMode, setThumbnailKey } from "@/store/course"
import { CustomAlertDialog } from "@/components/common/CustomAlertDialog"
import CustomAlert from "@/components/common/CustomAlert"
import { PublishDraftToggle } from "@/components/profile/add-new-course/publish-draft-toggle"
import axiosInstance from "@/config/axios.config"
import { Button } from "@/components/ui/button"
import { setActiveTab } from "@/store/auth/authSlice"
import { PublishScheduleDialog } from "@/components/profile/add-new-course/public-schedule-dailog"

export const CreateCourseTab = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {modules, thumbnailKey, uploadStatus, editMode, submitStatus } = useSelector((state: RootState) => state.course.courseEditor);

  
  const [courseImage, setCourseImage] = useState<string | null>(null)
  const [courseLandingData, setCourseLandingData] = useState<CourseLandingFormData | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPublished, setIsPublished] = useState<boolean>(false)
  const [isScheduleOpen, setIsScheduleOpen] = useState(false)
  const [courseScedule, setCourseSchedule] = useState<{ isScheduled: boolean; publishDate: Date | null }>({ isScheduled: false, publishDate: null });

  useEffect(()=>{
    if (editMode.status && editMode.courseId) {
      async function fetchSingleCourse() {
        const response = await axiosInstance.get(`/api/v1/courses/${editMode.courseId}`)
        console.log(response.data)
        setIsPublished(response.data.isPublished)
        await dispatch(setModules(response.data.modules))
        setCourseLandingData({
          title: response.data.title,
          description: response.data.description,
          category: response.data.category,
          level: response.data.level,
          objectives: response.data.objectives,
          pricing: response.data.pricing,
          primaryLanguage: response.data.primaryLanguage,
          subtitle: response.data.subtitle,
          welcomeMessage: response.data.welcomeMessage,
        })
        setCourseImage(response.data.thumbnailKey)
        if(response.data.isScheduled && response.data.publishDate){
          console.log(response.data.publishDate,response.data.isScheduled)
          setCourseSchedule({isScheduled: true, publishDate: response.data.publishDate})
        }

      }
      fetchSingleCourse();
    }
  },[dispatch, editMode.status, editMode.courseId])

  const handleCourseLandingSubmit = (data: CourseLandingFormData) => {
    try {
      setCourseLandingData(data)
      console.log("Course landing data:", data)
      toast.success("Course details saved successfully!")
    } catch (error) {
      toast.error("Failed to save course details")
      console.error("Error saving course:", error)
    }
  }
  
  const handleInputChange = (imageKey: string | null) => {
    if (imageKey) {
      setCourseImage(imageKey)
    } else {
      toast.error("Failed to upload image !")
    }
  }

  const resetEditState = () => {
    dispatch(setEditMode({ status: false, courseId: "" }));
    dispatch(setModules([]));
    setCourseImage(null);
    setCourseLandingData(null);
    setIsPublished(false);
    setCourseSchedule({ isScheduled: false, publishDate: null });
    dispatch(setThumbnailKey(''));
    dispatch(setActiveTab('courses'));
  };

  const handleCancel = () => {
    resetEditState();
  }

  const handlePublishScheduleDate = (date: Date) =>{
    if(date){
      setCourseSchedule({isScheduled: true, publishDate: date})
      toast.success("Schedule set successfully !")
      console.log({isScheduled: true, publishDate: date})
    }
  }

console.log(courseScedule,'currentstate')

  function validateFullCourseData(){
    // Validate everything before submission
    let isValid = true;
    const errorMessage: string[] = [];

    if (!courseLandingData) {
      isValid = false;
      errorMessage.push("Course landing page details are missing");
    }

    if (!courseImage) {
      isValid = false;
      errorMessage.push("Course image is required");
    }

    if (!modules.length) {
      isValid = false;
      errorMessage.push("At least one module is required");
    } else {
      const emptyModules = modules.filter(module => !module.chapters.length);
      if (emptyModules.length > 0) {
        isValid = false;
        errorMessage.push(`Module(s) "${emptyModules.map(m => m.title).join(", ")}" have no chapters`);
      }

      for (const module of modules) {
        for (const chapter of module.chapters) {
          if (!chapter.title || !chapter.content || chapter.content.length < 50) {
            isValid = false;
            errorMessage.push(`Chapter "${chapter.title}" in module "${module.title}" has invalid or insufficient content`);
          }
          if (!chapter.videoKey ) {
            isValid = false;
            errorMessage.push(`Chapter "${chapter.title}" in module "${module.title}" is missing a video`);
          }
        }
      }
    }


    if (!isValid) {
      toast.error("Validation Failed", {
        description: errorMessage.join(", "),
      });
      return;
    }
  }

  const handleMainCourseSubmit = async () => {
    validateFullCourseData();

    setIsSubmitting(true);
    
    try {

      // // Step 2: Send course data to backend
      console.log(courseImage, courseLandingData, modules, isPublished,'last checking');
      // return
      if (!courseLandingData) throw new Error("Course details are missing");
      // if(!thumbnailKey) throw new Error('Course image is missing')
      
      if(editMode.status && editMode.courseId){ 
        const courseUpdateAction = await dispatch(updateCourse({
          courseDetails:courseLandingData,
          thumbnailKey: thumbnailKey as string,
          modules:modules,
          publishDate: isPublished ? null : courseScedule.publishDate,
          isScheduled: isPublished ? false : courseScedule.isScheduled,
          isPublished,
          courseId:editMode.courseId
        })).unwrap()
        console.log('response course updated !:', courseUpdateAction)
      }else{
        const courseSubmitAction = await dispatch(submitCourse({
          courseDetails: courseLandingData,
          thumbnailKey: thumbnailKey as string,
          modules: modules,
          publishDate: isPublished ? null : courseScedule.publishDate,
          isScheduled: isPublished ? false : courseScedule.isScheduled,
          isPublished
        })).unwrap();
        console.log('reponse course submit:', courseSubmitAction);
      }


      if(submitStatus === "success"){
        if(editMode.status) {
          toast.success("Course updated successfully!");
          resetEditState(); // Use the resetEditState function here
        } else {
          toast.success("Course created successfully!");
          // Reset only necessary states for new course
          dispatch(setModules([]));
          setCourseImage(null);
          setCourseLandingData(null);
          setIsPublished(false);
          setCourseSchedule({ isScheduled: false, publishDate: null });
          dispatch(setThumbnailKey(''));
        }
      }

      
    } catch (error) {
      console.error("Error submitting course:", error); 
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center gap-6">
        <div className="flex-col">
            <h3 className="text-sm md:text-2xl font-semibold">{editMode.status && editMode.courseId ? "Update Course" : "Create New Course"}</h3>
            <p className="text-[11px] md:text-xs text-muted-foreground">
                Fill in the details below to {editMode.status && editMode.courseId ? "update an existing course" : "create a new course"}.
            </p>
        </div>
        <div className="flex items-start md:items-center gap-2">
            
            <div className="flex items-center gap-4">
              <AnimatePresence initial={false}>
                {!isPublished && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    key="schedule-button"
                  >
                    <Button 
                      onClick={() => setIsScheduleOpen(true)}
                      className="bg-transparent border text-amber-300/70 border-amber-300/30 hover:bg-transparent hover:text-amber-300 rounded-tl-none rounded-br-none"
                    >
                      {courseScedule.isScheduled ? "Reschedule" : "Schedule Publish"}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>            
            <PublishScheduleDialog
                isOpen={isScheduleOpen}
                onOpenChange={setIsScheduleOpen}
                onSchedule={handlePublishScheduleDate}
                initialDate={courseScedule.publishDate}
                setCourseSchedule={setCourseSchedule}
            />
          <div className="flex-col space-y-2 md:space-y-0 md:flex md:flex-row">
            {editMode.status && editMode.courseId 
            ? (
              <div className="flex gap-1">
                <Button variant="outline"
                  className="text-red-500 rounded-tl-none rounded-br-none border-red-500 hover:text-red-600 hover:border-red-600" 
                  onClick={() => handleCancel()}
                >Cancel</Button>
                <CustomAlertDialog buttonText={isSubmitting ? "Submitting..." : "UPDATE"} handleSubmit={handleMainCourseSubmit} isDisabled={isSubmitting}/>
              </div>
            )
            : <CustomAlertDialog buttonText={isSubmitting ? "Submitting..." : "SUBMIT"} handleSubmit={handleMainCourseSubmit} isDisabled={isSubmitting}/>}
            <PublishDraftToggle isPublished={isPublished} setIsPublished={setIsPublished}/>
          </div>  
        </div>
      </div>
      {submitStatus === 'submitting' || uploadStatus === 'uploading' ? (
        <CustomAlert 
        className="bg-sky-950/10 text-sky-400/50 hover:text-sky-400/60 hover:bg-sky-950/30"
        title="Uploading Course" 
        description="Please wait while we upload your course..." 
        isLoading={true}
        />
      ):null}
      <Card className="p-0 border-0 md:pb-6 md:border-1 border-sky-400/10">
        <CardContent className="m-0 p-0">
          <div className="container p-0 md:p-4">
            <Tabs defaultValue="curriculum" className="space-y-4 m-0 p-0">
              <TabsList className="flex justify-between w-full">
                <TabsTrigger value="course-landing-page">Course Landing Page</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              </TabsList>
              <TabsContent value="curriculum">
                <CourseCurriculum />
              </TabsContent>              
              <TabsContent value="course-landing-page">
                <CourseLandingPage 
                  setCourseLandingData={setCourseLandingData}
                  onSubmit={handleCourseLandingSubmit}
                  initialData={courseLandingData || undefined}
                />
              </TabsContent>
              <TabsContent value="settings">
                <CourseSettings handleInputChange={handleInputChange} courseImage={courseImage}/>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}