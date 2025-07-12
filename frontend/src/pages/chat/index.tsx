import ChatContainer from "@/components/chat/chat-container";
import ContactsContainer from "@/components/chat/contacts-container";
import EmptyChatContainer from "@/components/chat/empty-chat-container";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

const Chat = () => {

    const {selectedChatData,selectedChatType} = useSelector((state:RootState) => state.chat);
    console.log(selectedChatData,selectedChatType);

    return (
        <div className="flex h-[43rem] overflow-hidden">
            <ContactsContainer />
            {
                selectedChatType === undefined 
                ? <EmptyChatContainer />
                : <ChatContainer />
            }
        </div>
    )
}

export default Chat