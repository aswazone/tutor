import { CategoriesTable } from "@/components/admin/CategoriesTable";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { categoryService} from "@/services/category.service";
import { ICategory } from "@/types/category.type";
import { Loader } from "lucide-react";
import { useState, useEffect, ChangeEvent, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

const Categories = () => {
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [searchParams,setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(Number(searchParams.get('page') || 1));
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const pageSize = 4; 

    const onPageChange = (newPage: number) => {
        setPage(newPage);
        setSearchParams({
            page: String(newPage),
            search: searchTerm
        });
    };

    const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearchTerm(val);
        setPage(1);
        setSearchParams({
            page: "1",
            search: val
        });
    };
    const fetchCategories = useCallback(async (pageNum = page, size = pageSize, search ='') => {
        setIsLoading(true);
        try {
            const {data,total} = await categoryService.getAllCategories(pageNum, size, search);
            console.log(data, 'categories');
            setCategories(data);
            setTotalPages(Math.ceil(total / pageSize));
            setTotalItems(total);
            setError(null);
        } catch (err) {
            setError('Failed to fetch categories');
            console.error('Error fetching categories:', err);
        } finally {
            setIsLoading(false);
        }
    }, [page, pageSize]);

    useEffect(() => {
        fetchCategories(page, pageSize, searchTerm);
    }, [page, pageSize, searchTerm,fetchCategories]);

  return (
    <>
      <div className="text-3xl font-bold font-serif">Categories</div>
      {error && (
        <div className="my-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}
      <div className="relative">
          <div className="absolute top-16 left-0">
            <Input value={searchTerm} onChange={onSearchChange} placeholder="Search Categories..." className="w-full" />  
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader className="animate-spin" />
              <span className="ml-2">Loading courses...</span>
            </div>
          )
          :(
              <>
              <CategoriesTable 
                categories={categories}
                onCategoryAdded={(category) => setCategories(prev => [...prev, category])}
                onCategoryUpdated={(updatedCategory) => {
                    setCategories(prev => prev.map(cat => 
                    cat._id === updatedCategory._id ? updatedCategory : cat
                    ));
                }}
                onCategoryDeleted={(id) => {
                    setCategories(prev => prev.filter(cat => cat._id !== id));
                }}
            />
                <Pagination 
                  className="mt-4 justify-end"
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={onPageChange}
                  showTotal
                  totalItems={totalItems}
                  itemsPerPage={pageSize}
                />
            </>
            )}
        </div>
      {/* <div>
        <CategoriesTable 
          categories={categories}
          loading={loading} 
          onCategoryAdded={(category) => setCategories(prev => [...prev, category])}
          onCategoryUpdated={(updatedCategory) => {
            setCategories(prev => prev.map(cat => 
              cat._id === updatedCategory._id ? updatedCategory : cat
            ));
          }}
          onCategoryDeleted={(id) => {
            setCategories(prev => prev.filter(cat => cat._id !== id));
          }}
        />
      </div> */}
    </>
  )
}

export default Categories