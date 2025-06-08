import { motion } from 'framer-motion'
import {
  CalendarIcon,
  AcademicCapIcon,
  HomeIcon,
  BookOpenIcon,
  UserGroupIcon,
  StarIcon,
  Cog6ToothIcon,
  UserIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store'
import { UserRole } from '@/types'

import { TutorCoursesTab } from './tabs/TutorCoursesTab'
import { StudentsTab } from './tabs/StudentsTab'
import { ReviewsTab } from './tabs/ReviewsTab'
import { TeachersTab } from './tabs/TeachersTab'
import { TeachersOverviewTab } from './tabs/TeachersOverviewTab'
import { StudentsOverviewTab } from './tabs/StudentsOverviewTab'
import { TeachersSettingsTab } from './tabs/TeachersSettingsTab'
import { StudentsSettingsTab } from './tabs/StudentsSettingsTab'
import { CreateCourseTab } from './tabs/CreateCourseTab'
import { setActiveTab } from '@/store/auth/authSlice'
import { WishlistTab } from './tabs/WishlistTab'
import { EnrolledCoursesTab } from './tabs/EnrolledCoursesTab'
import { Sparkles } from '@/components/common/Sparkles'
import { CheckCheck } from '@/components/common/VerifiedBadge'
import { BadgeAlert } from '@/components/common/AlertBadge'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { TutorVerifyModal } from '@/components/profile/TutorVerifyModal'
import Loader from '@/components/ui/loader'
import { useEffect, useState } from 'react'
import axiosInstance from '@/config/axios.config'
import CustomAlert from '@/components/common/CustomAlert'
import { LightbulbIcon } from 'lucide-react'

interface User {
  _id: string
  userName: string
  userEmail: string
  name?: string
  role: UserRole
  profileImage?: string
  isVerified?: string
  tutorDetails?: {
    qualification?: string
    experience?: number
    expertise?: string
    about?: string
    resume?: string
    rejectReason?: string
  }
  createdAt?: Date
}

const getTabs = (role: UserRole) => {
  switch (role) {
    case UserRole.TUTOR:
      return [
        { id: 'overview', name: 'Overview', icon: <HomeIcon className="h-5 w-5 md:hidden" />, component: TeachersOverviewTab },
        { id: 'courses', name: 'My Courses', icon: <BookOpenIcon className="h-5 w-5 md:hidden" />, component: TutorCoursesTab },
        { id: 'create-course', name: 'Manage Course', icon: <PlusIcon className="h-5 w-5 md:hidden" />, component: CreateCourseTab },
        { id: 'students', name: 'My Students', icon: <UserGroupIcon className="h-5 w-5 md:hidden" />, component: StudentsTab },
        { id: 'reviews', name: 'Reviews', icon: <StarIcon className="h-5 w-5 md:hidden" />, component: ReviewsTab },
        { id: 'settings', name: 'Settings', icon: <Cog6ToothIcon className="h-5 w-5 md:hidden" />, component: TeachersSettingsTab },
      ]
    case UserRole.STUDENT:
      return [
        { id: 'overview', name: 'Overview', icon: <HomeIcon className="h-5 w-5 md:hidden" />, component: StudentsOverviewTab },
        { id: 'enrolled-courses', name: 'Enrolled Courses', icon: <StarIcon className="h-5 w-5 md:hidden" />, component: EnrolledCoursesTab },
        { id: 'wishlist', name: 'Wishlist', icon: <AcademicCapIcon className="h-5 w-5 md:hidden" />, component: WishlistTab },
        { id: 'teachers', name: 'Teachers', icon: <UserIcon className="h-5 w-5 md:hidden" />, component: TeachersTab },
        { id: 'settings', name: 'Settings', icon: <Cog6ToothIcon className="h-5 w-5 md:hidden" />, component: StudentsSettingsTab },
      ]
    default:
      return []
  }
}

const Profile = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { user, activeTab } = useSelector((state: RootState) => state.auth)
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<User | null>(null)

  console.log(userData)

    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get('/api/v1/auth');
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }finally{
        setIsLoading(false);
      }
    };

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [dispatch, user]);


  console.log("User Data:", userData)
  
  const tabs = userData ? getTabs(userData.role) : []

  const renderTabContent = () => {
    const currentTab = tabs.find(tab => tab.id === activeTab)
    if (!currentTab) return null

    const TabComponent = currentTab.component
    return <div className='relative'>
        <div className={
          userData?.role === UserRole.STUDENT 
            ? 'my-5' 
            : userData?.isVerified === 'pending'
              ? 'blur-sm grayscale-75 mt-5 pointer-events-none'
              : userData?.isVerified === 'rejected'
                ? 'grayscale-75 mt-5 pointer-events-none'
                : userData?.isVerified === 'unverified'
                  ? 'grayscale-85 mt-5'
                  : 'my-5'
        }>
          <TabComponent />
        </div>
        {userData?.isVerified === 'pending' && (
          <div className='absolute top-0 z-50 left-0 w-full mt-30 flex items-center justify-center'>
            <Loader className='w-7 h-7 mr-2'/> Verifying!
          </div>
        )}
    </div>
  }
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false)

  const handleVerifyRequest = () => {
    setIsVerifyModalOpen(true)
  }

  const handleVerifySuccess = async () => {
    try {
      await fetchUserData();
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  if(isLoading) return <Loader className='w-7 h-7'/>
  return (
    <div className="min-h-screen bg-background">
      {/* Profile Header */}
      <div className="relative">
        <div className="h-48 w-full bg-background bg-gradient-to-br from-sky-900/50 via-black to-sky-900/50 text-sky-600  overflow-hidden border border-sky-900/10 dark:bg-conic-210" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 md:gap-0 -mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
            <div className="flex">
              <div className="relative rotate-hor-center-normal flip-coin h-24 w-24 rounded-full border-1 shadow-[inset_0px_0px_25px_7px_rgba(2,_13,_19,_0.94)] border-black overflow-hidden">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={userData?.profileImage || "https://i.pravatar.cc/150?img=67"}
                    alt={userData?.userName || "User Avatar"}
                    className="object-cover shadow-[inset_0px_0px_25px_7px_rgba(9,_2,_9,_0.94)]"
                  />
                  <AvatarFallback 
                    className="text-4xl bg-gradient-to-br from-sky-400 to-blue-800 text-white font-bold"
                  >
                    {userData?.userName ? userData.userName.slice(0, 2).toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
            <div className="md:mt-6 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
              <div className="sm:hidden md:flex md:items-start mt-6 min-w-0 flex-1">
                <div className=''>
                  <h1 className="text-4xl font-mono font-bold text-foreground truncate">{userData?.userName?.slice(0,1).toUpperCase().concat(userData?.userName?.slice(1)) || userData?.userName}</h1>
                  <p className="text-gray-500 dark:text-gray-400">@{userData?.userName.toLowerCase()}</p>
                </div>
                {userData?.role === UserRole.TUTOR && ( userData?.isVerified === 'verified'
                  ? <CheckCheck stroke='#34D399' className="h-5 w-5 mt-1 text"/>
                  : userData?.isVerified === 'pending' 
                    ? <Loader className='h-5 w-5 ml-1 mt-3'/> 
                    : (
                        <HoverCard defaultOpen={userData?.isVerified !== 'verified'}>
                          <HoverCardTrigger asChild>  
                            <BadgeAlert 
                              stroke='#f59e0b' 
                              className="h-5 w-5 mt-1 cursor-pointer animate-caret-blink grayscale-25 hover:grayscale-0 hover:scale-105 transition-all"
                            />
                          </HoverCardTrigger>
                          <HoverCardContent className="relative w-80 mt-2 ml-10 bg-card/95 backdrop-blur-lg rounded-tl-2xl rounded-br-2xl rounded-bl-none rounded-tr-none border-sky-900/40 shadow-[0px_17px_22px_4px_rgba(3,_7,_13,_0.95)]">
                            <div className="absolute inset-y-auto left-0 h-80% w-px bg-neutral-200/80 dark:bg-neutral-800/80">
                              <div className="absolute top-0 h-20 w-px bg-gradient-to-b from-transparent via-sky-500 to-transparent" />
                            </div>
                            <div className="absolute inset-x-3 top-0 h-px w-80% bg-neutral-200/80 dark:bg-neutral-800/80">
                              <div className="absolute mx-auto h-px w-30 bg-gradient-to-r from-transparent via-sky-500 to-transparent" />
                            </div>
                            
                            <div className="flex justify-between space-x-4">
                              <div className="space-y-2">
                                <h4 className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-br from-sky-900/90 from-40% to-sky-200/70">{userData?.userEmail}</h4>                                
                                
                                  {userData?.isVerified === 'rejected' && <CustomAlert 
                                    className="bg-red-950/10 text-red-400/50 hover:text-red-400/60 hover:bg-red-950/30"
                                    title="Admin Rejected !" 
                                    description={userData?.tutorDetails?.rejectReason || "No reason provided."} 
                                    isLoading={false}
                                    />}
                                
                                <div className="flex items-center justify-between gap-2 pt-2">
                                  <div className="flex items-center text-xs text-muted-foreground">
                                    <CalendarIcon className="mr-1 h-4 w-4 opacity-70" />
                                    <span>Joined {new Date(userData?.createdAt as Date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                  </div>                                  
                                  <button
                                    onClick={handleVerifyRequest}
                                    className="text-white px-3 py-1 text-xs rounded-tl-md rounded-br-md bg-gradient-to-br from-sky-900/30 to-sky-900/60 
                                      border border-sky-800/30 hover:from-sky-900/40 hover:to-sky-900/70 
                                      transition-colors"
                                  >
                                    Request Verify
                                  </button>
                                </div>
                              </div>
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      ))
                  }
              
              {/* Tutor Verify Modal */}
              <TutorVerifyModal 
                tutorId={userData?._id as string}
                isOpen={isVerifyModalOpen}
                onClose={() => setIsVerifyModalOpen(false)}
                onSuccess={handleVerifySuccess}
              />
              </div>
              {userData?.role === UserRole.STUDENT && ( 
                 userData?.isVerified === 'pending' 
                    ? <Loader className='h-5 w-5 ml-1 mt-3'/> 
                    : (
                        <HoverCard>
                          <HoverCardTrigger asChild>
                            <Sparkles 
                              stroke='#38bdf8' 
                              className="h-8 w-8 mt-1 cursor-pointer animate-in grayscale-25 hover:grayscale-0 hover:scale-105 transition-all"
                            />
                          </HoverCardTrigger>
                          <HoverCardContent sideOffset={15} side='left' className="relative w-80 mb-25 bg-card/95 backdrop-blur-lg rounded-tl-2xl rounded-br-2xl rounded-bl-none rounded-tr-none border-sky-900/40 shadow-[0px_17px_22px_4px_rgba(3,_7,_13,_0.95)]">
                            <div className="absolute inset-y-auto left-0 h-80% w-px bg-neutral-200/80 dark:bg-neutral-800/80">
                              <div className="absolute top-0 h-20 w-px bg-gradient-to-b from-transparent via-sky-500 to-transparent" />
                            </div>
                            <div className="absolute inset-x-3 top-0 h-px w-80% bg-neutral-200/80 dark:bg-neutral-800/80">
                              <div className="absolute mx-auto h-px w-30 bg-gradient-to-r from-transparent via-sky-500 to-transparent" />
                            </div>
                            
                            <div className="flex justify-between space-x-4">
                              <div className="space-y-2">
                                <h4 className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-br from-sky-900/90 from-40% to-sky-200/70">{userData?.userEmail}</h4>                                
                                
                                  {userData?.role !== UserRole.STUDENT && userData?.isVerified === 'rejected' && <CustomAlert 
                                    className="bg-red-950/10 text-red-400/50 hover:text-red-400/60 hover:bg-red-950/30"
                                    title="Admin Rejected !" 
                                    description={userData?.tutorDetails?.rejectReason || "No reason provided."} 
                                    isLoading={false}
                                    />}
                                    <CustomAlert 
                                    className="bg-red-950/10 text-red-400/50 hover:text-red-400/60 hover:bg-red-950/30"
                                    title="Warning !" 
                                    description="Important: This action is permanent. You cannot switch back to a student account with this email address." 
                                    isLoading={false}
                                    />
                                
                                <div className="flex items-center justify-between gap-2 pt-2">
                                  <div className="flex items-center text-xs text-muted-foreground">
                                    <CalendarIcon className="mr-1 h-4 w-4 opacity-70" />
                                    <span>Joined {new Date(userData?.createdAt as Date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                  </div>
                                  <button
                                    onClick={handleVerifyRequest}
                                    className="text-white px-3 py-1 text-xs rounded-tl-md rounded-br-md bg-gradient-to-br from-sky-900/20 to-sky-900/40 
                                      border border-sky-800/30 hover:from-sky-900/40 hover:to-sky-900/70 
                                      transition-colors"
                                  >
                                    Become a Tutor
                                  </button>
                                </div>
                              </div>
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      ))
                  }
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar */}
          <div className="w-full lg:w-1/3 space-y-6">
            <ProfileCard userData={userData as User} />
            {userData?.role === UserRole.TUTOR ? <TeachersCard /> : <StudentsCard />}
          </div>

          {/* Right Content */}
          <div className="w-full lg:w-2/3 space-y-6">
            <div className="w-full overflow-x-auto scrollbar-none -mb-px">
              <nav className="flex justify-around space-x-4 border-b border-border pb-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => dispatch(setActiveTab(tab.id))}
                    className={` px-3 py-1  rounded-bl-lg rounded-tr-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-br border-2 border-sky-800/30 from-sky-900/30 to-sky-9from-sky-900/60 text-primary-background'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tab.icon}
                    <span className="hidden sm:inline">{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

const ProfileCard = ({ userData }: { userData: User }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-card rounded-lg p-6 shadow-sm"
  >
    <h2 className="text-xl font-semibold mb-4">About</h2>
    <p className="text-muted-foreground">
      {userData?.tutorDetails?.about || `Frontend developer passionate about creating beautiful user experiences.
      Learning and sharing knowledge through teaching.`}
    </p>
    <div className="mt-4 space-y-2">
      <div className="flex items-center text-sm">
        <LightbulbIcon className="h-5 w-5 mr-4 text-primary" />
        <span>{(userData?.tutorDetails?.expertise as string) || "Frontend Development, UI/UX Design"}</span>
      </div>
      <div className="flex items-center text-sm">
        <AcademicCapIcon className="h-5 w-5 mr-4 text-primary" />
        <span>{userData?.tutorDetails?.qualification || "Bachelor's degree in Computer Science"}</span>
      </div>
      <div className="flex items-center text-sm">
        <CalendarIcon className="h-5 w-5 mr-4 text-primary" />
        <span>Joined {new Date(userData?.createdAt as Date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>
    </div>
  </motion.div>
)

const TeachersCard = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
    className="bg-card rounded-lg p-6 shadow-sm"
  >
    <h2 className="text-xl font-semibold mb-4">My Stats</h2>
    <div className="grid grid-cols-2 gap-4">
      <div className="text-center">
        <div className="text-2xl font-bold">15</div>
        <div className="text-sm text-muted-foreground">Courses</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold">156</div>
        <div className="text-sm text-muted-foreground">Students</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold">4.8</div>
        <div className="text-sm text-muted-foreground">Rating</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold">24</div>
        <div className="text-sm text-muted-foreground">Reviews</div>
      </div>
    </div>
  </motion.div>
)

const StudentsCard = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.15 }}
    className="bg-card rounded-lg p-6 shadow-sm"
  >
    <h2 className="text-xl font-semibold mb-4">My Stats</h2>
    <div className="grid grid-cols-2 gap-4">
      <div className="text-center">
        <div className="text-2xl font-bold">8</div>
        <div className="text-sm text-muted-foreground">Enrolled</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold">3</div>
        <div className="text-sm text-muted-foreground">Wishlist</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold">5</div>
        <div className="text-sm text-muted-foreground">Completed</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold">2</div>
        <div className="text-sm text-muted-foreground">Reviews</div>
      </div>
    </div>
  </motion.div>
)

export default Profile