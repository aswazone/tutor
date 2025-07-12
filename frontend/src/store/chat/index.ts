import { createSlice } from "@reduxjs/toolkit"


interface IChatState {
    selectedChatType: string | undefined
    selectedChatData: any
    selectedChatMessages: []
}

const initialState:IChatState = {
    selectedChatType: undefined,
    selectedChatData: undefined,
    selectedChatMessages: [],
}


const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setSelectedChatType: (state, action) => {
            console.log(action.payload);
            state.selectedChatType = action.payload
        },
        setSelectedChatData: (state, action) => {
            state.selectedChatData = action.payload
        },
        setSelectedChatMessages: (state, action) => {
            state.selectedChatMessages = action.payload
        },
        closeChat: (state) => {
            state.selectedChatType = undefined
            state.selectedChatData = undefined
            state.selectedChatMessages = []
        },
    },
})

export const {
    closeChat, 
    setSelectedChatData, 
    setSelectedChatType
} = chatSlice.actions;
export default chatSlice.reducer;