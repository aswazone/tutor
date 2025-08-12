import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Check, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CustomDataTable } from "@/components/common/CustomDataTable"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { AddCategoryDrawer } from "./AddCategoryDrawer"
import { categoryService} from "@/services/category.service"
import { toast } from "sonner"
import { ICategory } from "@/types/category.type"

type TableCategory = {
  _id: string;
  name: string;
  isListed: boolean;
  parentId?: string;
  depth: number;
  type: 'category' | 'subcategory';
}

interface Props {
  categories: ICategory[];
  onCategoryAdded: (category: ICategory) => void;
  onCategoryUpdated: (category: ICategory) => void;
  onCategoryDeleted: (id: string) => void;
}

const columns: ColumnDef<TableCategory>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          className="font-bold"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const isSubcategory = row.original.type === 'subcategory';
      
      return (
        <div 
          className={cn(
            "flex items-center",
            isSubcategory && "pl-10"
          )}
        >
          {!isSubcategory && <ChevronRight className="mr-2 h-4 w-4" />}
          <span className={cn(
            isSubcategory && "text-muted-foreground"
          )}>
            {row.getValue("name")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "isListed",
    header: "Listed",
    cell: ({ row }) => (
      <div className="flex justify-center">
        {row.getValue("isListed") ? (
          <Check className="h-5 w-5 text-green-500" />
        ) : (
          <X className="h-5 w-5 text-red-500" />
        )}
      </div>
    ),
  },
]

