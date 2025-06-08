import { ICourse } from '@/types/course.type';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance, { axiosErrorMessage } from '@/config/axios.config';

interface CourseState {
  items: ICourse[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CourseState = {
  items: [],
  isLoading: false,
  error: null,
};

export const fetchAllCourses = createAsyncThunk(

  'courses/fetchItems',
  async (_, { rejectWithValue }) => {
    try {
    console.log('fetching all courses');

      const response = await axiosInstance.get('/api/v1/courses');
      return response.data;
    } catch (err) {
      return rejectWithValue(axiosErrorMessage(err));
    }
  }
);

export const fetchCourse = createAsyncThunk(

  'courses/fetchItem',
  async (courseId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/v1/courses/${courseId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(axiosErrorMessage(err));
    }
  }
);

export const fetchTutorCourses = createAsyncThunk(

  'courses/fetchTutorItems',
  async (_, { rejectWithValue }) => {
    try {
    console.log('fetching tutor courses');

      const response = await axiosInstance.get('/api/v1/courses/tutor');
      return response.data;
    } catch (err) {
      return rejectWithValue(axiosErrorMessage(err));
    }
  }
);

export const toggleCourseStatus = createAsyncThunk<string, { courseId: string, status: boolean }, { rejectValue: string }>(
  'course/statusToggle',
  async ({ courseId, status }: {courseId: string, status: boolean }, { rejectWithValue }) => {
    try {
      await axiosInstance.patch(`/api/v1/courses/${courseId}/${status}`);
      return courseId;
    } catch (err) {
      return rejectWithValue(axiosErrorMessage(err));
    }
  }
);

export const deleteCourse = createAsyncThunk(
  'course/delete',
  async (courseId: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/v1/courses/${courseId}`);
      return courseId;
    } catch (err) {
      return rejectWithValue(axiosErrorMessage(err));
    }
  }
);

const fetchSlice = createSlice({
  name: 'fetchData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourse.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = [action.payload];
      })
      .addCase(fetchCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAllCourses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllCourses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchAllCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTutorCourses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTutorCourses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchTutorCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(toggleCourseStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(toggleCourseStatus.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(toggleCourseStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(deleteCourse.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })  
      .addCase(deleteCourse.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default fetchSlice.reducer;
