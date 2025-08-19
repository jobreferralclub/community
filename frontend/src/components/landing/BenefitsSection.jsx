import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Target,
  Clock,
  Award,
  TrendingUp,
  Shield,
  Zap,
  Network,
} from "lucide-react";

const BenefitsSection = () => {
  const benefits = [
    {
      icon: Network,
      title: "Priority Access",
      description:
        "Connect directly with employees at your target companies. Skip the black hole of online applications.",
      color: "text-primary-green",
    },
    {
      icon: Target,
      title: "Quality Over Quantity",
      description:
        "Focus on roles that match your skills and career goals. No more spray-and-pray applications.",
      color: "text-blue-400",
    },
    {
      icon: Clock,
      title: "Faster Results",
      description:
        "Get responses in days, not months. Our members see 5x faster response rates than traditional job hunting.",
      color: "text-purple-400",
    },
    {
      icon: Users,
      title: "Ambitious Community",
      description:
        "Join ambitious professionals who understand the value of quality connections and mutual support.",
      color: "text-orange-400",
    },
    {
      icon: TrendingUp,
      title: "Higher Success Rate",
      description:
        "85% of our members receive interview invitations within their first month. Results speak louder than promises.",
      color: "text-primary-green",
    },
    {
      icon: Shield,
      title: "Trusted Network",
      description:
        "Every member is verified. Build genuine professional relationships in a trusted environment.",
      color: "text-red-400",
    },
    {
      icon: Zap,
      title: "Career Acceleration",
      description:
        "Don't just find any job—find the right role that accelerates your career trajectory.",
      color: "text-yellow-400",
    },
    {
      icon: Award,
      title: "Premium Opportunities",
      description:
        "Access high-impact roles at top-tier companies that aren't advertised on public job boards.",
      color: "text-indigo-400",
    },
  ];

  return (
    <section className="section-padding bg-gray-900/50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">
            Why Choose <span className="gradient-text">JobReferral.Club</span>?
          </h2>
          <p className="section-subtitle">
            Stop wasting time on applications that go nowhere. Join a community
            that actually opens doors to your dream career.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full bg-black/50 border-gray-800 hover:border-primary-green/50 card-hover group">
                <CardContent className="p-6">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center mb-4 group-hover:bg-primary-green/10 transition-colors duration-300`}
                  >
                    <benefit.icon
                      className={`w-6 h-6 ${benefit.color} group-hover:text-primary-green transition-colors duration-300`}
                    />
                  </div>

                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary-green transition-colors duration-300">
                    {benefit.title}
                  </h3>

                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Stats section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-20 text-center"
        >
          <div className="bg-black/30 rounded-2xl p-8 border border-gray-800">
            <h3 className="text-2xl md:text-3xl font-bold mb-8">
              The Numbers Don't Lie
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                  85%
                </div>
                <div className="text-gray-400">Interview Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                  5x
                </div>
                <div className="text-gray-400">Faster Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                  $25K+
                </div>
                <div className="text-gray-400">Average Salary Increase</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BenefitsSection;
