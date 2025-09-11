import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  Users,
  TrendingUp,
  Clock,
  Shield,
  Zap,
} from "lucide-react";

const FinalCTASection = () => {
  const features = [
    {
      icon: Users,
      text: "2,000+ verified professionals",
    },
    {
      icon: TrendingUp,
      text: "85% interview success rate",
    },
    {
      icon: Clock,
      text: "30-day results guarantee",
    },
    {
      icon: Shield,
      text: "100% privacy protected",
    },
  ];

  return (
    <section className="py-32 px-6 md:px-12 bg-gradient-to-b from-black via-gray-900/50 to-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-green/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-green/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-green/3 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Main CTA Card */}
          <Card className="bg-black/60 border-primary-green/30 backdrop-blur-sm px-10 py-14 md:px-16 md:py-20">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-primary-green/10 border border-primary-green/30 rounded-full px-6 py-2 text-primary-green font-medium mb-6"
            >
              <Zap className="w-4 h-4" />
            </motion.div>

            {/* Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-5xl md:text-6xl font-extrabold leading-tight mb-6"
            >
              Stop Applying.
              <br />
              Start <span className="gradient-text">Connecting</span>.
            </motion.h2>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed"
            >
              Join the community that's changing how ambitious professionals
              find their next big opportunity. Real connections. Real
              referrals. Real results.
            </motion.p>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10"
            >
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-14 h-14 bg-primary-green/10 rounded-full flex items-center justify-center mb-3">
                    <feature.icon className="w-6 h-6 text-primary-green" />
                  </div>
                  <span className="text-base text-gray-400">
                    {feature.text}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* CTA Button Placeholder (Optional to Add Later) */}
          </Card>

          {/* Urgency element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-full px-6 py-2 text-red-400 font-medium">
              <Clock className="w-4 h-4" />
              <span>Limited spots available - 100 remaining this month</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTASection;
