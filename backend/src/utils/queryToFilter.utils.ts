import { Request } from 'express';

export interface QueryFilter {
    isPublished: boolean;
    category?: { $in: string[] };
    subcategory?: { $in: string[] };
    level?: { $in: string[] };
    primaryLanguage?: { $in: string[] };
    pricing?: {
        $eq?: number;
        $gt?: number;
        $lte?: number;
    };
    $or?: Array<{
        title?: { $regex: string; $options: string };
        description?: { $regex: string; $options: string };
    }>;
}

export interface QueryOptions {
    sort?: { [key: string]: 1 | -1 };
    page?: number;
    limit?: number;
}

type QueryValue = string | string[] | { [key: string]: QueryValue };

function normalizeQueryValue(value: QueryValue): string[] {
    if (Array.isArray(value)) {
        return value.map(String);
    }
    if (typeof value === 'object' && value !== null) {
        return Object.values(value).flatMap(normalizeQueryValue);
    }
    return [String(value)];
}

export async function queryToFilter(req: Request): Promise<{ filter: QueryFilter; options: QueryOptions }> {    
    const query = req.query;
    const filter: QueryFilter = { isPublished: true };
    const options: QueryOptions = {};


    if (query.search) {
        const searchTerm = String(query.search);
        filter.$or = [
            { title: { $regex: searchTerm, $options: 'i' } },
            { description: { $regex: searchTerm, $options: 'i' } }
        ];
    }

    if(query.page) {
        options.page = query.search? 1 : Number(query.page);
    }

    if(query.limit) {
        options.limit = Number(query.limit);
    }

    // Handle sorting
    if (query.sort) {
        switch (String(query.sort)) {
            case 'price-lowtohigh':
                options.sort = { pricing: 1 };
                break;
            case 'price-hightolow':
                options.sort = { pricing: -1 };
                break;
            case 'newest':
                options.sort = { createdAt: -1 };
                break;
            case 'oldest':
                options.sort = { createdAt: 1 };
                break;
            case 'popular':
                options.sort = { enrollmentCount: -1 };
                break;
            case 'title-atoz':
                options.sort = { title: 1 };
                break;
            case 'title-ztoa':
                options.sort = { title: -1 };
                break;
            default:
                options.sort = { createdAt: 1 }; // default sort
        }
    }


    // Handle category filter
    if (query.category) {
        filter.category = { $in: normalizeQueryValue(query.category as QueryValue) };
    }

    // Handle subcategories filter
    if (query.subcategories) {
        const subcategories = normalizeQueryValue(query.subcategories as QueryValue);
        
        const decodedSubcategories = subcategories.map(sub => {
            try {
                // Handle base64 encoded subcategories
                const decoded = JSON.parse(Buffer.from(sub, 'base64').toString());
                return decoded.id;
            } catch (error) {
                console.error('Error decoding subcategory:', error);
                return null;
            }
        }).filter((id): id is string => id !== null);

        if (decodedSubcategories.length > 0) {
            filter.category = { $in: decodedSubcategories };
        }
    }

    // Handle level filter
    if (query.level) {
        filter.level = { $in: normalizeQueryValue(query.level as QueryValue) };
    }

    // Handle language filter
    if (query.primaryLanguage) {
        filter.primaryLanguage = { $in: normalizeQueryValue(query.primaryLanguage as QueryValue) };
    }

    // Handle price filter
    if (query.price) {
        const priceRanges = normalizeQueryValue(query.price as QueryValue);
        const priceFilter: { [key: string]: number } = {};

        priceRanges.forEach(range => {
            switch(range) {
                case 'free':
                    priceFilter.$eq = 0;
                    break;
                case 'paid':
                    priceFilter.$gt = 0;
                    break;
                case 'under-50':
                    priceFilter.$gt = 0;
                    priceFilter.$lte = 50;
                    break;
                default:
                    break;
            }
        });
        
        if (Object.keys(priceFilter).length > 0) {
            filter.pricing = priceFilter;
        }
    }

    


    return {filter, options};
}
    