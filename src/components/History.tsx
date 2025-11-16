import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { History as HistoryIcon, Trash2, Eye, Clock, TrendingUp, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';

interface HistoryEntry {
  id: string;
  userId: string;
  ideaTitle: string;
  ideaDescription: string;
  evaluationData: any;
  createdAt: string;
}

interface HistoryProps {
  userId: string;
  onViewReport: (entry: HistoryEntry) => void;
  onBack?: () => void;
}

export function History({ userId, onViewReport, onBack }: HistoryProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory();
  }, [userId]);

  const fetchHistory = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-1789c21d/history/${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      const result = await response.json();

      if (result.success) {
        setHistory(result.data);
      } else {
        toast.error('Failed to load history');
      }
    } catch (error) {
      console.error('Error fetching history:', error);
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this evaluation?')) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-1789c21d/evaluation/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      const result = await response.json();

      if (result.success) {
        setHistory(history.filter(entry => entry.id !== id));
        toast.success('Evaluation deleted');
      } else {
        toast.error('Failed to delete evaluation');
      }
    } catch (error) {
      console.error('Error deleting evaluation:', error);
      toast.error('Failed to delete evaluation');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getAverageScore = (scores: any) => {
    if (!scores) return 0;
    const avg = (scores.innovation + scores.feasibility + scores.scalability) / 3;
    return avg.toFixed(1);
  };

  return (
    <div className="min-h-screen pt-20 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <HistoryIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl gradient-text">Evaluation History</h1>
                <p className="text-muted-foreground">View and manage your past evaluations</p>
              </div>
            </div>
            <Button 
              onClick={onBack}
              variant="ghost" 
              className="glass-card border-primary/30 hover:border-primary/50 hover:bg-primary/10"
              disabled={!onBack}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </motion.div>

        {loading ? (
          <div className="glass-card p-12 text-center">
            <div className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-muted-foreground">Loading your history...</p>
          </div>
        ) : history.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-12 text-center"
          >
            <HistoryIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl mb-2">No Evaluations Yet</h3>
            <p className="text-muted-foreground">
              Start evaluating your startup ideas to see them here
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {history.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 hover:border-primary/40 transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl mb-2 truncate">{entry.ideaTitle}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {entry.ideaDescription}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDate(entry.createdAt)}
                      </div>
                      {entry.evaluationData?.scores && (
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          <span>Score: {getAverageScore(entry.evaluationData.scores)}/10</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => onViewReport(entry)}
                      size="sm"
                      className="bg-primary/10 hover:bg-primary/20 border border-primary/30"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button
                      onClick={() => handleDelete(entry.id)}
                      disabled={deletingId === entry.id}
                      size="sm"
                      variant="outline"
                      className="border-red-500/30 hover:bg-red-500/10 hover:border-red-500/50 text-red-400"
                    >
                      {deletingId === entry.id ? (
                        <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}