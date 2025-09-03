import { IInterviewModel } from "@/models/interface/interview.model.interface"

export interface IInterviewDTO {
    id: string;
    domain: string;
    description: string;
    duration: string;
    interviewTypes: string[];
    questions: {
        question: string;
        type: string;
    }[];
    userEmail: string;
    createdAt: string
}

export const toInterviewDTO = (interview: IInterviewModel): IInterviewDTO => {
    return {
        id: (interview._id as string).toString(),
        domain: interview.domain,
        description: interview.description,
        duration: interview.duration,
        interviewTypes: interview.interviewTypes,
        questions: interview.questions,
        userEmail: interview.userEmail,
        createdAt: (interview.createdAt as Date).toISOString()
    }
}

export const toInterviewDTOs = (interviews: IInterviewModel[]): IInterviewDTO[] => {
    return interviews.map(toInterviewDTO);
}