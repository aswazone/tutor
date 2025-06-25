import { useState, useRef, useEffect } from "react";
import { Paperclip, Send } from "lucide-react";
import RobotViewer from "./Robo";
import { BorderBeam } from "../magicui/border-beam";

const GlassChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { from: "user", text: input }]);
    setInput("");
    // Simulate bot reply
    setTimeout(() => {
      setMessages(msgs => [...msgs, { from: "bot", text: "I'm just a demo bot 🤖" }]);
    }, 800);
  };

  return (
    <div className="fixed bottom-6 right-8 z-50 flex flex-col items-end">
      {/* Toggle Button */}
      
      <button
        onClick={() => setOpen(o => !o)}
        className=""
        aria-label="Open chat"
      >
        <RobotViewer />
      </button>

      {/* Chat Box */}
      {open && (
        <div className="w-80 max-w-[90vw] rounded-tl-3xl rounded-br-3xl shadow-2xl border border-sky-600/20 bg-sky-900/10 backdrop-blur-xl p-4 flex flex-col gap-2 animate-fade-in">
          <BorderBeam />
          <div className="flex items-center gap-2 mb-2">
            <span className="w-3 h-3 rounded-full bg-green-400/80 animate-pulse" />
            <span className="font-semibold text-sky-200">AI Enquire Bot</span>
          </div>
          <div className="flex-1 min-h-[120px] max-h-60 overflow-y-auto custom-scrollbar">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`mb-1 flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
              >
                <span
                  className={`px-3 py-1.5 rounded-2xl text-sm max-w-[80%] ${
                    msg.from === "user"
                      ? "bg-sky-500/80 text-white rounded-br-none"
                      : "bg-sky-300/10 rounded-bl-none border border-sky-300/20 text-sky-200 backdrop-blur-md"
                  }`}
                >
                  {msg.text}
                </span>
              </div>
            ))}
          </div>
          <form
            className="flex items-center gap-2 mt-2"
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-xl px-3 py-1 text-sm bg-gray-800 text-sky-300/70 placeholder:text-sky-700/80 focus:outline-none focus:ring-2 focus:ring-sky-400/30 backdrop-blur-md"
            />
            <div className="flex items-center">
            <button type="button" className="p-2 text-sky-400 hover:text-sky-600">
              <Paperclip size={15} />
            </button>
            <button
              type="submit"
              className="p-2 rounded-full bg-sky-400/30 hover:bg-sky-500 text-white transition"
            >
              <Send size={15} />
            </button>
            </div>
          </form>
        </div>
      )}
      <style>{`
        .animate-fade-in {
          animation: fadeInUp 0.3s cubic-bezier(.4,0,.2,1);
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #38bdf8aa;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default GlassChatBot;