import { useState, useEffect } from 'react';
import { Todo, TodoFormData } from '@/types/todo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Save, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TodoFormProps {
  editingTodo?: Todo;
  onSubmit: (data: TodoFormData) => void;
  onCancel: () => void;
}

export const TodoForm = ({ editingTodo, onSubmit, onCancel }: TodoFormProps) => {
  const [formData, setFormData] = useState<TodoFormData>({
    title: '',
    description: '',
    completed: false,
    priority: 'medium',
    dueDate: undefined,
  });
  const [date, setDate] = useState<Date>();

  useEffect(() => {
    if (editingTodo) {
      setFormData({
        title: editingTodo.title,
        description: editingTodo.description || '',
        completed: editingTodo.completed,
        priority: editingTodo.priority,
        dueDate: editingTodo.dueDate,
      });
      if (editingTodo.dueDate) {
        setDate(new Date(editingTodo.dueDate));
      }
    }
  }, [editingTodo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    onSubmit({
      ...formData,
      dueDate: date?.toISOString(),
    });

    if (!editingTodo) {
      setFormData({
        title: '',
        description: '',
        completed: false,
        priority: 'medium',
        dueDate: undefined,
      });
      setDate(undefined);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto animate-scale-in bg-gradient-card border-border/50 shadow-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold bg-gradient-primary bg-clip-text text-transparent">
          {editingTodo ? 'Edit Task' : 'Create New Task'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Task Title *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter task title..."
              className="transition-all duration-200 focus:shadow-elegant"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Add a description..."
              className="min-h-[80px] transition-all duration-200 focus:shadow-elegant"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: 'low' | 'medium' | 'high') => 
                  setFormData(prev => ({ ...prev, priority: value }))
                }
              >
                <SelectTrigger className="transition-all duration-200 focus:shadow-elegant">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">🟢 Low Priority</SelectItem>
                  <SelectItem value="medium">🟡 Medium Priority</SelectItem>
                  <SelectItem value="high">🔴 High Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal transition-all duration-200",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              className="flex-1 bg-gradient-primary hover:opacity-90 transition-all duration-200 shadow-elegant"
            >
              <Save className="w-4 h-4 mr-2" />
              {editingTodo ? 'Update Task' : 'Create Task'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};