import { useEffect, useState } from "react";
import aiImage from "../../assets/ai.png";
import { Button } from "../ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { vapi } from "@/config/vapi.config";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { AlertConfirmation } from "../common/AlertConfirmation";
import Timer from "./TimerComponent";
import { interviewService } from "@/services/interview.service";
import { CallStatus, InterviewFeedback, SavedMessage, VapiMessage } from "@/types/interview.type";
import { toast } from "sonner";
import Loader from "../ui/loader";
import { useAuth } from "@/hooks/useAuth";



const Agent = () => {
  
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const {user} = useAuth();
  const interviewUserinfo = useSelector((state: RootState) => state.interview.interviewUserinfo);
  const [isGenerating, setIsGenerating] = useState(false);
  // State for conversation history
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [liveAssistantMessage, setLiveAssistantMessage] = useState('');

  useEffect(() => {
    if (!interviewUserinfo.candidateName) {
      navigate(`/interview/${id}`);
    }
  }, [interviewUserinfo, navigate, id]);

  useEffect(() => {
    
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);

    const onCallEnd = async () => {
      setCallStatus(CallStatus.FINISHED);
      // Optional: Navigate to a results page after a delay
      try {
          setIsGenerating(true);
          
          const finalMessages = messages.filter(msg => msg.content.trim() !== '');

          const response = await interviewService.generateFeedback(finalMessages);
          if (response) {
            console.log(response, 'feedbacks');
            const result = await interviewService.createInterviewFeedback({
              userName: interviewUserinfo?.candidateName as string,
              userEmail: user?.userEmail as string,
              interviewId: id as string,
              feedback: response?.feedback as InterviewFeedback,
              recommendation: response?.feedback?.recommendation === 'No' ? false : true
            });
            console.log(result,'result-feedback creation')
            if(result.success){
              toast('Feedback generated successfully');
              setIsGenerating(false);
            }
          }

          // if (finalMessages.length > 0) {
          //   navigate('/interview/finish', {
          //     state: { messages: finalMessages, userName: interviewUserinfo?.candidateName }
          //   });
          // }
          
        } catch (error) {
          console.error(error);
          setIsGenerating(false);
        }
    };

    const onMessage = (message: VapiMessage) => {
      if (message.type === 'transcript') {
        if (message.role === 'assistant') {
          if (message.transcriptType === 'partial') {
            setLiveAssistantMessage(message.transcript);
          } else {
            setLiveAssistantMessage('');
            setMessages(prev => [...prev, { role: 'assistant', content: message.transcript }]);
          }
        } else if (message.role === 'user' && message.transcriptType === 'final') {
          setMessages(prev => [...prev, { role: 'user', content: message.transcript }]);
        }
      }
    };

    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);
    const onError = (error: Error) => console.error('VAPI error', error);

    vapi.on('call-start', onCallStart);
    vapi.on('call-end', onCallEnd);
    vapi.on('speech-start', onSpeechStart);
    vapi.on('speech-end', onSpeechEnd);
    vapi.on('message', onMessage);
    vapi.on('error', onError);

    return () => {
      vapi.off('call-start', onCallStart);
      vapi.off('call-end', onCallEnd);
      vapi.off('speech-start', onSpeechStart);
      vapi.off('speech-end', onSpeechEnd);
      vapi.off('message', onMessage);
      vapi.off('error', onError);
    };
  }, [messages, navigate, interviewUserinfo, user?.userEmail, id]);

  const handleCall = () => {
    setCallStatus(CallStatus.CONNECTING);
    if (!interviewUserinfo?.questions) return;

    const questionlist = interviewUserinfo.questions.map(item => item.question).join(" | ");

    const assistantOptions = {
        name: "AI Recruiter",
        firstMessage: `Hi ${interviewUserinfo.candidateName}, how are you? Ready for your interview on ${interviewUserinfo.domain}?`,
        model: {
            provider: "openai" as const,
            model: "gpt-4" as const,
            messages: [{
                role: "system" as const,
                content: `You are an AI voice assistant conducting interviews.
                          Your job is to ask candidates provided interview questions and assess their responses.
                          
                          **Candidate Information:**
                          - **Name:** ${interviewUserinfo?.candidateName}
                          - **Interview Topic:** ${interviewUserinfo?.domain}

                          **Your Persona:**
                          - Be friendly, engaging, and witty.
                          - Keep your responses short and natural, like a real conversation.
                          - Adapt your tone based on the candidate's confidence level.

                          **Interview Flow:**
                          1.  **Greeting:** Start with a friendly introduction. If the candidate corrects their name, remember and use the new name throughout the interview.
                              *   Example: "Hey there! Welcome to your ${interviewUserinfo?.domain} interview. Let's get started with a few questions!"
                          2.  **Questions:** Ask one question at a time from the list below and wait for the response.
                              *   **Question List:** ${questionlist}
                          3.  **Hints and Feedback:** If the candidate struggles, offer a hint. Provide brief, encouraging feedback after each answer.
                              *   Example (Hint): "Need a hint? Think about how React tracks component updates!"
                              *   Example (Feedback): "Nice! That's a solid answer." or "Hmm, not quite! Want to try again?"
                          4.  **Wrap-up:** After all questions are asked, summarize the interview smoothly.
                              *   Example: "That was great! You handled some tough questions well. Thanks for chatting!"

                          **Key Guideline:**
                          - Ensure the interview remains focused on the provided questions and topic.`.trim(),
            }],
        },
        transcriber: {
          provider: "deepgram" as const,
          model: "nova-2",
          language: "en-US" as const,
        },
        voice: {
          provider: "playht" as const,
          voiceId: "jennifer",
        },
    };

    vapi.start(assistantOptions);
  };

  const handleEndCall = () => {
    vapi.stop();
  };

  const lastFinalMessage = messages.length > 0 ? messages[messages.length - 1]?.content : `Ready when you are, ${interviewUserinfo?.candidateName}!`;
  const isCallInactiveOrFinished = callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;

  return (
    <>
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-7 mx-5 md:mx-20 mt-10">
          <div className="bg-gradient-to-b from-sky-950 to-sky-[#001823] p-0.5 rounded-md">
            <div className="bg-gradient-to-b from-[#011e2b] to-sky-[#012333] h-[400px] rounded-md flex flex-col items-center justify-center border-sky-900/50">
                {callStatus === CallStatus.ACTIVE && isSpeaking && <div className="relative">
                  <div className="-z-1 animate-ping absolute top-18 -left-25 w-[200px] h-[200px] bg-sky-500 rounded-full opacity-55"></div>
                </div>}
                <img src={aiImage} alt="vapi" className="w-[200px] border-2 border-[#032939] rounded-lg shadow-2xl shadow-black" />
                <h2 className="text-sky-200 text-2xl font-bold mt-3">AI Agent</h2>
                <Timer start={callStatus === CallStatus.ACTIVE} />
            </div>
            {interviewUserinfo?.candidateName && <div className="absolute rotate-90 md:rotate-0 top-[49px] md:top-0 -left-17 md:left-0 my-5 bg-gradient-to-b from-sky-950 to-sky-[#001823] rounded-xl rounded-l-none p-0.5">
              <div className="w-full flex items-center justify-end gap-2 bg-gradient-to-b from-[#011e2b] to-sky-[#012333] rounded-xl rounded-l-none px-4 py-2">
                <p className=" uppercase text-sky-300/60 text-sm text-center break-words">{interviewUserinfo?.domain}</p>
              </div>
            </div>}
          </div>
          <div className="bg-gradient-to-b from-sky-950 to-sky-[#001823] p-0.5 rounded-md hidden md:block">
            <div className="bg-gradient-to-b from-[#011e2b] to-sky-[#012333] h-[400px] rounded-md flex flex-col items-center justify-center border-sky-900/50">
                {callStatus === CallStatus.ACTIVE && !isSpeaking && <div className="relative">
                  <div className="-z-1 animate-ping absolute top-3 -left-13 w-[100px] h-[100px] bg-sky-500 rounded-full transition-all opacity-55"></div>
                </div>}
                <div className="flex items-center justify-center bg-[#064e6f] w-[100px] h-[100px] border-2 border-[#032939] rounded-full text-sky-200 text-2xl font-bold mt-3">
                    <h2>{'You'}</h2>
                </div>
            </div>
            {interviewUserinfo?.candidateName && <div className="absolute top-0 right-0 my-5 bg-gradient-to-b from-sky-950 to-sky-[#001823] rounded-xl rounded-r-none p-0.5">
              <div className="w-full flex items-center justify-end gap-2 bg-gradient-to-b from-[#011e2b] to-sky-[#012333] rounded-xl rounded-r-none px-4 py-2">
                <p className=" uppercase text-sky-200 text-sm text-center break-words">{interviewUserinfo?.candidateName}</p>
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                </span>
              </div>
            </div>}
          </div>
      </div>

      <div className="relative md:mt-12 flex flex-col gap-10 items-center mx-5 md:mx-auto">
        <div className="my-5 bg-gradient-to-b w-full max-w-[400px] md:max-w-[600px] from-sky-950 to-sky-[#001823] rounded-full p-0.5">
          <div className="w-full bg-gradient-to-b from-[#011e2b] to-sky-[#012333] rounded-full px-4 py-2">
            <p className="text-sky-200 text-sm text-center break-words min-h-[20px]">
              {liveAssistantMessage || lastFinalMessage}
            </p>
          </div>
        </div>

        <div className="w-full absolute -bottom-6 md:-bottom-15 flex justify-center">
          {callStatus !== CallStatus.ACTIVE && !isGenerating ? (
            <Button disabled={callStatus === CallStatus.CONNECTING} onClick={handleCall} className={` py-2 px-7 rounded-full bg-gradient-to-l ${callStatus === CallStatus.CONNECTING ? 'from-black! border-y-2 border-orange-500/30! cursor-wait' :'from-green-500/50' } via-green-500/60 to-green-500/60 text-white hover:bg-green-500/70 cursor-pointer`}>
              <span>{isCallInactiveOrFinished ? 'Call' : 'Connecting...'}</span>
            </Button>
          ) : (
            <AlertConfirmation className={`${isGenerating ? 'pointer-events-none' : ''}`} stopInterview={handleEndCall}>
              <div className="py-2 px-7 rounded-full flex items-center bg-gradient-to-l from-red-500/50 via-red-500/60 to-red-500/60 text-white hover:bg-red-500/70 cursor-pointer">
                <span>{isGenerating ? "Wait..." : "End Call"}</span>
                {isGenerating && <Loader className="ml-2 text-red-300"/>}
              </div>
            </AlertConfirmation>
          )}
        </div>
      </div>
    </>
  );
};

export default Agent;
