import { useState } from 'react';
import { motion } from 'motion/react';
import { Loader2, Sparkles } from 'lucide-react';

interface IdeaFormProps {
  onSubmit: (title: string, description: string) => void;
  isLoading: boolean;
}

export function IdeaForm({ onSubmit, isLoading }: IdeaFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted!', { title, description });
    setError('');

    if (!title.trim()) {
      const errorMsg = 'Please enter an idea title';
      setError(errorMsg);
      console.error('Validation error:', errorMsg);
      return;
    }

    if (description.trim().length < 150) {
      const errorMsg = `Description must be at least 150 characters. Current: ${description.trim().length}`;
      setError(errorMsg);
      console.error('Validation error:', errorMsg);
      return;
    }

    console.log('Validation passed, calling onSubmit...');
    onSubmit(title.trim(), description.trim());
  };

  const wordCount = description.trim().split(/\s+/).filter(Boolean).length;
  const charCount = description.length;

  return (
    <section className="py-24 px-4 min-h-screen flex items-center">
      <div className="max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
            <h2 className="text-4xl md:text-5xl font-bold">
              Evaluate Your <span className="gradient-text">Idea</span>
            </h2>
          </div>
          <p className="text-xl text-muted-foreground">
            Share your startup concept and get instant VC-style feedback
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="gradient-border p-8 md:p-12"
          style={{ position: 'relative', zIndex: 1 }}
        >
          <form onSubmit={handleSubmit} className="space-y-8" style={{ position: 'relative', zIndex: 2 }}>
            {/* Title Input */}
            <div className="space-y-3">
              <label htmlFor="title" className="block text-lg font-medium text-foreground">
                Idea Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="e.g., AI-powered fitness coach for remote workers"
                value={title}
                onChange={(e) => {
                  console.log('Title changed:', e.target.value);
                  setTitle(e.target.value);
                }}
                onFocus={() => console.log('Title input focused')}
                onBlur={() => console.log('Title input blurred')}
                onClick={() => console.log('Title input clicked')}
                onMouseDown={() => console.log('Title input mouse down')}
                disabled={isLoading}
                required
                autoComplete="off"
                tabIndex={0}
                className="w-full px-4 py-4 text-lg rounded-lg transition-all outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#f8fafc',
                  fontSize: '18px',
                  position: 'relative',
                  zIndex: 9999,
                  pointerEvents: 'auto',
                  cursor: 'text',
                  userSelect: 'text',
                  WebkitUserSelect: 'text',
                  MozUserSelect: 'text',
                  msUserSelect: 'text',
                  minHeight: '56px',
                  display: 'block',
                }}
              />
            </div>

            {/* Description Textarea */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="description" className="block text-lg font-medium text-foreground">
                  Describe Your Idea *
                </label>
                <span className={`text-sm ${charCount >= 150 ? 'text-primary' : 'text-muted-foreground'}`}>
                  {charCount}/150 characters ({wordCount} words)
                </span>
              </div>
              <textarea
                id="description"
                name="description"
                placeholder="Describe your startup idea in detail. Include the problem you're solving, your target audience, your solution, and what makes it unique. The more detail you provide, the better the AI evaluation will be."
                value={description}
                onChange={(e) => {
                  console.log('Description changed, length:', e.target.value.length);
                  setDescription(e.target.value);
                }}
                onFocus={() => console.log('Description textarea focused')}
                onBlur={() => console.log('Description textarea blurred')}
                onClick={() => console.log('Description textarea clicked')}
                onMouseDown={() => console.log('Description textarea mouse down')}
                disabled={isLoading}
                rows={10}
                required
                autoComplete="off"
                tabIndex={0}
                className="w-full px-4 py-4 text-lg rounded-lg resize-none transition-all outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#f8fafc',
                  fontSize: '18px',
                  position: 'relative',
                  zIndex: 9999,
                  pointerEvents: 'auto',
                  cursor: 'text',
                  userSelect: 'text',
                  WebkitUserSelect: 'text',
                  MozUserSelect: 'text',
                  msUserSelect: 'text',
                  minHeight: '240px',
                  display: 'block',
                }}
              />
              <p className="text-sm text-muted-foreground">
                Minimum 150 characters required for detailed evaluation
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive"
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              onClick={(e) => {
                console.log('Button clicked!', { isLoading });
              }}
              className="w-full glow-button bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white py-6 text-lg rounded-xl inline-flex items-center justify-center font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                cursor: isLoading ? 'not-allowed' : 'pointer',
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing your idea like a VC...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Evaluate Now
                </>
              )}
            </button>
          </form>

          {/* Loading Animation */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 text-center space-y-4"
            >
              <div className="flex justify-center gap-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-3 h-3 rounded-full bg-primary"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
              <p className="text-muted-foreground">
                Our AI is analyzing market potential, competition, and business viability...
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}