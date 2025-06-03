import { Filters, ISubcategoryOption } from "@/types/course.type";

export const buildQueryParams = (params: Filters, search= '', sort='price-lowtohigh') => {

    const searchParams = new URLSearchParams();   
    
    if (search) searchParams.append('search', search);
    if (sort) searchParams.append('sort', sort);    

    Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
        if (key === 'subcategories') {
            (value as ISubcategoryOption[]).forEach((subcategory) => {
            const jsonString = JSON.stringify({
                id: subcategory.id,
                parentId: subcategory.parentId
            });
            const encodedValue = btoa(unescape(encodeURIComponent(jsonString)));
            searchParams.append(key, encodedValue);
            });
        } else {
            (value as string[]).forEach((item) => {
            searchParams.append(key, encodeURIComponent(item));
            });
        }
        }
    });

    return searchParams.toString();
}

export const buildFilterFromQueryParams = (searchParams: URLSearchParams) => {
    const params: Filters = {};
    // Convert URL params to filter state
    searchParams.forEach((value, key) => {
      try {
        if(key === 'page' || key === 'limit') return;
        if (key === 'subcategories') {
          if (!params[key]) params[key] = [];
          const decoded = decodeURIComponent(escape(atob(value)));
          (params[key] as ISubcategoryOption[]).push(JSON.parse(decoded));
        } else {
          if (!params[key]) params[key] = [];
          (params[key] as string[]).push(value);
        }
      } catch (e) {
        console.error('Error parsing URL params:', e);
      }
    });
    return params;
}