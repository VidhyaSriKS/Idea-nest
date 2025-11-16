// IdeaNest History Management
// Functions for storing and retrieving evaluation history

import * as kv from './kv_store.tsx';

export interface HistoryEntry {
  id: string;
  userId: string;
  ideaTitle: string;
  ideaDescription: string;
  evaluationData: any;
  createdAt: string;
}

// Save evaluation to history
export async function saveEvaluation(
  userId: string,
  ideaTitle: string,
  ideaDescription: string,
  evaluationData: any
): Promise<string> {
  const id = `eval_${userId}_${Date.now()}`;
  const entry: HistoryEntry = {
    id,
    userId,
    ideaTitle,
    ideaDescription,
    evaluationData,
    createdAt: new Date().toISOString(),
  };

  await kv.set(`history:${id}`, entry);
  console.log('✅ Saved evaluation to history:', id);
  
  return id;
}

// Get all evaluations for a user
export async function getUserHistory(userId: string): Promise<HistoryEntry[]> {
  const prefix = `history:eval_${userId}_`;
  const entries = await kv.getByPrefix(prefix);
  
  // Sort by createdAt descending (newest first)
  const sorted = entries.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  
  console.log(`✅ Retrieved ${sorted.length} history entries for user ${userId}`);
  return sorted;
}

// Get a specific evaluation by ID
export async function getEvaluation(evaluationId: string): Promise<HistoryEntry | null> {
  const entry = await kv.get(`history:${evaluationId}`);
  
  if (!entry) {
    console.log('❌ Evaluation not found:', evaluationId);
    return null;
  }
  
  console.log('✅ Retrieved evaluation:', evaluationId);
  return entry as HistoryEntry;
}

// Delete an evaluation
export async function deleteEvaluation(evaluationId: string): Promise<void> {
  await kv.del(`history:${evaluationId}`);
  console.log('✅ Deleted evaluation:', evaluationId);
}
