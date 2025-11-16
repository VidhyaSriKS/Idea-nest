import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Download, 
  ArrowLeft, 
  Sparkles, 
  TrendingUp, 
  Target, 
  Zap,
  CheckCircle,
  XCircle,
  Lightbulb,
  Users,
  DollarSign,
  BarChart3,
  FileText,
  PresentationIcon,
  TrendingUpIcon,
  X
} from 'lucide-react';
import { Button } from './ui/button';
import { RadarChart } from './RadarChart';
import { Card } from './ui/card';
import confetti from 'canvas-confetti';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';

interface EvaluationData {
  problemStatement: string;
  existingSolutions: string;
  proposedSolution: string;
  marketPotential: string;
  swotAnalysis: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  businessModel: string;
  prosConsImprovements: {
    pros: string[];
    cons: string[];
    improvements: string[];
  };
  pitchSummary: string;
  scores: {
    innovation: number;
    feasibility: number;
    scalability: number;
  };
  refinedVersions?: Array<{
    title: string;
    description: string;
    whyItWorks: string;
  }>;
  competitors?: Array<{
    name: string;
    description: string;
    pricing?: string;
    marketShare?: string;
    founded?: string;
    funding?: string;
    employees?: string;
    keyFeatures?: string[];
  }>;
  marketStrategy?: {
    targetAudience: string;
    goToMarket: string;
    revenueModel: string;
  };
  pitchDeck?: {
    problem: string;
    solution: string;
    marketSize: string;
    businessModel: string;
    traction: string;
    competition: string;
    team: string;
    financials: string;
    ask: string;
  };
}

interface EvaluationReportProps {
  data: EvaluationData;
  ideaTitle: string;
  onBack: () => void;
  backLabel?: string;
}

type ModalType = 'refinement' | 'pitchDeck' | 'competitors' | 'marketStrategy' | null;

