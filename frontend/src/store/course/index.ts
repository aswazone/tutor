import { Chapter, Module } from "@/types/course.type";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { CourseLandingFormData } from "@/schemas/course/course-landing.schema";
import axiosInstance, { axiosErrorMessage } from "@/config/axios.config";



interface CourseEditorState {
  modules: Module[];
  isChapterModalOpen: boolean;
  isModuleModalOpen: boolean;
  selectedModuleIndex: number | null;
  selectedChapterId: string | null;
  selectedModuleId: string | null;
  selectedChapterIndex: number | null;
  editMode: { status:boolean, courseId: string };
  courseId: string;
  courseTitle: string;
  courseCategory: string;
  courseDescription: string;
  thumbnailKey?: string;
  thumbnailUploadStatus: "idle" | "uploading" | "success" | "error";
  thumbnailUploadError?: string;
  uploadStatus: "idle" | "uploading" | "success" | "error";
  uploadError?: string;
  submitStatus: "idle" | "submitting" | "success" | "error";
  submitError?: string;
}


interface InitialStateTypes {
  courseEditor: CourseEditorState;
}

const initialState: InitialStateTypes = {
  courseEditor: {
    modules: [],
    isChapterModalOpen: false,
    isModuleModalOpen: false,
    selectedModuleId: null,
    selectedChapterId: null,
    selectedModuleIndex: null,
    selectedChapterIndex: null,
    editMode: { status: false, courseId: "" },
    courseId: "",
    courseTitle: "",
    courseCategory: "",
    courseDescription: "",
    thumbnailUploadStatus: "idle",
    uploadStatus: "idle",
    submitStatus: "idle",
  },
};



import { UploadImageResult, UploadPdfResult, UploadVideoResult } from "@/types/store.types";

export const uploadSingleVideoFile = createAsyncThunk<UploadVideoResult, { video: File, moduleId: string, chapterId: string }, { rejectValue: string }>(
  "course/uploadSingleVideoFile",
  async ({ video , moduleId, chapterId}, { rejectWithValue }) => {
    try {
            const videoResponse = await axiosInstance.get<{ url: string; key: string }>("/api/v1/upload/presigned-url", {
              params: {
                fileName: `${moduleId}/${chapterId}/${video.name}`,
                fileType: video.type
              }
            });

            fetch(videoResponse.data.url, {
              method: 'PUT',
              body: video,
              headers: {
                'Content-Type': 'video/*' 
              }
            })
            .then(response => {
              if (response.ok) {
                console.log('Upload successful!');
              } else {
                console.error('Upload failed:', response.statusText);
              }
            })
            .catch(error => console.error('Error:', error));

            return {
              videoKey: videoResponse.data.key,
              videoUploadStatus: "success" as const,
              videoUploadError: "",
            }
    } catch (err) {
      console.log(err, 'upload error');
      const message = axiosErrorMessage(err);
      return rejectWithValue(message);
    }
  
})

export const uploadSinglePdfFile = createAsyncThunk<UploadPdfResult, { pdf: File, moduleId: string, chapterId: string }, { rejectValue: string }>(
  "course/uploadSingleVideoFile",
  async ({ pdf , moduleId, chapterId}, { rejectWithValue }) => {
    
    try {
            const pdfResponse = await axiosInstance.get<{ url: string; key: string }>("/api/v1/upload/presigned-url", {
              params: {
                fileName: `${moduleId}/${chapterId}/${pdf.name}`,
                fileType: pdf.type
              }
            });

            fetch(pdfResponse.data.url, {
              method: 'PUT',
              body: pdf,
              headers: {
                'Content-Type': 'application/pdf' 
              }
            })
            .then(response => {
              if (response.ok) {
                console.log('Upload successful!');
              } else {
                console.error('Upload failed:', response.statusText);
              }
            })
            .catch(error => console.error('Error:', error));

            return {
              pdfKey: pdfResponse.data.key,
              pdfUploadStatus: "success" as const,
              pdfUploadError: "",
            }
    } catch (err) {
      console.log(err, 'upload error');
      const message = axiosErrorMessage(err);
      return rejectWithValue(message);
    }
  
})


