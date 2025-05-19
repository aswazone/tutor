import axiosInstance, { axiosErrorMessage } from "@/config/axios.config";
import { IAuthState, SignInRequest, SignInResponse, SignUpRequest, SignUpResponse } from "@/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";



const initialState: IAuthState = {
    accessToken: "",
    activeTab: "overview",
    user: null, 
    isAuthenticated: false,
    isLoading: false,
    error: null
}

export const signupUser = createAsyncThunk<
    SignUpResponse,
    SignUpRequest,
    { rejectValue: string }
>('/auth/signup', async (formData, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post('api/v1/auth/signup', formData);
        return response.data;
    } catch (err: unknown) {
        const message = axiosErrorMessage(err);
        return rejectWithValue(message);
    }
});

export const signinUser = createAsyncThunk<
    SignInResponse,
    SignInRequest,
    { rejectValue: string }
>('/auth/signin', async (formData, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post('api/v1/auth/signin', formData);
        return response.data;
    } catch (err: unknown) {
        const message = axiosErrorMessage(err);
        return rejectWithValue(message);
    }
});


export const verifyOtp = createAsyncThunk<
    { accessToken: string; user: Record<string, string> },
    { otp: string; email: string },
    { rejectValue: string }
>('/auth/verify-otp', async ({ otp, email }, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post('api/v1/auth/verify-otp', { otp, email });
        return response.data;
    } catch (err: unknown) {
        const message = axiosErrorMessage(err);
        return rejectWithValue(message);
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action: { payload: Record<string, string> }) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        setAccessToken: (state, action: { payload: string }) => {
            state.accessToken = action.payload;
        },
        logout: (state) => {
            state.accessToken = "";
            state.user = null;
            state.isAuthenticated = false;
        },
        setActiveTab: (state, action: { payload: string }) => {
            state.activeTab = action.payload;
        },
        
    },
    extraReducers: (builder) => {
        builder
            .addCase(signinUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(signinUser.fulfilled, (state, action: { payload: { accessToken: string; user: Record<string, string> } }) => {
                state.isLoading = false;
                state.accessToken = action.payload.accessToken;
                state.user = action.payload.user;
                state.isAuthenticated = true;
            })
            .addCase(signinUser.rejected, (state, action: { payload: string | undefined }) => {
                state.isLoading = false;
                state.error = action.payload ?? null;
            })
            .addCase(signupUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(signupUser.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(signupUser.rejected, (state, action: { payload: string | undefined }) => {
                state.isLoading = false;
                state.error = action.payload ?? null;
            })
            .addCase(verifyOtp.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(verifyOtp.fulfilled, (state, action: { payload: { accessToken: string; user: Record<string, string> } }) => {
                state.isLoading = false;
                state.accessToken = action.payload.accessToken;
                state.user = action.payload.user;
                state.isAuthenticated = true;
            })
            .addCase(verifyOtp.rejected, (state, action: { payload: string | undefined }) => {
                state.isLoading = false;
                state.error = action.payload ?? null;
            });
    }
});


export const { setUser, logout, setAccessToken, setActiveTab } = authSlice.actions;
export default authSlice.reducer;