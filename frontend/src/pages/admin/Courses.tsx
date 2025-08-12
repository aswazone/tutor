import axiosInstance from "@/config/axios.config"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs"
import { ChangeEvent, useCallback, useEffect, useState } from "react"
import { ArrowUpDown, Check, FileText, Loader, X } from "lucide-react"
import { CourseDetailsDialog } from "@/components/admin/CourseDetailsDialog"
import { verifyCourse } from "@/store/admin/adminSlice"
import { toast } from "sonner"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/store"
import { Course } from "@/types/admin.type"
import { CustomDataTable } from "@/components/common/CustomDataTable"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Pagination } from "@/components/ui/pagination"
import { useSearchParams } from "react-router-dom"


const Courses = () => {
  const [searchParams,setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedTab, setSelectedTab] = useState(searchParams.get('tab') || 'approved');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [page, setPage] = useState(Number(searchParams.get('page') || 1)); // 1-based
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 4;
    
  console.log(courses,'courses');
  
   const pendingColumns: ColumnDef<Course>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Title
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "tutor",
      header: "Tutor",
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => <Badge variant="outline">{row.getValue("category")}</Badge>,
    },
    {
      accessorKey: "price",
      header: "Price",
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
    {
      accessorKey: "isVerified",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.getValue("isVerified") === "rejected" ? "destructive" : "outline"}>
          {row.getValue("isVerified")}
        </Badge>
      ),
    },
    {
      header: "Details",
      id: "details",
      cell: ({ row }) => {
        const course = row.original;
        return (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              console.log("View course details:", course);
              setSelectedCourse(course);
              setIsDetailsOpen(true);
            }}
            className="hover:bg-sky-500/20 text-sky-500"
          >
            <FileText className="h-4 w-4" />
          </Button>
        );
      },
    },
  ];

  const approvedColumns: ColumnDef<Course>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "tutor",
    header: "Tutor",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"))
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(price)
    },
  },
  {
    accessorKey: "enrollments",
    header: "Enrollments",
    cell: ({ row }) => (
      <Badge variant="secondary" className="w-full justify-center">
        {row.getValue("enrollments")}
      </Badge>
    ),
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => {
      const rating = parseFloat(row.getValue("rating"))
      return <div className="text-center">{rating.toFixed(1)}</div>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const variants: { [key: string]: 'outline' | 'secondary' | 'destructive' } = {
        published: "outline",
        draft: "secondary",
        archived: "destructive",
      }
      return (
        <Badge
          variant={variants[status]}
          className="w-full justify-center"
        >
          {status}
        </Badge>
      )
    },
    
  },
  {
    accessorKey: "createdDate",
    header: "Created At",
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

const handleToggleStatus = async (course: Course) => {
    try {
      const response = await axiosInstance.patch(`/api/v1/admin/toggle-course-status/${course.id}/${course.isActive}`);

      const updatedCourses = courses.map((s) => {
        if (s.id === course.id) {
          return { ...s, isActive: !s.isActive };
        }
        return s;
      });
      setCourses(updatedCourses);
      toast.success("Status updated successfully");

      console.log("Status updated:", response.data);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleAction = (action: string, course: Course) => {
    switch (action) {
      case "view":
        setSelectedCourse(course)
        setIsDetailsOpen(true)
        console.log("View course", course)
        break
      case "status":
        handleToggleStatus(course)
        console.log("Activate/Deactivate course", course)
        break
    }
  }


  const fetchCourses = useCallback(async (pageNum = page, size = pageSize, search ='') => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/api/v1/admin/courses', {
        params: { page: pageNum, limit: size, tab: selectedTab, search }
      });
      console.log(response.data,'response-data');
      const {data, total } = response.data;

      console.log(data,total,'data-total');
      setCourses(data);
      setTotalItems(total);
      const tp = Math.ceil(total / size) || 1;
      setTotalPages(tp);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, selectedTab]);


  const dispatch = useDispatch<AppDispatch>();
  
    const handleCourseVerified = async (courseId: string, isVerified: string ,rejectReason?: string) => {
      try {
        await dispatch(verifyCourse({ courseId, isVerified, rejectReason })).unwrap();
        toast.success(`Course ${isVerified === 'verified' ? 'approved' : 'rejected'} successfully`);
        fetchCourses();
      } catch (error) {
        toast.error('Failed to update course status');
        console.error('Verification error:', error);
      }
    };

    const handleTabSelect = (tab: string) => {
      setSelectedTab(tab);
      setPage(1);
      setSearchParams({
        tab,
        page: '1',
        search: '',
      })
    };

    const onPageChange = (newPage: number) => {
      setPage(newPage);
      setSearchParams({
        tab: selectedTab,
        page: String(newPage),
        search: searchTerm
      });
    };

    const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setSearchTerm(val);
      setPage(1);
      setSearchParams({
        tab: selectedTab,
        page: "1",
        search: val
      });
    };

  useEffect(() => {
    const urlTab = searchParams.get("tab") || "approved";
    const urlPage = Number(searchParams.get("page")) || 1;
    const urlSearch = searchParams.get("search") || "";

    setSelectedTab(urlTab);
    setPage(urlPage);
    setSearchTerm(urlSearch);
    
  }, [searchParams]);


  useEffect(() => {
    fetchCourses(page, pageSize, searchTerm);
  }, [page, selectedTab, pageSize,fetchCourses, searchTerm]);

  return (
    <>
      <Tabs defaultValue={selectedTab}>

        <TabsList>
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-between">
              <span className={`text-3xl bg-conic ${selectedTab === 'approved' ? 'from-sky-700 via-sky-400' : 'from-amber-500/90 via-amber-200/80'} to-white bg-clip-text text-transparent font-bold font-serif mr-1`}>Courses</span>
              <span className={selectedTab === 'approved' ? 'text-sky-500/80 font-bold text-xs uppercase' : 'text-amber-400/80 font-bold text-xs uppercase'}>~{selectedTab}</span>
            </div>
            <div className="grid w-[350px] grid-cols-2 gap-2 mt-3 text-sm font-bold">
              <TabsTrigger onClick={() => handleTabSelect('approved')} className="border rounded py-1 text-sky-500/80 hover:border-sky-500/40 hover:scale-103" value="approved">
                Approved
              </TabsTrigger>
              <TabsTrigger onClick={() => handleTabSelect('pending')} className="border rounded py-1 text-amber-300/80 hover:border-amber-500/40 hover:scale-103" value="pending">
                Pending
              </TabsTrigger>
            </div>
          </div>
        </TabsList>
        <TabsContent className="relative" value={selectedTab}>
          <div className="absolute top-4 left-0">
            <Input value={searchTerm} onChange={onSearchChange} placeholder="Search Courses..." className="w-full" />  
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader className="animate-spin" />
              <span className="ml-2">Loading courses...</span>
            </div>
          )
          :(
            <>
            <CustomDataTable 
                data={courses} 
                columns={selectedTab === 'approved' ? approvedColumns : pendingColumns} 
                onRowActionSelect={handleAction}
                actionItems={
                  selectedTab === 'approved' ? [
                    { label: "View Details", action: "view" },
                    { label: "Activate/Deactivate", action: "status" },
                  ] : []
                }
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
        </TabsContent>
      </Tabs>
      <CourseDetailsDialog
          course={selectedCourse}
          isOpen={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          onStatusChange={handleCourseVerified}
      />
    </>
  );
}

export default Courses