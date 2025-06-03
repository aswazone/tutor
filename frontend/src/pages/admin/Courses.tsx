import { CoursesTable } from "@/components/admin/CoursesTable"
import { PendingApprovalCourses } from "@/components/admin/PendingApprovalCourses"
import axiosInstance from "@/config/axios.config"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs"
import { useEffect, useState } from "react"
import { Loader } from "lucide-react"
import { CourseDetailsDialog } from "@/components/admin/CourseDetailsDialog"
import { verifyCourse } from "@/store/admin/adminSlice"
import { toast } from "sonner"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/store"


interface ApiCourses {
  _id: string;
  title: string;
  isPublished: boolean;
  isActive: boolean;
  thumbnailKey: string;
  level: string;
  pricing: string;
  tutor: {
    id: string;
    userName: string;
  };
  rating: string;
  category: string;
  isDeleted: boolean;
  createdAt: Date;
  isVerified: string;
  rejectReason?: string
}

export interface Course {
  id: string
  title: string
  tutor: string
  category: string
  thumbnailKey: string
  level: string
  isVerified: string
  rejectReason?: string
  isActive: boolean
  price: string
  enrollments: number
  rating: number
  status: "draft" | "published" | "archived"
}

const Courses = () => {
  const [approvedCourses, setApprovedCourses] = useState<Course[]>([]);
  const [pendingCourses, setPendingCourses] = useState<Course[]>([]);
  const [selectedTab, setSelectedTab] = useState('approved');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    
  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/api/v1/admin/courses');
      console.log(response.data,'response.data');
      const transformedCourses = response.data.result.map((course: ApiCourses) => ({
        id: course._id,
        title: course.title,
        status: course.isPublished ? 'published' : 'draft',
        category: course.category,
        isDeleted: course.isDeleted,
        isVerified: course.isVerified,
        rejectReason: course.rejectReason,
        isActive: course.isActive,
        level: course.level,
        tutor: course.tutor?.userName,
        price: course.pricing,
        rating: course.rating,
        thumbnailKey: course.thumbnailKey,
        enrollments: 0,
        createdDate: new Date(course.createdAt).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      }));

      // Split courses based on verification status
      const approved = transformedCourses.filter((course: Course) => course.isVerified === 'verified');
      const pending = transformedCourses.filter((course: Course) => course.isVerified !== 'verified');

      setApprovedCourses(approved);
      setPendingCourses(pending);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setIsLoading(false);
    }
  };


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

  useEffect(() => {
    fetchCourses();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader className="animate-spin" />
        <span className="ml-2">Loading courses...</span>
      </div>
    );
  }

  return (
    <>
      <Tabs defaultValue="approved">
        <TabsList>
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-between">
              <span className={`text-3xl bg-conic ${selectedTab === 'approved' ? 'from-sky-700 via-sky-400' : 'from-amber-500/90 via-amber-200/80'} to-white bg-clip-text text-transparent font-bold font-serif mr-1`}>Courses</span>
              <span className={selectedTab === 'approved' ? 'text-sky-500/80 font-bold text-xs uppercase' : 'text-amber-400/80 font-bold text-xs uppercase'}>~{selectedTab}</span>
            </div>
            <div className="grid w-[350px] grid-cols-2 gap-2 mt-3 text-sm font-bold">
              <TabsTrigger onClick={() => setSelectedTab('approved')} className="border rounded py-1 text-sky-500/80 hover:border-sky-500/40 hover:scale-103" value="approved">
                Approved
              </TabsTrigger>
              <TabsTrigger onClick={() => setSelectedTab('pending')} className="border rounded py-1 text-amber-300/80 hover:border-amber-500/40 hover:scale-103" value="pending">
                Pending
              </TabsTrigger>
            </div>
          </div>
        </TabsList>
        <TabsContent value="approved">
          <CoursesTable setIsDetailsOpen={setIsDetailsOpen} setSelectedCourse={setSelectedCourse} courses={approvedCourses} setCourses={setApprovedCourses} />
        </TabsContent>
        <TabsContent value="pending">
          <PendingApprovalCourses setIsDetailsOpen={setIsDetailsOpen} setSelectedCourse={setSelectedCourse} courses={pendingCourses}/>
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