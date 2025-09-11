import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Quote, TrendingUp, Users, Award } from "lucide-react";

const StorySection = () => {
  const testimonials = [
    {
      name: "Michael Johnson",
      role: "Senior Product Manager",
      company: "Google",
      image:
        "https://images.unsplash.com/photo-1680540692052-79fde1108370?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MTg3MTl8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBBbWVyaWNhbiUyMG1hbiUyMHBvcnRyYWl0JTIwaGVhZHNob3QlMjBidXNpbmVzc3xlbnwwfHx8fDE3NTEyMjExOTR8MA&ixlib=rb-4.1.0&q=80&w=200",
      content:
        "I was stuck applying to hundreds of jobs with no response. Through JobReferral.Club, I connected with a PM at Google who referred me directly. Got the interview within a week and landed my dream role with a 40% salary increase.",
      metric: "+40% salary",
      timeframe: "2 weeks",
    },
    {
      name: "Arjun Sharma",
      role: "Data Scientist",
      company: "Netflix",
      image:
        "https://images.unsplash.com/photo-1531339413195-cc6c17163974?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MTg3MTl8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBJbmRpYW4lMjBtYW4lMjBwb3J0cmFpdCUyMGhlYWRzaG90JTIwYnVzaW5lc3N8ZW58MHx8fHwxNzUxMjIxMTk0fDA&ixlib=rb-4.1.0&q=80&w=200",
      content:
        "The quality of connections here is unmatched. I connected with a senior data scientist who not only referred me but also mentored me through the interview process. The community support is incredible.",
      metric: "3 interviews",
      timeframe: "1 month",
    },
    {
      name: "Kavya Reddy",
      role: "VP of Strategy",
      company: "McKinsey & Company",
      image:
        "https://images.unsplash.com/photo-1544264796-acfb69e05b37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MTg3MTl8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBJbmRpYW4lMjB3b21hbiUyMHBvcnRyYWl0JTIwaGVhZHNob3QlMjBidXNpbmVzc3xlbnwwfHx8fDE3NTEyMjExOTR8MA&ixlib=rb-4.1.0&q=80&w=200",
      content:
        "As someone who was career-switching into consulting, I needed insider guidance. The connections I made here gave me the insights and referrals that made my transition possible. Now I'm living my consulting dream.",
      metric: "Career switch",
      timeframe: "6 weeks",
    },
  ];

  return (
    <section id="stories" className="section-padding bg-gray-900/30">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">
            Real Stories, <span className="gradient-text">Real Results</span>
          </h2>
          <p className="section-subtitle">
            Success speaks louder — see how quality referrals and genuine
            connections changed the game for others like you.
          </p>
        </motion.div>

        {/* Success metrics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          <div className="text-center p-6 rounded-xl bg-black/30 border border-gray-800">
            <TrendingUp className="w-8 h-8 text-primary-green mx-auto mb-3" />
            <div className="text-3xl font-bold gradient-text mb-2">85%</div>
            <div className="text-gray-400">Get Interviews Within 30 Days</div>
          </div>
          <div className="text-center p-6 rounded-xl bg-black/30 border border-gray-800">
            <Users className="w-8 h-8 text-primary-green mx-auto mb-3" />
            <div className="text-3xl font-bold gradient-text mb-2">2,000+</div>
            <div className="text-gray-400">Successful Career Transitions</div>
          </div>
          <div className="text-center p-6 rounded-xl bg-black/30 border border-gray-800">
            <Award className="w-8 h-8 text-primary-green mx-auto mb-3" />
            <div className="text-3xl font-bold gradient-text mb-2">$25K+</div>
            <div className="text-gray-400">Average Salary Increase</div>
          </div>
        </motion.div>

        {/* Testimonials Grid (commented out) */}
        {/*
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full bg-black/50 border-gray-800 hover:border-primary-green/30 card-hover">
                <CardContent className="p-6">
                  <Quote className="w-8 h-8 text-primary-green/60 mb-4" />
                  <p className="text-gray-300 leading-relaxed mb-6 text-sm">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center justify-between mb-4 p-3 bg-primary-green/5 rounded-lg border border-primary-green/20">
                    <div className="text-center">
                      <div className="text-primary-green font-semibold text-sm">
                        {testimonial.metric}
                      </div>
                      <div className="text-gray-500 text-xs">Impact</div>
                    </div>
                    <div className="text-center">
                      <div className="text-primary-green font-semibold text-sm">
                        {testimonial.timeframe}
                      </div>
                      <div className="text-gray-500 text-xs">Timeline</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-primary-green/20"
                    />
                    <div>
                      <div className="font-semibold text-white">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-400">
                        {testimonial.role}
                      </div>
                      <div className="text-sm text-primary-green font-medium">
                        {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        */}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-primary-green/10 to-primary-green/5 rounded-2xl p-8 border border-primary-green/20">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Write Your Success Story?
            </h3>
            <p className="text-gray-300 mb-6">
              Join the community that's helping ambitious professionals land
              their dream roles.
            </p>
            <div className="inline-flex items-center gap-4">
              <div className="flex -space-x-2">
                {testimonials.slice(0, 3).map((testimonial, index) => (
                  <img
                    key={index}
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-black"
                  />
                ))}
              </div>
              <span className="text-sm text-gray-400">
                +1,000 members already inside
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StorySection;
