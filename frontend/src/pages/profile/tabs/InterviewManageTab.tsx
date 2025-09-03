import CreateInterviewDialog from "@/components/profile/interview/CreateInterviewModal"
// import CreateInterviewModal from "@/components/profile/interview/CreateInterviewModal"
import CreateOptions from "@/components/profile/interview/CreateOptions"
import LatestInterviewLists from "@/components/profile/interview/LatestInterviewLists"
import { motion } from 'framer-motion'
import { useState } from "react"
const InterviewManageTab = () => {

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

    return (
        <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
        >
            <CreateOptions setOpen={setIsCreateModalOpen} />
            <LatestInterviewLists />
            <CreateInterviewDialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />
        </motion.div>
    )

}

export default InterviewManageTab