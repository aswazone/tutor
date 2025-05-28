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
import { StudentsCoursesTab } from './tabs/StudentsCoursesTab'
import { EnrolledCoursesTab } from './tabs/EnrolledCoursesTab'
import { Sparkles } from '@/components/common/Sparkles'
import { Link } from 'react-router-dom'

interface User {
  userName: string
  userEmail: string
  name?: string
  role: UserRole
  profileImage?: string
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
        { id: 'courses', name: 'All Courses', icon: <BookOpenIcon className="h-5 w-5 md:hidden" />, component: StudentsCoursesTab },
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
  const userData = user as User | null
  
  const tabs = userData ? getTabs(userData.role) : []

  const renderTabContent = () => {
    const currentTab = tabs.find(tab => tab.id === activeTab)
    if (!currentTab) return null

    const TabComponent = currentTab.component
    return <div className='my-4'><TabComponent /></div>
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Profile Header */}
      <div className="relative">
        <div className="h-48 w-full bg-background bg-gradient-to-br from-sky-900/50 via-black to-sky-900/50 text-sky-600  overflow-hidden border border-sky-900/10 dark:bg-conic-210" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 md:gap-0 -mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
            <div className="flex ">
              <div className="relative rotate-hor-center-normal flip-coin h-24 w-24 rounded-full ring-3 ring-white dark:ring-gray-900/80 dark:bg-gray-200 bg-gray-200 overflow-hidden">
                <Avatar className="h-24 w-24 ">
                  <AvatarImage
                    src={userData?.profileImage || "https://i.pravatar.cc/150?img=67"}
                    alt={userData?.userName || "User Avatar"}
                    className="object-cover "
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
              <div className="sm:hidden md:block mt-6 min-w-0 flex-1">
                <h1 className="text-4xl font-mono font-bold text-foreground truncate">{userData?.userName?.slice(0,1).toUpperCase().concat(userData?.userName?.slice(1)) || userData?.userName}</h1>
                <p className="text-gray-500 dark:text-gray-400">@{userData?.userName.toLowerCase()}</p>
              </div>
              {userData?.role === UserRole.STUDENT && <div className='flex items-center hover:scale-105 gap-1'>
                <span className="text-sm font-bold cursor-pointer font-mono text-sky-500/55 ">Become a Tutor</span>
                <Link to='/become-a-tutor'><Sparkles stroke='#38bdf8' className='hover:scale-110' /></Link>
              </div>}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar */}
          <div className="w-full lg:w-1/3 space-y-6">
            <ProfileCard />
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

const ProfileCard = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-card rounded-lg p-6 shadow-sm"
  >
    <h2 className="text-xl font-semibold mb-4">About</h2>
    <p className="text-muted-foreground">
      Frontend developer passionate about creating beautiful user experiences.
      Learning and sharing knowledge through teaching.
    </p>
    <div className="mt-4 space-y-2">
      <div className="flex items-center text-sm">
        <AcademicCapIcon className="h-5 w-5 md:hidden mr-2 text-primary" />
        <span>Computer Science at University XYZ</span>
      </div>
      <div className="flex items-center text-sm">
        <CalendarIcon className="h-5 w-5 md:hidden mr-2 text-primary" />
        <span>Joined March 2023</span>
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