export const uploadSingleImageFile = createAsyncThunk<UploadImageResult, { courseImage: File }, { rejectValue: string }>(
  "course/uploadSingleImageFile",
  async ({ courseImage }, { rejectWithValue }) => {
    try {
      const thumbnailResponse = await axiosInstance.get<{ url: string; key: string }>("/api/v1/upload/presigned-url", {
        params: { 
          fileName: courseImage.name,
          fileType: courseImage.type 
        }
      });

      console.log(thumbnailResponse.data.key);
      console.log(thumbnailResponse.data.url);

        fetch(thumbnailResponse.data.url, {
          method: 'PUT',
          body: courseImage,
          headers: {
            'Content-Type': 'image/*' 
          }
        })
        .then(response => {
          if (response.ok) {
            console.log('Upload successful!');
          } else {
            console.error('Upload failed:', response.statusText);
          }
        })
        .catch(error => console.error('Error:', error));

      console.log('thumbnail uploaded');

      return {
        thumbnailKey: thumbnailResponse.data.key,
        thumbnailUploadStatus: "success" as const,
        thumbnailUploadError: "",
      };
    } catch (err) {
      console.log(err, 'upload error');
      const message = axiosErrorMessage(err);
      return rejectWithValue(message);
    }
  }
);


export const submitCourse = createAsyncThunk<string, { courseDetails: CourseLandingFormData, thumbnailKey: string, modules: Module[], isPublished: boolean ,publishDate?:Date | null, isScheduled?:boolean}, { rejectValue: string }>(
  "course/submit",
  async (courseData: {
    courseDetails: CourseLandingFormData,
    thumbnailKey: string,
    modules: Module[]
    isPublished: boolean
    publishDate?:Date | null
    isScheduled?:boolean
  }, { rejectWithValue }) => {
    try {      
      const response = await axiosInstance.post("/api/v1/courses", courseData);
      return response.data;
    } catch (error) {
      const message = axiosErrorMessage(error);
      return rejectWithValue(message);
    }
  }
);

export const updateCourse = createAsyncThunk<string, { courseDetails: CourseLandingFormData, thumbnailKey: string, modules: Module[], isPublished: boolean ,courseId:string, publishDate?:Date | null, isScheduled?:boolean}, { rejectValue: string }>(
  "course/update",
  async ({
    courseDetails,
    thumbnailKey,
    modules,
    isPublished,
    courseId,
    publishDate,
    isScheduled
  }, { rejectWithValue }) => {
    try {      
      const response = await axiosInstance.put(`/api/v1/courses/${courseId}`, {courseDetails,thumbnailKey,modules,isPublished,publishDate,isScheduled});
      return response.data;
    } catch (error) {
      const message = axiosErrorMessage(error);
      return rejectWithValue(message);
    }
  }
);

