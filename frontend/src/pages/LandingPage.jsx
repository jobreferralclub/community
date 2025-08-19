import Navigation from "../components/landing/Navigation";
import HeroSection from "../components/landing/HeroSection";
import BenefitsSection from "../components/landing/BenefitsSection";
import CategoriesSection from "../components/landing/CategoriesSection";
import StorySection from "../components/landing/StorySection";
import PracticeSection from "../components/landing/PracticeSection";
import CommunitySection from "../components/landing/CommunitySection";
import HowItWorksSection from "../components/landing/HowItWorksSection";
import FinalCTASection from "../components/landing/FinalCTASection";
import Footer from "../components/landing/Footer";

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
        <BenefitsSection />
        <div id="categories">
          <CategoriesSection />
        </div>
        <StorySection />
        <div id="practice">
          <PracticeSection />
        </div>
        <div id="community">
          <CommunitySection />
        </div>
        <div id="how-it-works">
          <HowItWorksSection />
        </div>
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
