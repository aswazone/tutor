import { CustomCursor } from "@/components/common/CustomCursor";
import { About } from "@/components/landing/About";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Newsletter } from "@/components/landing/Newsletter";
import { Pricing } from "@/components/landing/Pricing";
import { ScrollToTop } from "@/components/landing/ScrollToTop";
import { Services } from "@/components/landing/Services";
import { Sponsors } from "@/components/landing/Sponsors";
import { Team } from "@/components/landing/Team";
import { Testimonials } from "@/components/landing/Testimonials";

const LandingPage = () => {
  return (
    <div className="flex cursor-none flex-col items-center">
      <CustomCursor/>
      <Hero />
      <Sponsors />
      <About />
      <HowItWorks />
      {/* <Features /> */}
      <Services />
      {/* <Cta /> */}
      <Testimonials />
      <Team />
      <Pricing />
      <Newsletter />
      <FAQ />
      <Footer />
      <ScrollToTop />
    </div>
  )
}

export default LandingPage;