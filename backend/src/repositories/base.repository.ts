import { Document, FilterQuery, Model } from "mongoose";

export abstract class BaseRepository<T extends Document> {
    constructor(protected readonly model: Model<T>) {}

    async create(data: Partial<T>): Promise<T> {
        const createdDocument = new this.model(data);
        return createdDocument.save();
    }
    async findOne(filter: FilterQuery<T>): Promise<T | null> {
        return this.model.findOne(filter);
    }
}