import { CategoryDocument } from '@/models/interface/category.model.interface';
import { Schema, model } from 'mongoose';

const SubCategorySchema = new Schema({
        name: {
            type: String,
            required: true,
            trim: true,
        },
        isListed: {
            type: Boolean,
            default: true,
        },
        coursesCount: {
            type: Number,
            default: 0,
        },
        parentId: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
        }
    }, 
    {timestamps: true}
);

const CategorySchema = new Schema<CategoryDocument>({
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        isListed: {
            type: Boolean,
            default: true,
        },
        coursesCount: {
            type: Number,
            default: 0,
        },
        subCategories: [SubCategorySchema]
    }, 
    {timestamps: true}
);



export const Category = model<CategoryDocument>('Category', CategorySchema);
export const SubCategory = model('SubCategory', SubCategorySchema);
