import { Video } from "lucide-react"

const CreateOptions = ({setOpen}:{setOpen: (open: boolean) => void}) => {
  return (
    <div className="grid gap-5">
        <div onClick={() => setOpen(true)} className="flex gap-3 items-centerborder cursor-pointer hover:scale-102 transition-all duration-300 border-sky-900/20 rounded-b-lg rounded-tr-2xl p-5 bg-gradient-to-bl from-sky-700/12 from-20% to-10% to-sky-950/15 backdrop-blur-3xl">
            <Video className="p-3 text-sky-400/60 border border-sky-600/10 bg-sky-950/30 rounded-tl-none rounded-lg h-12 w-12" />
            <div className="flex flex-col">
              <h1 className="font-bold text-sky-200/80">Create New Interview</h1>
              <p className="text-xs text-sky-400/40">Create AI interview and schedule then with Candidates</p>
            </div>
        </div>
        {/* <div  onClick={() => setOpen(true)} className="border cursor-pointer hover:scale-102 transition-all duration-300 border-sky-900/20 rounded-b-lg rounded-tr-2xl p-5 bg-gradient-to-bl from-sky-700/12 from-20% to-10% to-sky-950/15 backdrop-blur-3xl">
            <Phone className="p-3 text-sky-400/60 border border-sky-600/10 bg-sky-950/30 rounded-tl-none rounded-lg h-12 w-12" />
            <h1 className="font-bold mt-2 text-sky-200/80">Create Phone Screening Call</h1>
            <p className="text-xs text-sky-400/40">Schedule phone screening call with candidates</p>
        </div> */}
    </div>
  )
}
export default CreateOptions