import { ICourse } from '@/types/course.type';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance, { axiosErrorMessage } from '@/config/axios.config';

interface WishlistState {
  items: ICourse[];
  isLoading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  isLoading: false,
  error: null,
};

export const fetchWishlist = createAsyncThunk(

  'wishlist/fetchItems',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/v1/wishlist');
      return response.data;
    } catch (err) {
      return rejectWithValue(axiosErrorMessage(err));
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/addItem',
  async (courseId: string, { rejectWithValue }) => {
    try {
      await axiosInstance.post(`/api/v1/wishlist/${courseId}`);
      return courseId;
    } catch (err) {
      return rejectWithValue(axiosErrorMessage(err));
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeItem',
  async (courseId: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/v1/wishlist/${courseId}`);
      return courseId;
    } catch (err) {
      return rejectWithValue(axiosErrorMessage(err));
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })      // Add to Wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        // We'll handle the refetch in the component
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Remove from Wishlist  
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item._id !== action.payload);
        state.error = null;
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default wishlistSlice.reducer;
