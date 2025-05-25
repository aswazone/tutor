import { CustomCursor } from "@/components/common/CustomCursor";
import { About } from "@/components/home/About";
import { Cards } from "@/components/home/Cards";
import { Features } from "@/components/home/Features";
import { Footer } from "@/components/home/Footer";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { ScrollToTop } from "@/components/home/ScrollToTop";
import { Team } from "@/components/home/Team";

const Home = () => {
  return (
    <div className="flex flex-col cursor-none items-center">
      <CustomCursor/>
      <Hero />
      <Cards />
      <About />
      <Team />
      <HowItWorks />
      <Features />
      <Footer />
      <ScrollToTop />
    </div>
  )
}

export default Home;