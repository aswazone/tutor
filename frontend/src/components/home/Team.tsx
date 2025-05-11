import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { motion } from "motion/react";

interface TeamProps {
  imageUrl: string;
  name: string;
  expertise: string;
  bio: string;
  socialNetworks: SociaNetworkslProps[];
}

interface SociaNetworkslProps {
  name: string;
  url: string;
}

const teamList: TeamProps[] = [
  {
    imageUrl: "https://i.pravatar.cc/150?img=35",
    name: "Emma Smith",
    expertise: "Data Science",
    bio: "Expert in machine learning and data visualization.",
    socialNetworks: [
      { name: "Linkedin", url: "https://www.linkedin.com/in/emma-smith/" },
      { name: "Facebook", url: "https://www.facebook.com/emma.smith" },
      { name: "Instagram", url: "https://www.instagram.com/emma.smith" },
    ],
  },
  {
    imageUrl: "https://i.pravatar.cc/150?img=60",
    name: "John Doe",
    expertise: "Web Development",
    bio: "Specialist in React, Node.js, and modern web technologies.",
    socialNetworks: [
      { name: "Linkedin", url: "https://www.linkedin.com/in/john-doe/" },
      { name: "Facebook", url: "https://www.facebook.com/john.doe" },
      { name: "Instagram", url: "https://www.instagram.com/john.doe" },
    ],
  },
  {
    imageUrl: "https://i.pravatar.cc/150?img=36",
    name: "Ashley Ross",
    expertise: "UI/UX Design",
    bio: "Passionate about creating intuitive and beautiful designs.",
    socialNetworks: [
      { name: "Linkedin", url: "https://www.linkedin.com/in/ashley-ross/" },
      { name: "Instagram", url: "https://www.instagram.com/ashley.ross" },
    ],
  },
  {
    imageUrl: "https://i.pravatar.cc/150?img=17",
    name: "Bruce Rogers",
    expertise: "Backend Development",
    bio: "Experienced in building scalable and secure APIs.",
    socialNetworks: [
      { name: "Linkedin", url: "https://www.linkedin.com/in/bruce-rogers/" },
      { name: "Facebook", url: "https://www.facebook.com/bruce.rogers" },
    ],
  },
];

export const Team = () => {
  const socialIcon = (iconName: string) => {
    switch (iconName) {
      case "Linkedin":
        return <Linkedin size="20" />;
      case "Facebook":
        return <Facebook size="20" />;
      case "Instagram":
        return <Instagram size="20" />;
      default:
        return null;
    }
  };

  return (
    <section
      id="team"
      className="container py-24 md:px-20 sm:px-3 sm:py-32"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-center">
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Meet Our Best Tutors
        </span>
      </h2>

      <p className="mt-4 mb-10 text-xl text-muted-foreground text-center">
        Learn from the best in the industry. Our tutors are experts in their
        fields and passionate about teaching.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 gap-y-10">
        {teamList.map(
          ({ imageUrl, name, expertise, bio, socialNetworks }: TeamProps) => (
            <motion.div
              key={name}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-muted/50 relative mt-8 flex flex-col justify-center items-center rounded-lg shadow-lg hover:shadow-md hover:shadow-primary/20"
            >
              <Card className="w-full">
                <CardHeader className="mt-8 flex flex-col justify-center items-center pb-2">
                  <img
                    src={imageUrl}
                    alt={`${name} - ${expertise}`}
                    className="absolute -top-12 rounded-full w-24 h-24 aspect-square object-cover"
                  />
                  <CardTitle className="text-center mt-12">{name}</CardTitle>
                  <CardDescription className="text-primary">
                    {expertise}
                  </CardDescription>
                </CardHeader>

                <CardContent className="text-center pb-2">
                  <p className="text-sm text-muted-foreground">{bio}</p>
                </CardContent>

                <CardFooter className="flex justify-center gap-4">
                  {socialNetworks.map(({ name, url }: SociaNetworkslProps) => (
                    <a
                      key={name}
                      rel="noreferrer noopener"
                      href={url}
                      target="_blank"
                      className={buttonVariants({
                        variant: "ghost",
                        size: "sm",
                      })}
                    >
                      <span className="sr-only">{name} icon</span>
                      {socialIcon(name)}
                    </a>
                  ))}
                </CardFooter>
              </Card>
            </motion.div>
          )
        )}
      </div>
    </section>
  );
};
