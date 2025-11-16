import { motion } from 'motion/react';
import { PenTool, Brain, FileText } from 'lucide-react';

const steps = [
  {
    icon: PenTool,
    title: 'Enter Your Idea',
    description: 'Describe your startup concept in detail. The more context, the better the evaluation.',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    icon: Brain,
    title: 'AI Evaluates',
    description: 'Our AI analyzes your idea like a VC, examining market fit, competition, and potential.',
    color: 'from-blue-500 to-purple-500',
  },
  {
    icon: FileText,
    title: 'Get Full Report',
    description: 'Receive a comprehensive VC-style report with scores, insights, and actionable improvements.',
    color: 'from-purple-500 to-pink-500',
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to transform your idea into an investor-ready pitch
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="relative"
            >
              <div className="glass-card p-8 rounded-2xl hover:scale-105 transition-transform duration-300 h-full">
                {/* Step number */}
                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                  <span className="text-xl font-bold text-white">{index + 1}</span>
                </div>

                {/* Icon with gradient background */}
                <div className="mb-6 pt-4">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>

              {/* Connecting line (not on last card) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary to-transparent" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
