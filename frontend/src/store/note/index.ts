import { createSlice } from "@reduxjs/toolkit";


export interface ChapterNote {
    id: string;
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
        addNote: (state, action) => {
            state.notes = [...state.notes, ...action.payload];
        },
        deleteNote: (state, action) => {
            state.notes = state.notes.filter((note) => note.id !== action.payload);
        },
    },
})

export const { setNotes, addNote, deleteNote } = noteSlice.actions
export default noteSlice.reducer;