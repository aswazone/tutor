import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import axiosInstance from "@/config/axios.config"
import { RootState } from "@/store"
import { User } from "@/types/profile.type"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

const ProfileInfo = () => {

    const {user} = useSelector((state: RootState) => state.auth)
    const [isLoading, setIsLoading] = useState(true)
    const [userData, setUserData] = useState<User | null>(null)
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get('/api/v1/auth');
        // console.log(response.data);
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }finally{
        setIsLoading(false);
      }
    };

    useEffect(() => {
      fetchUserData();
    }, [user]);

  return (
    <div>
        {!isLoading && <div className="absolute bottom-2 h-16 flex items-center justify-between px-10 w-full bg-[#0c3a4ef7]">
            <div className="flex gap-3 items-center justify-between">
                <Avatar className="h-12 w-12">
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
            <div className="flex items-center gap-2">
                <h1 className="text-white text-lg font-bold">{userData?.userName}</h1>
            </div>
        </div>}
    </div>
  )
}

export default ProfileInfo