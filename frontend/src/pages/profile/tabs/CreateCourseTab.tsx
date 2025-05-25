import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CourseCurriculum from "@/components/profile/add-new-course/course-curriculum"
import CourseLandingPage from "@/components/profile/add-new-course/course-landing-page"
import CourseSettings from "@/components/profile/add-new-course/course-settings"
import { toast } from "sonner"
import { useState } from "react"
import { Module } from "@/types/course.type"
import { CourseLandingFormData } from "@/schemas/course/course-landing.schema"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/store"
import { uploadCourseFiles, submitCourse, setModules } from "@/store/course"
import { CustomAlertDialog } from "@/components/common/CustomAlertDialog"
import CustomAlert from "@/components/common/CustomAlert"
import { PublishDraftToggle } from "@/components/profile/add-new-course/publish-draft-toggle"

export const CreateCourseTab = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {modules, uploadStatus, submitStatus, uploadError, submitError } = useSelector((state: RootState) => state.course.courseEditor);

  
  const [courseImage, setCourseImage] = useState<File | null>(null)
  const [courseLandingData, setCourseLandingData] = useState<CourseLandingFormData | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPublished, setIsPublished] = useState(false)


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
  
  const handleInputChange = (file: File | null) => {
    if (file) {
      setCourseImage(file)
      toast.success("File uploaded successfully!")
    } else {
      toast.error("Failed to upload file")
    }
  }

  const handleMainCourseSubmit = async () => {
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
          if (!chapter.video ) {
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

    setIsSubmitting(true);
    
    try {
      // Step 1: Upload files to S3
      if (!courseImage) throw new Error("Course image is required");
      console.log('modules for upload:', modules);
      
      let uploadResult: { thumbnailKey: string, modules: Module[] } = { thumbnailKey: "", modules: [] };
      const uploadAllFilesAction = await dispatch(uploadCourseFiles({ courseImage, modules }));



      if (uploadCourseFiles.fulfilled.match(uploadAllFilesAction)) {
        uploadResult = uploadAllFilesAction.payload;
        console.log(uploadResult, 'upload result after upload');
        toast.success("Files uploaded successfully!",{duration: 5000});
      } else if (uploadCourseFiles.rejected.match(uploadAllFilesAction)) {
        toast.error(uploadError);
      }

      // Step 2: Send course data to backend
      if (!courseLandingData) throw new Error("Course details are missing");
      if (!uploadResult.thumbnailKey) throw new Error("Thumbnail key is missing");
      if (uploadResult.modules.length === 0) throw new Error("Modules are missing");


      const courseSubmitAction = await dispatch(submitCourse({
        courseDetails: courseLandingData,
        thumbnailKey: uploadResult.thumbnailKey,
        modules: uploadResult.modules,
        isPublished
      })).unwrap();

      console.log('reponse course submit:', courseSubmitAction);

      if(submitStatus === "success"){
          toast.success("Course submitted successfully!");
          setModules([]);
          setCourseImage(null);
          setCourseLandingData(null);
      }else if(submitStatus === "error"){
        toast.error(submitError);
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
            <h3 className="text-sm md:text-2xl font-semibold">Create New Course</h3>
            <p className="text-[11px] md:text-xs text-muted-foreground">
                Fill in the details below to create a new course.
            </p>
        </div>
        <div className="flex items-center gap-2">
          <PublishDraftToggle isPublished={isPublished} setIsPublished={setIsPublished}/>
          <CustomAlertDialog buttonText={isSubmitting ? "Submitting..." : "SUBMIT"} handleSubmit={handleMainCourseSubmit} isDisabled={isSubmitting}/>
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
                <CourseCurriculum/>
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