const courseSlice = createSlice({
  name: "courseEditor",
  initialState,
  reducers: {
    setModules: (state, action: PayloadAction<Module[]>) => {
      state.courseEditor.modules = action.payload;
    },
    setEditMode: (state, action: PayloadAction<{ status: boolean; courseId: string }>) => {
      state.courseEditor.editMode = action.payload;
    },
    setThumbnailKey: (state, action: PayloadAction<string>) => {
      state.courseEditor.thumbnailKey = action.payload;
    },
    setSelectedChapterId: (state, action: PayloadAction<string>) => {
      state.courseEditor.selectedChapterId = action.payload;
    },
    setSelectedModuleId: (state, action: PayloadAction<string>) => {
      state.courseEditor.selectedModuleId = action.payload;
    },
    setCourseId: (state, action: PayloadAction<string>) => {
      state.courseEditor.courseId = action.payload;
    },
    setCourseTitle: (state, action: PayloadAction<string>) => {
      state.courseEditor.courseTitle = action.payload;
    },
    setCourseCategory: (state, action: PayloadAction<string>) => {
      state.courseEditor.courseCategory = action.payload;
    },
    setCourseDescription: (state, action: PayloadAction<string>) => {
      state.courseEditor.courseDescription = action.payload;
    },
    openChapterModal: (
      state,
      action: PayloadAction<{
        moduleIndex: number | null;
        chapterIndex: number | null;
      }>
    ) => {
      state.courseEditor.isChapterModalOpen = true;
      state.courseEditor.selectedModuleIndex = action.payload.moduleIndex;
      state.courseEditor.selectedChapterIndex = action.payload.chapterIndex;
    },
    closeChapterModal: (state) => {
      state.courseEditor.isChapterModalOpen = false;
      state.courseEditor.selectedModuleIndex = null;
      state.courseEditor.selectedChapterIndex = null;
      state.courseEditor.selectedChapterId = null;
      state.courseEditor.selectedModuleId = null;
    },
    openModuleModal: (
      state,
      action: PayloadAction<{ moduleIndex: number | null }>
    ) => {
      state.courseEditor.isModuleModalOpen = true;
      state.courseEditor.selectedModuleIndex = action.payload.moduleIndex;
    },
    closeModuleModal: (state) => {
      state.courseEditor.isModuleModalOpen = false;
      state.courseEditor.selectedModuleIndex = null;
    },
    addModule: (state, action: PayloadAction<Module>) => {
      state.courseEditor.modules.push(action.payload);
    },
    editModule: (
      state,
      action: PayloadAction<{ index: number; module: Module }>
    ) => {
      state.courseEditor.modules[action.payload.index] = action.payload.module;
    },
    deleteModule: (state, action: PayloadAction<number>) => {
      state.courseEditor.modules.splice(action.payload, 1);
    },
    addChapter: (
      state,
      action: PayloadAction<{ moduleIndex: number; chapter: Chapter }>
    ) => {
      state.courseEditor.modules[action.payload.moduleIndex].chapters.push(
        action.payload.chapter
      );
    },
    editChapter: (
      state,
      action: PayloadAction<{
        moduleIndex: number;
        chapterIndex: number;
        chapter: Chapter;
      }>
    ) => {
      state.courseEditor.modules[action.payload.moduleIndex].chapters[
        action.payload.chapterIndex
      ] = action.payload.chapter;
    },
    deleteChapter: (
      state,
      action: PayloadAction<{ moduleIndex: number; chapterIndex: number }>
    ) => {
      state.courseEditor.modules[action.payload.moduleIndex].chapters.splice(
        action.payload.chapterIndex,
        1
      );
    },
  },
  extraReducers: (builder) => {
  builder
      .addCase(uploadSingleImageFile.pending, (state) => {
        state.courseEditor.thumbnailUploadStatus = "uploading";
      })
      .addCase(uploadSingleImageFile.fulfilled, (state, action) => {
        state.courseEditor.thumbnailKey = action.payload.thumbnailKey;
        state.courseEditor.thumbnailUploadStatus = "success";
      })
      .addCase(uploadSingleImageFile.rejected, (state) => {
        state.courseEditor.thumbnailUploadStatus = "error";
      })
      .addCase(uploadSingleVideoFile.pending, (state) => {
        state.courseEditor.uploadStatus = "uploading";
      })
      .addCase(uploadSingleVideoFile.fulfilled, (state) => {
        state.courseEditor.uploadStatus = "success";
      })
      .addCase(uploadSingleVideoFile.rejected, (state) => {
        state.courseEditor.uploadStatus = "error";
      })
    .addCase(submitCourse.pending, (state) => {
      state.courseEditor.submitStatus = "submitting";
      state.courseEditor.submitError = undefined;
    })
    .addCase(submitCourse.fulfilled, (state) => {
      state.courseEditor.submitStatus = "success";
      state.courseEditor = {
        ...initialState.courseEditor,
        submitStatus: "success"
      };
    })
    .addCase(submitCourse.rejected, (state, action) => {
      state.courseEditor.submitStatus = "error";
      state.courseEditor.submitError = action.payload as string;
    })
    
    .addCase(updateCourse.pending, (state) => {
      state.courseEditor.submitStatus = "submitting";
      state.courseEditor.submitError = undefined;
    })
    .addCase(updateCourse.fulfilled, (state) => {
      state.courseEditor.submitStatus = "success";
      state.courseEditor = {
        ...initialState.courseEditor,
        submitStatus: "success"
      };
    })
    .addCase(updateCourse.rejected, (state, action) => {
      state.courseEditor.submitStatus = "error";
      state.courseEditor.submitError = action.payload as string;
    })
    
  }
});

export const {
  setModules,
  setCourseId,
  setEditMode,
  setThumbnailKey,
  setSelectedModuleId,
  setSelectedChapterId,
  setCourseTitle,
  setCourseCategory,
  setCourseDescription,
  openChapterModal,
  closeChapterModal,
  openModuleModal,
  closeModuleModal,
  addModule,
  editModule,
  deleteModule,
  addChapter,
  editChapter,
  deleteChapter,
} = courseSlice.actions;

export default courseSlice.reducer;