export function EvaluationReport({ data, ideaTitle, onBack, backLabel }: EvaluationReportProps) {
  const [visibleSections, setVisibleSections] = useState<Set<number>>(new Set());
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Calculate overall score
  const overallScore = (
    (data.scores.innovation + data.scores.feasibility + data.scores.scalability) / 3
  ).toFixed(1);

  useEffect(() => {
    // Trigger confetti on mount
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#38bdf8', '#a855f7', '#06b6d4'],
    });

    // Setup intersection observer for scroll reveal
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sectionRefs.current.indexOf(entry.target as HTMLDivElement);
            if (index !== -1) {
              setVisibleSections((prev) => new Set(prev).add(index));
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const handleDownloadPDF = () => {
    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - 2 * margin;
      let y = margin;

      // Helper function to check if we need a new page
      const checkNewPage = (requiredSpace: number) => {
        if (y + requiredSpace > pageHeight - margin) {
          doc.addPage();
          y = margin;
          return true;
        }
        return false;
      };

      // Helper function to add section with proper formatting
      const addSection = (title: string, content: string | string[], isList = false) => {
        checkNewPage(30);
        
        // Section title with background
        doc.setFillColor(56, 189, 248);
        doc.rect(margin, y - 5, contentWidth, 10, 'F');
        doc.setFontSize(12);
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.text(title, margin + 3, y + 2);
        y += 12;

        // Content
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);

        if (Array.isArray(content)) {
          content.forEach((item, index) => {
            checkNewPage(15);
            const lines = doc.splitTextToSize(`• ${item}`, contentWidth - 5);
            doc.text(lines, margin + 5, y);
            y += lines.length * 5 + 3;
          });
        } else {
          const lines = doc.splitTextToSize(content, contentWidth);
          lines.forEach((line: string) => {
            checkNewPage(8);
            doc.text(line, margin, y);
            y += 6;
          });
        }
        y += 8;
      };

      // Cover Page
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');
      
      // IdeaNest Logo/Title
      doc.setFontSize(32);
      doc.setTextColor(56, 189, 248);
      doc.setFont('helvetica', 'bold');
      doc.text('IdeaNest', pageWidth / 2, 80, { align: 'center' });
      
      doc.setFontSize(16);
      doc.setTextColor(168, 85, 247);
      doc.text('AI-Powered Startup Evaluation', pageWidth / 2, 95, { align: 'center' });
      
      // Idea Title
      doc.setFontSize(24);
      doc.setTextColor(248, 250, 252);
      const titleLines = doc.splitTextToSize(ideaTitle, contentWidth - 20);
      doc.text(titleLines, pageWidth / 2, 130, { align: 'center' });
      
      // Date
      doc.setFontSize(10);
      doc.setTextColor(148, 163, 184);
      doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}`, pageWidth / 2, pageHeight - 30, { align: 'center' });
      
      // Page 2: Executive Summary
      doc.addPage();
      y = margin;
      
      doc.setFontSize(20);
      doc.setTextColor(56, 189, 248);
      doc.setFont('helvetica', 'bold');
      doc.text('Executive Summary', margin, y);
      y += 15;
      
      // Overall Score with visual indicator
      doc.setFillColor(168, 85, 247);
      doc.roundedRect(margin, y, contentWidth, 25, 3, 3, 'F');
      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.text(`Overall Score: ${overallScore}/10`, pageWidth / 2, y + 10, { align: 'center' });
      
      // Individual scores
      doc.setFontSize(11);
      doc.text(`Innovation: ${data.scores.innovation}/10  •  Feasibility: ${data.scores.feasibility}/10  •  Scalability: ${data.scores.scalability}/10`, 
        pageWidth / 2, y + 19, { align: 'center' });
      y += 35;
      
      // Pitch Summary
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.text('Elevator Pitch', margin, y);
      y += 8;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const pitchLines = doc.splitTextToSize(data.pitchSummary, contentWidth);
      doc.text(pitchLines, margin, y);
      y += pitchLines.length * 6 + 15;

      // Main Content Sections
      addSection('Problem Statement', data.problemStatement);
      addSection('Existing Solutions & Gaps', data.existingSolutions);
      addSection('Proposed Solution', data.proposedSolution);
      addSection('Market Potential', data.marketPotential);
      addSection('Business Model', data.businessModel);

      // SWOT Analysis
      checkNewPage(80);
      doc.setFontSize(16);
      doc.setTextColor(56, 189, 248);
      doc.setFont('helvetica', 'bold');
      doc.text('SWOT Analysis', margin, y);
      y += 12;

      const swotSections = [
        { title: 'Strengths', data: data.swotAnalysis.strengths, color: [34, 197, 94] },
        { title: 'Weaknesses', data: data.swotAnalysis.weaknesses, color: [239, 68, 68] },
        { title: 'Opportunities', data: data.swotAnalysis.opportunities, color: [59, 130, 246] },
        { title: 'Threats', data: data.swotAnalysis.threats, color: [251, 146, 60] }
      ];

      swotSections.forEach(section => {
        checkNewPage(40);
        doc.setFillColor(section.color[0], section.color[1], section.color[2]);
        doc.rect(margin, y - 5, contentWidth, 8, 'F');
        doc.setFontSize(11);
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.text(section.title, margin + 3, y + 1);
        y += 10;
        
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        section.data.forEach(item => {
          checkNewPage(12);
          const lines = doc.splitTextToSize(`• ${item}`, contentWidth - 5);
          doc.text(lines, margin + 5, y);
          y += lines.length * 5 + 2;
        });
        y += 5;
      });

      // Pros, Cons, Improvements
      checkNewPage(40);
      doc.setFontSize(16);
      doc.setTextColor(56, 189, 248);
      doc.setFont('helvetica', 'bold');
      doc.text('Evaluation Details', margin, y);
      y += 12;

      addSection('Pros', data.prosConsImprovements.pros, true);
      addSection('Cons', data.prosConsImprovements.cons, true);
      addSection('Recommended Improvements', data.prosConsImprovements.improvements, true);

      // Market Strategy (if available)
      if (data.marketStrategy) {
        checkNewPage(40);
        doc.setFontSize(16);
        doc.setTextColor(56, 189, 248);
        doc.setFont('helvetica', 'bold');
        doc.text('Go-to-Market Strategy', margin, y);
        y += 12;

        addSection('Target Audience', data.marketStrategy.targetAudience);
        addSection('Go-to-Market Plan', data.marketStrategy.goToMarket);
        addSection('Revenue Model', data.marketStrategy.revenueModel);
      }

      // Competitors (if available)
      if (data.competitors && data.competitors.length > 0) {
        checkNewPage(40);
        doc.setFontSize(16);
        doc.setTextColor(56, 189, 248);
        doc.setFont('helvetica', 'bold');
        doc.text('Competitive Landscape', margin, y);
        y += 12;

        data.competitors.forEach((competitor, index) => {
          checkNewPage(50);
          doc.setFillColor(168, 85, 247);
          doc.rect(margin, y - 5, contentWidth, 8, 'F');
          doc.setFontSize(11);
          doc.setTextColor(255, 255, 255);
          doc.setFont('helvetica', 'bold');
          doc.text(`${index + 1}. ${competitor.name}`, margin + 3, y + 1);
          y += 10;

          doc.setTextColor(0, 0, 0);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          
          const compLines = doc.splitTextToSize(competitor.description, contentWidth);
          doc.text(compLines, margin + 3, y);
          y += compLines.length * 5 + 3;

          if (competitor.pricing) {
            doc.setFont('helvetica', 'bold');
            doc.text('Pricing: ', margin + 3, y);
            doc.setFont('helvetica', 'normal');
            doc.text(competitor.pricing, margin + 22, y);
            y += 5;
          }

          if (competitor.marketShare) {
            doc.setFont('helvetica', 'bold');
            doc.text('Market Share: ', margin + 3, y);
            doc.setFont('helvetica', 'normal');
            doc.text(competitor.marketShare, margin + 30, y);
            y += 5;
          }

          if (competitor.keyFeatures && competitor.keyFeatures.length > 0) {
            doc.setFont('helvetica', 'bold');
            doc.text('Key Features:', margin + 3, y);
            y += 5;
            doc.setFont('helvetica', 'normal');
            competitor.keyFeatures.forEach(feature => {
              checkNewPage(10);
              doc.text(`  • ${feature}`, margin + 5, y);
              y += 5;
            });
          }
          y += 5;
        });
      }

      // Refined Versions (if available)
      if (data.refinedVersions && data.refinedVersions.length > 0) {
        checkNewPage(40);
        doc.setFontSize(16);
        doc.setTextColor(56, 189, 248);
        doc.setFont('helvetica', 'bold');
        doc.text('Refined Versions', margin, y);
        y += 12;

        data.refinedVersions.forEach((version, index) => {
          checkNewPage(40);
          doc.setFillColor(168, 85, 247);
          doc.rect(margin, y - 5, contentWidth, 8, 'F');
          doc.setFontSize(11);
          doc.setTextColor(255, 255, 255);
          doc.setFont('helvetica', 'bold');
          doc.text(`Version ${index + 1}: ${version.title}`, margin + 3, y + 1);
          y += 10;

          doc.setTextColor(0, 0, 0);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          
          const descLines = doc.splitTextToSize(version.description, contentWidth);
          doc.text(descLines, margin + 3, y);
          y += descLines.length * 5 + 5;

          doc.setFont('helvetica', 'bold');
          doc.text('Why It Works:', margin + 3, y);
          y += 5;
          doc.setFont('helvetica', 'normal');
          const whyLines = doc.splitTextToSize(version.whyItWorks, contentWidth - 6);
          doc.text(whyLines, margin + 5, y);
          y += whyLines.length * 5 + 8;
        });
      }

      // Footer on all pages
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(
          `IdeaNest - AI-Powered Startup Evaluation | Page ${i} of ${totalPages}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
      }

      doc.save(`${ideaTitle.replace(/\s+/g, '-')}-evaluation-report.pdf`);
    });
  };

  const handleDownloadPitchDeck = () => {
    if (!data.pitchDeck) return;

    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;

      const slides = [
        { title: 'Problem', content: data.pitchDeck!.problem },
        { title: 'Solution', content: data.pitchDeck!.solution },
        { title: 'Market Size', content: data.pitchDeck!.marketSize },
        { title: 'Business Model', content: data.pitchDeck!.businessModel },
        { title: 'Traction', content: data.pitchDeck!.traction },
        { title: 'Competition', content: data.pitchDeck!.competition },
        { title: 'Team', content: data.pitchDeck!.team },
        { title: 'Financials', content: data.pitchDeck!.financials },
        { title: 'The Ask', content: data.pitchDeck!.ask },
      ];

      slides.forEach((slide, index) => {
        if (index > 0) {
          doc.addPage();
        }

        // Header with gradient effect simulation
        doc.setFillColor(56, 189, 248);
        doc.rect(0, 0, pageWidth, 40, 'F');

        // Slide number
        doc.setFontSize(10);
        doc.setTextColor(255, 255, 255);
        doc.text(`${index + 1} / ${slides.length}`, pageWidth - margin, 15);

        // Slide title
        doc.setFontSize(24);
        doc.setTextColor(255, 255, 255);
        doc.text(slide.title, margin, 25);

        // Idea title
        doc.setFontSize(10);
        doc.setTextColor(200, 200, 200);
        doc.text(ideaTitle, margin, 35);

        // Content
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        const lines = doc.splitTextToSize(slide.content, pageWidth - 2 * margin);
        doc.text(lines, margin, 60);

        // Footer
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text('IdeaNest - AI-Powered Startup Analysis', margin, pageHeight - 10);
      });

      doc.save(`${ideaTitle.replace(/\s+/g, '-')}-pitch-deck.pdf`);
    });
  };

  const sections = [
    {
      icon: Target,
      title: 'Problem Statement',
      content: data.problemStatement,
      color: 'from-cyan-500 to-blue-500',
    },
    {
      icon: Lightbulb,
      title: 'Proposed Solution',
      content: data.proposedSolution,
      color: 'from-blue-500 to-purple-500',
    },
    {
      icon: TrendingUp,
      title: 'Market Potential',
      content: data.marketPotential,
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: BarChart3,
      title: 'Business Model',
      content: data.businessModel,
      color: 'from-pink-500 to-red-500',
    },
  ];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Button
            onClick={onBack}
            variant="ghost"
            className="mb-6 glass-card hover:bg-white/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {backLabel ?? 'Back to Home'}
          </Button>

          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
                {ideaTitle}
              </h2>
              <p className="text-muted-foreground">VC-Style Evaluation Report</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleDownloadPDF}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white border-0"
            >
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
            
            {data.pitchDeck && (
              <Button
                onClick={() => setActiveModal('pitchDeck')}
                variant="outline"
                className="glass-card border-primary/30 hover:border-primary/50 hover:bg-white/5"
              >
                <PresentationIcon className="mr-2 h-4 w-4 text-primary" />
                Pitch Deck
              </Button>
            )}

            {data.refinedVersions && data.refinedVersions.length > 0 && (
              <Button
                onClick={() => setActiveModal('refinement')}
                variant="outline"
                className="glass-card border-secondary/30 hover:border-secondary/50 hover:bg-white/5"
              >
                <Lightbulb className="mr-2 h-4 w-4 text-secondary" />
                Refinement
              </Button>
            )}

            {data.competitors && data.competitors.length > 0 && (
              <Button
                onClick={() => setActiveModal('competitors')}
                variant="outline"
                className="glass-card border-purple-500/30 hover:border-purple-500/50 hover:bg-white/5"
              >
                <BarChart3 className="mr-2 h-4 w-4 text-purple-400" />
                Competitors
              </Button>
            )}

            {data.marketStrategy && (
              <Button
                onClick={() => setActiveModal('marketStrategy')}
                variant="outline"
                className="glass-card border-cyan-500/30 hover:border-cyan-500/50 hover:bg-white/5"
              >
                <TrendingUpIcon className="mr-2 h-4 w-4 text-cyan-400" />
                Market Strategy
              </Button>
            )}
          </div>
        </motion.div>

        {/* Scores Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <Card className="glass-card p-8 border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold">VC Evaluation Scores</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Left side - Overall score and bars */}
              <div>
                {/* Overall Score */}
                <div className="mb-8">
                  <div className="text-6xl font-bold gradient-text mb-2">
                    {overallScore}/10
                  </div>
                  <p className="text-muted-foreground">Overall Score</p>
                </div>

                {/* Score Bars */}
                <div className="space-y-4">
                  <ScoreBar
                    label="Innovation"
                    score={data.scores.innovation}
                    icon={Zap}
                    color="from-cyan-500 to-blue-500"
                  />
                  <ScoreBar
                    label="Feasibility"
                    score={data.scores.feasibility}
                    icon={CheckCircle}
                    color="from-blue-500 to-purple-500"
                  />
                  <ScoreBar
                    label="Scalability"
                    score={data.scores.scalability}
                    icon={TrendingUp}
                    color="from-purple-500 to-pink-500"
                  />
                </div>
              </div>

              {/* Right side - Radar Chart */}
              <div className="flex justify-center">
                <RadarChart scores={data.scores} />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Main Sections */}
        <div className="space-y-8 mb-12">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              ref={(el) => (sectionRefs.current[index] = el)}
              initial={{ opacity: 0, y: 50 }}
              animate={
                visibleSections.has(index)
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 50 }
              }
              transition={{ duration: 0.6 }}
            >
              <Card className="glass-card p-8 border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${section.color} flex items-center justify-center`}
                  >
                    <section.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold">{section.title}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {section.content}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* SWOT Analysis */}
        <motion.div
          ref={(el) => (sectionRefs.current[sections.length] = el)}
          initial={{ opacity: 0, y: 50 }}
          animate={
            visibleSections.has(sections.length)
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 50 }
          }
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <Card className="glass-card p-8 border-white/10">
            <h3 className="text-2xl font-bold mb-6">SWOT Analysis</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <SWOTCard
                title="Strengths"
                items={data.swotAnalysis.strengths}
                color="text-green-400"
              />
              <SWOTCard
                title="Weaknesses"
                items={data.swotAnalysis.weaknesses}
                color="text-red-400"
              />
              <SWOTCard
                title="Opportunities"
                items={data.swotAnalysis.opportunities}
                color="text-blue-400"
              />
              <SWOTCard
                title="Threats"
                items={data.swotAnalysis.threats}
                color="text-orange-400"
              />
            </div>
          </Card>
        </motion.div>

        {/* Pros, Cons, Improvements */}
        <motion.div
          ref={(el) => (sectionRefs.current[sections.length + 1] = el)}
          initial={{ opacity: 0, y: 50 }}
          animate={
            visibleSections.has(sections.length + 1)
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 50 }
          }
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <Card className="glass-card p-8 border-white/10">
            <h3 className="text-2xl font-bold mb-6">Detailed Analysis</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <AnalysisCard
                title="Pros"
                items={data.prosConsImprovements.pros}
                icon={CheckCircle}
                color="text-green-400"
              />
              <AnalysisCard
                title="Cons"
                items={data.prosConsImprovements.cons}
                icon={XCircle}
                color="text-red-400"
              />
              <AnalysisCard
                title="Improvements"
                items={data.prosConsImprovements.improvements}
                icon={Lightbulb}
                color="text-yellow-400"
              />
            </div>
          </Card>
        </motion.div>

        {/* Pitch Summary */}
        <motion.div
          ref={(el) => (sectionRefs.current[sections.length + 2] = el)}
          initial={{ opacity: 0, y: 50 }}
          animate={
            visibleSections.has(sections.length + 2)
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 50 }
          }
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <Card className="glass-card p-8 border-white/10 gradient-border">
            <h3 className="text-2xl font-bold mb-4">100-Word Pitch Summary</h3>
            <p className="text-lg leading-relaxed">{data.pitchSummary}</p>
          </Card>
        </motion.div>
      </div>

      {/* Modals */}
      <RefinementModal
        isOpen={activeModal === 'refinement'}
        onClose={() => setActiveModal(null)}
        refinedVersions={data.refinedVersions || []}
      />

      <PitchDeckModal
        isOpen={activeModal === 'pitchDeck'}
        onClose={() => setActiveModal(null)}
        pitchDeck={data.pitchDeck}
        ideaTitle={ideaTitle}
      />

      <CompetitorsModal
        isOpen={activeModal === 'competitors'}
        onClose={() => setActiveModal(null)}
        competitors={data.competitors || []}
      />

      <MarketStrategyModal
        isOpen={activeModal === 'marketStrategy'}
        onClose={() => setActiveModal(null)}
        marketStrategy={data.marketStrategy}
      />
    </div>
  );
}

