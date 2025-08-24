import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, TrendingUp, Zap } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useAuth0 } from "@auth0/auth0-react";

const container = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.2,
      duration: 0.8,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const HeroSection = () => {
  const { user } = useAuthStore();

  const { loginWithPopup,} = useAuth0();

  const handleNavigate = () => {
    user ? window.open("/community", "_self") : loginWithPopup();
  };


  return (
    <section className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden pt-16 md:pt-20">
      {/* Gradient Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-green/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-green/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-primary-green/5 rounded-full blur-3xl animate-pulse transform -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(121,231,8,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(121,231,8,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      {/* Main Content */}
      <div className="relative z-10 container-custom text-center">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-5xl mx-auto"
        >
          {/* Headline */}
          <motion.h1
            variants={item}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6"
          >
            Skip the Job Boards.
            <br />
            <span className="gradient-text">Get Referrals</span>
            <br />
            That Actually Work.
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={item}
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Join a community that opens real doors at top companies. Connect with
            professionals, get quality referrals, and land high-impact roles.
          </motion.p>

          {/* Stats */}
          <motion.div
            variants={item}
            className="flex flex-wrap justify-center gap-8 mb-12"
          >
            <Stat icon={<Users />} label="Active Members" value="1,000+" />
            <Stat icon={<TrendingUp />} label="Success Rate" value="85%" />
            <Stat icon={<Zap />} label="Partner Companies" value="100+" />
          </motion.div>

          {/* CTA Button */}
          <motion.div
            variants={item}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              size="lg"
              onClick={handleNavigate}
              className="btn-primary text-lg px-8 py-4 group transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary-green/20"
              aria-label={user ? "Continue to Community" : "Sign In / Sign Up"}
            >
              {user ? "Continue to Community" : "Sign In / Sign Up"}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </motion.div>

          {/* Trust Logos */}
          <motion.div variants={item} className="mt-16 text-center">
            <p className="text-gray-400 text-sm mb-6">
              Trusted by professionals at
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {["Google", "Meta", "Apple", "Microsoft", "Amazon"].map((brand) => (
                <div
                  key={brand}
                  className="text-2xl font-bold hover:opacity-100 hover:text-primary-green transition-all duration-300 cursor-default select-none"
                >
                  {brand}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary-green rounded-full mt-2 animate-bounce" />
        </div>
      </motion.div>
    </section>
  );
};

// Helper component for stats
const Stat = ({ icon, label, value }) => (
  <div className="flex items-center gap-2 text-sm md:text-base">
    <span className="w-5 h-5 text-primary-green">{icon}</span>
    <span className="text-white font-semibold">{value}</span>
    <span className="text-gray-400">{label}</span>
  </div>
);

export default HeroSection;
