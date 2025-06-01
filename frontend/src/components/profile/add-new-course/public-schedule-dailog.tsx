import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { format } from "date-fns"

interface PublishScheduleDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSchedule: (date: Date) => void;
    setCourseSchedule: React.Dispatch<React.SetStateAction<{ isScheduled: boolean; publishDate: Date | null }>>
    initialDate?: Date | null
}

export function PublishScheduleDialog({
    isOpen,
    onOpenChange,
    onSchedule,
    initialDate,
    setCourseSchedule
}: PublishScheduleDialogProps) {
    const [date, setDate] = useState<Date>()
    const [isSubmitting, setIsSubmitting] = useState(false)
    

    useEffect(() => {
        if (initialDate) {
            setDate(initialDate)
        }
    }, [initialDate])

    const handleSchedule = async () => {
        if (!date) {
            toast.error("Please select a publish date")
            return
        }

        try {
            setIsSubmitting(true)
            onSchedule(date)
            onOpenChange(false)
        } catch (error) {
            toast.error("Failed to schedule course")
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Schedule Course Publication</DialogTitle>
                </DialogHeader>
                <div className="flex gap-4 space-y-4 py-4">
                    <Calendar
                        mode="single"
                        selected={initialDate ? initialDate : date}
                        onSelect={setDate}
                        disabled={(date) => date < new Date()}
                        className="rounded-md border"
                    />
                    {date && (
                        <div className="flex flex-col gap-3">
                            <p className="text-sm text-muted-foreground">
                                Course will be published on 
                            </p>
                            <div className="w-full md:h-[100px] text-center font-extrabold border border-muted-foreground rounded-md p-2">
                                {format(initialDate ? initialDate : date, 'PPPP')}
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex justify-end gap-3">
                    <Button
                        variant="outline"
                        onClick={() => {
                            onOpenChange(false)
                            setDate(undefined)
                            setCourseSchedule({ isScheduled: false, publishDate: null })
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSchedule}
                        disabled={!date || isSubmitting}
                    >
                        Schedule Publish
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}