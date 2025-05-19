import { Document, FilterQuery, UpdateQuery } from 'mongoose';

export interface BaseRepositoryIF<T extends Document> {
    create(data: Partial<T>): Promise<T>;
    findById(id: string): Promise<T | null>;
    findOne(filter: FilterQuery<T>): Promise<T | null>;
    find(filter: FilterQuery<T>): Promise<T[]>;
    findByIdAndUpdate(id: string, update: UpdateQuery<T>, options?: { new: boolean }): Promise<T | null>;
    findByIdAndDelete(id: string): Promise<T | null>;
    deleteMany(filter: FilterQuery<T>): Promise<boolean>;
}
