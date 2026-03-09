import { useState } from 'react';
import { X, Check, Zap, Crown, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { loadStripe } from '@stripe/stripe-js';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const TIERS = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Get started with basic verdicts',
    icon: Zap,
    features: [
      '3 submissions per day',
      'Basic verdict analysis',
      'All 10 categories',
      '3 tone modes',
      'Public feed access',
    ],
    cta: 'Current Plan',
    disabled: true,
    tier: 'FREE',
  },
  {
    name: 'Casual',
    price: '$4.99',
    period: '/month',
    description: 'For regular idea testers',
    icon: Zap,
    popular: true,
    features: [
      '20 submissions per day',
      'Detailed analysis',
      'Priority processing',
      'Share cards',
      'Appeal system',
      'No ads',
    ],
    cta: 'Upgrade to Casual',
    tier: 'CASUAL',
  },
  {
    name: 'Pro',
    price: '$14.99',
    period: '/month',
    description: 'For power users & creators',
    icon: Crown,
    features: [
      'Unlimited submissions',
      'Professional reports',
      'API access',
      'Custom categories',
      'Team sharing',
      'Analytics dashboard',
    ],
    cta: 'Upgrade to Pro',
    tier: 'PRO',
  },
  {
    name: 'Team',
    price: '$49',
    period: '/month',
    description: 'For organizations',
    icon: Users,
    features: [
      '5 team members',
      'Unlimited submissions',
      'Advanced analytics',
      'Priority support',
      'SSO integration',
      'Custom branding',
    ],
    cta: 'Contact Sales',
    tier: 'TEAM',
  },
];

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier?: string;
}

export function PricingModal({ isOpen, onClose, currentTier = 'FREE' }: PricingModalProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const { user, isSignedIn } = useUser();

  const handleUpgrade = async (tier: string) => {
    if (!isSignedIn) {
      // Redirect to sign in
      window.location.href = '/sign-in?redirect=/pricing';
      return;
    }

    if (tier === 'TEAM') {
      window.location.href = 'mailto:sales@youbeenclassed.org?subject=Team Plan Inquiry';
      return;
    }

    setIsLoading(tier);

    try {
      const response = await axios.post('/api/stripe/create-checkout', {
        tier,
        userId: user.id,
        email: user.primaryEmailAddress?.emailAddress,
      });

      const stripe = await stripePromise;
      if (stripe && response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setIsLoading(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-court-dark/95 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-6xl max-h-[90vh] overflow-auto bg-court-card border border-gold/30 rounded-2xl p-6 md:p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-8">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-2">
            Choose Your Plan
          </h2>
          <p className="text-muted-foreground">
            Upgrade for more submissions and premium features
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {TIERS.map((tier) => {
            const Icon = tier.icon;
            const isCurrent = currentTier === tier.tier;
            
            return (
              <div
                key={tier.name}
                className={`relative bg-court-dark border rounded-xl p-5 md:p-6 ${
                  tier.popular
                    ? 'border-gold shadow-gold'
                    : 'border-gold/20'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gold text-court-dark text-xs font-bold px-3 py-1 rounded-full">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2 mb-4">
                  <Icon className="w-5 h-5 text-gold" />
                  <h3 className="font-display font-bold text-lg">{tier.name}</h3>
                </div>

                <div className="mb-4">
                  <span className="font-display font-bold text-3xl text-foreground">
                    {tier.price}
                  </span>
                  <span className="text-muted-foreground text-sm">{tier.period}</span>
                </div>

                <p className="text-sm text-muted-foreground mb-6">
                  {tier.description}
                </p>

                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleUpgrade(tier.tier)}
                  disabled={isCurrent || tier.disabled || isLoading === tier.tier}
                  className={`w-full ${
                    tier.popular
                      ? 'bg-gold text-court-dark hover:bg-gold-light'
                      : 'border-gold text-gold hover:bg-gold/10'
                  } ${isCurrent ? 'opacity-50 cursor-not-allowed' : ''}`}
                  variant={tier.popular ? 'default' : 'outline'}
                >
                  {isLoading === tier.tier ? 'Loading...' : isCurrent ? 'Current Plan' : tier.cta}
                </Button>
              </div>
            );
          })}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Cancel anytime. All plans include secure payment processing.
        </p>
      </div>
    </div>
  );
}
