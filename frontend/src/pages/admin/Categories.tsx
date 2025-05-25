import { CategoriesTable } from "@/components/admin/CategoriesTable";
import { categoryService, ICategory } from "@/services/category.service";
import { useState, useEffect } from "react";

const Categories = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();
        setCategories(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch categories');
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      <div className="text-3xl font-bold font-serif">Categories</div>
      {error && (
        <div className="my-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}
      <div>
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
      </div>
    </>
  )
}

export default Categories