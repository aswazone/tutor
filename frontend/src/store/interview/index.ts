
import { InterviewDataState } from "@/types/interview.type";
import { createSlice } from "@reduxjs/toolkit";

interface InterviewState {
    interviewUserinfo: InterviewDataState 
}

const initialState: InterviewState = {
    interviewUserinfo: {
        questions: [],
        domain: '',
        description: '',
        duration: '',
        interviewTypes: [],
        userEmail: '',
        candidateName: '',
    }
};

const interviewSlice = createSlice({
    name: "interview",
    initialState,
    reducers: {
        setInterviewUserinfo: (state, action) => {
            state.interviewUserinfo = action.payload;
        },
    },
});

export const { setInterviewUserinfo } = interviewSlice.actions;
export default interviewSlice.reducer;