import { CheckCheck } from "@/components/common/VerifiedBadge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { env } from "@/config/env.config"
import { InterviewFormData } from "@/schemas/interview"
import { Calendar, ChevronLeft, Clock, Copy, FileStack, ListTodo, MessageCircleMore, Plus, Send } from "lucide-react"
import { toast } from "sonner"

const InterviewLink = ({interviewId,formData,createNew,toHome}:{interviewId:string,formData:InterviewFormData,createNew:()=>void,toHome:()=>void}) => {
    
    const url = `${env.URL}/interview/${interviewId}`
    const getUrl = () => {
        return url;
    }

    const onCopy = async () => {
        await navigator.clipboard.writeText(url);
        toast("Link copied to clipboard",{position:"top-center"});
    }

  return (
    <div className="mx-6 flex flex-col items-center justify-center">
        <div className="flex items-center flex-col my-10">
            <CheckCheck stroke="#10b981" className="border border-green-600/20 rounded-full p-4 h-18 w-18 bg-green-500/5"/>
            <h2 className="text-sky-200 font-bold text-lg">Your AI Interview is Ready !</h2>
            <p className="text-xs text-sky-400/50">Share the link with candidates to start interview process </p>
        </div>
        <div className="w-full flex flex-col my-2 p-4 bg-sky-950/20 rounded-md border border-sky-300/10">
            <div className="flex items-end justify-between">
                <h3 className="text-sky-200 text-sm font-bold">Interview Link:</h3>
                <h3 className="text-xs font-bold text-green-400 bg-sky-200/10 px-2 py-0.5 rounded-xl rounded-br-none">Valid for 30 days</h3>
            </div>
            <div className="mt-2 flex items-center justify-between">
                <Input className="h-7 rounded-r-none" readOnly defaultValue={getUrl()} />
                <Button onClick={onCopy} variant={"outline"} className="rounded-l-none text-sky-300 flex items-center justify-between h-7 cursor-pointer">
                    <Copy className="p-0.5"/>
                    <span>Copy</span>
                </Button>
            </div>
            <hr className="my-3 bg-sky-300/20" />
            <div className="text-sky-300/80 flex items-center gap-3">
                <div className="text-[10px] flex items-center"><Clock className="mr-1 w-3 h-3" /><span>{formData?.duration || "30 minutes"}</span></div>
                <div className="text-[10px] flex items-center"><ListTodo className="mr-1 w-3 h-3" /><span>{"3"} questions</span></div>
                <div className="text-[10px] flex items-center"><Calendar className="mr-1 w-3 h-3" /><span>{"Expires in 30 days"}</span></div>
            </div>
        </div>
        <div className="w-full flex flex-col my-2 mb-4 p-4 bg-sky-950/20 rounded-md border border-sky-300/10">
            <div className="flex items-end justify-between">
                <h3 className="text-sky-200 text-sm font-bold">Share via:</h3>
            </div>
            <div className="mt-2 flex items-center justify-between">
                <Button variant={"outline"} className=" text-sky-300 flex items-center justify-between h-7 cursor-pointer">
                    <Send className="p-0.5"/>
                    <span>Email</span>
                </Button>
                <Button variant={"outline"} className=" text-sky-300 flex items-center justify-between h-7 cursor-pointer">
                    <FileStack className="p-0.5"/>
                    <span>Stack</span>
                </Button>
                <Button variant={"outline"} className=" text-sky-300 flex items-center justify-between h-7 cursor-pointer">
                    <MessageCircleMore className="p-0.5"/>
                    <span>Whatsapp</span>
                </Button>
            </div>
        </div>
        <div className="flex justify-between w-full mb-6">
            <Button onClick={toHome} className="bg-sky-950/70 rounded-tl-none! hover:bg-sky-950 rounded-md border border-sky-300/10 text-sky-300 h-7 cursor-pointer">
                <ChevronLeft className="p-0.5"/>
                <span>Back to dashboard</span>
            </Button>
            <Button onClick={createNew} className="bg-sky-950/70 rounded-tr-none! hover:bg-sky-950 rounded-md border border-sky-300/10 text-sky-300 h-7 cursor-pointer">
                <Plus className="p-0.5"/>
                <span>Create new interview</span>
            </Button>
        </div>
    </div>
  )
}

export default InterviewLink