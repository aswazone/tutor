import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Chapter, ICourse, IProgressData, Module } from "@/types/course.type"
import { AudioLines, CirclePlay } from "lucide-react"
import { motion } from "framer-motion";
import { CheckCheck } from "../common/VerifiedBadge";



export function CourseProgressModules({ course, progressData, currentChapterId, handleSetFreePreview }: { course: ICourse, progressData: IProgressData | undefined, currentChapterId: string, handleSetFreePreview: (chapter: Chapter) => void }) {
  const isCompleted = progressData
  
  console.log(isCompleted,'progressData');
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full space-y-1"
      defaultValue="item-1"
    >
      {course.modules.map((module: Module) => (
        <AccordionItem 
          key={module.id} 
          value={module.id}
          className="border-none rounded-bl-xl rounded-tr-xl pb-0 bg-gradient-to-bl from-sky-700/12 from-20% to-10% to-sky-950/15 backdrop-blur-3xl shadow-lg"
        >
          <AccordionTrigger className="ps-5 pe-3 py-4 text-md font-semibold hover:text-white/80 text-white/50 transition-colors">
            {module.title}
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4">
            <p className="text-gray-300 mb-4">{module.description}</p>
            <div className="space-y-3">
              {module.chapters.map((chapter: Chapter) => (
                  <div 
                    key={chapter.id}
                    className={`p-2 rounded-lg bg-sky-900/30 border border-sky-800/50 cursor-pointer hover:bg-sky-900/40 backdrop-blur-sm flex items-center justify-between group`}
                  >
                    <div className="relative w-full flex items-center gap-3" onClick={chapter.freePreview ? () => handleSetFreePreview(chapter):undefined}>
                      {
                      currentChapterId === chapter.id 
                        ? (
                          <AudioLines className="animate-caret-blink text-sky-400 h-4 w-4"/>
                        ) :
                          (progressData?.progress?.moduleProgress
                          .filter((chapterProgress) => chapterProgress.moduleId === module.id)
                          .some((chapterProgress) => chapterProgress.chapterProgress.some((chapterProgress) => chapterProgress.chapterId === chapter.id)) 
                          ? (
                              <CheckCheck stroke="#34d399" className="w-5 h-5" />
                          ) : (
                            <motion.span
                              initial={{ scale: 1, rotate: 0 }}
                              whileHover={{ scale: 1.2, rotate: -10 }}
                              transition={{ type: "spring", stiffness: 300, damping: 15 }}
                              className="inline-flex"
                            >
                              <CirclePlay className="w-5 h-5 text-sky-400" />
                            </motion.span>
                          )
                        )
                        }
                      
                      <p className="font-medium text-sm">{chapter.title}</p>
                    </div>
                  </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
      
    </Accordion>
  )
}
