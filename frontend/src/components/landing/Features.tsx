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

interface CourseProps {
  title: string;
  description: string;
  image: string;
  price: string;
  category: string;
  rating: number;
  students: number;
}

const courses: CourseProps[] = [
  {
    title: "React for Beginners",
    description: "Learn the basics of React and build your first web app with modern practices.",
    image: "https://via.placeholder.com/300x200",
    price: "$49",
    category: "Web Development",
    rating: 4.8,
    students: 1234
  },
  {
    title: "Advanced JavaScript",
    description: "Master JavaScript with advanced concepts and real-world applications.",
    image: "https://via.placeholder.com/300x200",
    price: "$99",
    category: "Programming",
    rating: 4.9,
    students: 2156
  },
  {
    title: "UI/UX Design Principles",
    description: "Create stunning user interfaces with modern design principles.",
    image: "https://via.placeholder.com/300x200",
    price: "$79",
    category: "Design",
    rating: 4.7,
    students: 1789
  },
];

const toolsAndTopics: string[] = [
  "React", "JavaScript", "UI/UX Design", "Data Science",
  "Python", "Machine Learning", "Web Development", "Mobile Development"
];

export const Features = () => {
  return (
    <section className="container py-24 md:px-20 sm:px-3 sm:py-32 space-y-8">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl lg:text-4xl font-bold md:text-center"
      >
        Best{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Courses
        </span>
      </motion.h2>

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
              className="text-sm cursor-pointer hover:bg-primary hover:text-white transition-colors"
            >
              {topic}
            </Badge>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map(({ title, description, image, price, category, rating, students }: CourseProps, index) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative overflow-hidden">
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  src={image}
                  alt={title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="secondary">View Course</Button>
                </div>
              </div>

              <CardHeader>
                <div className="flex justify-between items-center mb-2">
                  <Badge variant="outline">{category}</Badge>
                  <span className="text-yellow-500">★ {rating}</span>
                </div>
                <CardTitle className="line-clamp-1">{title}</CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-muted-foreground line-clamp-2">{description}</p>
              </CardContent>

              <CardFooter className="flex justify-between items-center">
                <span className="text-primary font-bold text-lg">{price}</span>
                <span className="text-sm text-muted-foreground">{students} students</span>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
