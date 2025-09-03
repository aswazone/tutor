import { IFeedbackModel } from "@/models/interface/feedback.model.interface";
import { IFeedbackRepository } from "../interface/feedback.repository.interface";
import { BaseRepository } from "../base.repository";
import { FeedbackModel } from "@/models/implements/feedback.model";

export class FeedbackRepository extends BaseRepository<IFeedbackModel> implements IFeedbackRepository {

    constructor() {
        super(FeedbackModel);
    }

    createFeedback = async (feedback: IFeedbackModel) :Promise<IFeedbackModel> =>{
        return await this.create(feedback);
    }

    getFeedback = async (id: string) :Promise<IFeedbackModel | null> => {
        return await this.findById(id);
    }
}