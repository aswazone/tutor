import { ChevronsLeft } from "@/components/common/ChevronsLeft";
import { ChevronsRight } from "@/components/common/ChevronsRight";
import { FileStack } from "@/components/common/FileStack";
import { GlowingEffect } from "@/components/common/GlowingEffect";
import { GridLineHorizontal, GridLineVertical } from "@/components/common/GridLines";
import { Paperclip } from "@/components/common/Paperclip";
import PopperConfetti from "@/components/common/PopperConfetti";
import { ScanText } from "@/components/common/ScanText";
import SimpleLoader from "@/components/common/SimpleLoader";
import { CourseProgressModules } from "@/components/course/CourseProgressModules";
import VideoPlayer from "@/components/course/VideoPlayer";
import { BorderBeam } from "@/components/magicui/border-beam";
// import { BoxReveal } from "@/components/magicui/box-reveal";
import { ShinyButton } from "@/components/magicui/shiny-button";
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axiosInstance from "@/config/axios.config";
import { env } from "@/config/env.config";
import { RootState } from "@/store";
import { Chapter, ICourse, IProgressData, Module } from "@/types/course.type";
import { Award, BookOpen, Calendar, ChevronsUpDown, Download, GripIcon, Sparkles, Star, Trophy, UserRound } from "lucide-react"
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import GlassChatBot from "@/components/course/GlassChatBot";
import { BlurFade } from "@/components/magicui/blur-fade";

