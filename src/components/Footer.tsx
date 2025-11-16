import { Sparkles, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="py-12 px-4 border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo and Branding */}
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold gradient-text">IdeaNest</span>
          </div>

          {/* Powered by Gemini */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>Powered by</span>
            <span className="font-semibold text-foreground">Google Gemini</span>
          </div>

          {/* Hackathon Badge */}
          <div className="flex items-center gap-2 glass-card px-4 py-2 rounded-full">
            <Heart className="w-4 h-4 text-red-400" />
            <span className="text-sm text-muted-foreground">
              Built in 2025
            </span>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            IdeaNest - Turn your raw ideas into investor-ready reports.
          </p>
        </div>
      </div>
    </footer>
  );
}
