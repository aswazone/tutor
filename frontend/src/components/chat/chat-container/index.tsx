import ChatHeader from "./chat-header"
import MessageBar from "./message-bar"
import MessageContainer from "./message-container"

const ChatContainer = () => {
  return (
    <div className="fixed top-0 h-[43rem] bg-[#4c7181a0] flex flex-col md:static md:flex-1">
        <ChatHeader />
        <MessageContainer />
        <MessageBar />
    </div>
  )
}

export default ChatContainer