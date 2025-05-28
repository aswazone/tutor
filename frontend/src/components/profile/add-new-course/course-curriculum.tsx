import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ArrowDownUp, ChevronsUpDown, Edit, Trash } from "lucide-react"
import { DeleteConfirmDialog } from "@/components/common/DeleteConfirmDialog"
import { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { ModuleForm } from "./module-form"
import { ChapterForm } from "./chapter-form"
import { Chapter, Module } from "@/types/course.type"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/store"
import { addModule, addChapter, closeChapterModal, closeModuleModal, openChapterModal, openModuleModal, editChapter, editModule, deleteChapter, deleteModule, uploadSingleVideoFile, setSelectedChapterId, setSelectedModuleId } from "@/store/course"
import {v4 as uuid} from 'uuid'
import { toast } from "sonner"

const CourseCurriculum = () => {
  const { isModuleModalOpen, isChapterModalOpen, modules, selectedModuleIndex, selectedChapterIndex } = 
    useSelector((state: RootState) => state.course.courseEditor);
  const dispatch = useDispatch<AppDispatch>();

  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    type: '' as 'Module' | 'Chapter',
    moduleIndex: -1,
    chapterIndex: -1
  });

  const handleDelete = (type: 'Module' | 'Chapter', moduleIndex: number, chapterIndex?: number) => {
    setDeleteDialog({
      isOpen: true,
      type,
      moduleIndex,
      chapterIndex: chapterIndex ?? -1
    });
  };

  const handleConfirmDelete = () => {
    if (deleteDialog.type === 'Module') {
      dispatch(deleteModule(deleteDialog.moduleIndex));
    } else {
      dispatch(deleteChapter({ 
        moduleIndex: deleteDialog.moduleIndex, 
        chapterIndex: deleteDialog.chapterIndex 
      }));
    }
  };

  const handleAddModule = (data: { title: string; description: string }) => {
    if (selectedModuleIndex !== null) {
      // Edit existing module
      const editedModule: Module = {
        ...modules[selectedModuleIndex],
        title: data.title,
        description: data.description,
      };
      dispatch(editModule({ index: selectedModuleIndex, module: editedModule }));
    } else {
      // Add new module
      const newModule: Module = {
        id: uuid(),
        title: data.title,
        description: data.description,
        chapters: []
      };
      dispatch(addModule(newModule));
    }
    dispatch(closeModuleModal());
  };

  const handleAddChapter = async (data: {
    title: string;
    content: string;
    video?: File;
    pdf?: File;
    subtitle?: File;
  }) => {
    if (selectedModuleIndex === null) return;
    const moduleId = modules[selectedModuleIndex].id;
    const chapterId = uuid();
   
    console.log(data.video,'add chapter video',typeof data.video);
    // return
    console.log(chapterId, moduleId, 'WHEN EDIT/ADD CHAPTER !!');
    const uploadedVideo = typeof data.video === 'string' 
        ? { videoKey: data.video, videoUploadStatus: "success" as const, videoUploadError: "" } 
        : await dispatch(uploadSingleVideoFile({ video: data.video! , moduleId, chapterId})).unwrap();
    if(uploadedVideo.videoUploadStatus === "error") {
      toast.error("Failed to upload video, please try again");
      return;
    }
    const newChapter: Chapter = {
      id: chapterId,
      title: data.title,
      content: data.content,
      videoKey: uploadedVideo.videoKey,
      videoUploadStatus: uploadedVideo.videoUploadStatus,
      videoUploadError: uploadedVideo.videoUploadError,
      pdfUrl: data.pdf ? data.pdf: undefined,
      subtitleUrl: data.subtitle ? data.subtitle : undefined,
    };

    if (selectedChapterIndex !== null) {
      // Edit existing chapter
      dispatch(editChapter({ 
        moduleIndex: selectedModuleIndex, 
        chapterIndex: selectedChapterIndex,
        chapter: {
          ...modules[selectedModuleIndex].chapters[selectedChapterIndex],
          ...newChapter
        }
      }));
    } else {
      // Add new chapter
      dispatch(addChapter({ 
        moduleIndex: selectedModuleIndex, 
        chapter: newChapter 
      }));
    }
    toast.success("Chapter saved successfully!");
    dispatch(closeChapterModal());
  };

  // Get the initial data for the form when editing
  const getModuleInitialData = () => {
    if (selectedModuleIndex !== null && modules[selectedModuleIndex]) {
      const module = modules[selectedModuleIndex];
      return {
        title: module.title,
        description: module.description,
      };
    }
    return undefined;
  };

  const getChapterInitialData = () => {
    if (selectedModuleIndex !== null && selectedChapterIndex !== null && 
        modules[selectedModuleIndex]?.chapters[selectedChapterIndex]) {
      const chapter = modules[selectedModuleIndex].chapters[selectedChapterIndex];
      return {
        title: chapter.title,
        content: chapter.content,
        video: chapter.videoKey,
        pdfUrl: chapter.pdfUrl,
        subtitleUrl: chapter.subtitleUrl
      };
    }
    return undefined;
  };

  return (
    <div className="border rounded-md flex-col">
      <Button 
        className="m-3 text-xs border rounded-tl-none rounded-br-none bg-sky-950/10 text-sky-200/50 hover:text-sky-500/50 hover:bg-sky-950/20" 
        onClick={() => dispatch(openModuleModal({moduleIndex: null}))}
      >
        + Add Module
      </Button>

      {modules && modules.map((module, moduleIndex) => (
        <Card key={module.id} className="mx-3 my-2 gap-2 rounded-bl-none rounded-tr-none pb-0 bg-gradient-to-bl from-sky-700/12 from-20% to-10% to-sky-950/15 backdrop-blur-3xl">
          <CardHeader className="border-b rounded-br-lg flex justify-between">
            <div className="left flex-col">
              <CardTitle className="flex items-center gap-2">
                <ArrowDownUp className="text-sky-300/50" size={12} />
                {module.title}
              </CardTitle>
              <span className="text-xs text-sky-200/50">{module.description}</span>
            </div>
            <div className="right flex items-center gap-2">
              <Trash className="text-sky-300/50 hover:text-sky-300" size={15}
                onClick={() => handleDelete('Module', moduleIndex)}/>              
              <Edit 
                className="text-sky-300/50 hover:text-sky-300" 
                size={15}
                onClick={() => dispatch(openModuleModal({ moduleIndex }))} 
              />
            </div>
          </CardHeader>
           <CardContent className={`gap-1 ${module.chapters.length === 0 ? "hidden" : "flex flex-col"}`}>
            {module.chapters.map((chapter, chapterIndex) => (
              <div key={chapter.id} className="flex w-[90%] justify-between items-center rounded-br-md rounded-tl-md p-3 bg-sky-950/30">
                <div className="left flex items-center gap-1.5">
                  <ChevronsUpDown className="text-sky-300/50" size={10}/>
                  <Label className="text-xs text-sky-200/50">{chapter.title}</Label>
                </div>
                <div className="right flex items-center gap-2">
                  <Trash className="text-sky-300/50 hover:text-sky-300" size={15}
                    onClick={() => handleDelete('Chapter', moduleIndex, chapterIndex)}/>
                  <Edit 
                    className="text-sky-300/50 hover:text-sky-300" 
                    size={15} 
                    onClick={() => {
                      dispatch(openChapterModal({moduleIndex, chapterIndex}))
                      dispatch(setSelectedChapterId(chapter.id));
                      dispatch(setSelectedModuleId(module.id));
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
          <span 
            className="text-xs ms-auto font-bold text-sky-300/50 hover:text-sky-300 p-4 cursor-pointer"
            onClick={() => dispatch(openChapterModal({moduleIndex, chapterIndex: null}))}
          >
            + Add Chapter
          </span>
        </Card>
      ))}

      <Sheet open={isModuleModalOpen} onOpenChange={()=> dispatch(closeModuleModal())}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>{selectedModuleIndex !== null ? 'Edit Module' : 'Add Module'}</SheetTitle>
          </SheetHeader>          
          <ModuleForm
            onSubmit={handleAddModule}
            onCancel={() => dispatch(closeModuleModal())}
            initialData={getModuleInitialData()}
          />
        </SheetContent>
      </Sheet>

      <Sheet open={isChapterModalOpen} onOpenChange={() => dispatch(closeChapterModal())}>
        <SheetContent side="right" className="overflow-y-scroll">
          <SheetHeader>
            <SheetTitle>{selectedChapterIndex !== null ? 'Edit Chapter' : 'Add Chapter'}</SheetTitle>
          </SheetHeader>          
          <ChapterForm
            onSubmit={handleAddChapter}
            onCancel={() => dispatch(closeChapterModal())}
            initialData={getChapterInitialData()}
          />
        </SheetContent>
      </Sheet>

      <DeleteConfirmDialog 
        open={deleteDialog.isOpen} 
        onClose={() => setDeleteDialog(prev => ({...prev, isOpen: false}))}
        onConfirm={handleConfirmDelete}
        title={`Delete ${deleteDialog.type}`}
        description={deleteDialog.type === 'Module' 
          ? 'Are you sure you want to delete this module? All associated chapters will be also deleted.' 
          : 'Are you sure you want to delete this chapter? This action cannot be undone.'}
      />
    </div>
  )
}

export default CourseCurriculum