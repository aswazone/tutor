import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance, { axiosErrorMessage } from '@/config/axios.config';

interface AdminState {
  isLoading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  isLoading: false,
  error: null
};

export const verifyCourse = createAsyncThunk<
  { message: string },
  { courseId: string; isVerified: string ,rejectReason?: string},
  { rejectValue: string }
>('admin/verifyCourse', async ({ courseId, isVerified ,rejectReason}, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.patch(`/api/v1/courses/${courseId}/verify/${isVerified}`, {rejectReason});
    return response.data;
  } catch (err) {
    const message = axiosErrorMessage(err);
    return rejectWithValue(message);
  }
});

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(verifyCourse.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyCourse.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(verifyCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Failed to verify course';
      });
  },
});

export default adminSlice.reducer;
