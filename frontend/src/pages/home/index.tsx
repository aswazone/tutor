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
    <div className="flex flex-col items-center">
      <Hero />
      <Cards />
      <About />
      <Team />
      <HowItWorks />
      <Features />
      {/* <Sponsors /> */}
      {/* <Services /> */}
      {/* <Cta /> */}
      {/* <Testimonials /> */}
      {/* <Pricing /> */}
      {/* <Newsletter /> */}
      {/* <FAQ /> */}
      <Footer />
      <ScrollToTop />
    </div>
  )
}

export default Home;