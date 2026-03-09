import { useState, useEffect } from 'react';
import { Menu, X, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavigationProps {
  onSubmitClick: () => void;
}

export function Navigation({ onSubmitClick }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { label: 'Submit', id: 'submit' },
    { label: 'Feed', id: 'feed' },
    { label: 'Leaderboard', id: 'leaderboard' },
    { label: 'About', id: 'footer' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-court-dark/90 backdrop-blur-md border-b border-gold/20'
          : 'bg-transparent'
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 group"
          >
            <Scale className="w-6 h-6 text-gold transition-transform group-hover:scale-110" />
            <span className="font-display font-bold text-sm md:text-base tracking-wider text-foreground">
              YOU BEEN CLASSED
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </button>
            ))}
            <Button
              onClick={onSubmitClick}
              variant="outline"
              className="border-gold text-gold hover:bg-gold/10"
            >
              Submit Idea
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-court-dark/95 backdrop-blur-md border-b border-gold/20">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="block w-full text-left py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </button>
            ))}
            <Button
              onClick={onSubmitClick}
              variant="outline"
              className="w-full border-gold text-gold hover:bg-gold/10 mt-2"
            >
              Submit Idea
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