export function CategoriesTable({
  categories,
  onCategoryAdded,
  onCategoryUpdated,
  onCategoryDeleted,
}: Props) {
  const [openNewCategory, setOpenNewCategory] = useState(false);
  const [openNewSubcategory, setOpenNewSubcategory] = useState(false);
  const [openEditCategory, setOpenEditCategory] = useState(false);
  const [openEditSubcategory, setOpenEditSubcategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<TableCategory | null>(null);

  const flattenedData: TableCategory[] = categories.reduce<TableCategory[]>((acc, category) => {
    acc.push({
      _id: category._id,
      name: category.name,
      isListed: category.isListed,
      type: 'category',
      depth: 0
    });

    category.subCategories.forEach(sub => {
      acc.push({
        _id: sub._id,
        name: sub.name,
        isListed: sub.isListed,
        parentId: category._id,
        type: 'subcategory',
        depth: 1
      });
    });

    return acc;
  }, []);

  const handleAddCategory = async (data: { name: string; isListed: boolean }) => {
    try {
      const newCategory = await categoryService.createCategory(data);
      onCategoryAdded(newCategory);
      setOpenNewCategory(false);
      toast.success("Category created successfully");
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Failed to create category");
    }
  };

  const handleAddSubcategory = async (data: { name: string; isListed: boolean }) => {
    if (!selectedCategory) return;
    
    try {
      const updatedCategory = await categoryService.createSubCategory({
        ...data,
        parentId: selectedCategory._id,
      });
      onCategoryUpdated(updatedCategory);
      setOpenNewSubcategory(false);
      toast.success("Subcategory created successfully");
    } catch (error) {
      console.error("Error creating subcategory:", error);
      toast.error("Failed to create subcategory");
    }
  };

  const handleToggleStatus = async (categoryId: string, subCategoryId: string | null, currentStatus: boolean) => {
    try {
      const updatedCategory = subCategoryId
        ? await categoryService.toggleSubCategoryStatus(categoryId, subCategoryId, currentStatus)
        : await categoryService.toggleCategoryStatus(categoryId, currentStatus);
      
      onCategoryUpdated(updatedCategory);
      toast.success("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (categoryId: string, subCategoryId: string | null) => {
    try {
      if (subCategoryId) {
        const updatedCategory = await categoryService.deleteSubCategory(categoryId, subCategoryId);
        onCategoryUpdated(updatedCategory);
      } else {
        await categoryService.deleteCategory(categoryId);
        onCategoryDeleted(categoryId);
      }
      toast.success("Deleted successfully");
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error("Failed to delete");
    }
  };

  const handleAction = async (action: string, item: TableCategory) => {
    const isSubcategory = item.type === "subcategory";
    const categoryId = isSubcategory ? item.parentId! : item._id;
    const subCategoryId = isSubcategory ? item._id : null;

    switch (action) {      
      case "edit":
        setSelectedCategory(isSubcategory ? categories.find(cat => cat._id === item.parentId)! : categories.find(cat => cat._id === item._id)!);
        if (isSubcategory) {
          setOpenEditSubcategory(true);
          setSelectedSubcategory(item);
        } else {
          setOpenEditCategory(true);
        }
        break;
      case "list":
        await handleToggleStatus(categoryId, subCategoryId, item.isListed);
        break;
      case "add-subcategory":
        if (!isSubcategory) {
          setSelectedCategory({ 
            _id: item._id,
            name: item.name,
            isListed: item.isListed,
            subCategories: [],
            createdAt: "",
            updatedAt: ""
          });
          setOpenNewSubcategory(true);
        }
        break;
      case "delete":
        await handleDelete(categoryId, subCategoryId);
        break;
    }
  };

  const handleUpdateCategory = async (data: { name: string; isListed: boolean }) => {
    if (!selectedCategory) return;
    try {
      const updatedCategory = await categoryService.updateCategory(selectedCategory._id, data);
      onCategoryUpdated(updatedCategory);
      setOpenEditCategory(false);
      toast.success("Category updated successfully");
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category");
    }
  };

  const handleUpdateSubcategory = async (data: { name: string; isListed: boolean }) => {
    if (!selectedCategory || !selectedSubcategory) return;
    try {
      const updatedCategory = await categoryService.updateSubCategory(
        selectedCategory._id,
        selectedSubcategory._id,
        data
      );
      onCategoryUpdated(updatedCategory);
      setOpenEditSubcategory(false);
      toast.success("Subcategory updated successfully");
    } catch (error) {
      console.error("Error updating subcategory:", error);
      toast.error("Failed to update subcategory");
    }
  };

  return (
    <div className="space-y-4">

          <div className="flex justify-end font-bold">
            <Button 
              onClick={() => setOpenNewCategory(true)}
              variant="ghost"
            >
             + Add Category
            </Button>
          </div>
          <CustomDataTable
            data={flattenedData}
            columns={columns}
            isHierarchical={true}
            getRowType={(row) => row.type === "category" ? "parent" : "child"}
            actionItems={[
              { label: "Edit", action: "edit" },
              { label: "List/Unlist", action: "list" },
              { label: "Add Subcategory", action: "add-subcategory" },
              { label: "Delete", action: "delete" },
            ]}
            onRowActionSelect={handleAction}
          />

          <AddCategoryDrawer
            open={openNewCategory}
            onOpenChange={setOpenNewCategory}
            onSubmit={handleAddCategory}
          />          <AddCategoryDrawer
            open={openNewSubcategory}
            onOpenChange={setOpenNewSubcategory}
            onSubmit={handleAddSubcategory}
            title="Add New Subcategory"
            description={`Create a new subcategory under ${selectedCategory?.name || ''}`}
          />

          <AddCategoryDrawer
            open={openEditCategory}
            onOpenChange={setOpenEditCategory}
            onSubmit={handleUpdateCategory}
            title="Edit Category"
            description="Update category details"
            initialData={selectedCategory ? {
              name: selectedCategory.name,
              isListed: selectedCategory.isListed
            } : undefined}
          />

          <AddCategoryDrawer
            open={openEditSubcategory}
            onOpenChange={setOpenEditSubcategory}
            onSubmit={handleUpdateSubcategory}
            title="Edit Subcategory"
            description={`Update subcategory under ${selectedCategory?.name || ''}`}
            initialData={selectedSubcategory ? {
              name: selectedSubcategory.name,
              isListed: selectedSubcategory.isListed
            } : undefined}
          />

          <AddCategoryDrawer
            open={openEditCategory}
            onOpenChange={setOpenEditCategory}
            onSubmit={(data) => handleUpdateCategory(data)}
            title="Edit Category"
            description="Update category details"
            initialData={selectedCategory ? {
              name: selectedCategory.name,
              isListed: selectedCategory.isListed
            } : undefined}
          />

          <AddCategoryDrawer
            open={openEditSubcategory}
            onOpenChange={setOpenEditSubcategory}
            onSubmit={(data) => handleUpdateSubcategory(data)}
            title="Edit Subcategory"
            description={`Update subcategory under ${selectedCategory?.name || ''}`}
            initialData={selectedSubcategory ? {
              name: selectedSubcategory.name,
              isListed: selectedSubcategory.isListed
            } : undefined}
          />
    </div>
  )
}
