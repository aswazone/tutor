import { Document, FilterQuery, Model, UpdateQuery } from "mongoose";
import { BaseRepositoryIF } from "./interface/base.repository.interface";

export abstract class BaseRepository<T extends Document> implements BaseRepositoryIF<T> {
    constructor(protected readonly model: Model<T>) {}

    async create(data: Partial<T>): Promise<T> {
        const createdDocument = new this.model(data);
        return createdDocument.save();
    }

    async findById(id: string): Promise<T | null> {
        return this.model.findById(id);
    }

    async findOne(filter: FilterQuery<T>): Promise<T | null> {
        return this.model.findOne(filter);
    }

    async findOneAndUpdate(filter: FilterQuery<T>, update: UpdateQuery<T>): Promise<T | null> {
        return this.model.findOneAndUpdate(filter, update, { new: true });
    }

    async find(filter: FilterQuery<T>): Promise<T[]> {
        return this.model.find(filter);
    }

    async findByIdAndUpdate(id: string,update: UpdateQuery<T>,
        options: { new?: boolean; arrayFilters?: Array<{ [key: string]: unknown }>; } = { new: true }): Promise<T | null> {
        return this.model.findByIdAndUpdate(id, update, options);
    }

    async findByIdAndDelete(id: string): Promise<T | null> {
        return this.model.findByIdAndDelete(id);
    }

    async deleteMany(filter: FilterQuery<T>): Promise<boolean> {
        const result = await this.model.deleteMany(filter);
        return result.deletedCount > 0;
    }
}