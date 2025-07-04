import { useNavigate } from "react-router-dom";
// import { Button } from "../ui/button";
// import { HeroCards } from "./HeroCards";
import { motion } from "framer-motion";
// import { WavyBackground } from "../common/WavyBackground";
import { ShinyButton } from "../magicui/shiny-button";
import { SparklesCore } from "../common/SparklesLight";
import { GridLineHorizontal } from "../common/GridLines";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    
    <div className="h-screen w-full bg-gradient-to-br from-[#011a3a] via-[#000000] to-[#021920] flex flex-col items-center justify-center overflow-hidden rounded-md">
         <motion.h1
           className="levitate absolute text-shadow-md text-shadow-black/30  bg-gradient-to-r from-[#206ed5] via-[#083543] to-[#011a3a] text-transparent bg-clip-text top-[25%] hidden md:block text-[160px] opacity-30"
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.7, duration: 0.5 }}
         >
         Tutor-E-Learning
         </motion.h1>
         <motion.h1
           className="text-3xl md:text-6xl lg:text-7xl font-extrabold text-center bg-gradient-to-r from-sky-400 via-fuchsia-400 to-teal-300 text-transparent bg-clip-text drop-shadow-lg"
           initial={{ opacity: 0, y: -30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.2, duration: 0.8, type: 'spring' }}
         >
           <span className="inline-block animate-gradient-x bg-gradient-to-r from-sky-400 via-fuchsia-400 to-[#F596D3] bg-clip-text text-transparent ">
               {["T", "u", "t", "o", "r"].map((letter, index) => (
                 <motion.span
                   key={index}
                   className="inline-block text-shadow-md text-shadow-black/10 text-6xl md:text-8xl bg-gradient-to-r from-[#2a7f96] via-[#1896bc] to-[#002532] text-transparent bg-clip-text"
                   whileHover={{ y: -10 }}
                   transition={{ type: "spring" as const, stiffness: 300, damping: 10 }}
                 >
                   {letter}
                 </motion.span>
               ))}{" "}<span className="tracking-tight block md:inline">
               {["E", "-", "l", "e", "a", "r", "n", "i", "n", "g"].map(
                 (letter, index) => (
                   <motion.span
                     key={index}
                     className="inline-block text-shadow-md text-shadow-black/10 text-6xl md:text-8xl bg-gradient-to-r from-[#F596D3] via-[#bb4f95]  to-[#520047] text-transparent bg-clip-text pb-4"
                     whileHover={{ y: -10 }}
                     transition={{ type: "spring" as const, stiffness: 300, damping: 10 }}
                   >
                     {letter}
                   </motion.span>
                 )
               )}
              </span>
           </span>
         </motion.h1>
        
      <div className="w-[40rem] h-40 relative">
        {/* Gradients */}
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-400 to-transparent h-[5px] w-1/4 blur-sm" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />
 
        {/* Core component */}
        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1}
          particleDensity={1200}
          className="w-full h-full"
          particleColor="#6ccfee"
        />
 
        {/* Radial Gradient to prevent sharp edges */}
        <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
      </div>
         <motion.div
           className="absolute bottom-55 w-full flex justify-center"
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.7, duration: 0.5 }}
         >
           <ShinyButton
             className=" px-8 py-3 rounded-lg border border-sky-500/20 hover:border-b-1.5 hover:border-b-sky-500/50  font-semibold text-xl shadow-lg backdrop-blur-md hover:scale-105 transition-all duration-200"
             onClick={() => navigate('/courses')}
           >
             <span className="text-shadow-black/20 text-md bg-gradient-to-b  from-[#377bd4] via-[#146d88] to-[#044ba9] text-transparent bg-clip-text">Explore Courses</span>
           </ShinyButton>
         </motion.div>
         <motion.p
           className="absolute text-shadow-black/20 text-md bg-gradient-to-l from-[#eeede7] via-[#e6d00c]  to-[#987a02] text-transparent bg-clip-text mt-6 text-center max-w-xl text-shadow-lg "
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 1, duration: 0.6 }}
         >
           Learn from industry-leading developers and master the hottest skills right from your cozy corner at home.
         </motion.p>
         <GridLineHorizontal offset="-100px" className="-bottom-15 h-0.5" />
    </div>
  );
};