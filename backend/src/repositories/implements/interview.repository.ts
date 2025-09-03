import { IInterviewModel } from "@/models/interface/interview.model.interface";
import { BaseRepository } from "../base.repository";
import { IInterviewRepository } from "../interface/interview.repository.interface";
import { InterviewModel } from "@/models/implements/interview.model";
import { FilterQuery } from "mongoose";

export class InterviewRepository extends BaseRepository<IInterviewModel> implements IInterviewRepository {
    constructor() {
        super(InterviewModel)
    }

    createInterview = async (interview: IInterviewModel):Promise<IInterviewModel> => {
        return await this.create(interview);
    };

    getInterview = async (id: string):Promise<IInterviewModel | null> => {
        return await this.findById(id);
    };

    getTutorCreatedInterviews = async (email: string, page: number, limit: number) => {
        console.log(email, page, limit);
        const filter: FilterQuery<IInterviewModel> = { userEmail: email };

        const data: IInterviewModel[] = await this.model.find(filter).skip((page - 1) * limit).limit(limit).sort({ createdAt: -1 });
        const total: number = await this.model.countDocuments(filter);

        return { data, total };
    };

    deleteInterview = async (id: string):Promise<IInterviewModel | null> => {
        return await this.findByIdAndDelete(id);
    };
}