import { createSlice } from "@reduxjs/toolkit";


export interface ChapterNote {
    _id: string;
    userId: string;
    courseId: string;
    chapterId: string;
    timestamp: number;
    text: string;
    createdAt: Date;
}

interface NoteState {
    notes: ChapterNote[];
}

const initialState: NoteState = {
    notes: [],
};

export const noteSlice = createSlice({
    name: 'note',
    initialState,
    reducers: {
        setNotes: (state, action) => {
            state.notes = action.payload
        },
    }, 
})

export const { setNotes } = noteSlice.actions
export default noteSlice.reducer;