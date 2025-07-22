import { Model } from "mongoose";
import { INoteModel } from "../interface/note.model.interface";
import { Note } from "@/schema/note.schema";

export const NoteModel: Model<INoteModel> = Note;