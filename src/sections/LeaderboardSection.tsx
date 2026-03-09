import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Trophy } from 'lucide-react';
import { CATEGORIES } from '@/types';

gsap.registerPlugin(ScrollTrigger);

// Mock leaderboard data
const LEADERBOARD_DATA = [
  { rank: 1, title: 'Solar-powered desalination backpack', score: 97, category: 'startup' },
  { rank: 2, title: 'AI-assisted farming drone swarm', score: 95, category: 'startup' },
  { rank: 3, title: 'Self-cleaning restaurant kitchen system', score: 92, category: 'business' },
  { rank: 4, title: 'Biodegradable packaging from seaweed', score: 89, category: 'product' },
  { rank: 5, title: 'Community-owned microgrid platform', score: 87, category: 'business' },
  { rank: 6, title: 'AI tutor for personalized education', score: 85, category: 'idea' },
  { rank: 7, title: 'Vertical farming in shipping containers', score: 84, category: 'startup' },
  { rank: 8, title: 'Wearable health monitor for elderly', score: 82, category: 'product' },
];

export function LeaderboardSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current,
        { x: '-6vw', opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 50%',
            scrub: 0.5,
          }
        }
      );

      gsap.fromTo(tableRef.current?.children || [],
        { x: '-8vw', opacity: 0 },
        {
          x: 0,
          opacity: 1,
          stagger: 0.06,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            end: 'top 30%',
            scrub: 0.5,
          }
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-400';
    if (rank === 2) return 'text-gray-300';
    if (rank === 3) return 'text-amber-600';
    return 'text-muted-foreground';
  };

  const getRankBg = (rank: number) => {
    if (rank <= 3) return 'border-l-2 border-gold bg-gold/5';
    return '';
  };

  return (
    <section
      ref={sectionRef}
      id="leaderboard"
      className="relative w-full py-20 md:py-32 bg-court-dark"
      style={{
        background: 'radial-gradient(ellipse at top, rgba(245,166,35,0.05) 0%, transparent 50%)'
      }}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Title */}
        <div ref={titleRef} className="mb-8 md:mb-10">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-6 h-6 text-gold" />
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground">
              Top Classed Submissions
            </h2>
          </div>
          <p className="text-muted-foreground">
            The highest scores across all categories.
          </p>
        </div>

        {/* Table */}
        <div
          ref={tableRef}
          className="max-w-4xl bg-court-card border border-gold/20 rounded-2xl overflow-hidden shadow-court"
        >
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 p-4 md:p-5 border-b border-gold/20 bg-court-dark/50">
            <div className="col-span-2 md:col-span-1 font-mono text-xs text-muted-foreground uppercase tracking-wider">
              Rank
            </div>
            <div className="col-span-7 md:col-span-8 font-mono text-xs text-muted-foreground uppercase tracking-wider">
              Submission
            </div>
            <div className="col-span-3 md:col-span-3 text-right font-mono text-xs text-muted-foreground uppercase tracking-wider">
              Score
            </div>
          </div>

          {/* Rows */}
          {LEADERBOARD_DATA.map((entry) => (
            <div
              key={entry.rank}
              className={`grid grid-cols-12 gap-4 p-4 md:p-5 border-b border-gold/10 last:border-b-0 hover:bg-gold/5 transition-colors ${getRankBg(entry.rank)}`}
            >
              <div className={`col-span-2 md:col-span-1 font-display font-bold text-lg ${getRankColor(entry.rank)}`}>
                #{entry.rank}
              </div>
              <div className="col-span-7 md:col-span-8">
                <p className="font-medium text-foreground mb-1">{entry.title}</p>
                <span className="text-xs font-mono text-muted-foreground uppercase">
                  {CATEGORIES.find(c => c.value === entry.category)?.label}
                </span>
              </div>
              <div className="col-span-3 md:col-span-3 text-right">
                <span className="font-mono text-xl text-gold">{entry.score}</span>
                <span className="text-xs text-muted-foreground ml-1">/100</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
