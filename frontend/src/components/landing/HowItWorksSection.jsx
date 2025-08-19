
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  UserPlus,
  Search,
  MessageCircle,
  Handshake,
  TrendingUp,
  ArrowRight,
  CheckCircle } from
"lucide-react";

const HowItWorksSection = () => {
  const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Join the Community",
    description: "Create your profile and get verified. Tell us about your background, skills, and career goals.",
    details: ["Professional verification", "Skills assessment", "Career goal matching"],
    color: "text-primary-green"
  },
  {
    number: "02",
    icon: Search,
    title: "Find Your Connections",
    description: "Browse our network of professionals at your target companies. Filter by role, company, and industry.",
    details: ["Advanced search filters","Role-specific matching"],
    color: "text-blue-400"
  },
  {
    number: "03",
    icon: MessageCircle,
    title: "Connect & Engage",
    description: "Reach out to relevant connections. Build genuine relationships through our guided conversation tools.",
    details: ["Message templates", "Conversation starters", "Relationship building tips"],
    color: "text-purple-400"
  },
  {
    number: "04",
    icon: Handshake,
    title: "Get Your Referral",
    description: "Receive quality referrals from people who know your work and can advocate for your potential.",
    details: ["Internal advocacy", "Application guidance", "Interview preparation"],
    color: "text-orange-400"
  },
  {
    number: "05",
    icon: TrendingUp,
    title: "Land Your Role",
    description: "Interview with confidence knowing you have an inside champion. Join our success community.",
    details: ["Interview support", "Salary negotiation", "Onboarding guidance"],
    color: "text-primary-green"
  }];


  return (
    <section className="section-padding bg-black">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16">

          <h2 className="section-title">
            How It <span className="gradient-text">Actually Works</span>
          </h2>
          <p className="section-subtitle">
            No gimmicks, no false promises. Just a proven system that connects 
            ambitious professionals with the right opportunities.
          </p>
        </motion.div>

        {/* Desktop Timeline View */}
        <div className="hidden lg:block relative">
          {/* Timeline line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-green/20 via-primary-green/60 to-primary-green/20 transform -translate-y-1/2"></div>
          
          <div className="grid grid-cols-5 gap-8">
            {steps.map((step, index) =>
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative">

                {/* Timeline dot */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary-green rounded-full border-4 border-black z-10"></div>
                
                <Card className="mt-16 bg-gray-900/50 border-gray-800 hover:border-primary-green/30 card-hover">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-primary-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <step.icon className={`w-8 h-8 ${step.color}`} />
                    </div>
                    
                    <div className="text-3xl font-bold text-primary-green mb-2">{step.number}</div>
                    <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">{step.description}</p>
                    
                    <div className="space-y-2">
                      {step.details.map((detail, idx) =>
                    <div key={idx} className="flex items-center gap-2 text-xs text-gray-500">
                          <CheckCircle className="w-3 h-3 text-primary-green" />
                          <span>{detail}</span>
                        </div>
                    )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>

        {/* Mobile/Tablet Vertical View */}
        <div className="lg:hidden space-y-6">
          {steps.map((step, index) =>
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="relative">

              <Card className="bg-gray-900/50 border-gray-800 hover:border-primary-green/30 card-hover">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-green/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <step.icon className={`w-6 h-6 ${step.color}`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-2xl font-bold text-primary-green">{step.number}</div>
                        <h3 className="text-xl font-semibold">{step.title}</h3>
                      </div>
                      
                      <p className="text-gray-400 leading-relaxed mb-4">{step.description}</p>
                      
                      <div className="grid grid-cols-1 gap-2">
                        {step.details.map((detail, idx) =>
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-500">
                            <CheckCircle className="w-4 h-4 text-primary-green" />
                            <span>{detail}</span>
                          </div>
                      )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Arrow connector */}
              {index < steps.length - 1 &&
            <div className="flex justify-center my-4">
                  <ArrowRight className="w-6 h-6 text-primary-green/60 rotate-90" />
                </div>
            }
            </motion.div>
          )}
        </div>

        {/* Bottom section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 text-center">

          <div className="bg-gradient-to-r from-primary-green/10 to-primary-green/5 rounded-2xl p-12 border border-primary-green/20">
            <h3 className="text-3xl md:text-4xl font-bold mb-6">
              It's That Simple
            </h3>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              No complex processes, no endless applications. Just genuine connections 
              that lead to real opportunities. Your next career move is one referral away.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="text-4xl font-bold gradient-text mb-2">7 Days</div>
                <div className="text-gray-400">Average Time to First Connection</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold gradient-text mb-2">85%</div>
                <div className="text-gray-400">Members Get Interviews</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold gradient-text mb-2">30 Days</div>
                <div className="text-gray-400">Average Time to Job Offer</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>);

};

export default HowItWorksSection;