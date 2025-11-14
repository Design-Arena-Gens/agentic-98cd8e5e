import { useState } from 'react';
import { NewsIdea, SentimentType, InterestLevel } from '../types';
import { ExternalLink, TrendingUp, RefreshCw, Check, X, AlertCircle } from 'lucide-react';

interface IdeaGenerationProps {
  ideas: NewsIdea[];
  setIdeas: (ideas: NewsIdea[]) => void;
  updateProgress: (percentage: number, completed: boolean) => void;
  onNext: () => void;
}

export default function IdeaGeneration({
  ideas,
  setIdeas,
  updateProgress,
  onNext,
}: IdeaGenerationProps) {
  const [loading, setLoading] = useState(false);

  const fetchTrendingNews = async () => {
    setLoading(true);

    // Simulate API call with mock data
    setTimeout(() => {
      const mockIdeas: NewsIdea[] = [
        {
          id: '1',
          title: 'AI Breakthrough: New Language Model Achieves Human Parity',
          description: 'Researchers announce a new AI model that performs at human levels across multiple benchmarks, raising questions about the future of work.',
          source: 'TechCrunch',
          sourceUrl: 'https://techcrunch.com',
          sentiment: 'positive',
          interestLevel: 'high',
          approved: null,
          timestamp: new Date(),
        },
        {
          id: '2',
          title: 'Climate Summit Ends with Mixed Results',
          description: 'World leaders gather for climate negotiations, achieving some progress but falling short on key emission targets.',
          source: 'BBC News',
          sourceUrl: 'https://bbc.com',
          sentiment: 'neutral',
          interestLevel: 'medium',
          approved: null,
          timestamp: new Date(),
        },
        {
          id: '3',
          title: 'Stock Market Volatility Continues Amid Economic Uncertainty',
          description: 'Major indices show significant fluctuations as investors react to conflicting economic signals.',
          source: 'Financial Times',
          sourceUrl: 'https://ft.com',
          sentiment: 'negative',
          interestLevel: 'medium',
          approved: null,
          timestamp: new Date(),
        },
        {
          id: '4',
          title: 'Space Tourism Company Announces First Civilian Mars Mission',
          description: 'Private space company reveals ambitious plans for the first commercial Mars expedition, scheduled for 2030.',
          source: 'Space.com',
          sourceUrl: 'https://space.com',
          sentiment: 'positive',
          interestLevel: 'high',
          approved: null,
          timestamp: new Date(),
        },
        {
          id: '5',
          title: 'New Study Links Social Media Usage to Mental Health Concerns',
          description: 'Comprehensive research study finds correlation between heavy social media use and increased anxiety among teenagers.',
          source: 'The Guardian',
          sourceUrl: 'https://theguardian.com',
          sentiment: 'negative',
          interestLevel: 'high',
          approved: null,
          timestamp: new Date(),
        },
        {
          id: '6',
          title: 'Electric Vehicle Sales Reach Record Highs',
          description: 'Global EV adoption accelerates with quarterly sales surpassing expectations across major markets.',
          source: 'Reuters',
          sourceUrl: 'https://reuters.com',
          sentiment: 'positive',
          interestLevel: 'medium',
          approved: null,
          timestamp: new Date(),
        },
      ];

      setIdeas(mockIdeas);
      updateProgress(50, false);
      setLoading(false);
    }, 1500);
  };

  const toggleApproval = (id: string, approved: boolean) => {
    setIdeas(
      ideas.map(idea =>
        idea.id === id ? { ...idea, approved } : idea
      )
    );

    const approvedCount = ideas.filter(i => i.approved === true).length + (approved ? 1 : 0);
    const percentage = Math.min((approvedCount / ideas.length) * 100, 100);
    updateProgress(percentage, approvedCount > 0);
  };

  const approvedIdeas = ideas.filter(i => i.approved === true);

  const getSentimentColor = (sentiment: SentimentType) => {
    switch (sentiment) {
      case 'positive':
        return 'text-success';
      case 'negative':
        return 'text-danger';
      default:
        return 'text-textMuted';
    }
  };

  const getInterestBadge = (level: InterestLevel) => {
    const colors = {
      high: 'bg-danger/20 text-danger border-danger/30',
      medium: 'bg-warning/20 text-warning border-warning/30',
      low: 'bg-textMuted/20 text-textMuted border-textMuted/30',
    };
    return colors[level];
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-text">Idea Generation</h2>
        <div className="flex gap-3">
          <button
            onClick={fetchTrendingNews}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/80 disabled:bg-accent/50 text-white rounded-lg font-medium transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Fetching...' : 'Fetch Trending News'}
          </button>
          {approvedIdeas.length > 0 && (
            <button
              onClick={onNext}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primaryHover text-white rounded-lg font-medium transition-colors"
            >
              Continue to Script Creation
            </button>
          )}
        </div>
      </div>

      {ideas.length === 0 ? (
        <div className="bg-surface rounded-lg border border-border p-12 text-center">
          <TrendingUp className="w-16 h-16 text-textMuted mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-text mb-2">No Ideas Yet</h3>
          <p className="text-textMuted mb-6">Click &quot;Fetch Trending News&quot; to discover viral content ideas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ideas.map(idea => (
            <div
              key={idea.id}
              className={`bg-surface rounded-lg border p-4 transition-all ${
                idea.approved === true
                  ? 'border-success shadow-lg shadow-success/20'
                  : idea.approved === false
                  ? 'border-danger/50 opacity-60'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className={`text-xs px-2 py-1 rounded border uppercase font-semibold ${getInterestBadge(idea.interestLevel)}`}>
                  {idea.interestLevel}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleApproval(idea.id, true)}
                    className={`p-1.5 rounded transition-colors ${
                      idea.approved === true
                        ? 'bg-success text-white'
                        : 'bg-background hover:bg-success/20 text-textMuted hover:text-success'
                    }`}
                    aria-label="Approve"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleApproval(idea.id, false)}
                    className={`p-1.5 rounded transition-colors ${
                      idea.approved === false
                        ? 'bg-danger text-white'
                        : 'bg-background hover:bg-danger/20 text-textMuted hover:text-danger'
                    }`}
                    aria-label="Reject"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-text mb-2 line-clamp-2">
                {idea.title}
              </h3>

              <p className="text-sm text-textMuted mb-3 line-clamp-3">
                {idea.description}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <a
                  href={idea.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-accent hover:text-accent/80 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  {idea.source}
                </a>
                <span className={`text-xs font-medium ${getSentimentColor(idea.sentiment)}`}>
                  {idea.sentiment}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {approvedIdeas.length > 0 && (
        <div className="mt-6 bg-primary/10 border border-primary/30 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-text">
              <span className="font-semibold">{approvedIdeas.length}</span> idea{approvedIdeas.length !== 1 ? 's' : ''} approved and ready for script creation.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
