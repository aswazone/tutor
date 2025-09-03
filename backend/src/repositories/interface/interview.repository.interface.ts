import { IInterviewModel } from "@/models/interface/interview.model.interface";
import { FindInterviewResult } from "@/types/interview.type";

export interface IInterviewRepository {
    createInterview: (interview: IInterviewModel) => Promise<IInterviewModel>;
    getInterview: (id: string) => Promise<IInterviewModel | null>;
    getTutorCreatedInterviews: (email: string, page: number, limit: number) => Promise<FindInterviewResult>;
    deleteInterview: (id: string) => Promise<IInterviewModel | null>;
}