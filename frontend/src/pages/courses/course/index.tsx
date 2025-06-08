import { CourseModules } from "@/components/course/modulesAccordion";
import VideoPlayer from "@/components/course/VideoPlayer";
import {PaypalPayment} from "@/components/payment/PaypalPayment";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Loader from "@/components/ui/loader";
import { env } from "@/config/env.config";
import { AppDispatch, RootState } from "@/store";
import { fetchCourse } from "@/store/fetch";
import { Chapter } from "@/types/course.type";
import { BadgeAlertIcon, CheckCircle, Globe, PlayCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom"
import { toast } from "sonner";
import { Alert } from "@/components/ui/alert";

const CourseDetailsPage = () => {

    const {id,userId} = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const {isAuthenticated} = useSelector((state:RootState)=>state.auth);
    const {items:courses,isLoading} = useSelector((state:RootState)=>state.fetch);
    const [currentCourseId,setCurrentCourseId] = useState<string>('');
    const [freeUrl,setFreeUrl] = useState<string | undefined>('');
    const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] = useState('');
    const [showDialog, setShowDialog] = useState(false);
    const [isToggledPayButton, setIsToggledPayButton] = useState(false);

    const handleTogglePayButton = () => {
        setIsToggledPayButton(!isToggledPayButton);
        setTimeout(() => {
            setIsToggledPayButton(false);
        }, 5000);
    }


    console.log(courses,'test-----------------');

    const toastAuthCheck = () => {
        toast("Please login to unlock this course",{
            position: "top-right",
            className: "mt-10",
            action: {
                label: "Login",
                onClick: () => {
                    window.location.href = "/auth";
                }
            }
        });
    }

    useEffect(()=>{
        return () => {
            setCurrentCourseId('');
            setFreeUrl('');
        }
    },[])

    useEffect(() => {
        if(id) setCurrentCourseId(id);
    }, [id]);

    useEffect(()=>{
        if(currentCourseId){
            dispatch(fetchCourse(currentCourseId));
        }
    },[currentCourseId,dispatch,userId])


    useEffect(()=>{
        const getFreePreviewVideoUrl = () => {
            let videoKey: string | undefined;
            
            // - the first free preview
            for (const module of courses[0]?.modules || []) {
                const freeChapter = module.chapters.find(chapter => chapter.freePreview === true);
                if (freeChapter) {
                    videoKey = freeChapter.videoKey;
                    break; 
                }
            }
            
            return videoKey;
        }
        
        const url = getFreePreviewVideoUrl();
        setFreeUrl(url);
    },[courses])
        
    console.log(freeUrl,'getFreePreviewVideoUrl');
    console.log(courses,'course');

    const handleSetFreePreview = (chapter: Chapter) => {
        console.log(chapter);
        setShowDialog(true);
        setDisplayCurrentVideoFreePreview(chapter?.videoKey as string);
    }

    if(isLoading)  return <div className="flex h-screen items-center justify-center"><Loader /> Please Wait..</div>
    if(!courses[0]?.isActive) return <Alert className="w-1/4 mx-auto mt-10" variant={"destructive"}>
        <CheckCircle className="w-4 h-4 text-center" /> This course is discontinued !
    </Alert>

    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-4 py-8">
                <div className="relative overflow-hidden rounded-t-xl bg-gradient-to-r from-sky-950/50 via-slate-900/50 to-gray-900/50 p-8 backdrop-blur-xl border border-white/10 shadow-2xl">
                    <img
                        src={`${env.AMZ_BUCKET_NAME}/${courses[0]?.thumbnailKey}`}
                        alt={courses[0]?.title}
                        className="absolute -z-1 inset-0 h-full w-full object-cover mask-radial-from-card-foreground"
                    />
                    {/* <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)] -z-10" /> */}
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-sky-400 bg-clip-text text-transparent mb-4">
                        {courses[0]?.title}
                    </h1>
                    <p className="text-sm text-gray-300 mb-6">{courses[0]?.subtitle}</p>
                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                        <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                            </svg>
                            Created By {courses[0]?.tutor?.name}
                        </span>
                        <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(courses[0]?.createdAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full">
                            <Globe className="w-4 h-4"/> 
                            {courses[0]?.primaryLanguage}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 mt-8">
                    <main className="flex-grow space-y-8">
                        <div className="rounded-tr-xl rounded-bl-xl p-3 bg-sky-950/30 border border-white/10 overflow-hidden">
                            <div className="p-6 border-b border-white/10">
                                <h2 className="text-2xl font-semibold text-white">What you will learn</h2>
                            </div>
                            <div className="p-6 rich-content">
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {courses[0]?.objectives?.split(',').map((item,index) => (
                                        <li className="flex items-start gap-3" key={index}>
                                            <CheckCircle className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-300">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="rounded-l-xl p-3 bg-sky-950/30 border border-white/10 overflow-hidden">
                            <div className="p-6 border-b border-white/10">
                                <h2 className="text-2xl font-semibold text-white">Course Description</h2>
                            </div>
                            <div className="p-6">
                                <div className=" text-gray-300 rich-content" dangerouslySetInnerHTML={{ __html: courses[0]?.description }}/>
                            </div>
                        </div>

                        <div className="rounded-br-xl rounded-tl-xl p-3 bg-sky-950/30 border border-white/10 overflow-hidden">
                            <div className="p-6 border-b border-white/10">
                                <h2 className="text-2xl font-semibold text-white">Course Content</h2>
                            </div>
                            <div className="p-6">
                                {courses[0] && <CourseModules handleSetFreePreview={handleSetFreePreview} course={courses[0]}/>}
                            </div>
                        </div>
                    </main>

                    <aside className="lg:w-[480px] relative">
                        <div className="sticky top-20 rounded-br-xl rounded-tl-xl p-3 bg-sky-950/30 overflow-hidden">
                            <div className="relative aspect-video">
                                {!freeUrl && 
                                <div className="absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                    <Alert variant={'default'}>
                                        <BadgeAlertIcon/> No free preview
                                    </Alert>
                                </div>}
                                <VideoPlayer 
                                    url={`${env.AMZ_BUCKET_NAME}/${freeUrl}`}
                                />
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-2xl font-bold text-white">₹{courses[0]?.pricing}</span>
                                    <span className="bg-sky-500/20 text-sky-300 px-3 py-1 rounded-full text-sm">
                                        {courses[0]?.level}
                                    </span>
                                </div>
                                
                                <AnimatePresence mode="wait">
                                   
                                        <motion.button
                                            key="buyButton"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.1 }}
                                            onClick={isAuthenticated ? handleTogglePayButton : toastAuthCheck}
                                            className={`${isToggledPayButton && 'hidden'} rounded-tr-none rounded-bl-none bg-sky-800/30 border border-sky-700/50 hover:bg-sky-600/40 text-white font-semibold py-2 px-4 rounded-lg`}
                                        >
                                            Buy Now
                                        </motion.button>
                                        <motion.div
                                            key="paypalButton"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.1 }}
                                            className={`${!isToggledPayButton && 'hidden'}`}
                                        >
                                            <PaypalPayment courseData={courses[0]}/>
                                        </motion.div>
                                   
                                </AnimatePresence>
                            </div>
                        </div>
                    </aside>
                </div>
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
                                    url={`${env.AMZ_BUCKET_NAME}/${displayCurrentVideoFreePreview}`}
                                />
                            </div>
                            <div>
                                {
                                    courses[0]?.modules.map((module) => (
                                        module.chapters.filter(chapter => chapter.freePreview).map((chapter) => (
                                            <div className="flex items-center">
                                                <PlayCircle className="w-5 h-5 text-sky-300/50" />
                                                <Button variant={"link"} className="text-sky-300/60 text-sm" key={chapter.id} onClick={() => setDisplayCurrentVideoFreePreview(chapter.videoKey as string)}>
                                                    {chapter.title}
                                                </Button>
                                            </div>
                                        ))
                                    ))
                                }
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
            </div>
        </div>
    )
}

export default CourseDetailsPage