import { useState } from "react";
import { Badge } from "../ui/badge";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const QuickNotes = ({handleNoteClick}:{handleNoteClick:(timestamp: number)=>void}) => {

    const [show, setOpen] = useState(false);
    const {notes} = useSelector((state:RootState) => state.note);
    const handleOpenQuickNotes = () => setOpen(!show);

  return (
    <>
    <div 
    onClick={handleOpenQuickNotes} className="text-sm cursor-pointer absolute top-3 right-3 bg-[#081f33] text-sky-200/70 border-y-1 rounded-l-md border-sky-600/30 hover:text-sky-400 ps-2 pe-4 py-1" 
    style={{clipPath: 'polygon(0% 0%, 80% 0%, 100% 50%, 80% 100%, 0% 100%)'}}
    >
        {show ? 'Close' : 'Quick Notes'}
    </div>
    <div className={`${!show ? 'opacity-0 -z-1' : 'z-1'} absolute top-1 -right-[315px] w-[300px] h-[400px] shadow-xl text-sky-200/70 bg-[#051828]/50 backdrop-blur-lg border rounded-lg rounded-tr-none rounded-bl-none overflow-y-auto transition-all duration-600`}>
        <div className="relative p-3 border-sky-400/20">
            <div className="sticky text-center bg-sky-950/80 shadow-xl backdrop-blur-xl font-semibold text-sm underline underline-offset-3 rounded truncate top-3 p-1 mb-2"># QUICK NOTES !</div>
            {
                // Array(10).fill(0)
               notes?.length > 0 ? notes
                .map((note, i) => (
                    <div key={i} className="pb-2 border-b">
                        <Badge onClick={() => handleNoteClick(note.timestamp)} variant={'outline'} className="cursor-pointer rounded-tl-none border text-xs">{(note.timestamp / 100).toFixed(2)}</Badge>
                        <ul className="list-disc list-outside text-sky-300/60 text-xs px-3 pt-1">
                            <li>{note.text}</li>
                        </ul>
                    </div>
                ))
                :
                <p className="text-sky-300/60 text-xs text-center mt-5">~ No notes found ~</p>
            }
        </div>
    </div>
    </>
  )
}

export default QuickNotes