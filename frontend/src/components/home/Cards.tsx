import { useNavigate } from "react-router-dom";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { ICourse } from "@/types/course.type";
import { courseService } from "@/services/course.service";
import { env } from "@/config/env.config";
import Loader from "../ui/loader";


const toolsAndTopics: string[] = [
  "React", "JavaScript", "UI/UX Design", "Data Science",
  "Python", "Machine Learning", "Web Development", "Mobile Development"
];



export const Cards = () => {

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [latestFourCourses, setLatestFourCourses] = useState<ICourse[]>([]);

  useEffect(() => {
    const fetchCoursesAsync = async () => {
      setIsLoading(true);
      const result = await courseService.fetchCourses("newest", 4, 1);
      if (result) setLatestFourCourses(result);
      setIsLoading(false);
    };
    fetchCoursesAsync();
  }, []);

  console.log(latestFourCourses, "latestThreeCourses");

  return (
    <section id="courses" className="container py-15 md:px-20 sm:px-3 sm:py-32 space-y-5">
      {/* Example usage of the loading animation */}

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl lg:text-6xl font-bold md:text-center auto-show text-sky-400"
      >
        Latest{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Courses
        </span>
      </motion.h2>


      {
        isLoading 
        ? <div className="flex h-[200px] items-center justify-center"><Loader /> Please Wait..</div> 
        : latestFourCourses && latestFourCourses.length > 0 &&
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap md:justify-center gap-4"
          >
            {toolsAndTopics.map((topic: string) => (
              <motion.div
                key={topic}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Badge
                  variant="secondary"
                  className="text-sm cursor-pointer auto-show hover:bg-gray-600 hover:text-white transition-colors"
                >
                  {topic}
                </Badge>
              </motion.div>
            ))}
          </motion.div>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
          {  latestFourCourses?.map(({_id: id, title, subtitle, thumbnailKey, pricing, category, rating, students }: ICourse, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group pt-0 auto-show overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative overflow-hidden">
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    src={`${env.AMZ_BUCKET_NAME}/${thumbnailKey}`}
                    alt={title}
                    className="w-full h-60 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button className="cursor-pointer" onClick={() => navigate(`/course/${id}`)} variant={"outline"}>View Course</Button>
                  </div>
                </div>

                <CardHeader>
                  <div className="flex justify-between items-center ">
                    <Badge variant="outline">{category}</Badge>
                    <span className="text-yellow-500">★ {rating || 5}</span>
                  </div>
                  <CardTitle className="text-xl line-clamp-1 ">{title}</CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-muted-foreground line-clamp-2">{subtitle}</p>
                </CardContent>

                <CardFooter className="flex justify-between items-center">
                  <span className="text-primary font-bold text-lg">₹{pricing}</span>
                  <span className="text-sm text-muted-foreground">{students?.length} students</span>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
        <div className="flex justify-center mt-20">
          <Button size={"lg"} className="text-lg" variant="outline" onClick={()=>navigate("/courses")}>View All Courses ✨</Button>
        </div>
        </>
      }
    </section>
  );
};
