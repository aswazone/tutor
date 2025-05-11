import { About } from "@/components/home/About";
import { Cards } from "@/components/home/Cards";
import { Cta } from "@/components/home/Cta";
import { FAQ } from "@/components/home/FAQ";
import { Features } from "@/components/home/Features";
import { Footer } from "@/components/home/Footer";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Newsletter } from "@/components/home/Newsletter";
import { Pricing } from "@/components/home/Pricing";
import { ScrollToTop } from "@/components/home/ScrollToTop";
import { Services } from "@/components/home/Services";
import { Sponsors } from "@/components/home/Sponsors";
import { Team } from "@/components/home/Team";
import { Testimonials } from "@/components/home/Testimonials";

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