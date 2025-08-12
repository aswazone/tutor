import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { BlurFade } from "@/components/magicui/blur-fade";
import { RefreshCw, SendHorizontal, Star } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import axiosInstance from "@/config/axios.config";

const ReviewDialog = ({ courseId, tutorId, isOpen, setIsOpen }: { courseId: string, tutorId: string, isOpen: boolean, setIsOpen: (open: boolean) => void }) => {
  // Tutor Review State
  const [tutorStars, setTutorStars] = useState(0);
  const [tutorReview, setTutorReview] = useState("");

  // Course Review State
  const [courseStars, setCourseStars] = useState(0);
  const [courseReview, setCourseReview] = useState("");

  // Submit Tutor Review to Backend
  const submitTutorReview = async () => {
    try {
      const response = await axiosInstance.post(`/api/v1/reviews/create`, {
        reviewType: "User",
        relatedId: tutorId,
        rating: tutorStars,
        review: tutorReview
      })
      if(response.status === 201) {
        toast.success("Tutor review submitted")
      }
      setTutorStars(0);
      setTutorReview("");
    } catch (err) {
      console.error(err);
      toast.error("Error submitting tutor review");
    }
  };

  // Submit Course Review to Backend
  const submitCourseReview = async () => {
    try {
      const response = await axiosInstance.post(`/api/v1/reviews/create`, {
        reviewType: "Course",
        relatedId: courseId,
        rating: courseStars,
        review: courseReview
      })
      if(response.status === 201) {
        toast.success("Course review submitted")
      }
      setCourseStars(0);
      setCourseReview("");
    } catch (err) {
      console.error(err);
      toast.error("Error submitting course review");
    }
  };

  const handleCloseTheReview = () => {
      if(tutorStars > 0 || courseStars > 0) {
        toast("Please submit the review, OR reset it before closing",{position: "top-right"});
        return;
      }
      setIsOpen(false);
  }

  const handleReset = () => {
    setTutorStars(0);
    setTutorReview("");
    setCourseStars(0);
    setCourseReview("");
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseTheReview}>
      <DialogContent className="p-0 max-w-lg overflow-hidden">
        <RefreshCw onClick={handleReset} className="absolute text-white/75 z-2 w-6 h-6 p-1 border border-white/10 rounded-full top-12 right-4 cursor-pointer" />
        <BlurFade delay={1}>
          <div className="relative w-full p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl space-y-8">
            <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-[#0c7ea9] via-[#a1d9f8] to-[#0c7ea9] bg-clip-text text-transparent">
              Share Your Feedback
            </DialogTitle>

            {/* Tutor Section */}
            <div>
              <h3 className="text-white text-lg font-semibold text-center mb-2">
                Review Tutor
              </h3>
              <div className="flex justify-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={28}
                    className={`cursor-pointer transition-transform hover:scale-110 ${
                      tutorStars >= i ? "text-yellow-400" : "text-gray-500"
                    }`}
                    fill={tutorStars >= i ? "currentColor" : "none"}
                    onClick={() => setTutorStars(i)}
                  />
                ))}
              </div>
              <textarea
                value={tutorReview}
                onChange={(e) => setTutorReview(e.target.value)}
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 resize-none focus:outline-none focus:ring-1 focus:ring-[#0c7ea9]"
                placeholder="Write your feedback for the tutor..."
                rows={3}
              />
              <div className="mt-3">
                <Button
                  className="rounded-tl-none"
                  variant="outline"
                  onClick={submitTutorReview}
                  disabled={tutorStars === 0}
                >
                <div className="flex items-center justify-center">
                    <span className="mr-2">Submit</span>
                    <SendHorizontal size={18} className="inline" />
                </div>
                </Button>
              </div>
            </div>

            {/* Course Section */}
            <div>
              <h3 className="text-white text-lg font-semibold text-center mb-2">
                Review Course
              </h3>
              <div className="flex justify-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={28}
                    className={`cursor-pointer transition-transform hover:scale-110 ${
                      courseStars >= i ? "text-yellow-400" : "text-gray-500"
                    }`}
                    fill={courseStars >= i ? "currentColor" : "none"}
                    onClick={() => setCourseStars(i)}
                  />
                ))}
              </div>
              <textarea
                value={courseReview}
                onChange={(e) => setCourseReview(e.target.value)}
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 resize-none focus:outline-none focus:ring-1 focus:ring-[#0c7ea9]"
                placeholder="Write your feedback for the course..."
                rows={3}
              />
              <div className="mt-3">
                <Button
                  className="rounded-tl-none"
                  variant="outline"
                  onClick={submitCourseReview}
                  disabled={courseStars === 0}
                >
                <div className="flex items-center justify-center">
                    <span className="mr-2">Submit</span>
                    <SendHorizontal size={18} className="inline" />
                </div>
                </Button>
              </div>
            </div>

            {/* Decorative blur */}
            <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-r from-[#0c7ea9]/20 to-[#a1d9f8]/20 rounded-full blur-xl pointer-events-none" />
            <div className="absolute bottom-4 left-4 w-20 h-20 bg-gradient-to-r from-[#a1d9f8]/20 to-[#0c7ea9]/20 rounded-full blur-xl pointer-events-none" />
          </div>
        </BlurFade>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDialog;
