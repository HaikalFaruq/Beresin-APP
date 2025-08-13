import { Todo } from '@/types/todo';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Calendar, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TodoCardProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

const priorityColors = {
  low: 'bg-blue-100 text-blue-800 border-blue-200',
  medium: 'bg-orange-100 text-orange-800 border-orange-200',
  high: 'bg-red-100 text-red-800 border-red-200',
};

const priorityLabels = {
  low: 'Low',
  medium: 'Medium', 
  high: 'High',
};

export const TodoCard = ({ todo, onToggle, onEdit, onDelete }: TodoCardProps) => {
  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed;

  return (
    <Card className={cn(
      "group transition-all duration-300 hover:shadow-card hover:-translate-y-0.5",
      "bg-gradient-card border-border/50",
      todo.completed && "opacity-70",
      isOverdue && "border-warning/50 bg-warning/5"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            id={`todo-${todo.id}`}
            checked={todo.completed}
            onCheckedChange={() => onToggle(todo.id)}
            className="mt-1 data-[state=checked]:bg-gradient-success data-[state=checked]:border-success"
          />
          
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              "font-medium text-foreground leading-6 transition-all duration-200",
              todo.completed && "line-through text-muted-foreground"
            )}>
              {todo.title}
            </h3>
            
            {todo.description && (
              <p className={cn(
                "text-sm text-muted-foreground mt-1 leading-5",
                todo.completed && "line-through"
              )}>
                {todo.description}
              </p>
            )}
            
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <Badge variant="secondary" className={priorityColors[todo.priority]}>
                {priorityLabels[todo.priority]}
              </Badge>
              
              {todo.dueDate && (
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-xs",
                    isOverdue && "border-warning text-warning"
                  )}
                >
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(todo.dueDate).toLocaleDateString()}
                </Badge>
              )}
              
              <Badge variant="outline" className="text-xs">
                <Clock className="w-3 h-3 mr-1" />
                {new Date(todo.createdAt).toLocaleDateString()}
              </Badge>
            </div>
          </div>
          
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(todo)}
              className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(todo.id)}
              className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};