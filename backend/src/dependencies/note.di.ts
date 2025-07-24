import { NoteController } from "@/controllers/implements/note.controller";
import { NoteRepository } from "@/repositories/implements/note.repository";
import { NoteService } from "@/services/implements/note.service";

export const noteController = new NoteController(new NoteService(new NoteRepository()));