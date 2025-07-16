// import { env } from "@/config/env.config";
// import { RootState } from "@/store";
// import { createContext, ReactNode, useEffect, useRef } from "react";
// import { useSelector } from "react-redux";
// import { default as io, Socket } from "socket.io-client";
// const SocketContext = createContext(null);


// export const SocketProvider = ({ children }: { children: ReactNode }) => {

//     const {user} = useSelector((state: RootState) => state.auth);

//     // const socket:SocketIOClient.Socket = io(env.API_URL, {
//     //     autoConnect: false,
//     //     reconnection: true,
//     //     reconnectionAttempts: 5,
//     //     reconnectionDelay: 1000,

        
//     // })

//     const socket = useRef<typeof Socket | null>(null);

//     useEffect(()=>{
//         if(user){
//             socket.current = io(env.API_URL,{
//                 withCredentials: true,
//                 query: {
//                     userId: user._id
//                 }
//             });

//             socket.current.on('connect', () => {
//                 console.log("connected to socket server");
//             });
//         }

//         return () => {
//             if(socket.current){
//                 socket.current.disconnect();
//             }
//         }
//     },[user])

//     return (
//         <SocketContext.Provider value={socket.current}>
//             {children}
//         </SocketContext.Provider>
//     )

// }

// export { SocketContext }