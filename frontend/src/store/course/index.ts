import { Chapter, Module } from "@/types/course.type";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { CourseLandingFormData } from "@/schemas/course/course-landing.schema";
import axiosInstance, { axiosErrorMessage } from "@/config/axios.config";



interface CourseEditorState {
  modules: Module[];
  isChapterModalOpen: boolean;
  isModuleModalOpen: boolean;
  selectedModuleIndex: number | null;
  selectedChapterIndex: number | null;
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
    selectedModuleIndex: null,
    selectedChapterIndex: null,
    courseId: "",
    courseTitle: "",
    courseCategory: "",
    courseDescription: "",
    thumbnailUploadStatus: "idle",
    uploadStatus: "idle",
    submitStatus: "idle",
  },
};



import { UploadCourseResult } from "@/types/store.types";

export const uploadCourseFiles = createAsyncThunk<UploadCourseResult, { courseImage: File; modules: Module[] }, { rejectValue: string }>(
  "course/uploadFiles",
  async ({ courseImage, modules }, { rejectWithValue }) => {
    try {
      // 1. Upload course thumbnail
        //fileName: 'course-videos/mockTest',
        // fileType: 'video/mp4'
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

      
      
      // 2. Upload chapter videos
      const uploadedModules = await Promise.all(modules.map(async (module) => {
        const modulesWithUploadedVideos = await Promise.all(module.chapters.map(async (chapter) => {
          if (chapter.video instanceof File) {
            const videoResponse = await axiosInstance.get<{ url: string; key: string }>("/api/v1/upload/presigned-url", {
              params: {
                fileName: `${module.id}/${chapter.id}/${chapter.video.name}`,
                fileType: chapter.video.type
              }
            });

            fetch(videoResponse.data.url, {
              method: 'PUT',
              body: chapter.video,
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
              ...chapter,
              videoKey: videoResponse.data.key,
              videoUploadStatus: "success" as const,
              video: undefined // Remove the File object after upload
            };
          }
          return chapter;
        }));
        
        return {
          ...module,
          chapters: modulesWithUploadedVideos
        };
      }));

      return {
        thumbnailKey: thumbnailResponse.data.key,
        modules: uploadedModules
      };
    } catch (err) {
      console.log(err, 'upload error');
      const message = axiosErrorMessage(err);
      return rejectWithValue(message);
    }
  }
);

export const submitCourse = createAsyncThunk<string, { courseDetails: CourseLandingFormData, thumbnailKey: string, modules: Module[], isPublished: boolean }, { rejectValue: string }>(
  "course/submit",
  async (courseData: {
    courseDetails: CourseLandingFormData,
    thumbnailKey: string,
    modules: Module[]
    isPublished: boolean
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

const courseSlice = createSlice({
  name: "courseEditor",
  initialState,
  reducers: {
    setModules: (state, action: PayloadAction<Module[]>) => {
      state.courseEditor.modules = action.payload;
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
    .addCase(uploadCourseFiles.pending, (state) => {
      state.courseEditor.uploadStatus = "uploading";
      state.courseEditor.uploadError = undefined;
    })
    .addCase(uploadCourseFiles.fulfilled, (state, action) => {
      state.courseEditor.thumbnailKey = action.payload.thumbnailKey;
      state.courseEditor.modules = action.payload.modules.map((module) => ({
        ...module,
        chapters: module.chapters.map((chapter) => ({
          ...chapter,
          videoUploadStatus: chapter.videoUploadStatus as "idle" | "uploading" | "success" | "error",
        })),
      }));
      state.courseEditor.uploadStatus = "success";
    })
    .addCase(uploadCourseFiles.rejected, (state, action) => {
      state.courseEditor.uploadStatus = "error";
      state.courseEditor.uploadError = action.payload as string;
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
    });
  }
});

export const {
  setModules,
  setCourseId,
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