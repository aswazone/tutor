import { Model } from "mongoose";
import { IInterviewModel } from "../interface/interview.model.interface";
import { Interview } from "@/schema/interview.schema";

export const InterviewModel:Model<IInterviewModel> = Interview;