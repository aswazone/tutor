import { X } from "lucide-react"

const ChatHeader = () => {
  return (
    <div className="h-[7vh] border-b border-[#062837f7] flex items-center justify-between px-6">
        <span className="font-semibold text-[#b6dbeeeb]">Chat/Channel</span>
        <X className="h-4 w-4 border rounded-full text-[#b6dbeeeb]" />
    </div>
  )
}

export default ChatHeader