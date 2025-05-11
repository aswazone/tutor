import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { GraduationCap, User } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

// Define the Zod schema for form validation
const FormSchema = z.object({
  role: z.enum(["tutor", "student"], {
    required_error: "You need to select a role.",
  }),
});

const PreAuth = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<"student" | "tutor" | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize react-hook-form with Zod resolver
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      role: "student",
    },
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2,
      speed: Math.random() * 0.5,
      angle: Math.random() * Math.PI * 2, // Random initial angle for rotation
    }));

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const animateStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "black"; // Galaxy background
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        // Update star position based on rotation
        star.angle += star.speed * 0.01; // Adjust speed multiplier for rotation
        const distance = Math.sqrt((star.x - centerX) ** 2 + (star.y - centerY) ** 2);
        star.x = centerX + Math.cos(star.angle) * distance;
        star.y = centerY + Math.sin(star.angle) * distance;

        // Draw the star
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#024a71"; // Star color
        ctx.fill();
      });

      requestAnimationFrame(animateStars); // Loop the animation
    };

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    animateStars(); // Start the animation

    return () => {
      cancelAnimationFrame(animateStars as unknown as number); // Cleanup animation
    };
  }, []);

  const handleContinue = (data: z.infer<typeof FormSchema>) => {
    localStorage.setItem("userRole", data.role);
    navigate("/auth");
  };

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0" />
      <motion.div
        className="flex flex-col w-full items-center justify-center min-h-screen relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col items-start">
          <Link
            to={"/"}
            className="bg-background mb-2 w-[60px] py-1 px-2 from-sky-900/50 via-black to-sky-900/50 text-sm text-sky-400/60 shadow-sm rounded-lg overflow-hidden border border-sky-900/10 bg-conic-210"
          >
            Home
          </Link>
          <Card className="w-[360px] md:w-[450px] py-7 space-y-4 bg-radial-[at_80%_20%] from-sky-900/50 to-black/40 bg-gray-100 dark:bg-gray-800 bg-opacity-10 dark:bg-opacity-50 backdrop-blur-lg border-sky-600/40 border-b-4">
            <CardHeader className="mb-2">
              <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-sky-900">
                Choose Your Role
              </CardTitle>
              <CardDescription className="text-xs text-gray-500">
                Select your role to continue.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleContinue)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-sky-200/60">Select your role</FormLabel>
                        <FormControl>
                          <motion.div
                            className="flex justify-center gap-3"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div
                              className={cn(
                                "flex flex-col items-center space-y-2 cursor-pointer p-6 w-30 md:w-40 text-center rounded-2xl border-2 transition-all duration-300",
                                selectedRole === "tutor"
                                  ? "bg-conic-210 from-sky-900/50 via-black to-sky-900/50 text-sky-600 shadow-sm rounded-lg overflow-hidden border-2 border-sky-900/60"
                                  : "border-gray-300/10"
                              )}
                              onClick={() => {
                                setSelectedRole("tutor");
                                field.onChange("tutor");
                              }}
                            >
                              <User className="h-10 w-10md:h-12 md:w-12 text-sky-200/50" />
                              <span className="text-sm text-sky-300/70">Tutor</span>
                            </div>
                            <div
                              className={cn(
                                "flex flex-col items-center space-y-2 cursor-pointer p-6 w-30 md:w-40 text-center rounded-2xl border-2 transition-all duration-300",
                                selectedRole === "student"
                                  ? "bg-conic-210 from-sky-900/50 via-black to-sky-900/50 text-sky-600 shadow-sm rounded-lg overflow-hidden border-2 border-sky-900/60"
                                  : "border-gray-300/10"
                              )}
                              onClick={() => {
                                setSelectedRole("student");
                                field.onChange("student");
                              }}
                            >
                              <GraduationCap className="h-10 w-10md:h-12 md:w-12 text-sky-200/50" />
                              <span className="text-sm text-sky-300/70">Student</span>
                            </div>
                          </motion.div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="grid gap-4 mt-6">
                      <Button
                        variant="outline"
                        onClick={() => navigate("/home")}
                        className="w-full"
                      >
                        ← Go Back
                      </Button>
                      <Button
                        type="submit"
                        disabled={!selectedRole}
                        className="bg-sky-900/20 text-sky-100 w-full border-1 rounded-md flex justify-center hover:bg-gradient-to-r hover:from-sky-900/10 hover:via-sky-950 hover:to-sky-900/10"
                      >
                        Continue →
                      </Button>
                    </div>
                  </motion.div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default PreAuth;