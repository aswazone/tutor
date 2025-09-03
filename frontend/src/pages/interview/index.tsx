import { LogoIcon } from "@/components/landing/Icons";
import { useNavigate, useParams } from "react-router-dom";

import aiInterviewPic from '../../assets/interview-ai.png';
import { Clock, Info, RefreshCw, Video } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { InterviewData } from "@/types/interview.type";
import { interviewService } from "@/services/interview.service";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { setInterviewUserinfo } from "@/store/interview";

const Interview = () => {
  
  const {id} = useParams();
  const [loading, setLoading] = useState(false);
  const [interview, setInterview] = useState<InterviewData>();
  const [candidateName, setCandidateName] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate()

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        setLoading(true);
        const response = await interviewService.getInterview(id as string);
        setInterview(response);
      } catch (error) {
        console.error(error);
      }finally{
        setLoading(false);
      }
    }
    
    fetchInterview();
  }, [id]);

  const handleCandidateNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCandidateName(e.target.value);
  };

  const onJoiningInterview = async () => {
    if(!interview) return;
    dispatch(setInterviewUserinfo({...interview,candidateName}));
    navigate(`/interview/start/${id}`);
  }

  return (
    <div className="flex justify-center items-center md:mt-10">
        <div className="px-30 py-5 flex flex-col items-center justify-center bg-sky-950/20 border border-sky-500/20 rounded-md">
          <div className="flex items-center justify-center">
              <LogoIcon />
              <h2 className="font-bold text-xl">Tutor</h2>
          </div>
          <p className="mt-2 text-xs text-sky-200/70">AI powered Interview Platform</p>
          <img className="my-5" width={200} height={200} src={aiInterviewPic} alt="ai-interview" />
         {loading 
          ? <h1 className="font-bold text-2xl text-sky-300/80 inline-flex items-center">Wait...<RefreshCw className="animate-spin h-5 w-5" /></h1> 
          : interview ? 
            (
              <h1 className="font-bold text-2xl text-sky-300/80">{interview?.domain}</h1>
            ) : (
              <div className="bg-red-500/10 border border-red-500/20 rounded-md px-8 py-2 flex items-center justify-center">
                <Info className="h-5 w-5 text-red-500/80 mr-2" />
                <span className="text-red-500/80">Invalid interview link</span>
              </div>
            )}
          <h3 className="flex items-center gap-2 bg-sky-950/50 border border-sky-500/10 text-sky-200/70 mt-2 px-2 py-[2px] rounded-full"><Clock className="h-4 w-4" /> <span className="text-xs">{interview?.duration || 'wait...'}</span></h3>
          <hr className="mt-4 w-11/12" />
          <div className="my-5 w-[300px]">
            <span className="text-xs bg-sky-950/50 border border-sky-500/10 text-sky-200/70 px-2 py-[2px] rounded-md rounded-b-none rounded-tr-xl">Candidate Name :</span>
            <Input value={candidateName} onChange={handleCandidateNameChange} placeholder="eg. Aswin Varghese" className="rounded-tl-none h-7"/>
          </div>
          
          <div className="bg-sky-800/20 text-sky-200/80 p-4 rounded-lg border border-sky-500/10">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4"/>
              <h2 className="font-bold">Before you begin</h2>
            </div>
              <ul className="text-sky-300/60 py-2">
                <li className="text-xs">- Test your micro phone and speaker</li>
                <li className="text-xs">- Ensure you are connected to the internet</li>
                <li className="text-xs">- Find a quiet place</li>
              </ul>
          </div>
          <hr className="mt-4 w-11/12" />
        <Button onClick={onJoiningInterview} disabled={loading || !candidateName}  className="w-full cursor-pointer mt-5 flex items-center justify-center bg-sky-800/50 hover:bg-sky-800 h-8 border border-sky-500/10 text-sky-300"><Video className="h-5 w-5" /> Start Interview</Button>
        </div>
    </div>
  )
}

export default Interview