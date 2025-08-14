import { Card, CardContent } from '@/components/ui/card';
import SpotlightCard from '@/components/SpotlightCard';
import { CheckCircle, Circle, Trophy, Clock } from 'lucide-react';

interface TodoStatsProps {
  stats: {
    total: number;
    active: number;
    completed: number;
  };
}

export const TodoStats = ({ stats }: TodoStatsProps) => {
  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <SpotlightCard spotlightColor="rgba(168, 85, 247, 0.25)">
        <Card className="bg-gradient-card border-border/50 hover:shadow-card transition-all duration-200">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center w-10 h-10 mx-auto mb-2 rounded-full bg-primary/10">
            <Circle className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.total}</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Tasks</p>
        </CardContent>
        </Card>
      </SpotlightCard>

      <SpotlightCard spotlightColor="rgba(251, 191, 36, 0.25)">
        <Card className="bg-gradient-card border-border/50 hover:shadow-card transition-all duration-200">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center w-10 h-10 mx-auto mb-2 rounded-full bg-warning/10">
            <Clock className="w-5 h-5 text-warning" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.active}</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Active</p>
        </CardContent>
        </Card>
      </SpotlightCard>

      <SpotlightCard spotlightColor="rgba(34, 197, 94, 0.25)">
        <Card className="bg-gradient-card border-border/50 hover:shadow-card transition-all duration-200">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center w-10 h-10 mx-auto mb-2 rounded-full bg-success/10">
            <CheckCircle className="w-5 h-5 text-success" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.completed}</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Completed</p>
        </CardContent>
        </Card>
      </SpotlightCard>

      <SpotlightCard spotlightColor="rgba(168, 85, 247, 0.25)">
        <Card className="bg-gradient-card border-border/50 hover:shadow-card transition-all duration-200">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center w-10 h-10 mx-auto mb-2 rounded-full bg-primary/10">
            <Trophy className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">{completionRate}%</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Completion</p>
        </CardContent>
        </Card>
      </SpotlightCard>
    </div>
  );
};