// Helper Components
function ScoreBar({ label, score, icon: Icon, color }: any) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-primary" />
          <span className="font-semibold">{label}</span>
        </div>
        <span className="font-bold text-lg">{score.toFixed(1)}/10</span>
      </div>
      <div className="h-3 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(score / 10) * 100}%` }}
          transition={{ duration: 1, delay: 0.5 }}
          className={`h-full bg-gradient-to-r ${color} rounded-full`}
        />
      </div>
    </div>
  );
}

function SWOTCard({ title, items, color }: any) {
  return (
    <div className="p-6 rounded-lg bg-white/5 border border-white/10">
      <h4 className={`font-semibold text-lg mb-3 ${color}`}>{title}</h4>
      <ul className="space-y-2">
        {items.map((item: string, index: number) => (
          <li key={index} className="flex items-start gap-2 text-muted-foreground">
            <span className="text-primary mt-1">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AnalysisCard({ title, items, icon: Icon, color }: any) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Icon className={`w-5 h-5 ${color}`} />
        <h4 className="font-semibold text-lg">{title}</h4>
      </div>
      <ul className="space-y-2">
        {items.map((item: string, index: number) => (
          <li key={index} className="flex items-start gap-2 text-muted-foreground">
            <span className="text-primary mt-1">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Refinement Modal
function RefinementModal({ isOpen, onClose, refinedVersions }: any) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-modal max-w-4xl max-h-[80vh] p-0 border-white/10">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary to-purple-600 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <DialogTitle className="text-2xl">Idea Refinement Suggestions</DialogTitle>
          </div>
          <DialogDescription className="sr-only">
            Three enhanced variations of your original idea with detailed explanations
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(80vh-100px)] px-6 pb-6">
          <div className="space-y-6">
            {refinedVersions.map((version: any, index: number) => (
              <div
                key={index}
                className="p-6 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-white text-sm">{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-xl mb-2">{version.title}</h4>
                    <p className="text-muted-foreground mb-3">{version.description}</p>
                    <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                      <p className="text-sm">
                        <span className="text-cyan-400 font-semibold">Why this works:</span>{' '}
                        <span className="text-muted-foreground">{version.whyItWorks}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

// Pitch Deck Modal
function PitchDeckModal({ isOpen, onClose, pitchDeck, ideaTitle }: any) {
  if (!pitchDeck) return null;

  const handleDownloadPitchDeck = () => {
    import('pptxgenjs').then((pptxgenModule) => {
      const pptx = new pptxgenModule.default();

      // Set presentation properties
      pptx.author = 'IdeaNest';
      pptx.title = `${ideaTitle} - Pitch Deck`;
      pptx.subject = 'AI-Generated Startup Pitch Deck';

      const slides = [
        { title: 'Problem', content: pitchDeck.problem },
        { title: 'Solution', content: pitchDeck.solution },
        { title: 'Market Size', content: pitchDeck.marketSize },
        { title: 'Business Model', content: pitchDeck.businessModel },
        { title: 'Traction', content: pitchDeck.traction },
        { title: 'Competition', content: pitchDeck.competition },
        { title: 'Team', content: pitchDeck.team },
        { title: 'Financials', content: pitchDeck.financials },
        { title: 'The Ask', content: pitchDeck.ask },
      ];

      // Add title slide
      const titleSlide = pptx.addSlide();
      
      // Background gradient
      titleSlide.background = { color: '0f172a' };
      
      // Title
      titleSlide.addText(ideaTitle, {
        x: 0.5,
        y: 2.0,
        w: '90%',
        h: 1.5,
        fontSize: 44,
        bold: true,
        color: 'FFFFFF',
        align: 'center',
        fontFace: 'Arial',
      });

      // Subtitle
      titleSlide.addText('AI-Powered Startup Analysis', {
        x: 0.5,
        y: 3.5,
        w: '90%',
        fontSize: 24,
        color: '38bdf8',
        align: 'center',
        fontFace: 'Arial',
      });

      // Footer
      titleSlide.addText('Powered by IdeaNest', {
        x: 0.5,
        y: 5.0,
        w: '90%',
        fontSize: 14,
        color: 'a855f7',
        align: 'center',
        fontFace: 'Arial',
      });

      // Add content slides
      slides.forEach((slideData, index) => {
        const slide = pptx.addSlide();
        
        // Background
        slide.background = { color: '0f172a' };
        
        // Header bar with gradient effect
        slide.addShape(pptx.ShapeType.rect, {
          x: 0,
          y: 0,
          w: '100%',
          h: 0.8,
          fill: { color: '38bdf8' },
        });
        
        // Slide number
        slide.addText(`${index + 1} / ${slides.length}`, {
          x: 8.5,
          y: 0.25,
          w: 1.0,
          fontSize: 14,
          color: 'FFFFFF',
          align: 'right',
          fontFace: 'Arial',
        });
        
        // Slide title in header
        slide.addText(slideData.title, {
          x: 0.5,
          y: 0.25,
          fontSize: 28,
          bold: true,
          color: 'FFFFFF',
          fontFace: 'Arial',
        });
        
        // Content box
        slide.addText(slideData.content, {
          x: 0.5,
          y: 1.5,
          w: 9.0,
          h: 3.5,
          fontSize: 16,
          color: 'f8fafc',
          align: 'left',
          valign: 'top',
          fontFace: 'Arial',
          lineSpacing: 24,
        });
        
        // Accent line
        slide.addShape(pptx.ShapeType.rect, {
          x: 0.5,
          y: 5.2,
          w: 9.0,
          h: 0.05,
          fill: { color: 'a855f7' },
        });
        
        // Footer
        slide.addText('IdeaNest - AI-Powered Startup Analysis', {
          x: 0.5,
          y: 5.4,
          fontSize: 10,
          color: '94a3b8',
          fontFace: 'Arial',
        });
      });

      // Save the presentation
      pptx.writeFile({ fileName: `${ideaTitle.replace(/\s+/g, '-')}-pitch-deck.pptx` });
    }).catch((error) => {
      console.error('Error generating PPTX:', error);
      alert('Failed to generate PowerPoint presentation. Please try again.');
    });
  };

  const slides = [
    { title: 'Problem', content: pitchDeck.problem, icon: Target },
    { title: 'Solution', content: pitchDeck.solution, icon: Lightbulb },
    { title: 'Market Size', content: pitchDeck.marketSize, icon: TrendingUp },
    { title: 'Business Model', content: pitchDeck.businessModel, icon: DollarSign },
    { title: 'Traction', content: pitchDeck.traction, icon: BarChart3 },
    { title: 'Competition', content: pitchDeck.competition, icon: Users },
    { title: 'Team', content: pitchDeck.team, icon: Users },
    { title: 'Financials', content: pitchDeck.financials, icon: DollarSign },
    { title: 'The Ask', content: pitchDeck.ask, icon: Target },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-modal max-w-4xl max-h-[80vh] p-0 border-white/10">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                <PresentationIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl">Pitch Deck</DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">{ideaTitle}</p>
              </div>
            </div>
            <Button
              onClick={handleDownloadPitchDeck}
              size="sm"
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white border-0"
            >
              <Download className="mr-2 h-4 w-4" />
              Download PPT
            </Button>
          </div>
          <DialogDescription className="sr-only">
            Nine-slide investor pitch deck with problem, solution, market size, and more
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(80vh-100px)] px-6 pb-6">
          <div className="space-y-6">
            {slides.map((slide, index) => (
              <div
                key={index}
                className="p-6 rounded-lg bg-white/5 border border-white/10"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <slide.icon className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="font-semibold text-lg">{slide.title}</h4>
                </div>
                <p className="text-muted-foreground leading-relaxed">{slide.content}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

// Competitors Modal
function CompetitorsModal({ isOpen, onClose, competitors }: any) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-modal max-w-5xl max-h-[80vh] p-0 border-white/10">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <DialogTitle className="text-2xl">Competitor Overview</DialogTitle>
          </div>
          <DialogDescription className="sr-only">
            Detailed competitive analysis with pricing, market share, and key features
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(80vh-100px)] px-6 pb-6">
          {/* Competitor Table */}
          <div className="mb-6 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-2 text-sm text-cyan-400">Competitor</th>
                  <th className="text-left py-3 px-2 text-sm text-cyan-400">Pricing</th>
                  <th className="text-left py-3 px-2 text-sm text-cyan-400">Market Share</th>
                  <th className="text-left py-3 px-2 text-sm text-cyan-400">Founded</th>
                  <th className="text-left py-3 px-2 text-sm text-cyan-400">Funding</th>
                </tr>
              </thead>
              <tbody>
                {competitors.map((comp: any, index: number) => (
                  <tr key={index} className="border-b border-white/5">
                    <td className="py-3 px-2 font-semibold">{comp.name}</td>
                    <td className="py-3 px-2 text-muted-foreground">{comp.pricing || 'N/A'}</td>
                    <td className="py-3 px-2">
                      <span className="text-cyan-400 font-semibold">{comp.marketShare || 'N/A'}</span>
                    </td>
                    <td className="py-3 px-2 text-muted-foreground">{comp.founded || 'N/A'}</td>
                    <td className="py-3 px-2 text-muted-foreground">{comp.funding || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Detailed Analysis */}
          <div>
            <h3 className="text-xl font-bold text-cyan-400 mb-4">Detailed Analysis</h3>
            <div className="space-y-6">
              {competitors.map((competitor: any, index: number) => (
                <div
                  key={index}
                  className="p-6 rounded-lg bg-white/5 border border-white/10"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <span className="font-bold text-white text-sm">{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">{competitor.name}</h4>
                        {competitor.employees && (
                          <p className="text-sm text-muted-foreground">{competitor.employees}</p>
                        )}
                      </div>
                    </div>
                    {competitor.marketShare && (
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Market Share</p>
                        <p className="text-2xl font-bold text-cyan-400">{competitor.marketShare}</p>
                      </div>
                    )}
                  </div>

                  <p className="text-muted-foreground mb-4">{competitor.description}</p>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {competitor.pricing && (
                      <div className="p-3 rounded-lg bg-white/5">
                        <p className="text-xs text-muted-foreground mb-1">Pricing</p>
                        <p className="font-semibold">{competitor.pricing}</p>
                      </div>
                    )}
                    {competitor.founded && (
                      <div className="p-3 rounded-lg bg-white/5">
                        <p className="text-xs text-muted-foreground mb-1">Founded</p>
                        <p className="font-semibold">{competitor.founded}</p>
                      </div>
                    )}
                    {competitor.funding && (
                      <div className="p-3 rounded-lg bg-white/5">
                        <p className="text-xs text-muted-foreground mb-1">Funding</p>
                        <p className="font-semibold">{competitor.funding}</p>
                      </div>
                    )}
                  </div>

                  {competitor.keyFeatures && competitor.keyFeatures.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-cyan-400 mb-2 flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Key Features
                      </p>
                      <ul className="space-y-2">
                        {competitor.keyFeatures.map((feature: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

// Market Strategy Modal
function MarketStrategyModal({ isOpen, onClose, marketStrategy }: any) {
  if (!marketStrategy) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-modal max-w-4xl max-h-[80vh] p-0 border-white/10">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <TrendingUpIcon className="w-5 h-5 text-white" />
            </div>
            <DialogTitle className="text-2xl">Market Strategy</DialogTitle>
          </div>
          <DialogDescription className="sr-only">
            Complete go-to-market strategy with target audience, phases, and revenue model
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(80vh-100px)] px-6 pb-6">
          <div className="space-y-6">
            <div className="p-6 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-5 h-5 text-primary" />
                <h4 className="font-semibold text-lg">Target Audience</h4>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {marketStrategy.targetAudience}
              </p>
            </div>

            <div className="p-6 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-secondary" />
                <h4 className="font-semibold text-lg">Go-to-Market Strategy</h4>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {marketStrategy.goToMarket}
              </p>
            </div>

            <div className="p-6 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-5 h-5 text-green-400" />
                <h4 className="font-semibold text-lg">Revenue Model</h4>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {marketStrategy.revenueModel}
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}