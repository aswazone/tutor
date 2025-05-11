import { Statistics } from "./Statistics";
import pilot from "../../assets/new.svg";

export const About = () => {
  return (
    <section
      id="about"
      className="container px-4 py-9 md:px-20"
    >
      <div className="bg-muted/50 border rounded-lg py-12">
        <div className="px-6 flex flex-col-reverse md:flex-row gap-8 md:gap-12">
          <img
            src={pilot}
            alt=""
            className="w-[300px] object-contain rounded-lg"
          />
          <div className="bg-green-0 flex flex-col justify-between">
            <div className="pb-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                  About{" "}
                </span>
                Company
              </h2>
              <p className="text-sm md:text-xl text-muted-foreground mt-4">
                Tutor E learning platform is dedicated to providing quality education through innovative technology, ensuring accessibility and convenience for learners worldwide. Our mission is to empower students and educators with tools that enhance learning experiences and foster academic success.
              </p>
            </div>

            <Statistics />
          </div>
        </div>
      </div>
    </section>
  );
};