const CourseProgressPage = () => {

  const {id} = useParams();
  const navigate = useNavigate();

  const {user} = useSelector((state:RootState) => state.auth);
  const [progressData, setProgressData] = useState<IProgressData>();
  const [isLoading, setIsLoading] = useState(false);
  const [lockCourse, setLockCourse] = useState(false);
  const [currentModule, setCurrentModule] = useState<Module>();
  const [currentChapter, setCurrentChapter] = useState<Chapter>();
  const [showCourseCompleteDialog, setShowCourseCompleteDialog] = useState(false);
  const [courseDetails, setCourseDetails] = useState<ICourse>();
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const [tab, setTab] = useState('modules');

  console.log(courseDetails,'--courseDetails--');
  

  const getLastViewedModuleAndChapter = useCallback((courseProgress: IProgressData['progress']) => {
    let lastViewedModule: typeof courseProgress.moduleProgress[number] | null = null;
    let lastViewedChapter: typeof courseProgress.moduleProgress[number]['chapterProgress'][number] | null = null;
    let moduleIndex: number = -1;
    let chapterIndex: number = -1;
  
    courseProgress.moduleProgress.forEach((moduleProgress, mIdx) => {
      if (moduleProgress.viewed) {
        moduleIndex = mIdx;
        lastViewedModule = moduleProgress;
        moduleProgress.chapterProgress.reduceRight((acc, chapter, cIdx) => {
          if(acc === -1 && chapter.viewed){
            lastViewedChapter = chapter;
            chapterIndex = cIdx;
            return cIdx;
          }else{
            return acc;
          }
        }, -1)
      }
    });
  
    return { lastViewedModule, lastViewedChapter, moduleIndex, chapterIndex };
  },[])
  

  const fetchProgress = useCallback(async () => {
          try {
              setIsLoading(true);
              const response = await axiosInstance.get(`/api/v1/course-progress/${user?._id}/${id}`);
              console.log(response.data, 'response-progress');
              if(!response?.data?.isPurchased){
                setLockCourse(true);
              }else{
                setProgressData(response?.data);
                setCourseDetails(response?.data?.courseDetails);
                if(response?.data?.progress?.completed){
                  // setCurrentModule(response?.data?.courseDetails?.modules[0]);
                  // setCurrentChapter(response?.data?.courseDetails?.modules[0].chapters[0]);
                  console.log(response.data, 'response-after-completion');  
                  setShowCourseCompleteDialog(true);
                  setShowConfetti(true);
                  return
                }

                if(response?.data?.progress?.moduleProgress?.length === 0){
                  console.log('setting current module');
                  console.log(response?.data?.courseDetails,'---response---');
                  setCurrentModule(response?.data?.courseDetails?.modules[0]);
                  setCurrentChapter(response?.data?.courseDetails?.modules[0].chapters[0]);
                }else{

                  const { moduleIndex, chapterIndex } = getLastViewedModuleAndChapter(response?.data?.progress);
                  const modules = response?.data?.courseDetails?.modules;
                  
                  // Try to go to the next chapter in the same module
                  if ( modules && moduleIndex >= 0 && chapterIndex + 1 < modules[moduleIndex].chapters.length) {
                    setCurrentModule(modules[moduleIndex]);
                    setCurrentChapter(modules[moduleIndex].chapters[chapterIndex + 1]);
                  }
                  // If no next chapter, try to go to the first chapter of the next module
                  else if ( modules && moduleIndex + 1 < modules.length && modules[moduleIndex + 1].chapters.length > 0) {
                    setCurrentModule(modules[moduleIndex + 1]);
                    setCurrentChapter(modules[moduleIndex + 1].chapters[0]);
                  }
                  // Otherwise, fallback to the last viewed
                  else if (modules && moduleIndex >= 0 && chapterIndex >= 0) {
                    setCurrentModule(modules[moduleIndex]);
                    setCurrentChapter(modules[moduleIndex].chapters[chapterIndex]);
                  }
                  // Fallback to the very first
                  else if (modules && modules.length > 0 && modules[0].chapters.length > 0) {
                    setCurrentModule(modules[0]);
                    setCurrentChapter(modules[0].chapters[0]);
                  }
                  
                }

              }
              setIsLoading(false);
          } catch (error) {
              setIsLoading(false);
              console.error('Error fetching progress:', error);
          }
      }, [id,user,getLastViewedModuleAndChapter]);

  useEffect(()=>{
    if(user && id){
      fetchProgress();
    }
  },[user,id,fetchProgress]);

  useEffect(() => {
    const updateCourseProgress = async () => {
      try {
        if (currentChapter && currentModule && user && courseDetails) {
          const response = await axiosInstance.post(`/api/v1/course-progress/mark-as-viewed`, {
            userId: user?._id,
            courseId: courseDetails?._id,
            chapterId: currentChapter?.id,
            moduleId: currentModule?.id,
          });
          console.log(response.data, 'progress-update-response');
          if(response?.data){
            fetchProgress();
          }
        }
      } catch (error) {
        console.error('Error marking chapter as viewed:', error);
      }
    };

    if (currentChapter?.progressValue === 1) updateCourseProgress();
}, [currentChapter, currentModule, user, courseDetails, fetchProgress]);


  // if(progressData && courseDetails) console.log(progressData,courseDetails,'progressData');
  // console.log(currentChapter,'currentChapter');

  const handleDownloadCertificate = () => {
    console.log("Downloading certificate...");
    toast.success("Certificate downloaded successfully");
  };

  const handleNavigateToCourses = () => {
    console.log("Navigating to courses...");
    navigate("/my-courses");
  };

  const handleRewatch = async () => {
    console.log("Rewatching course...");
    try {
      const response = await axiosInstance.post(`/api/v1/course-progress/reset-progress`, {
        userId: user?._id,
        courseId: id,
      })

      if(response?.data){
        setShowCourseCompleteDialog(false);
        setCurrentChapter(undefined);
        setCurrentModule(undefined);
        setShowConfetti(false);
        fetchProgress();
      }

      console.log(response.data, 'progress-update-reset');
    } catch (error) {
      console.error("Error rewatching course:", error);
    }
  };

  const handleTabChange = (value: string) => {
    setTab(value);
  };

  const handleSetFreePreview = (chapter: Chapter) => {
    console.log(chapter); 
  }
  

  return (
    <div className="relative flex flex-col h-full bg-[#0a0f1d] text-white overflow-y-scroll">  
    <GlassChatBot />
      <div className="flex items-center justify-between p-4 bg-gradient-to-b from-background to-[#0a0f1d] ">
        <div className="relative flex items-center space-x-4">
          <GridLineHorizontal className="-bottom-2" offset="20px" />
          <Button className="text-white" onClick={() => navigate("/my-courses") } variant={"outline"} size={"sm"}>
            <ChevronsLeft />
            Back to My Courses Page
          </Button>
          <h1 className="text-lg font-bold hidden md:block">{courseDetails?.title}</h1>
        </div>
        <Button className="ml-auto border-1 border-r-0 border-l-0 border-sky-400/20 bg-sky-700/20 hover:bg-sky-700/18 text-sky-300/70" onClick={() => setIsSideBarOpen(!isSideBarOpen)} size={"sm"}>{isSideBarOpen ? <ChevronsRight stroke="#549abe"/> : <ChevronsLeft stroke="#549abe"/> }</Button>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className={`flex-1 ${isSideBarOpen ? "w-full" : "w-4/5"} transition-all duration-600 mx-3`}>
          <div className="relative rounded-xl">
          <VideoPlayer 
              width="100%" height="500px" 
              url={`${env.AMZ_BUCKET_NAME}/${currentChapter?.videoKey}`} 
              onProgressUpdate={setCurrentChapter} progressData={currentChapter}
          />
          <GridLineHorizontal className="-bottom-1" offset="20px" />
          <GlowingEffect
              spread={10}
              glow={true}
              disabled={false}
              proximity={100}
              inactiveZone={0.01}
          />
          </div>
          <div className="relative py-6 my-2 rounded-t-xl rounded-br-xl bg-gradient-to-bl from-sky-700/12 from-20% to-10% to-sky-950/15 backdrop-blur-3xl shadow-2xl backdrop-filter border border-sky-500/10 bg-opacity-10">
            <h2 className="text-2xl px-6 py-2 font-bold mb-2 text-sky-300/70 bg-gradient-to-r from-transparent to-sky-700/10">{currentChapter?.title.toUpperCase()}</h2>
            <p className="px-6 text-gray-300/80 rich-content" dangerouslySetInnerHTML={{ __html: (currentChapter?.content as string) }}></p>
            <GlowingEffect 
              spread={10}
              glow={true}
              disabled={false}
              proximity={100}
              inactiveZone={0.01}
            />
          </div>
        </div>
        <div className={`${isSideBarOpen ? "relative flex flex-col border-t-2 border-l-1 bg-gradient-to-bl from-sky-700/12 from-20% to-10% to-sky-950/15 backdrop-blur-3xl shadow-2xl backdrop-filter border border-sky-500/10 bg-opacity-10 rounded-tl-lg rounded-br-lg w-1/5" : "hidden"} transition-all duration-600 mr-3 mb-3`}>
        <GridLineVertical className="-left-2" offset="80px" />
          <Tabs defaultValue="modules" value={tab}>
            <div className=" text-[#6173a5]">
              {/* <span>Course Progress</span> */}
              <TabsList className="m-0.5 from-[#09182a] via-[#09182a] to-[#09182a] rounded-lg overflow-hidden bg-conic-210">
                <TabsTrigger className="border-none" value="modules" onClick={() => handleTabChange("modules")}><ScanText stroke="#549abe"/></TabsTrigger>
                <TabsTrigger className="border-none" value="notes" onClick={() => handleTabChange("notes")}><Paperclip stroke="#549abe"/></TabsTrigger>
              </TabsList>
            </div>
            <div className="absolute -z-1 bg-sky-700/12 border-b-1 border-sky-500/10 w-full h-[40px] opacity-35"/>
            <TabsContent value="modules" >
              <div className="flex-col bg-[#0b25448c] p-2">
                <span className="text-xl text-sky-300/70">✧ Modules</span>
              </div>
              <div className="m-2 ">
                {courseDetails && <CourseProgressModules currentChapterId={currentChapter?.id as string} handleSetFreePreview={handleSetFreePreview} course={courseDetails} progressData={progressData}/>}
              </div>
            </TabsContent>
            <TabsContent value="notes">
              <div className="flex-col">
                <div className="flex-col bg-[#0b25448c] p-2">
                  <span className="text-xl text-sky-300/70">✧ Notes</span>
                </div>
                <div className="space-y-4 m-1.5">
                  {courseDetails && courseDetails.modules.map((module: Module) => (
                    <div key={module.id} className="flex flex-col space-y-2">
                      <div className="flex items-center gap-2 p-2 bg-sky-950/30 rounded-lg">
                        <GripIcon stroke="#549abe" className="h-3 w-3" />
                        <span className="text-lg text-sky-200/90 font-medium">{module.title}</span>
                      </div>
                      <div className="ml-6 space-y-2">
                        {module.chapters.map((chapter: Chapter) => (
                          <div key={chapter.id} className="flex flex-col">
                            <div className="p-2 bg-gradient-to-r from-transparent to-white/10 rounded-lg">
                              <div className="flex items-center gap-2 mb-1">
                                <ChevronsUpDown className="h-3 w-3 text-sky-400/30" />
                                <span className="text-sm text-sky-300/80">{chapter.title}</span>
                              </div>
                              <div className="flex items-center gap-2 ml-6">
                                {chapter.pdfUrl ? (
                                  <a 
                                    href={`${env.AMZ_BUCKET_NAME}/${chapter.pdfUrl}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center border-x-2 bg-gradient-to-bl from-sky-900/30 to-sky-900/10 hover:bg-gradient-to-bl hover:from-sky-900/40 hover:to-sky-900/50 group rounded-md px-1"                                  >
                                    <FileStack className="h-4 w-4 text-sky-400 group-hover:text-sky-300" />
                                    <span className="text-xs text-sky-300/70 group-hover:text-sky-300">View Notes</span>
                                  </a>
                                ) : (
                                  <div className="flex items-center gap-2 p-1.5 bg-slate-800/40 rounded-md opacity-50 cursor-not-allowed">
                                    <FileStack className="h-4 w-4 text-gray-500" />
                                    <span className="text-xs text-gray-400">No notes available</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
            <GlowingEffect 
                spread={40}
                glow={true}
                disabled={false}
                proximity={100}
                inactiveZone={0.01}
            />
        </div>
      </div>
      {isLoading && <SimpleLoader height="300px" />}
      <Dialog open={lockCourse}>
        <DialogContent className="sm:w-[425px]">
          <DialogHeader>
            <DialogTitle>You can't view this page !</DialogTitle>
            <DialogDescription>
              please purchase this course to view this page
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showCourseCompleteDialog}>
        <DialogContent className="p-0 w-full max-w-lg overflow-hidden">
          <BlurFade delay={3}>
            <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
              
              {/* Background Image with Mask */}
              <div className="absolute inset-0 -z-10 rounded-2xl">
                <div className="absolute inset-0 opacity-50 bg-gradient-to-br from-[#0c7ea9]/20 via-purple-900/20 to-pink-900/20 backdrop-blur-sm" />
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl"
                  style={{
                    maskImage: 'radial-gradient(ellipse at center, transparent 0%, black 50%)',
                    WebkitMaskImage: 'radial-gradient(ellipse at center, transparent 0%, black 50%)',
                  }}
                />
              </div>


              {/* Main Content Container */}
              <div className="relative backdrop-blur-xl bg-black/20 border border-white/10 rounded-md p-8 pt-1 shadow-2xl w-full">

                  <div className="flex justify-center my-6">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-r from-[#0c7ea9] to-[#a1d9f8] rounded-full flex items-center justify-center relative">
                        <Trophy size={32} className="text-white" />
                        <div className="absolute -top-2 -right-2">
                          <Sparkles size={16} className="text-yellow-300 animate-pulse" />
                        </div>
                      </div>
                      <div className="absolute -z-10 inset-0 bg-gradient-to-r from-[#0c7ea9ad] to-[#a1daf894] rounded-full blur-lg opacity-50" />
                    </div>
                  </div>
                
                  <div className="text-center mb-6">
                    <h1 className="text-4xl font-bold text-center mb-2">
                      <span className="bg-gradient-to-r from-[#0c7ea9] via-[#a1d9f8] to-[#0c7ea9] bg-clip-text text-transparent">
                        Congratulations
                      </span>
                      <span className="text-[#0c7ea9]">!</span>
                    </h1>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={16} 
                          className="text-yellow-400 animate-pulse"
                          style={{ animationDelay: `${i * 100}ms` }}
                          fill="currentColor"
                        />
                      ))}
                    </div>
                  </div>
                
                  <div className="text-center mb-6">
                    <h2 className="text-sm text-white/90 mb-2">
                      You have completed
                    </h2>
                    <div className="text-xl font-semibold text-[#0c7ea9] mb-4">
                      {courseDetails?.title ?? "Your Course"}
                    </div>
                    
                    {/* Achievement Badge */}
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0c7ea9]/20 to-[#a1d9f8]/20 backdrop-blur-sm border border-[#0c7ea9]/30 rounded-full px-4 py-2 mb-4">
                      <Award size={18} className="text-[#0c7ea9]" />
                      <span className="text-white font-medium">You are now an Expert!</span>
                    </div>
                  </div>
                
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border-x-3 border-sky-400/15 text-center">
                      <div className="text-2xl font-bold text-[#79c6e2]">{courseDetails?.modules.length}</div>
                      <div className="text-xs text-white/70">Modules</div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border-x-3 border-sky-400/30 flex flex-col items-center justify-center text-center">
                      <Calendar size={16} className="text-[#a1d9f8] mx-auto mb-1" />
                      <div className="text-xs text-white/70">{courseDetails?.title.length}</div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border-x-3 border-sky-400/15 flex flex-col items-center justify-center text-center">
                      <UserRound size={16} className="text-[#a1d9f8] mx-auto mb-1" />
                      <div className="text-xs text-white/70">Tutor: {courseDetails?.tutor?.userName}</div>
                    </div>
                  </div>
                
                  <div className="text-center mb-6">
                    <div className="text-white/80 text-sm">
                      Celebrate your achievement and download your certificate.
                    </div>
                  </div>
                
                {/* Action Buttons */}
                  <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-3">
                      <ShinyButton
                        onClick={handleDownloadCertificate}
                      >
                        <div className="flex items-center justify-center">
                          <Download size={18} className="inline" />
                          <span className="ml-2">Certificate</span>
                        </div>
                      </ShinyButton>
                      <ShinyButton
                        onClick={handleRewatch}
                      >
                        <div className="flex items-center justify-center">
                          <BookOpen size={18} className="inline" />
                          <span className="ml-2">Rewatch</span>
                        </div>
                      </ShinyButton>
                    </div>
                    <ShinyButton
                      onClick={handleNavigateToCourses}
                      className="w-full"
                    >
                      My Courses
                    </ShinyButton>
                  </div>

                {/* Decorative Elements */}
                <div className="absolute top-6 right-6 w-24 h-24 bg-gradient-to-r from-[#0c7ea9]/20 to-[#a1d9f8]/20 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute bottom-6 left-6 w-32 h-32 bg-gradient-to-r from-[#a1d9f8]/20 to-[#0c7ea9]/20 rounded-full blur-3xl pointer-events-none" />
                
                {/* Border Beams */}
                <BorderBeam duration={8} size={100} />
                <BorderBeam duration={8} size={100} initialOffset={450} />
              </div>
            </div>
          </BlurFade>
        </DialogContent>
    </Dialog>
    <PopperConfetti showConfetti={showConfetti} />
      
    </div>
  )
}

export default CourseProgressPage