import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LinkedinIcon, MessageCircle, Users, Star } from 'lucide-react';

const CommunitySection = () => {
  const communityStats = [
    { label: "Active Members", value: "2,000+", icon: <Users className="h-6 w-6" /> },
    { label: "Successful Referrals", value: "50+", icon: <Star className="h-6 w-6" /> },
    { label: "LinkedIn Followers", value: "Growing Daily", icon: <LinkedinIcon className="h-6 w-6" /> }
  ];

  return (
    <section id="community" className="py-20 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-[#79e708]/5"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-[#79e708]/3 via-transparent to-black/80"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Community Highlight
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join our thriving LinkedIn community of 1,000+ professionals. Get peer support, mentorship, and exclusive job alerts.
          </p>
        </motion.div>

        {/* Community Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {communityStats.map((stat) => (
            <Card
              key={stat.label}
              className="text-center p-6 hover:shadow-lg transition-all duration-300 hover:border-[#79e708]/30 bg-gradient-to-br from-gray-800/80 via-gray-900 to-black/90 border-[#79e708]/20 backdrop-blur-sm"
            >
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-gradient-to-br from-[#79e708]/20 to-black/40 rounded-full border border-[#79e708]/20">
                  <div className="text-[#79e708]">{stat.icon}</div>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-[#79e708] mb-2">{stat.value}</h3>
              <p className="text-gray-300">{stat.label}</p>
            </Card>
          ))}
        </motion.div>

        {/* Community Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-black via-gray-900/90 to-black rounded-2xl p-8 text-white mb-8 border border-[#79e708]/20 backdrop-blur-sm"
        >
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-white mb-4">
              Benefits of Joining Our Community
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <MessageCircle className="h-8 w-8 text-[#79e708] mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">Peer Support</h4>
              <p className="text-gray-300">
                Connect with like-minded professionals who understand your journey
              </p>
            </div>

            <div className="text-center">
              <Users className="h-8 w-8 text-[#79e708] mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">Mentorship</h4>
              <p className="text-gray-300">
                Learn from industry leaders who've walked the path before
              </p>
            </div>

            <div className="text-center">
              <Star className="h-8 w-8 text-[#79e708] mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">Exclusive Alerts</h4>
              <p className="text-gray-300">
                Get early access to premium opportunities and expert tips.
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://www.linkedin.com/company/jobreferralclub/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#79e708] to-[#79e708]/80 text-black hover:from-[#79e708]/90 hover:to-[#79e708] font-semibold text-lg px-8 py-4 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Join LinkedIn Community
                <LinkedinIcon className="ml-2 h-5 w-5" />
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CommunitySection;
