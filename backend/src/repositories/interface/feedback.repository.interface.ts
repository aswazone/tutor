import { IFeedbackModel } from "@/models/interface/feedback.model.interface";

export interface IFeedbackRepository {
    createFeedback: (feedback: IFeedbackModel) => Promise<IFeedbackModel>
    getFeedback: (id: string) => Promise<IFeedbackModel | null>
}