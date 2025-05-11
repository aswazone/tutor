import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { buttonVariants } from "../ui/button";
import { HeroCards } from "./HeroCards";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";

export const Hero = () => {
  const letterAnimation = {
    whileHover: { y: -10 },
    transition: { type: "spring", stiffness: 300, damping: 10 },
  };

  return (
    <section className="container grid lg:grid-cols-2 place-items-center p-3 md:p-20  md:py-32 gap-10">
      <motion.div
        className="text-center lg:text-start space-y-6"
        initial={{ transform: "translateX(-100px)" }}
        animate={{ transform: "translateX(0px)" }}
        transition={{ type: "spring" }}
      >
        <main className="flex flex-col text-5xl md:text-6xl font-bold">
          <h1 className="inline">
            {["T", "u", "t", "o", "r"].map((letter, index) => (
              <motion.span
                key={index}
                className="inline-block sm:text-2xl md:text-8xl bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-transparent bg-clip-text"
                {...letterAnimation}
              >
                {letter}
              </motion.span>
            ))}{" "}
          </h1>{" "}
          <h2 className="inline">
            {["E", "-", "l", "e", "a", "r", "n", "i", "n", "g"].map(
              (letter, index) => (
                <motion.span
                  key={index}
                  className="inline-block sm:text-2xl md:text-8xl bg-gradient-to-r from-[#F596D3] to-[#D247BF] text-transparent bg-clip-text pb-4"
                  {...letterAnimation}
                >
                  {letter}
                </motion.span>
              )
            )}
          </h2>
        </main>

        <p className="text-xs md:text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
          Learn from industry-leading developers and master the hottest skills
          right from your cozy corner at home.
        </p>

        <div className="space-y-4 md:space-y-0 md:space-x-4">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            className="w-full md:w-1/3"
          >
            <Button className="w-full">
              <Link to="/pre-auth">Get Started</Link>
            </Button>
          </motion.div>

          <motion.a
            whileHover={{ scale: 1.1, rotate: -2 }}
            whileTap={{ scale: 0.95 }}
            rel="noreferrer noopener"
            href={import.meta.env.VITE_BACKEND_API_URL + "/home"}
            className={`w-full md:w-1/3 ${buttonVariants({
              variant: "outline",
            })}`}
          >
            Explore {" "} ✨
          </motion.a>
        </div>
      </motion.div>

      {/* Hero cards sections */}
      <motion.div
        className="z-10"
        initial={{ transform: "translateX(100px)" }}
        animate={{ transform: "translateX(0px)" }}
        transition={{ type: "spring" }}
        >
          <HeroCards />
       
      </motion.div>

      {/* Shadow effect */}
      <div className="shadow"></div>
    </section>
  );
};