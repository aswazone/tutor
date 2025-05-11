
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Check, Linkedin } from "lucide-react";
import { LightBulbIcon } from "./Icons";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
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
      className="hidden lg:flex flex-row flex-wrap gap-8 relative w-[700px] h-[500px]"
      onPointerMove={(e) => {
        gradientX.set((e.clientX - left) / width);
        gradientY.set((e.clientY - top) / height);
      }}
    >
      {/* Testimonial */}
      <motion.div
        ref={ref}
        style={{
          borderImageSource: borderGradient,
          borderImageSlice: 1,
        }}
        onPointerEnter={() => measure()}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="absolute w-[340px] -top-[15px] drop-shadow-xl shadow-black/10 dark:shadow-white/10 border-2 "
      >
        <Card>
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <Avatar>
              <AvatarImage
                alt=""
                src="https://github.com/shadcn.png"
              />
              <AvatarFallback>AM</AvatarFallback>
            </Avatar>

            <div className="flex flex-col">
              <CardTitle className="text-lg">Aswa Zone</CardTitle>
              <CardDescription>@aswa_manu</CardDescription>
            </div>
          </CardHeader>

          <CardContent>Error Makes Clever !</CardContent>
        </Card>
      </motion.div>

      {/* Team */}
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
              src="https://static.vecteezy.com/system/resources/previews/000/579/928/large_2x/a-business-letter-logo-and-symbol-template-vector-icon.jpg"
              alt="user avatar"
              className="absolute grayscale-[0%] -top-12 rounded-full w-24 h-24 aspect-square object-cover"
            />
            <CardTitle className="text-center">Aswin KP</CardTitle>
            <CardDescription className="font-normal text-primary">
              Frontend Developer
            </CardDescription>
          </CardHeader>

          <CardContent className="text-center pb-2">
            <p>
              I really enjoy transforming ideas into functional software that
              exceeds expectations
            </p>
          </CardContent>

          <CardFooter>
            <div>
              <a
                rel="noreferrer noopener"
                href="https://github.com/leoMirandaa"
                target="_blank"
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                })}
              >
                <span className="sr-only">Github icon</span>
                <GitHubLogoIcon className="w-5 h-5" />
              </a>
              <a
                rel="noreferrer noopener"
                href="https://twitter.com/leo_mirand4"
                target="_blank"
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                })}
              >
                <span className="sr-only">X icon</span>
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="fill-foreground w-5 h-5"
                >
                  <title>X</title>
                  <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                </svg>
              </a>

              <a
                rel="noreferrer noopener"
                href="https://www.linkedin.com/in/leopoldo-miranda/"
                target="_blank"
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                })}
              >
                <span className="sr-only">Linkedin icon</span>
                <Linkedin size="20" />
              </a>
            </div>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Pricing */}
      <motion.div
        ref={ref}
        style={{
          borderImageSource: borderGradient,
          borderImageSlice: 1,
        }}
        onPointerEnter={() => measure()}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="absolute top-[150px] left-[50px] w-72 drop-shadow-xl shadow-black/10 dark:shadow-white/10 border-4"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex item-center justify-between">
              Free
              <Badge
                variant="secondary"
                className="text-sm text-primary"
              >
                Most popular
              </Badge>
            </CardTitle>
            <div>
              <span className="text-3xl font-bold">$0</span>
              <span className="text-muted-foreground"> /month</span>
            </div>

            <CardDescription>
              Lorem ipsum dolor sit, amet ipsum consectetur adipisicing elit.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Button className="w-full">Start Free Trial</Button>
          </CardContent>

          <hr className="w-4/5 m-auto mb-4" />

          <CardFooter className="flex">
            <div className="space-y-4">
              {["4 Team member", "4 GB Storage", "Upto 6 pages"].map(
                (benefit: string) => (
                  <span
                    key={benefit}
                    className="flex"
                  >
                    <Check className="text-green-500" />{" "}
                    <h3 className="ml-2">{benefit}</h3>
                  </span>
                )
              )}
            </div>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Service */}
      <motion.div
        ref={ref}
        style={{
          borderImageSource: borderGradient,
          borderImageSlice: 1,
        }}
        onPointerEnter={() => measure()}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="absolute w-[350px] -right-[10px] bottom-[30px] drop-shadow-xl shadow-black/10 dark:shadow-white/10 border-2"
      >
        <Card>
          <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
            <div className="mt-1 bg-primary/20 p-1 rounded-2xl">
              <LightBulbIcon />
            </div>
            <div>
              <CardTitle>Light & dark mode</CardTitle>
              <CardDescription className="text-md mt-2">
                Lorem ipsum dolor sit amet consect adipisicing elit. Consectetur
                natusm.
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
