import { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { IdeaForm } from './components/IdeaForm';
import { EvaluationReport } from './components/EvaluationReport';
import { Footer } from './components/Footer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthModal } from './components/AuthModal';
import { UserProfile } from './components/UserProfile';
import { History } from './components/History';
import { projectId, publicAnonKey } from './utils/supabase/info';
import { getSupabaseClient } from './utils/supabase/client';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';
import { Sparkles } from 'lucide-react';

type View = 'home' | 'form' | 'report' | 'history';

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

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [isLoading, setIsLoading] = useState(false);
  const [evaluationData, setEvaluationData] = useState<EvaluationData | null>(null);
  const [ideaTitle, setIdeaTitle] = useState('');
  const [user, setUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [pendingAction, setPendingAction] = useState<'form' | 'history' | null>(null);
  const [reportBackTarget, setReportBackTarget] = useState<View>('home');

  const supabase = getSupabaseClient();

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || 'User',
            accessToken: session.access_token,
          });
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setCheckingSession(false);
      }
    };

    checkSession();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      toast.success('Signed out successfully');
      handleBackToHome();
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  const handleAuthSuccess = (userData: any) => {
    setUser(userData);
    const message = pendingAction === 'form' 
      ? `Welcome, ${userData.name}! Let's evaluate your idea.`
      : `Welcome back, ${userData.name}!`;
    toast.success(message);
    if (pendingAction) {
      // Small delay to let modal close smoothly
      setTimeout(() => {
        if (pendingAction === 'form') {
          setCurrentView('form');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (pendingAction === 'history') {
          setCurrentView('history');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        setPendingAction(null);
      }, 100);
    }
  };

  const handleGetStarted = () => {
    // Check if user is logged in
    if (!user) {
      toast.error('Please sign in to evaluate your idea');
      setShowAuthModal(true);
      setPendingAction('form');
      return;
    }
    setCurrentView('form');
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitIdea = async (title: string, description: string) => {
    console.log('=== HANDLE SUBMIT IDEA CALLED ===');
    console.log('Title:', title);
    console.log('Description length:', description.length);
    
    setIsLoading(true);
    setIdeaTitle(title);

    try {
      const apiUrl = `https://${projectId}.supabase.co/functions/v1/make-server-1789c21d/evaluate`;
      console.log('📤 Sending request to:', apiUrl);
      console.log('Request body:', { ideaTitle: title, ideaDescription: description, userId: user?.id });
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          ideaTitle: title,
          ideaDescription: description,
          userId: user?.id, // Include userId for history saving
        }),
      });

      console.log('📥 Response status:', response.status);
      console.log('📥 Response ok:', response.ok);

      const result = await response.json();
      console.log('📥 Response data:', result);

      if (!response.ok) {
        console.error('❌ Response not ok:', result);
        console.error('❌ Error details:', result.details);
        console.error('❌ Error stack:', result.stack);
        throw new Error(result.details || result.error || 'Failed to evaluate idea');
      }

      if (!result.success || !result.data) {
        console.error('❌ Invalid response structure:', result);
        throw new Error('Invalid response from server');
      }

      console.log('✅ Evaluation successful!');
      setEvaluationData(result.data);
      setReportBackTarget('form');
      setCurrentView('report');
      
      // Smooth scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      toast.success('Evaluation complete! 🎉');
    } catch (error) {
      console.error('❌ Error evaluating idea:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      toast.error(
        error instanceof Error 
          ? error.message 
          : 'Failed to evaluate your idea. Please try again.'
      );
    } finally {
      setIsLoading(false);
      console.log('=== HANDLE SUBMIT IDEA COMPLETED ===');
    }
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setEvaluationData(null);
    setIdeaTitle('');
    setReportBackTarget('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewHistory = () => {
    if (!user) {
      toast.error('Please sign in to view history');
      setShowAuthModal(true);
      setPendingAction('history');
      return;
    }
    setCurrentView('history');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewReportFromHistory = (entry: any) => {
    setIdeaTitle(entry.ideaTitle);
    setEvaluationData(entry.evaluationData);
    setReportBackTarget('history');
    setCurrentView('report');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromReport = () => {
    if (reportBackTarget === 'history') {
      setCurrentView('history');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (reportBackTarget === 'form') {
      setCurrentView('form');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    handleBackToHome();
  };

  const reportBackLabel = reportBackTarget === 'history'
    ? 'Back to History'
    : reportBackTarget === 'form'
      ? 'Back to Idea Form'
      : 'Back to Home';

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Background gradient effects */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-secondary/10 via-transparent to-transparent" />
        </div>

        {/* Header with User Profile */}
        <header className="fixed top-0 left-0 right-0 z-50 px-4 py-4 backdrop-blur-md bg-background/80 border-b border-white/5">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <button 
              onClick={handleBackToHome}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text group-hover:scale-105 transition-transform">IdeaNest</span>
            </button>
            {!checkingSession && (
              <UserProfile
                user={user}
                onSignOut={handleSignOut}
                onSignIn={() => setShowAuthModal(true)}
                onViewHistory={handleViewHistory}
              />
            )}
          </div>
        </header>

        {/* Add padding to content to account for fixed header */}
        <div className="pt-20">
          {/* Content */}
          {currentView === 'home' && (
            <>
              <Hero onGetStarted={handleGetStarted} />
              <HowItWorks />
              <Footer />
            </>
          )}

          {currentView === 'form' && (
            <>
              <IdeaForm onSubmit={handleSubmitIdea} isLoading={isLoading} />
              <Footer />
            </>
          )}

          {currentView === 'report' && evaluationData && (
            <>
              <EvaluationReport
                data={evaluationData}
                ideaTitle={ideaTitle}
                onBack={handleBackFromReport}
                backLabel={reportBackLabel}
              />
              <Footer />
            </>
          )}

          {currentView === 'history' && user && (
            <>
              <History
                userId={user.id}
                onViewReport={handleViewReportFromHistory}
                onBack={handleBackToHome}
              />
              <Footer />
            </>
          )}
        </div>

        {/* Auth Modal */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => {
            setShowAuthModal(false);
            setPendingAction(null);
          }}
          onSuccess={handleAuthSuccess}
        />

        {/* Toast notifications */}
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#f8fafc',
            },
          }}
        />
      </div>
    </ErrorBoundary>
  );
}