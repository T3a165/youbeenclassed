import { useState } from 'react';
import { X, Scale, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/store/AppContext';

export function AppealModal() {
  const { isAppealOpen, closeAppeal, verdict } = useApp();
  const [appealText, setAppealText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isAppealOpen || !verdict) return null;

  const handleSubmit = () => {
    if (appealText.trim().length >= 20) {
      setIsSubmitted(true);
      setTimeout(() => {
        closeAppeal();
        setIsSubmitted(false);
        setAppealText('');
      }, 2000);
    }
  };

  const isValid = appealText.trim().length >= 20;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-court-dark/90 backdrop-blur-sm"
        onClick={closeAppeal}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg bg-court-card border border-gold/30 rounded-2xl p-6 md:p-8 shadow-court-lg animate-in fade-in zoom-in duration-200">
        {/* Close button */}
        <button
          onClick={closeAppeal}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <Scale className="w-6 h-6 text-gold" />
              <h2 className="font-display font-bold text-xl md:text-2xl text-foreground">
                Appeal your verdict
              </h2>
            </div>

            <p className="text-muted-foreground mb-6">
              Explain why the verdict should be reconsidered. Provide additional context or evidence that wasn't in your original submission.
            </p>

            {/* Original verdict summary */}
            <div className="bg-court-dark border border-gold/20 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-sm text-muted-foreground">Original Verdict</span>
                <span className="font-display font-bold text-gold">{verdict.rank}</span>
              </div>
              <p className="text-sm text-foreground italic">"{verdict.finalRuling}"</p>
            </div>

            {/* Appeal text */}
            <div className="mb-6">
              <Textarea
                value={appealText}
                onChange={(e) => setAppealText(e.target.value)}
                placeholder="Provide additional context or evidence..."
                className="w-full min-h-[140px] bg-court-dark border-gold/30 text-foreground placeholder:text-muted-foreground/50 resize-none focus:border-gold/60 focus:ring-gold/20 text-sm leading-relaxed p-4"
                maxLength={500}
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-muted-foreground">
                  {appealText.length}/500
                </span>
                {appealText.length < 20 && (
                  <span className="text-xs text-muted-foreground">
                    Min 20 characters
                  </span>
                )}
              </div>
            </div>

            {/* Submit button */}
            <Button
              onClick={handleSubmit}
              disabled={!isValid}
              className="w-full bg-gold text-court-dark hover:bg-gold-light font-display font-bold tracking-wider py-5 text-sm rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-gold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4 mr-2" />
              Submit Appeal
            </Button>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              Appeals are reviewed within 24 hours.
            </p>
          </>
        ) : (
          /* Success state */
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <Scale className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="font-display font-bold text-xl text-foreground mb-2">
              Appeal Submitted
            </h3>
            <p className="text-muted-foreground">
              Your appeal has been received and will be reviewed within 24 hours.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
