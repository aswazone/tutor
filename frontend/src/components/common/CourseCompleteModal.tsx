import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { BadgeCheck, PartyPopper } from "lucide-react"

type Props = {
    showCourseCompleteDialog: boolean
    setShowConfetti: React.Dispatch<React.SetStateAction<boolean>>
    navigate: (string: string) => void
}


export const CourseCompleteModal = ({ showCourseCompleteDialog, setShowConfetti, navigate }: Props) => {

  return (
    <>
      <Dialog open={showCourseCompleteDialog}>
        <DialogContent className="sm:max-w-[450px] text-center px-6 py-8 rounded-2xl shadow-2xl bg-white">
          <DialogHeader>
            <div className="flex justify-center items-center mb-4">
              <PartyPopper className="text-green-600 w-10 h-10 animate-bounce" />
            </div>
            <DialogTitle className="text-2xl font-bold text-green-700">
              Congratulations!
            </DialogTitle>
            <DialogDescription className="text-gray-600 text-base mt-2">
              🎉 You've successfully completed the course!
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 flex flex-col gap-3">
            <Button
              variant="default"
              className="bg-green-600 hover:bg-green-700 transition-all"
              onClick={() => {
                // Handle view certificate
                navigate("/certificate")
                setShowConfetti(false)
              }}
            >
              <BadgeCheck className="mr-2 h-4 w-4" />
              View Certificate
            </Button>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  navigate("/my-courses")
                  setShowConfetti(false)
                }}
              >
                My Courses
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  navigate("/course/rewatch")
                  setShowConfetti(false)
                }}
              >
                Rewatch Course
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
};
