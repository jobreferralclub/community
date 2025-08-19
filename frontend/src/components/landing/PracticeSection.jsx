import { motion } from "framer-motion";
import { Button } from '@/components/ui/button';
import { Brain, Target, CheckCircle, Trophy } from 'lucide-react';

const PracticeSection = () => {
  return (
    <section id="practice" className="py-20 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-[#79e708]/5"></div>
      <div className="absolute inset-0 bg-gradient-to-tl from-[#79e708]/3 via-transparent to-black/80"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16">

          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-[#79e708]/20 to-black/40 rounded-full shadow-lg border border-[#79e708]/20">
              <Brain className="h-10 w-10 text-[#79e708]" />
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Practice Simulations
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            Role-specific, smart MCQ practice banks to sharpen your domain knowledge before referrals or interviews.
          </p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16">
            <Button
              size="lg"
              className="bg-gradient-to-r from-[#79e708] to-[#79e708]/80 text-black hover:from-[#79e708]/90 hover:to-[#79e708] font-semibold text-xl px-12 py-6 rounded-full shadow-xl transform hover:scale-105 transition-all duration-300"
              onClick={() => window.open('https://simulations.jobreferral.club', '_blank')}>
              Practice Simulation Problems
              <Target className="ml-3 h-6 w-6" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-black via-gray-900/80 to-black rounded-2xl p-8 text-white border border-[#79e708]/20 shadow-2xl backdrop-blur-sm">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-gradient-to-br from-[#79e708]/20 to-black/40 rounded-full shadow-lg border border-[#79e708]/20">
                  <CheckCircle className="h-8 w-8 text-[#79e708]" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-[#79e708] mb-2">100+</h3>
              <p className="text-gray-400">Practice Questions</p>
            </div>
            
            <div>
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-gradient-to-br from-[#79e708]/20 to-black/40 rounded-full shadow-lg border border-[#79e708]/20">
                  <Brain className="h-8 w-8 text-[#79e708]" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-[#79e708] mb-2">10</h3>
              <p className="text-gray-400">Skill Categories</p>
            </div>
            
            <div>
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-gradient-to-br from-[#79e708]/20 to-black/40 rounded-full shadow-lg border border-[#79e708]/20">
                  <Trophy className="h-8 w-8 text-[#79e708]" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-[#79e708] mb-2">85%</h3>
              <p className="text-gray-400">Success Rate</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>);

};

export default PracticeSection;