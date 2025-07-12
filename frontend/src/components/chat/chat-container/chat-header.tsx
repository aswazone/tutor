import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RootState } from "@/store";
import { closeChat } from "@/store/chat";
import { X } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"

const ChatHeader = () => {

  const {selectedChatData,selectedChatType} = useSelector((state: RootState) => state.chat);
  const  dispatch = useDispatch();
  const handleCloseMessage = () =>{
    dispatch(closeChat());
  }

  return (
    <div className="h-[8vh] border-b border-[#062837f7] flex items-center justify-between px-6 gap-3">
        <div className="flex items-center gap-3 font-semibold text-[#b6dbeeeb]">
          <div className="flex gap-3 items-center justify-between">
              <Avatar className="h-12 w-12">
                  <AvatarImage
                  src={selectedChatData?.profileImage || "https://i.pravatar.cc/150?img=67"}
                  alt={selectedChatData?.userName || "User Avatar"}
                  className="object-cover shadow-[inset_0px_0px_25px_7px_rgba(9,_2,_9,_0.94)]"
                  />
                  <AvatarFallback
                  className="text-4xl bg-gradient-to-br from-sky-400 to-blue-800 text-white font-bold"
                  >
                  {selectedChatData?.userName ? selectedChatData.userName.slice(0, 2).toUpperCase() : 'U'}
                  </AvatarFallback>
              </Avatar>
          </div>
          <div className="flex items-center gap-2">
              <h1 className="text-white text-lg font-bold">{selectedChatType === 'contact' ? selectedChatData?.userName : 'Group'}</h1>
          </div>
        </div>
        <X className="h-4 w-4 border rounded-full text-[#b6dbeeeb] cursor-pointer" onClick={handleCloseMessage}/>
    </div>
  )
}

export default ChatHeader