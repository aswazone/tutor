import { Paperclip, SendHorizontal, Smile } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import EmojiPicker, { EmojiStyle, Theme } from 'emoji-picker-react';

const MessageBar = () => {

  const emojiRef = useRef<HTMLDivElement>(null);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(()=>{
    const handleClickOut = (e:MouseEvent) => {
      if(emojiRef.current && !emojiRef.current.contains(e.target as Node)){
        setEmojiPickerOpen(false);
      }  
    }

    document.addEventListener('mousedown', handleClickOut);

    return () => {
      document.removeEventListener('mousedown', handleClickOut);
    }
  },[emojiRef])

  const hanadleAddEmoji = (emoji:{emoji:string}) =>{
    setMessage((msg)=> msg + emoji.emoji);
  }

  const handleSendMessage = () =>{

  }

  

  return (
    <div className="h-[10vh] bg-[#071e28f7] flex justify-center items-center px-8 gap-5 ">
      <div className="flex-1 flex bg-[#0f2630f7] rounded-md gap-5 pr-5">
        <input 
          type="text" 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message" 
          className="flex-1 p-2 bg-transparent rounded-md focus:outline-none focus:border-none placeholder:text-sky-200/40"
         />
          <button className="text-sky-200/40">
            <Paperclip className="w-4 h-4"/>
          </button>
          <div className="relative flex items-center">
            <button onClick={()=>setEmojiPickerOpen(!emojiPickerOpen)} className="text-sky-200/40">
              <Smile className="w-4 h-4"/>
            </button>
            <div ref={emojiRef} className="absolute bottom-15 -right-25">
              <EmojiPicker emojiStyle={EmojiStyle.APPLE} theme={Theme.DARK} open={emojiPickerOpen} onEmojiClick={hanadleAddEmoji} autoFocusSearch={false}/>
            </div>
          </div>
      </div>
      <button onClick={handleSendMessage} className="bg-[#2f6379f7] flex items-center justify-center p-3 rounded-md text-sky-200/70">
        <SendHorizontal className="w-4 h-4"/>
      </button>
    </div>
  )
}

export default MessageBar