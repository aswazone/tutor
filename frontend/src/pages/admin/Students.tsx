import { CustomDataTable } from "@/components/common/CustomDataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import axiosInstance from "@/config/axios.config";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Check, Loader, X } from "lucide-react";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export interface Student {
  id: string
  name: string
  userName: string
  userEmail: string
  profileImage: string
  enrolledCourses: number
  completedCourses: number
  joinDate: string
  isActive: boolean;
}



const Students = () => {
        const [students, setStudents] = useState<Student[]>([]);
        const [isLoading, setIsLoading] = useState(true);
        const [searchParams,setSearchParams] = useSearchParams();
        const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
        const [page, setPage] = useState(Number(searchParams.get('page') || 1));
        const [totalPages, setTotalPages] = useState(1);
        const [totalItems, setTotalItems] = useState(0);
        const pageSize = 4;  

        const columns: ColumnDef<Student>[] = [
            {
                accessorKey: "name",
                header: ({ column }) => {
                return (
                    <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
                },
            },
            {
                accessorKey: "userEmail",
                header: "Email",
            },
            {
                accessorKey: "createdDate",
                header: "Join Date",
            },
            {
                accessorKey: "isActive",
                header: "Active",
                cell: ({ row }) => (
                <div className="flex justify-center">
                    {row.getValue("isActive") ? (
                    <Check className="h-5 w-5 text-green-500" />
                    ) : (
                    <X className="h-5 w-5 text-red-500" />
                    )}
                </div>
                ),
            },
        ]

        const fetchStudents = useCallback(async (pageNum = page, size = pageSize, search ='') => {
            try {
            setIsLoading(true);
            const response = await axiosInstance.get('/api/v1/admin/students',{
                params: { page: pageNum, limit:size, search }
            });

                const {data,total} = response.data;

                setIsLoading(false);
                setTotalPages(Math.ceil(total / size));
                setTotalItems(total);
                setStudents(data);

            } catch (error) {
                setIsLoading(false);
                console.error('Error fetching students:', error);
            }
        }, [page]);

        useEffect(() => {
            const urlPage = Number(searchParams.get("page")) || 1;
            const urlSearch = searchParams.get("search") || "";

            setPage(urlPage);
            setSearchTerm(urlSearch);
            
        }, [searchParams]);

        useEffect(() => {
            fetchStudents(page, pageSize, searchTerm);
        }, [fetchStudents, page, pageSize, searchTerm]);
  
  
    const handleToggleStatus = async (student: Student) => {
        try {
        const response = await axiosInstance.patch(`/api/v1/admin/toggle-user-status/${student.id}/${student.isActive}`);

        const updatedStudents = students.map((s) => {
            if (s.id === student.id) {
            return { ...s, isActive: !s.isActive };
            }
            return s;
        });
        setStudents(updatedStudents);
        toast.success("Status updated successfully");

        console.log("Status updated:", response.data);
        } catch (error) {
        console.error("Error updating status:", error);
        }
    };



    const handleAction = (action: string, student: Student) => {
        switch (action) {
        case "view":
            console.log("View student", student)
            break
        case "courses":
            console.log("View student courses", student)
            break
        case "status":
            handleToggleStatus(student)
            console.log("Block/Unblock student", student)
            break
        }
    }

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

  return (
    <>
    <div className="text-3xl font-bold font-serif">Students</div>
    <div className="relative">
          <div className="absolute top-4 left-0">
            <Input value={searchTerm} onChange={onSearchChange} placeholder="Search Students..." className="w-full" />  
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader className="animate-spin" />
              <span className="ml-2">Loading courses...</span>
            </div>
          )
          :(
            <>
            <CustomDataTable<Student> 
                data={students} 
                columns={columns} 
                onRowActionSelect={handleAction}
                actionItems={[
                  { label: "View Profile", action: "view" },
                  { label: "Block/Unblock", action: "status" },
                ]}
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
    </>
  )
}

export default Students