import { motion } from 'motion/react';
import { Brain, Sparkles, FileText, TrendingUp, Lightbulb } from 'lucide-react';
import { Button } from './ui/button';
import type { Page } from '../App';

type HomePageProps = {
  onNavigate: (page: Page) => void;
};

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#38bdf8] opacity-20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#a855f7] opacity-20 blur-[120px] rounded-full"></div>

      {/* Header */}
      <header className="relative z-10 px-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3"
        >
          <div className="relative">
            <Brain className="w-10 h-10 text-[#38bdf8]" />
            <Sparkles className="w-4 h-4 text-[#a855f7] absolute -top-1 -right-1" />
          </div>
          <h1 className="text-2xl font-['Poppins']">IdeaNest</h1>
        </motion.div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mb-6"
          >
            <h2 className="text-5xl md:text-7xl mb-6 font-['Poppins'] bg-gradient-to-r from-[#38bdf8] via-[#a855f7] to-[#38bdf8] bg-clip-text text-transparent leading-tight">
              Turn your raw idea into an investor-ready report — instantly.
            </h2>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-[#cbd5e1] mb-12 max-w-2xl mx-auto font-['Manrope']"
          >
            Get professional VC-style evaluation of your startup idea powered by AI. 
            Understand market potential, competitors, and growth strategies in seconds.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex gap-4 justify-center flex-wrap"
          >
            <Button
              onClick={() => onNavigate('input')}
              className="bg-gradient-to-r from-[#38bdf8] to-[#a855f7] hover:shadow-[0_0_30px_rgba(56,189,248,0.5)] transition-all duration-300 text-lg px-8 py-6 rounded-xl"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Evaluate Your Idea
            </Button>
            <Button
              variant="outline"
              onClick={() => onNavigate('input')}
              className="border-[#38bdf8] text-[#38bdf8] hover:bg-[#38bdf8]/10 text-lg px-8 py-6 rounded-xl"
            >
              Get Started
            </Button>
          </motion.div>
        </motion.div>

        {/* 3-Step Workflow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="grid md:grid-cols-3 gap-6 mb-20"
        >
          {[
            {
              icon: Lightbulb,
              step: '01',
              title: 'Enter Your Idea',
              description: 'Describe your startup concept, problem, and solution in detail.',
            },
            {
              icon: Brain,
              step: '02',
              title: 'AI Evaluates',
              description: 'Our AI analyzes your idea like a seasoned VC investor would.',
            },
            {
              icon: FileText,
              step: '03',
              title: 'Get Full Report',
              description: 'Receive comprehensive evaluation with scores, insights, and recommendations.',
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.2 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#38bdf8]/10 to-[#a855f7]/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:border-[#38bdf8]/50 transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-gradient-to-br from-[#38bdf8] to-[#a855f7] p-3 rounded-xl">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <span className="text-4xl font-['Poppins'] text-white/20">{item.step}</span>
                </div>
                <h3 className="text-xl mb-2 font-['Poppins']">{item.title}</h3>
                <p className="text-[#cbd5e1] font-['Manrope']">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="grid md:grid-cols-2 gap-6"
        >
          {[
            {
              icon: TrendingUp,
              title: 'Market Analysis',
              description: 'Deep dive into market potential, competitors, and positioning strategies.',
            },
            {
              icon: Sparkles,
              title: 'SWOT Analysis',
              description: 'Comprehensive evaluation of strengths, weaknesses, opportunities, and threats.',
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index === 0 ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.8 + index * 0.2 }}
              className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:border-[#a855f7]/50 transition-all duration-300"
            >
              <feature.icon className="w-8 h-8 text-[#a855f7] mb-3" />
              <h3 className="text-lg mb-2 font-['Poppins']">{feature.title}</h3>
              <p className="text-[#cbd5e1] text-sm font-['Manrope']">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 px-6 border-t border-white/10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="space-y-2"
        >
          <p className="text-[#94a3b8] text-sm font-['Manrope']">
            🪶 Powered by Google Gemini
          </p>
          <p className="text-[#64748b] text-xs font-['Manrope']">
            Built in 48 hours @ Hackathon 🚀
          </p>
        </motion.div>
      </footer>
    </div>
  );
}
