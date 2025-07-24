import { useState, useMemo, useCallback } from "react";
import { Badge } from "../ui/badge";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { motion, AnimatePresence } from "framer-motion";
import { Trash } from "lucide-react";
import axiosInstance from "@/config/axios.config";
import { toast } from "sonner";

interface QuickNotesProps {
  handleNoteClick: (timestamp: number) => void;
  fetchNotes: () => void
}

const QuickNotes = ({ handleNoteClick, fetchNotes }: QuickNotesProps) => {
  const [show, setShow] = useState(false);
  const { notes } = useSelector((state: RootState) => state.note);

  const handleToggle = () => setShow(prev => !prev);
  const handleDeleteNoteConform = useCallback(async (id: string) => {
    toast("Do you want to delete this note ?",{
      position: "top-right",
      className: "mt-10 h-10",
      action: {
          label: "Delete",
          onClick: () => {
              deleteNote(id);
          }
      },
      cancel: {
          label: "Cancel",
          onClick: () => {
              toast.dismiss();
          }
      }
    });
    const deleteNote = async (id: string) => {
      try {
        toast("Note deleted");
        const response = await axiosInstance.delete(`/api/v1/notes/${id}`);
        console.log(response.data);
        fetchNotes();
      } catch (error) {
        console.log(error);
      }
    }
  },[fetchNotes]);


  const renderedNotes = useMemo(() => {
    if (!notes || notes.length === 0) {
      return (
        <p className="text-sky-300/60 text-xs text-center mt-5">~ No notes found ~</p>
      );
    }

    return notes.map((note, i) => (
      <div key={i} className="pb-2 border-b">
        <Badge
          onClick={() => handleNoteClick(note.timestamp)}
          variant="outline"
          className="cursor-pointer rounded-tl-none border text-xs hover:scale-105 hover:text-green-300 transition-all duration-200"
        >
          {(note.timestamp / 100).toFixed(2)}
        </Badge>
        <ul className="flex justify-between list-disc list-outside text-sky-300/60 text-xs px-3 pt-1">
          <li>{note.text}</li>
          <Trash onClick={() => handleDeleteNoteConform(note._id)} className="h-4 w-4 hover:text-red-500 cursor-pointer transition-all duration-300 transform hover:scale-105"/>
        </ul>
      </div>
    ));
  }, [notes, handleNoteClick, handleDeleteNoteConform]);

  return (
    <>
      <div
        onClick={handleToggle}
        className="text-sm cursor-pointer absolute top-3 right-3 bg-[#081f33] text-sky-200/70 border-y-1 rounded-l-md border-sky-600/30 hover:text-sky-400 ps-2 pe-4 py-1 z-20 overflow-hidden"
        style={{
            clipPath: "polygon(0% 0%, 80% 0%, 100% 50%, 80% 100%, 0% 100%)",
        }}
        >
        <AnimatePresence mode="wait">
            <motion.span
            key={show ? "close" : "open"}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.25 }}
            className="block"
            >
            {show ? "Close" : "Notes"}
            </motion.span>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {show && (
          <motion.div
            key="quick-notes"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute top-1 -right-[315px] w-[300px] h-[400px] shadow-xl text-sky-200/70 bg-[#051828]/50 backdrop-blur-lg border rounded-lg rounded-tr-none rounded-bl-none overflow-y-auto z-10"
          >
            <div className="relative p-3 border-sky-400/20">
              <div className="sticky text-center bg-sky-950/80 shadow-xl backdrop-blur-xl font-semibold text-sm underline underline-offset-3 rounded truncate top-3 p-1 mb-2">
                # QUICK NOTES !
              </div>
              {renderedNotes}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default QuickNotes;
