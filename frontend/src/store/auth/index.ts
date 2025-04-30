import { createSlice } from "@reduxjs/toolkit";

interface IAuthState {
    token: string,
    user: Record<string, unknown> | null,
    isAuthenticated: boolean,
    isLoading: boolean,
    error: Error | null
}

const initialState: IAuthState = {
    token: "",
    user: null, 
    isAuthenticated: false,
    isLoading: false,
    error: null
}


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser : (state,action) => {}
    },
});

export const {setUser} = authSlice.actions;
export default authSlice.reducer;