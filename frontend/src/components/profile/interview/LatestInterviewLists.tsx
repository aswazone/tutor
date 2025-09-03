import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { useAuth } from "@/hooks/useAuth";
import { formatDate } from "@/lib/utils";
import { interviewService } from "@/services/interview.service";
import { InterviewDataResponse } from "@/types/interview.type";
import { Copy, Send, Trash, Video } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

const LatestInterviewLists = () => {
  const [interviewList, setInterviewList] = useState<InterviewDataResponse[]>([]);
  const { user } = useAuth();

  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 3;

  const fetchInterviewList = useCallback(async () => {
    if(!user) return
    const { data, total } = await interviewService.getTutorCreatedInterviews(user?.userEmail, page, pageSize);
    setTotalPages(Math.ceil(total / pageSize));
    setTotalItems(total);
    setInterviewList(data);
  }, [user, page]);

  const handleCopyLink = (interviewId: string) => {
    const link = `${window.location.origin}/interview/${interviewId}`;
    navigator.clipboard.writeText(link);
    toast('Link copied to clipboard', { position: 'top-center', className: 'mt-10' });
  };

  const handleSend = (interviewId: string) => {
    console.log("Sending interview:", interviewId);
  };

  const onPageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(newPage));
    setSearchParams(params);
  };

  const handleDelete = useCallback(async (interviewId: string) => {
    try {
      toast("Are you sure you want to delete this interview ?",{
          position: "top-right",
          className: "mt-10",
          action: {
              label: "Delete",
              onClick: async () => {
                  await interviewService.deleteInterview(interviewId);
                  await fetchInterviewList();
              }
          }
      });
    } catch (error) {

      console.error('Toggle status error:', error);
    } 
  }, [fetchInterviewList]);

  
  useEffect(() => {
    fetchInterviewList();
  }, [fetchInterviewList]);


  return (
    <div className="my-5">
      <h2 className="font-bold text-2xl text-sky-200/60 mb-6">
        Previously Created Interviews
      </h2>

      {interviewList?.length === 0 && (
        <div className="p-5 flex flex-col items-center gap-2">
          <Video className="h-10 w-10 text-sky-400/60" />
          <h2 className="text-sky-400/40">
            You don't have any interviews created!
          </h2>
          <Button className="text-sky-400/50 transition-all duration-300 hover:text-sky-400 cursor-pointer bg-transparent rounded-tr-xl rounded-tl-none border border-sky-900/10 border-l-sky-900/20 border-t-sky-900/20 hover:bg-gradient-to-bl from-sky-700/12 from-20% to-10% to-sky-950/15 backdrop-blur-3xl">
            + Create New Interview
          </Button>
        </div>
      )}

      {interviewList?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {interviewList?.map((interview) => (
            <div
              key={interview.id}
              className=" cursor-pointer hover:scale-102 transition-all duration-300 border-sky-900/20 rounded-b-lg rounded-tr-2xl p-6 bg-gradient-to-bl from-sky-700/12 from-10% to-40% to-sky-950/15 backdrop-blur-3xl"
            >
              {/* Header with Icon and Date */}
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 text-sky-400/60  bg-sky-950/30 rounded-tl-none rounded-full h-12 w-12 flex items-center justify-center">
                  <Video className="h-6 w-6" />
                </div>
                <span className="text-xs text-sky-400/40">
                  {formatDate(interview.createdAt)}
                </span>
              </div>

              {/* Interview Title and Duration */}
              <div className="mb-4">
                <h3 className="font-bold text-sky-200/80 mb-1">
                  {interview.domain}
                </h3>
                <p className="text-xs text-sky-400/40">
                  {interview.duration}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2 text-sky-400/50 transition-all duration-300 hover:text-sky-400 cursor-pointer bg-transparent rounded-tr-xl rounded-tl-none border border-sky-900/10 border-l-sky-900/20 border-t-sky-900/20 hover:bg-gradient-to-bl from-sky-700/12 from-20% to-10% to-sky-950/15 backdrop-blur-3xl"
                  onClick={() => handleCopyLink(interview.id)}
                >
                  <Copy className="h-4 w-4" />
                  Copy Link
                </Button>
                <Button
                  size="sm"
                  className="flex-1 gap-2 text-sky-400/50 transition-all duration-300 hover:text-sky-400 cursor-pointer bg-transparent rounded-tr-xl rounded-tl-none border border-sky-900/10 border-l-sky-900/20 border-t-sky-900/20 hover:bg-gradient-to-bl from-sky-700/12 from-20% to-10% to-sky-950/15 backdrop-blur-3xl"
                  onClick={() => handleSend(interview.id)}
                >
                  <Send className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  className="flex-1 gap-2 text-red-400/50 transition-all duration-300 hover:text-red-400 cursor-pointer bg-transparent rounded-tr-xl rounded-tl-none border border-red-900/10 border-l-red-900/20 border-t-red-900/20 hover:bg-gradient-to-bl from-red-700/12 from-20% to-10% to-red-950/15 backdrop-blur-3xl"
                  onClick={() => handleDelete(interview.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Pagination 
        className="mt-4 justify-end"
        currentPage={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
        showTotal
        totalItems={totalItems}
        itemsPerPage={pageSize}
      />
    </div>
  );
};

export default LatestInterviewLists;
