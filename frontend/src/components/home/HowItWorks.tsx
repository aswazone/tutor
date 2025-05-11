import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { MedalIcon, MapIcon, PlaneIcon, GiftIcon } from "./Icons";

interface FeatureProps {
  icon: React.JSX.Element;
  title: string;
  description: string;
}

const features: FeatureProps[] = [
  {
    icon: <MedalIcon />,
    title: "Sign Up",
    description:
      "Create your account to access a wide range of courses and learning materials.",
  },
  {
    icon: <MapIcon />,
    title: "Browse Courses",
    description:
      "Explore our extensive library of courses across various categories and topics.",
  },
  {
    icon: <PlaneIcon />,
    title: "Start Learning",
    description:
      "Enroll in a course and start learning with interactive lessons and quizzes.",
  },
  {
    icon: <GiftIcon />,
    title: "Earn Certificates",
    description:
      "Complete courses and earn certificates to showcase your achievements.",
  },
];

export const HowItWorks = () => {
  return (
    <section
      id="howItWorks"
      className="container text-center py-24 md:px-20 sm:px-3 sm:py-32"
    >
      <h2 className="text-3xl md:text-4xl font-bold">
        How It{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Works
        </span>
      </h2>
      <p className="md:w-3/4 mx-auto mt-4 mb-8 text-xl text-muted-foreground">
        Follow these simple steps to start your learning journey with our Tutor
        LMS platform.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map(({ icon, title, description }: FeatureProps) => (
          <Card
            key={title}
            className="bg-muted/50"
          >
            <CardHeader>
              <CardTitle className="grid gap-4 place-items-center">
                {icon}
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent>{description}</CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
