import { TodoFilter } from '@/types/todo';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TodoFiltersProps {
  currentFilter: TodoFilter;
  onFilterChange: (filter: TodoFilter) => void;
  stats: {
    total: number;
    active: number;
    completed: number;
  };
}

export const TodoFilters = ({ currentFilter, onFilterChange, stats }: TodoFiltersProps) => {
  const filters = [
    { key: 'all' as TodoFilter, label: 'All Tasks', count: stats.total },
    { key: 'active' as TodoFilter, label: 'Active', count: stats.active },
    { key: 'completed' as TodoFilter, label: 'Completed', count: stats.completed },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map(({ key, label, count }) => (
        <Button
          key={key}
          variant={currentFilter === key ? "default" : "outline"}
          onClick={() => onFilterChange(key)}
          className={cn(
            "relative transition-all duration-200",
            currentFilter === key 
              ? "bg-gradient-primary shadow-elegant" 
              : "hover:bg-primary/10 hover:border-primary/30"
          )}
        >
          {label}
          <Badge 
            variant="secondary" 
            className={cn(
              "ml-2 transition-colors",
              currentFilter === key 
                ? "bg-white/20 text-primary-foreground" 
                : "bg-primary/10 text-primary"
            )}
          >
            {count}
          </Badge>
        </Button>
      ))}
    </div>
  );
};