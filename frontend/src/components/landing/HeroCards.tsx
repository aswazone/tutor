"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Check, LightbulbIcon } from "lucide-react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";

export const HeroCards = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ width, height, top, left }, measure] = useElementDimensions(ref);
  const gradientX = useMotionValue(0.5);
  const gradientY = useMotionValue(0.5);
  const borderGradient = useTransform(
    () =>
      `linear-gradient(135deg, rgba(12, 220, 247, 0.8) ${gradientX.get() * 100}%, rgba(255, 0, 136, 0.8) ${gradientY.get() * 100}%)`
  );

  return (
    <div
      className="hidden rounded-lg lg:flex flex-row flex-wrap gap-8 relative w-[700px] h-[500px]"
      onPointerMove={(e) => {
        gradientX.set((e.clientX - left) / width);
        gradientY.set((e.clientY - top) / height);
      }}
    >
      {/* Student Testimonial */}
      <motion.div
        ref={ref}
        style={{
          borderImageSource: borderGradient,
          borderImageSlice: 1,
        }}
        onPointerEnter={() => measure()}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="absolute w-[340px] -top-[55px] drop-shadow-xl shadow-black/10 dark:shadow-white/10 border-2"
      >
        <Card>
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <Avatar>
              <AvatarImage
                alt="Student Avatar"
                src="https://i.pravatar.cc/150?img=12"
              />
              <AvatarFallback>JS</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <CardTitle className="text-lg">Saurav</CardTitle>
              <CardDescription>@saurav_palat</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            "The courses on this platform have transformed my career. The
            interactive lessons and expert tutors are amazing!"
          </CardContent>
        </Card>
      </motion.div>

      {/* Featured Tutor */}
      <motion.div
        ref={ref}
        style={{
          borderImageSource: borderGradient,
          borderImageSlice: 1,
        }}
        onPointerEnter={() => measure()}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="absolute right-[20px] top-4 w-80 flex flex-col justify-center items-center drop-shadow-xl shadow-black/10 dark:shadow-white/10 border-4"
      >
        <Card>
          <CardHeader className="w-full mt-8 flex flex-col justify-center items-center pb-2">
            <img
              src="https://i.pravatar.cc/150?img=67"
              alt="Tutor Avatar"
              className="absolute grayscale-[0%] -top-12 rounded-full w-24 h-24 aspect-square object-cover"
            />
            <CardTitle className="text-center">Aswin KP</CardTitle>
            <CardDescription className="font-normal text-primary">
              Frontend Expert
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center pb-2">
            <p>
              "I love helping students unlock their potential in data science
              and machine learning."
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Popular Course */}
      <motion.div
        ref={ref}
        style={{
          borderImageSource: borderGradient,
          borderImageSlice: 1,
        }}
        onPointerEnter={() => measure()}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="absolute top-[165px] left-[50px] w-72 drop-shadow-xl shadow-black/10 dark:shadow-white/10 border-4"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex item-center justify-between">
              Mern Bootcamp
              <div className="relative">
                <Badge
                  variant="secondary"
                  className="text-sm bg-rose-400/20 text-rose-100 relative overflow-hidden"
                >
                  Bestseller
                  <motion.div
                    className="absolute w-8 inset-0 bg-gradient-to-r from-transparent via-rose-100/30 to-transparent"
                    animate={{ x: ["-100%", "230%"] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      repeatType: "loop",
                    }}
                  />
                </Badge>
              </div>
            </CardTitle>
            <div>
              <span className="text-3xl font-bold">$199</span>
              <span className="text-muted-foreground"> /course</span>
            </div>
            <CardDescription>
              Master data science with hands-on projects and real-world
              applications.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Enroll Now</Button>
          </CardContent>
          <hr className="w-4/5 m-auto mb-4" />
          <CardFooter className="flex">
            <div className="space-y-2">
              {["10+ Projects", "Expert Mentors", "Lifetime Access"].map(
                (benefit: string) => (
                  <span key={benefit} className="flex">
                    <Check className="text-green-500" />
                    <h3 className="ml-2">{benefit}</h3>
                  </span>
                )
              )}
            </div>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Platform Feature */}
      <motion.div
        ref={ref}
        style={{
          borderImageSource: borderGradient,
          borderImageSlice: 1,
        }}
        onPointerEnter={() => measure()}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="absolute w-[350px] -right-[10px] bottom-[65px] drop-shadow-xl shadow-black/10 dark:shadow-white/10 border-2"
      >
        <Card>
          <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
            <div className="mt-1 bg-primary/20 p-1 rounded-2xl">
              <LightbulbIcon />
            </div>
            <div>
              <CardTitle>Interactive Learning</CardTitle>
              <CardDescription className="text-md mt-2">
                Experience a modern learning platform with interactive lessons,
                quizzes, and live sessions.
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
      </motion.div>
    </div>
  );
};

/**
 * ================  Utils  =========================
 */

function useElementDimensions(
  ref: React.RefObject<HTMLDivElement | null>
): [
  { width: number; height: number; top: number; left: number },
  VoidFunction
] {
  const [size, setSize] = useState({ width: 0, height: 0, top: 0, left: 0 });

  function measure() {
    if (!ref.current) return;

    setSize(ref.current.getBoundingClientRect());
  }

  useEffect(() => {
    measure();
  }, []);

  return [size, measure];
}
