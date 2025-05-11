import { Badge } from "../ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "motion/react";

interface FeatureProps {
  title: string;
  description: string;
  icon: string;
}

const features: FeatureProps[] = [
  {
    title: "Interactive Courses",
    description:
      "Engage with interactive video lessons, quizzes, and assignments to enhance learning.",
    icon: "🎓",
  },
  {
    title: "Live Classes",
    description:
      "Join live sessions with expert tutors and get real-time feedback.",
    icon: "📡",
  },
  {
    title: "Progress Tracking",
    description:
      "Track your learning progress with detailed analytics and reports.",
    icon: "📊",
  },
  {
    title: "Certifications",
    description:
      "Earn certificates upon course completion to showcase your achievements.",
    icon: "🏆",
  },
  {
    title: "Community Support",
    description:
      "Connect with peers and tutors in a vibrant learning community.",
    icon: "🤝",
  },
  {
    title: "Mobile Friendly",
    description:
      "Access courses anytime, anywhere with a fully responsive design.",
    icon: "📱",
  },
];

export const Features = () => {
  return (
    <section
      id="features"
      className="container py-24 md:px-20 sm:px-3 sm:py-32 space-y-8"
    >
      <h2 className="text-3xl lg:text-4xl font-bold md:text-center">
        Why Choose{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Our LMS
        </span>
      </h2>

      <p className="text-xl text-muted-foreground text-center">
        Discover the features that make our Tutor E-learning LMS the best choice
        for your learning journey.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map(({ title, description, icon }: FeatureProps) => (
          <motion.div
            key={title}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-muted/50 rounded-lg shadow-lg hover:shadow-md hover:shadow-primary/20"
          >
            <Card className="h-full">
              <CardHeader className="flex flex-col items-center text-center">
                <div className="text-4xl">{icon}</div>
                <CardTitle className="mt-4">{title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-sm text-muted-foreground">
                {description}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
