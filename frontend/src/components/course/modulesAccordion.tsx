import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Chapter, ICourse, Module } from "@/types/course.type"
import { CirclePlay, Lock } from "lucide-react"


export function CourseModules({ course,handleSetFreePreview }: { course: ICourse, handleSetFreePreview: (chapter: Chapter) => void }) {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full space-y-4"
      defaultValue="item-1"
    >
      {course.modules.map((module: Module) => (
        <AccordionItem 
          key={module.id} 
          value={module.id}
          className="border-none rounded-bl-xl rounded-tr-xl pb-0 bg-gradient-to-bl from-sky-700/12 from-20% to-10% to-sky-950/15 backdrop-blur-3xl shadow-lg"
        >
          <AccordionTrigger className="px-6 py-4 text-lg font-semibold hover:text-sky-400 transition-colors">
            {module.title}
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4">
            <p className="text-gray-300 mb-4">{module.description}</p>
            <div className="space-y-3">
              {module.chapters.map((chapter: Chapter) => (
                <div 
                  key={chapter.id}
                  className={`p-4 rounded-lg ${
                    chapter.freePreview 
                      ? 'bg-sky-900/30 border border-sky-800/50 cursor-pointer hover:bg-sky-900/40' 
                      : 'rounded-br-md rounded-tl-md p-3 bg-sky-950/30 grayscale-70 poiner-events-none'
                  } backdrop-blur-sm flex items-center justify-between`}
                >
                  <div className="flex items-center gap-3" onClick={chapter.freePreview ? () => handleSetFreePreview(chapter):undefined}>
                    
                    {chapter.freePreview ? <CirclePlay className="w-5 h-5 text-sky-400" /> : <Lock className="w-5 h-5 text-sky-400" /> }
                    <p className="font-medium text-sm">{chapter.title}</p>
                  </div>
                  {chapter.freePreview && (
                    <span className="text-[8px] bg-sky-500/20 text-sky-300 px-2 py-1 rounded">
                      Free Preview
                    </span>
                  )}
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
      
    </Accordion>
  )
}
